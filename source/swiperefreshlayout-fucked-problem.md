title: "SwipeRefreshLayout下拉不显示进度圈"
date: 2018-02-03 11:10:00 +0800
author: w568w
preview: SwipeRefreshLayout坑真tm多
---
# 问题
最近做的一个项目里用到了`SwipeRefreshLayout`，布局大概是这样的：
```
<android.support.v4.widget.SwipeRefreshLayout xmlns:android="http://schemas.android.com/apk/res/android"
    android:layout_width="match_parent"
    android:layout_height="match_parent">
    <ScrollView
        android:layout_width="match_parent"
        android:layout_height="match_parent"
        android:padding="16dp">
    <RelativeLayout
        android:layout_width="match_parent"
        android:layout_height="wrap_content">
        <TextView
            android:layout_width="wrap_content"
            android:layout_height="wrap_content" />
    </RelativeLayout>
    </ScrollView>
</android.support.v4.widget.SwipeRefreshLayout>
```
但是！下拉时啥都没有显示，根据Debugger显示，`OnRefresh`方法**几乎**也不被调用。  
这TM就很闹心了。。。各种调试无果，只好求助度娘。
# 解决
网上的解决方法也是种类繁多。。。总的来说有这几种：  
1. 用`ScrollView`或者`ListView`作为`SwipeRefreshLayout`的子控件。  
2. 导入了两个不同版本`android.support.v4`支持包，用`resolutionStrategy`强制指定版本。([原文章在这里](https://www.jianshu.com/p/2a1897fdc041))  
3. 给子布局设置`onTouchEvent`，屏蔽事件。  
***
前两种压根没遇到。。。所以果断选择第3种，嘿，还真有效！  
[原文章](http://blog.csdn.net/u013673799/article/details/70755747)里是这么说的:  
<blockquote>
当使用ListView，下拉刷新时，`SwipeRefreshLayout`的down事件被子View消费了，当Move时，才会调用自身的`onTouchEvent`方法。  
而不使用ListView，显示`TextView`时，`SwipeRefreshLayout`的down事件没有被子View消费，需要调用自己的`onTouchEvent`方法 。这个就是导致问题的原因。   
根据上面的原因，可以有一种解决方式，如下:  
```
mTextView.setOnTouchListener(new View.OnTouchListener() {
    @Override
    public boolean onTouch(View v, MotionEvent event) {
        if(event.getAction() == MotionEvent.ACTION_DOWN){
            return true;
        }
        return false;
    }
});
```
</blockquote>  
於是这个问题就解决了。。。浪费了我半个小时的时间QAQ
