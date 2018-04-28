title: "Git的高級玩法——花式撤回誤操作"
date: 2018-04-28 21:58:00 +0800
author: w568w
preview: 你可以用git撤回任何操作!
---
# 引子
今天作死Commit的時候，不小心把自己的Ket Store和密碼push到Github上去了...  
發現Github上沒有回滾Commit選項時，嚇了一跳，以爲撤回不了自己的騷操作了，遂百度之，  
  
然後，我發現了一片Git的新天地...原來，Git真心這麼強大！
# 我擦，隨手Push上去了?!
可能你和我有過類似的經歷，把奇怪的文件Push到遠程，然後又想辦法撤回。其實，Git爲我們提供了非常簡單的操作來撤回到任何狀態，只需要三個指令，就可以無損撤回Commit。  
首先，在項目目錄打開終端。你可以用`git log`查看歷史提交，看起來大概這樣：  
```
$ git log
commit ad8bcddd03f25904de27e830e12d22e79ba61e44
Author: w568w <1278297578@qq.com>
Date:   Sat Apr 28 21:05:43 2018 +0800

    Add error catching

commit 5eb7444126ef10f3bcd1a9daca7b81051d9533df
Author: w568w <1278297578@qq.com>
Date:   Sat Apr 28 21:03:23 2018 +0800

    Add error-catching for the module's self-checking.
```
比如說想回到`5eb7444126ef10f3bcd1a9daca7b81051d9533df`這個狀態，也就是撤回最後一次提交，記下這個對應的SHA-256值，然後按`q`鍵退出vim。  
然後，使用`git reset`來重定向`HEAD`指針：

```
如果你要連着本地文件一塊兒撤回(也就是刪除本地文件)：
$ git reset --hard 5eb7444126ef10f3bcd1a9daca7b81051d9533df 
如果你只要撤回遠程(本地文件不動)：
$ git reset --soft 5eb7444126ef10f3bcd1a9daca7b81051d9533df 
```
> Tips：這裏要退到上一個，所以可以簡寫成：
 ```
$ git reset --hard HEAD~1
或者
$ git reset --soft HEAD~1
```

最後，用`-f`無視版本問題，強制推到遠程，問題解決！
```
$ git push -f
```
# 我擦，不小心用了 --hard ?!
剛開始撤回時我就遇到了這個問題...由於沒搞懂`--hard`和`--soft`的區別...  
結果撤回時連着本地文件一塊兒沒了...  
擦，這下沒轍了？代碼又得重寫了？  
  
其實萬能的Git還有辦法，而且只需要兩行指令。  
  
首先使用`git reflog`來查看`HEAD`指針變動日誌：
```
$ git reflog
4ba77dc HEAD@{1}: reset: moving to 5eb7444126ef10f3bcd1a9daca7b81051d9533df
ad8bcdd HEAD@{2}: commit: Add error catching
5eb7444 HEAD@{3}: commit: Add error-catching for the module's self-checking.
```
可以看到，第一條記錄就是上一節里撤回時的操作。
我要讓所有文件回到`commit: Add error catching`還沒推送到遠程時的狀態，因此直接執行：
```
$ git reset --hard ad8bcdd
HEAD 现在位于 ad8bcdd Add error catching
```
問題解決！文件都回來了！  
# 總結
可以看到，Git的強大的確不是吹的。只要不是作死刪庫的命令（~~`reset --hard 0`，`push -f`上去再反手一個`gc`什麼的，別瞎jb試~~），幾乎[無所不能撤回](http://mobile.51cto.com/hot-481240.htm)。  
因此，經常~~和我一樣~~手賤的小夥伴們的確很需要使用`Git`來管理自己的公共/私有項目。