title: "Xposed模塊本體向Hook類傳遞信息的研究"
date: 2017-12-03 01:00:00 +0800
author: w568w
preview: Xposed是無底的巨坑
---
# 引子
在寫淨眼(一個Xposed模塊)時，遇到一個問題，App本體的設置參數如何傳給Hook類？  
之前我一直用的是文件讀寫的方式，但在調試中我發現：如果被Hook的應用本身無此權限，那麼就無法讀到這個文件。  
經過多次(兩三個小時而已)的查找，找到了一個解決方案。  
# XSharedPreferences
XSharedPreferences是XposedBridge的一部分。它可以讀取任意應用的SharedPreferences。  
於是就可以在App本體中寫入SharedPreferences，然後從Hook類中讀取...  
程序本體中：  
```
        SharedPreferences mSharedPreferences = getSharedPreferences("data", Context.MODE_WORLD_READABLE);
        data.edit().putString("test","something");
```
Xposed Hook類中：  
```
        XSharedPreferences xSP=new XSharedPreferences("ml.w568w.test","data");
        xSP.reload();
        xSP.makeWorldReadable();
        String test = xSP.getString("test", "");
```
# 注意
1. **必須**使用`Context.MODE_WORLD_READABLE`得到的`SharedPreferences`，`makeWorldReadable()`並不能讓你可以隨意限定`SharedPreferences`的讀取權限。  
2. 儘可能地不使用`PreferenceManager.getDefaultSharedPreferences(this);`或者`PreferenceActivity`得到的`SharedPreferences`（我在這裏被坑了好久...）  
