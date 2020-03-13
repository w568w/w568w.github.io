title: "Git的高级玩法——花式撤回误操作"
date: 2018-04-28 21:58:00 +0800
author: w568w
cover: https://i.loli.net/2020/03/13/X29z7qgZdjyUTmo.jpg
preview: 你可以用git撤回任何操作!
---
![Photo by Sai Kiran Anagani on Unsplash](images/sai-kiran-anagani-555972-unsplash.jpg)
# 引子
今天作死Commit的时候，不小心把自己的Ket Store和密码push到Github上去了...  
发现Github上没有回滚Commit选项时，吓了一跳，以为撤回不了自己的骚操作了，遂百度之，  
  
然后，我发现了一片Git的新天地...原来，Git真心这么强大！
# 我擦，随手Push上去了?!
可能你和我有过类似的经历，把奇怪的文件Push到远程，然后又想办法撤回。其实，Git为我们提供了非常简单的操作来撤回到任何状态，只需要三个指令，就可以无损撤回Commit。  
首先，在项目目录打开终端。你可以用`git log`查看历史提交，看起来大概这样：  
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
比如说想回到`5eb7444126ef10f3bcd1a9daca7b81051d9533df`这个状态，也就是撤回最后一次提交，记下这个对应的SHA-256值，然后按`q`键退出vim。  
然后，使用`git reset`来重定向`HEAD`指针：

```
如果你要连着本地文件一块儿撤回(也就是删除本地文件)：
$ git reset --hard 5eb7444126ef10f3bcd1a9daca7b81051d9533df 
如果你只要撤回远程(本地文件不动)：
$ git reset --soft 5eb7444126ef10f3bcd1a9daca7b81051d9533df 
```
> Tips：这里要退到上一个，所以可以简写成：
 ```
$ git reset --hard HEAD~1
或者
$ git reset --soft HEAD~1
```

最后，用`-f`无视版本问题，强制推到远程，问题解决！
```
$ git push -f
```
# 我擦，不小心用了 --hard ?!
刚开始撤回时我就遇到了这个问题...由于没搞懂`--hard`和`--soft`的区別...  
结果撤回时连着本地文件一块儿没了...  
擦，这下没辙了？代码又得重写了？  
  
其实万能的Git还有办法，而且只需要两行指令。  
  
首先使用`git reflog`来查看`HEAD`指针变动日志：
```
$ git reflog
4ba77dc HEAD@{1}: reset: moving to 5eb7444126ef10f3bcd1a9daca7b81051d9533df
ad8bcdd HEAD@{2}: commit: Add error catching
5eb7444 HEAD@{3}: commit: Add error-catching for the module's self-checking.
```
可以看到，第一条记录就是上一节里撤回时的操作。
我要让所有文件回到`commit: Add error catching`还没推送到远程时的状态，因此直接执行：
```
$ git reset --hard ad8bcdd
HEAD 现在位于 ad8bcdd Add error catching
```
问题解决！文件都回来了！  
# 总结
可以看到，Git的强大的确不是吹的。只要不是作死删库的命令（~~`reset --hard 0`，`push -f`上去再反手一个`gc`什么的，別瞎jb试~~），几乎[无所不能撤回](http://mobile.51cto.com/hot-481240.htm)。  
因此，经常~~和我一样~~手贱的小伙伴们的确很需要使用`Git`来管理自己的公共/私有项目。