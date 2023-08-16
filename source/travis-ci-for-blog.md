title: "用 Travis CI 实现博客持续集成"
date: 2020-03-13 18:13:00 +0800
author: w568w
cover: images/sai-kiran-anagani-555972-unsplash.jpg
preview: …实在懒得build静态网页了…
---
# 什么是CI？
CI，即Continues Integration，是一种软件开发实践，如一个团队的开发成员经常集成他们的工作，通常每个成员每天至少集成一次，也就意味着每天可能会发生多次集成。每次集成都通过自动化的构建（包括编译，发布，自动化测试）来验证，从而尽早地发现集成错误。  
通俗的解释就是每次提交代码到 Github，都会触发某种自动化过程(如自动编译,测试等)，以跟进开发过程。  
当然我们这里使用它，不是这个目的！我们希望实现的是:在每一次提交新文章到`Github Pages`时，远程都能自动生成网页，免得本地手动生成的麻烦…  
这里决定使用的是`Travis CI`，它的优点是能直接与Github集成，省去很多麻烦。

# 1.注册Travis CI
打开[Travis CI](travis-ci.org)，用Github账号登录。  
简单配置一下`token`，一路下一步就好了…  
这里偷个懒(>v<)，详细步骤来自于[这里](https://dmego.me/2017/10/13/deylpoy-hexo-with-TravisCI/)：  
## 在GitHub 上生成 Access Token

如果想要 让`travis CI`构建完成之后自动 push 到 master 分支，则travis需要有对这个仓库进行操作的权限，此时我们就需要为Travis CI 配置`Access Token（访问令牌）`。  

在GitHub上生成Access Token 的步骤是，点击头像进入设置（Settings）,然后点击左边菜单栏最下面的`Developer settings` 选项，进入后点击左边的`Personal access tokens`选项，进入后点击右上角的`Generate new token`按钮。  
 
先给 Token 起一个名字，然后为它设置一些权限，其中`repo`的权限是必须的，其他可以随意添加。  

点击下面的 create token 按钮，就会生成一个已经赋予好权限的 token 值，接下来我们进入Travis CI 网站的配置中。  
## 配置 Travis CI

如果之前从未使用 Travis CI 来构建项目，则我们先需要使用GitHub账号来登录网站,登录进来后，如果底下 没有把 GitHub 仓库中的项目加载进来，可以手动点击右上角的 `Sync account` 按钮，待到同步完成后将要自动构建的项目开启。  

开启后点击设置图标就可以进行一系列的设置，先开启`General`里的两项选项：  

    Build only if .travis.yml is present:只有在.travis.yml文件中配置的分支改变了才构建  
    Build branch updates:当分支更新后开始构建  

然后在`Environment Variables`一栏里将在 GitHub 下获取的的`Access Token`值添加进来。   
呼呼~ 这样就配置完成了。接下来我们需要设置`.travis.yml`。  
  
# 2.配置`.travis.yml`
`.travis.yml`是一个简单的脚本兼配置文件，用于指示如何进行自动化构建。  
一个通常的`.travis.yml`大概如下:
```
language: node_js
node_js: stable

# S: Build Lifecycle
install:
  - npm install

before_script:
  - npm install -g gulp

script:
  - hexo g

after_script:
  - cd ./public
  - git init
  - git push
# E: Build LifeCycle

branches:
  only:
    - master
env:
 global:
   - GH_REF: github.com/xxx/xxx.git
```
  
其中各个部分含义:  
```
language:用于指定预配置环境，如nodejs、java、android等。系统在构建前会自动安装所需环节。
 
install和before_script:在开始操作前执行，一般用于下载、安装自己在构建中所需要的库。
 
script:正式的构建过程。
 
after_script:构建之后执行，一般用于发布或者push。
 
branches:指定在哪条分支上发生变化时开始构建，通常是master。
 
env:Environment，一些环境变量。
```
  
PS:**如果没有指明系统环境，构建所使用的系统都是Linux哦！**
害，说了这么多废话，(¬◡¬)✧总算要入正题了！  
这里以我所使用的博客软件`纸小墨`为例；  
当然，如果你使用`hexo`等软件，过程也大同小异。  
我们的操作大概分以下几步:  

1. 下载`ink`构建文件。
2. 执行`ink preview`进行构建。
3. `git`推送到`master`分支。
4. 删除构建中的临时文件。
  
但！是！这里有一个坑:**推送到master分支的过程会再次触发自动构建，导致进入递归，无限构建的过程…**  
解决这个坑也不难，只要在`push`前判断一下就好了，下面直接上代码:  
```
language: node_js
node_js: stable

# S: Build Lifecycle
before_install:
  - wget https://imeoer.github.io/release/ink_linux_386.tar.gz
  - tar -zxvf ink_linux_386.tar.gz
  - ls
  - sudo mv ./ink /usr/local/bin/

script:
  - ink build

after_script:
  - git config user.name "w568w"
  - git config user.email "1278297578@qq.com"
  - rm -rf ink_linux_386.tar.gz
  - rm -rf ink_linux_386.tar.gz.1
  - rm -rf ./blog/
  - rm -rf ./ink
  - git add .
  - if [ $(git log -1 | grep -c "Update") -gt 0 ]; then echo "Have been updated";else git commit -m "Update"&&git push "https://${ttoken}@${GH_REF}" HEAD:master;fi
# E: Build LifeCycle

branches:
  only:
    - master
env:
 global:
   - GH_REF: github.com/w568w/w568w.github.io.git
```  
其中的`ttoken`是上一步中定义的`access token`的变量名。
这里应该不需要太多解释吧…重要的就是这一行:  
  
```
if [ $(git log -1 | grep -c "Update") -gt 0 ]; then 
echo "Have been updated";
else 
git commit -m "Update"&&git push "https://${ttoken}@${GH_REF}" HEAD:master;
fi
```  
  
稍微有一点Linux Shell基础的同学知道，它的意思是判断上一次提交的`message`中是否含有`Update`字样，如果含有则放弃本次提交。  
# 3.提交
全部做完后别忘了提交到远程git库！  
然后，应该就可以看到第1次结果啦~  
（ '▿ ' ）  
![如图！ヾ(❀╹◡╹)ﾉ~](https://i.loli.net/2020/03/13/pmVI26dSXlaJKvZ.jpg)  
  
# 后记

现在想起来其实这种做法挺蠢的，为什么不在一开始就分出`master`和`source`两个分支呢？  
~~还是暴力出奇迹好哇~~