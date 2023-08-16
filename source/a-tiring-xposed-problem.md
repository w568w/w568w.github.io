title: "Xposed模块本体向Hook类传递信息的研究"
date: 2017-12-16 11:00:00 +0800
author: w568w
preview: Xposed是无底的巨坑
---
# 引子
在写净眼(一个Xposed模块)时，遇到一个问题，App本体的设置参数如何传给Hook类？  
之前我一直用的是文件读写的方式，但在调试中我发现：如果被Hook的应用本身无此权限，那么就无法读到这个文件。  
经过多次(两三个小时而已)的查找，找到了一个解决方案。  
# XSharedPreferences
XSharedPreferences是XposedBridge的一部分。它可以读取任意应用的SharedPreferences。  
於是就可以在App本体中写入SharedPreferences，然后从Hook类中读取...  
程序本体中：  
```
        SharedPreferences mSharedPreferences = getSharedPreferences("data", Context.MODE_WORLD_READABLE);
        data.edit().putString("test","something");
```
Xposed Hook类中：  
```
        XSharedPreferences xSP=new XSharedPreferences("ml.w568w.test","data");
        xSP.reload();
        xSP.makeWorldReadable();
        String test = xSP.getString("test", "");
```
# 注意
1. **必须**使用`Context.MODE_WORLD_READABLE`得到的`SharedPreferences`，`makeWorldReadable()`并不能让你可以随意限定`SharedPreferences`的读取权限。  
2. 尽可能地不使用`PreferenceManager.getDefaultSharedPreferences(this);`或者`PreferenceActivity`得到的`SharedPreferences`（我在这里被坑了好久...）  
3. 即便这么做，获得的`XSharedPreferences`仍然是只读的...因此，Hook类依旧不能向模块本体传递信息...
