/**
* github: https://github.com/AspenLuoQiang/web-toast
* 仿原生Toast提示
* useage 1: new Toast('test').show()
* useage 2: new Toast({showText:'test'}).show()
*
* @param {string|object} options 实例参数，可以是object配置项，也可以是简单的文案
* @param {string} options.className toast的类名，可以使用多个类名，空格分隔
* @param {string} options.showClassName toast显示时的类名
* @param {string} options.showText toast显示文案
* @param {string} options.timeout toast显示时长
* @param {function} options.onShow toast显示时的回调
* @param {function} options.onRemove toast被删除时的回调
* @param {function} options.onHide toast隐藏时的回调
*/

function Toast(options){
	if(typeof options === "string"){
		options = {
			showText: options
		};
	}
	var _defaults = {
		className : "common-toast",
		showClassName : "show",
		showText: "",
		timeout: 1500,
		autoHide: true,
		onShow: function($toastElement){},
		onRemove: function($toastElement){},
		onHide: function($toastElement){},
	};
	this._opts = $.extend(true, {}, _defaults, options);
	this._isShowing = false;
	if(!this._opts.showText)
		throw new Error('需要提示语！');

	this._$ele = void 0;
	this._init();
}

/**
* 显示Toast，自动消失
*
* @return {type}   description
*/
Toast.prototype.show = function() {
	if (this._isShowing) return;
	var $toastElement = this.$toastElement.clone();
	this._$ele = $toastElement;
	this._opts.onShow && this._opts.onShow($toastElement);
	/* 每次都重新插入节点，并在显示后删除：防止其他多地方次调用导致的冲突 */
	$("body").append($toastElement);
	$toastElement.addClass(this._opts.showClassName);
	this._isShowing = true;

	if(this._opts.autoHide){
		setTimeout(function(){
			this.hide();
		}.bind(this), this._opts.timeout);
	}
};

/**
 * Toast.prototype.hide - 关闭提示
 *
 * @return {type}  description
 */
Toast.prototype.hide = function() {
	this._opts.onHide && this._opts.onHide(this._$ele);
	this._$ele.removeClass(this._opts.showClassName);

	/* 平滑淡出，在动画完成之后再删除这个节点 */
	setTimeout(function(){
		this._isShowing = false;
		this._opts.onRemove && this._opts.onRemove(this._$ele);
		this._$ele.remove();
	}.bind(this), 200);
};

/**
* 设置显示文字，当同一按钮每次点击时内容都不一致时使用，多个按钮请使用多个实例
*
* @params {string} text 设置显示文案
* @return {Toast}   实例
*/
Toast.prototype.setText = function(text){
	this._opts.showText = text;
	this._setToast();
	return this;
};

/**
* 设置样式，允许自定义，统一组件，若无特殊需求，请勿修改
*
* @params {string} customStyle 自定义的样式
* @return {Toast}   实例
*/
Toast.prototype.setStyle = function(customStyle){
	var style = "."+this._opts.className+"{"+
					"background-color: transparent;"+
					"color: transparent;"+
					"font-size: 14px;"+
					"position: fixed;"+
					"top: 50%;"+
					"left: 50%;"+
					"padding: 0;"+
					"-webkit-transform: translate(-50%, -50%);"+
					"transform: translate(-50%, -50%);"+
					"border-radius: 4px;"+
					"z-index: 9999999;"+
					"text-align: center;"+
					"transition: all .2s ease-in-out;"+
					"-moz-transition: all .2s ease-in-out;"+
					"-webkit-transition: all .2s ease-in-out;"+
					"-o-transition: all .2s ease-in-out;"+
					"white-space: nowrap;"+
				"}"+
				"."+this._opts.className+"."+this._opts.showClassName+"{"+
					"padding: 8px 30px;"+
					"background-color: rgba(0, 0, 0, .65);"+
					"color: #fff;"+
				"}";
	style = customStyle || style;
	var id = this._opts.className.split(/[\s]+/)[0] + "-style";
	!$("head").find("style#"+id).size() && $("head").append("<style id='"+id+"'>"+style+"</style>");
	return this;
};

/**
* 组件初始化
*
* @return {type}   description
*/
Toast.prototype._init = function(){
	this.setStyle();
	this._setToast();
};

/**
* 设置弹出层
*
* @private
* @return {type}   description
*/
Toast.prototype._setToast = function(){
	this.$toastElement = $("<div class='"+this._opts.className+"'>"+this._opts.showText+"</div>");
};
