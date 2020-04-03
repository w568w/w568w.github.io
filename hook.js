/**
Code by pnig0s[Knownsec&FreeBuf]
Date 20130214
һ��ͨ�õ�js���⺯���^��
A simple hooks to Javascript functions

[bool]hook:params{
	realFunc[String|must]:��춱���ԭʼ��Ŀ�˺�����,���unHook;
	hookFunc[Function|must]:��Q��hook����;
	context[Object|opt]:Ŀ�˺��������Č���,���hook��window�����µĺ�������String.protype.slice,carInstance1
	methodName[String|opt]:���hook��������eg:this.Begin = function(){....};
}
[bool]unhook:params{
	realFunc[String|must]:��춱���ԭʼ��Ŀ�˺�����,���unHook;
	funcName[String|must]:��Hook�ĺ������Q
	context[Object|opt]:Ŀ�˺��������Č���,���hook��window�����µĺ�������String.protype.slice,carInstance1
}

**/
LivereTower.isMobile=true;
LivereTower.init();
function Hooks()
{
	return {
		initEnv:function () {
			Function.prototype.hook = function (realFunc,hookFunc,context,funcName) {
				var _context = null; //����������
				var _funcName = null; //������

				_context = context || window;
				_funcName = funcName || getFuncName(this);
				_context[realFunc] = this;

				if(_context[_funcName].prototype && _context[_funcName].prototype.isHooked)
				{
					console.log("Already has been hooked,unhook first");
					return false;
				}

				function getFuncName (fn) {
					// �@ȡ�������Q
					var strFunc = fn.toString();
					var _regex = /function\s+(\w+)\s*\(/;
					var patten = strFunc.match(_regex);
					if (patten) {
						return patten[1];
					};
					return '';
				}

				try
				{
					eval('_context[_funcName] = function '+_funcName+'(){\n'+
						'var args = Array.prototype.slice.call(arguments,0);\n'+
						'var obj = this;\n'+
						'hookFunc.apply(obj,args)\n'+
						'return _context[realFunc].apply(obj,args);\n'+
						'};');
					_context[_funcName].prototype.isHooked = true;
					return true;
				}catch (e)
				{
					console.log("Hook failed,check the params.");
					return false;
				}
			}
			Function.prototype.unhook = function (realFunc,funcName,context) {
				var _context = null;
				var _funcName = null;
				_context = context || window;
				_funcName = funcName;
				if (!_context[_funcName].prototype.isHooked)
				{
					console.log("No function is hooked on");
					return false;
				}
				_context[_funcName] = _context[realFunc];
				delete _context[realFunc];
				return true;
			}
		},
		cleanEnv:function () {
			if(Function.prototype.hasOwnProperty("hook"))
			{
				delete Function.prototype.hook;
			}
			if(Function.prototype.hasOwnProperty("unhook"))
			{
				delete Function.prototype.unhook;
			}
			return true;
		}
	};
}
