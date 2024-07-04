title: "如何在 U-Boot 中启动 Linux 内核"
date: 2024-07-04 18:08:00 +0800
author: w568w
cover: images/u-boot.webp
preview: 字面意思的短文
---

U-Boot 是一个开源的引导加载程序，用于嵌入式系统的引导。

调试内核时需要手动切换内核，由于其命令非常不直观，这里记录一下如何在 U-Boot 中启动 Linux 内核。

> **以下假设**：
>
> - 你能进入 U-Boot 命令行
> - 你的 Linux 内核位于 mmc 第 0 分区下，路径为 `/vmlinuz`
> - 你的设备树位于 mmc 第 0 分区下，路径为 `/dtbs/rk.dtb`
> - 你是 ARM 架构，且 U-Boot 正确定义了 `kernel_addr_r` 和 `fdt_addr_r` 等[环境变量](https://docs.u-boot.org/en/latest/usage/environment.html)


## 1. 加载内核
将 `/vmlinuz` 载入到内核载入地址 `$kernel_addr_r`：

```shell
load mmc 0 ${kernel_addr_r} /vmlinuz
```

## 2. 加载设备树
将 `/dtbs/rk.dtb` 载入到 `$fdt_addr_r`：

```shell
load mmc 0 ${fdt_addr_r} /dtbs/rk.dtb
```

## 3. 设置启动参数

指定内核的启动参数。请根据实际情况来，不要直接复制：

```shell
setenv bootargs initrd=/initramfs-linux.img console=ttyS2,1500000 root=PARTUUID=2f3fd9c7-cb58-43ae-978e-60f136cfd91c rw rootwait loglevel=2
```

其中重要的参数有：

- `initrd`：指定 initramfs 文件路径
- `console`：指定控制台串口和波特率
- `root`：指定根分区
- `loglevel`：指定内核日志级别

## 4. 启动内核

用 [`booti`](https://docs.u-boot.org/en/latest/usage/cmd/booti.html) 或 [`bootz`](https://docs.u-boot.org/en/latest/usage/cmd/bootz.html) 启动内核。

> **你知道吗？**
>
> Linux 内核镜像有[多种不同格式](https://unix.stackexchange.com/questions/5518/what-is-the-difference-between-the-following-kernel-makefile-terms-vmlinux-vml)：
> 
> - `vmlinux`：未压缩的内核镜像，一个普通的可执行文件，包含调试符号
> - `vmlinuz`：经过 `zlib` 压缩的 `vmlinux`，可以直接启动，不包含调试符号
> - `Image`: 移除了调试符号的 `vmlinux`
> - `zImage`：经过压缩的 `vmlinux`，与 `vmlinuz` 不同的是镜像本身包含在 `piggy.o` 中，添加了一些额外的启动代码以解压缩
> - `bzImage`：和 `zImage` 类似，但允许携带更大（**b**igger）的内核
>
> **对于最后两种格式，需要用 `bootz` 启动。** 其他可先尝试 `booti`。

```shell
booti ${kernel_addr_r} - ${fdt_addr_r}
```

其中，`booti` 的三个参数分别为「内核地址」、「ramdisk 地址」和「设备树地址」。由于我们没有 ramdisk，所以用 `-` 占位。

