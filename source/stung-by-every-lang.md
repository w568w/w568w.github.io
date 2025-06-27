title: "[EN] Stung by Every Language"
date: 2025-06-28 03:26:00 +0800
author: w568w
cover: images/languages.webp
preview: Programming languages are like a box of chocolates. You never know what you're gonna get
toc: true

---

![Image by: <a href=https://www.flickr.com/photos/isipeoria/6691167811>isipeoria</a>, CC BY-NC-ND 2.0](images/languages.webp)

Ever since I started college, one of my favorite pastimes has been to wander around the internet, dipping my toes into new programming languages. I love digging into their features, always hoping to find that "holy grail" I've envisioned, and trying to build some practical applications with them.

Through years of this exploration, I've slowly come to a realization: every language has its flaws. A language that seems promising at first will, before long, inevitably reveal its not-so-pretty side. This is true even for those hailed as "elegant" or "highly modern." At this point, my watchlist is full of them. To prevent myself from forgetting these issues and repeating the same mistakes, I've decided to write down the hidden pain points behind these languages.

> (Insert meme here: "*You decide to play a game you haven't touched in a year. Ten minutes later, you remember why you quit.*")

Consider this blog post purely a rant; it only reflects my personal opinions. I haven't gone deep with most of these languages, nor do I intend to spend months mastering each one. I will also deliberately lump issues with the toolchain and ecosystem together with problems in the language itself. Typically, I've only used each language to write simple numerical computing or GUI programs before just scratching the surface and moving on. So, if anything I say rubs you the wrong way, please feel free to call me out on it!

**Update**: I had originally written long-winded descriptions for each language. I realize now that was pointless, so I'm just going to summarize the pain points in a sentence or two.

# 1. Rust

- It desperately needs **a more ergonomic macro system**. The current one is too complex to use.
- **Cross-compilation** is still a pain because so many libraries simply link to C.
- Both compilation and IntelliSense (which relies on `cargo check`) are **slow**.
- Everything is great, as long as you don't touch **lifetimes** and **dynamic dispatch**. If you do, you've fucked up.

# 2. Go

- **Misusing *product* types** (`return_value AND err` instead of `return_value OR err`) for error handling.
- **No much optimization.** Even function inlining is seldom done, let alone a performant GC.
- **Many popular libraries are dead.** Things like "Last Commit: 8 years ago" are much more common than I see in other languages.
- **No exhaustive check for `switch` cases.**
- Silently allow **partial initialization of structs**.
- The way of **representing optional/null values** is painful. Have to use `**int` simply because you want to distinguish absent / null / present states of a JSON integer field.
- **Stdlib would pollute your stdout** with arbitrary log messages.

# 3. C

- **The introduction of new features is painfully slow**. Each generation of the C committee seems to be pulling the language in a different direction.
- **Build systems are hellishly complex.** Just take a look at the landscape: Makefiles, the GNU Autotools, generations of CMake, Meson, SCons... the list goes on. I honestly don't believe any mere mortal can get the hang of a build system they don't already live and breathe in any reasonable amount of time.
- **No support for generics.** `void *` pointers everywhere destroy all semantics. Hope you have good code comments, or good luck to the next maintainer.
- **Some ancient quirks prevent optimizations.** There's no Automatic Struct Field Reordering because of concerns about breaking the old code. Auto Vectorization is also too conservative.
- Trying to **static link**? **Glibc** will fight you every step of the way. You'd need to recompile every single library you use, and even then, some libraries deliberately use `dlopen` for loading, which makes **static linking them completely impossible**.
- **Dynamic linking** is also a pain. Write once, recompile everywhere.
- **Macros are massively overused and abused** in the last 30 years, making code unreadable. You have to constantly jump between different macros and definitions in tons of files just to figure out what `CALL_LIB_FN_E("Class", foo, 1, 0)` is actually doing. This fundamentally destroys C's "*intuitiveness*" and "*simplicity*".

# 4. C++

- **The language is a mess.** It has so many features that it feels like a hodgepodge of ideas from different eras. Java-like Exceptions and OOP, Rust-like Ownership and Smart Pointers, JavaScript-like Lambdas, and so on.
- As for the other drawbacks, refer to C. I'm honestly not sure **what problems C++ has solved that C had**. In my opinion, it's just **introduced more headaches**: static compilation is even harder, and the build systems are more complex.

# 5. Java

- **No null safety**, and the infamous `NullPointerException`.
- **Big and heavy**. I can't understand why my "Hello World" needs tens of megabytes of memory, and a simple graphical application requires hundreds.
- **Spring and Gradle have, in my opinion, should be blamed for the infamous complexity of the ecosystem**. My feelings about Spring are a personal bias: most "junior" developers simply apply Spring design patterns to every application, complicating simple problems. My stereotype of Java programmers as "rigid and inflexible, unwilling to adapt" largely stems from this. Gradle, on the other hand, has profoundly shown me that "a build system can be so bloated and enormous, taking up tens of gigabytes of disk space and 4 GB of RAM, with a configuration language, Groovy, which is so complex that it's impossible for the human mind to grasp the thousands of classes, tasks, jobs and plugins."

# 6. Kotlin

- **No checked exception**. I really don't get it. Kotlin designers often justify the removal by saying, "they were abused by Java programmers." But shouldn't the right action be to improve it, instead of removing completely? Now, any function can implicitly throw any exception. **Welcome to the minefield where every step could trigger an explosion.**
- **Kotlin Native is a joke.** To be fair, it should be renamed to "Kotlin for iOS." Not even a real cross-platform solution.
- The stdlib is too small. Even **network programming relies on third-party libraries**.

# 7. Python

- **GIL**. It should, and must, be removed a decade ago. I don't know how it has survived this long. Today, our Python programs are built on top of complex multi-processing and IPC mechanisms that break or hang time to time, just to get around the GIL.
- **Terrible package management**. pip is simple, but it's *too* simple, leading packagers to **abuse its various features to implement behaviors not defined in PEPs**. The bad news is, pip isn't a complete package dependency management solution at all, which has caused significant inconvenience for later reimplementations like `uv`. And I haven't even mentioned the specification changes in libraries like `setup_tools`, and the confusion they've caused for developers and users alike…
- **The stdlib is extensive, but many parts feel like missing some key functionalities**. For instance, even today, you still can't perform a select operation across multiple `asyncio.Future` objects.
- **Horribly slow**. Python is not a language for performance, but for productivity, and it *does* show that by smashing performance to the ground. 

# 8. JavaScript

Nah.

# 9. TypeScript

- **Still not prepared for applications** other than web development. The ecosystem is yet immature.
- A typed language with schemas that has **no support for runtime schema validation** and encourages you to maintain your own type guards. This is a pain in the ass especially when dealing with network objects.

# 10. Zig

- We, need, **async**. I'm await. I don't want to reinvent the asynchronous programming in a "modern" language.
- **Error-code handling**, rather than error-handling.
- The **platform target policy is too aggressive and unclear**. For example, it drops support for Linux < 5.10 (which is declared nowhere in documentation, but in a GitHub issue), a decision that could alienate potential users.
- **The stdlib is incomplete**.

# 11. V

- **A history of hype without substantial features**. It's better now, but far from great.
- The **ecosystem is minimal**, if not non-existent.

# 12. Dart

- **Depends on Flutter too heavily**. Most libraries in the ecosystem are built specifically for Flutter, making it difficult to find packages for general-purpose Dart development.
- **Google seems to be losing interest in Dart**. Can it survive without Google's backing?

# 13. Lua

- **Messy package and dependency management**. The ecosystem is fragmented, with multiple package management approaches (although `luarocks` is the most popular).
- **The general-use ecosystem is dead**. For example, you cannot find any threading library that receives updates in the last 5 years. It is still popular in the game modding community, but not much else.
- **Error-handling is awkward**. Have to use `pcall` or `xpcall` to catch errors. Verbose and not intuitive.

# 14. Haskell

- Is it really **used in production**?
- I heard it has **namespace conflicts**.

# 15. $\LaTeX$

No, it is cursed. I would rather use $\text{Lua}\TeX$ or Typst.

# 16. C\#

- **No open-source debugger**.
- **Stdlib is tied to Microsoft**. Mono? No, it's imfamous for slow performance and poor maintenance.
- **AOT is immature yet.**