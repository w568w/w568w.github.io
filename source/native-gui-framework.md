title: "通往原生 GUI 之路"
date: 2024-11-30 18:50:25 +0800
author: w568w
cover: images/nokia-2617880_1280.jpg
preview: 以及对一批原生 GUI 框架的简单评测
toc: true
---

# Lazarus

- 编程语言：Object Pascal
- 支持平台：Windows、Linux、macOS、iOS、FreeBSD、Android、Windows CE、Embedded

**💪优点**

- 有一个所见即所得的界面设计器
- 完整的 IDE 支持，在 Lazarus IDE 中即可完成所有开发工作
- 编译速度快，生成的可执行文件体积小，不再依赖其他框架

**🤔缺点**

- Object Pascal 是一种较为陈旧且冗长的语言，不太适合新手。可以说，在 2024 年，提到 Object Pascal 唯一的用途就是 Delphi 和 Lazarus 了，学习该语言的其他用途几乎为零。自然地，你也不可能找到较好的第三方库和模块支持，这就使得对碎片化严重的平台（如 Linux 和 Android）的支持意义变得很小
- Lazarus IDE 功能较为简陋，但整个开发流程又被完全绑定在 Lazarus IDE 上，使得开发效率较低。对于习惯 Visual Studio、Xcode 等现代 IDE 的开发者来说，这绝对是一场灾难：例如，所有设置和菜单项的位置都摆放随意，作为一个接近十年开发经验的开发者，我竟然在 IDE 中花了 10 分钟才找到如何设置编译选项

# ImGui

- 编程语言：C++（以及几乎所有常见语言的绑定，例如 C#、Rust、Go…）
- 支持平台：官方维护的后端基本已经支持了所有常见桌面、移动、嵌入式平台（DirectX9/11/12、OpenGL、Metal、SDL、Vulkan、WebGPU…）

**💪优点**

- 足够轻量（本身只有一个头文件和一个 cpp 文件），可以很方便地集成到任何项目中
- 兼容性绝对是杀手级别，你可以使用几乎任何语言为任何平台开发基于 ImGui 的应用
- 扩展性好，容易迁移到新的设备或平台上
- 流行度高，已经被广泛应用于游戏开发、工具开发等领域
- 非常精简，编译体积甚至比 Lazarus 生成的可执行文件还要小

**🤔缺点**

- 轻量有的时候意味着简陋。例如，至今没有好办法在 ImGui 中实现一个多行文本框，这在很多应用场景下是必须的（尽管当我们谈到文字处理时，[事情总是变得复杂](https://faultlore.com/blah/text-hates-you/)[^1]）
- 立即模式 GUI 有时候并不是一个好的选择：每帧重新绘制整个界面对复杂应用来说肯定是一个性能瓶颈，而且任何动画和复杂的控件交互都需要自己从头实现
- 完全利用图形 API 绘制界面，意味着会有更高的 GPU 占用，并且不利用原生控件也使得其控件风格和系统原生控件有较大差异


[^1]: 另外，[文本编辑也讨厌你](https://lord.io/text-editing-hates-you-too/)。

# wxWidgets

- 编程语言：C++、Python（还有其他语言的绑定，但要么不完善，要么已经停止维护）
- 支持平台：Windows、Linux、macOS

**💪优点**

- 直接使用系统原生控件进行绘制，风格契合度和性能都很好
- 控件数量相对比较丰富
- 编译体积也相对比较轻量

**🤔缺点**

- 官方教程年久失修，很多函数没有文档注释，很多功能的使用方法也需要查阅第三方教程
- 偏向 MFC 时代的 API 设计风格（尽管他们实际上有一套新的不太成熟的 API），对于新手来说学习曲线较陡
- 编写布局的方法较为繁琐。其 RAD 工具也不太好用，让本就缓慢的 C++ 编译速度变得更加难以忍受

# FLTK

- 编程语言：C++、Rust
- 支持平台：Windows、Linux、macOS

**💪优点**

- [内存占用极低](https://szibele.com/memory-footprint-of-gui-toolkits/)、[依赖体积较小](https://ironoxidizer.github.io/gui-toolkit-benchmarks/)
- 简单的、基于代码的布局 API

**🤔缺点**

- 控件数量较少，功能较为简陋
- 控件的风格和系统原生控件有较大差异，并且非常原始，看起来像来自 Windows 95 时代（尽管 Rust 绑定的维护者编写了一些新的主题，努力改善这一点）
- 中文支持不佳，在 Windows 下的字体渲染效果差

# Fyne

- 编程语言：Go
- 支持平台：Windows、Linux、macOS、iOS、FreeBSD、Android

**💪优点**

- 使用 Go 也算是一个优点？

**🤔缺点**

- 编译体积较大，[即使空项目也有 10~20MB 左右](https://github.com/fyne-io/fyne/issues/2393)
- 使用自己的控件风格，与系统原生控件有一定差异（但相对比较现代）
- 社区资源较少，学习资料不多，组件数量也不多（实际上维护也不是很活跃）

# Slint

# SWT

# GTK4

# 易语言

- 编程语言：易语言
- 支持平台：Windows、Linux（仅控制台，不支持 GUI）

**💪优点**

- 语法简单，基本是中文版的 Visual Basic，适合初学者
- 有一个所见即所得的界面设计器
- 有大量的第三方库和模块支持，诸多优秀的中文教程和社区
- 编译体积和 VB 一样小，比 Lazarus 生成的可执行文件还要小

**🤔缺点**

- 很难写出紧凑高效的代码。语言本身的局限性很大，很多功能都需要调用系统 API 才能实现
- 难以用 Git 等现代版本控制工具管理代码
- 仅支持 Windows 平台
- 上一版本以来已停止更新 1 年多，未来前景不明朗

# aardio

- 编程语言：Lua（使用 aardio 标准库，有一定魔改）
- 支持平台：Windows

**💪优点**

- 完善的中文文档、教程和社区，自称已经有 20 年历史，目前仍在活跃更新
- 有一个所见即所得的界面设计器
- 语法简单，适合初学者，也支持调用外部语言
- 编译体积和易语言类似，专注于 Windows 平台

**🤔缺点**

- 仅支持 Windows 平台
- 只能使用 aardio IDE 进行开发，功能较为简陋


# 参考

- https://blog.royalsloth.eu/posts/sad-state-of-cross-platform-gui-frameworks/
- https://ironoxidizer.github.io/gui-toolkit-benchmarks/
- https://xylt.github.io/windows-ui/