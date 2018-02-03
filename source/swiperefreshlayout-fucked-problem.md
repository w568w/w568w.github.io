title: "SwipeRefreshLayout下拉不顯示進度圈"
date: 2018-02-03 11:10:00 +0800
author: w568w
preview: SwipeRefreshLayout坑真tm多
---
# 問題
最近做的一個項目裏用到了`SwipeRefreshLayout`，佈局大概是這樣的：
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
但是！下拉時啥都沒有顯示，根據Debugger顯示，`OnRefresh`方法**幾乎**也不被調用。  
這TM就很鬧心了。。。各種調試無果，只好求助度娘。
# 解決
網上的解決方法也是種類繁多。。。總的來說有這幾種：  
1. 用`ScrollView`或者`ListView`作爲`SwipeRefreshLayout`的子控件。  
2. 導入了兩個不同版本`android.support.v4`支持包，用`resolutionStrategy`強制指定版本。([原文章在這裏](https://www.jianshu.com/p/2a1897fdc041))  
3. 給子佈局設置`onTouchEvent`，屏蔽事件。  
***
前兩種壓根沒遇到。。。所以果斷選擇第3種，嘿，還真有效！  
[原文章](http://blog.csdn.net/u013673799/article/details/70755747)裏是這麼說的:  
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
於是這個問題就解決了。。。浪費了我半個小時的時間QAQ
