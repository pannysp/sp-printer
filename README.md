sp-printer
=

## 介绍

sp-printer是改进了的基于nodejs的window下控制打印机程序，使用`printer`的C组件与打印机通信，使用ESC/POS命令控制打印机，可应用于NW.js或electron应用程序，且支持中英文打印，门店小票打印，条形码、二维码打印等。

## 安装  
首先要保证电脑已安装python2.7、Visual Studio 2015、全局安装的nw-gyp；    
之后运行以下命令：  
1.指定python路径；  
2.指定运行在NW.js的版本号，如0.33.4；  
3.指定windows的系统位数x64或x32；  
4.指定node-gyp编译器为nw-gyp；  
5.指定依赖C++模块按照 VS2015 安装编译为node模块    


```  

set PYTHON=C:\Users\NALA\.windows-build-tools\python27\python.exe

set npm_config_target=0.33.4

set npm_config_arch=x64

set npm_config_runtime=node-webkit

set npm_config_build_from_source=true

set npm_config_node_gyp=C:\Users\NALA\AppData\Roaming\npm\node_modules\nw-gyp\bin\nw-gyp.js

npm install --msvs_version=2015 sp-printer

```

## 使用方法  
### new printer(callback, printerName)    
string `printerName` :打印机名称，如'TSC TTP-244 Pro'，不传参数则取默认打印机    

```  
let printer = require('sp-printer');
new printer(function(err,msg){
    //调用this方法进行打印
    this.text('测试打印');
    this.print(function(err, msg){
        if(err){
            console.log(msg);
        }
        this.empty();
    });
});
```  
  
## 打印方法  

### text(text,[inline]) 打印文字内容 
string `text`:打印内容,单行数据,如果超出自动换行  
boolen `inline`:是否自动换行,如果为true,则不会自动换行
```
this.text('测试打印');
```

### line(text) 间隔线  
string `text`: '-'
```
this.line('-');
```

### blank(number) 空行  
number `number`:空行数  
```
this.blank(2);
```

### setAlign(align) 设置对齐
string `align`:`C/L/R`分别代表居中/居左/居右,不区分大小写  
```
this.setAlign('c').text('这个是居中文字');
```

### setLineheight(hex) 设置行高
string `hex`:16进制数字,如'\x05'  
```
this.setLineheight('\x05');
```

### setStyle(type) 设置样式
string `type`:`B/U`分别代表加粗/下划线,不区分大小写  
```
this.setStyle('b').text('加粗');
```

### setSize(size) 设置文字大小
number `size`:3/2/1/null,x代表x倍字体,1/null均为正常
```
this.setSize(2).text('大字体');
```
### barcode(text,type,width,height) 打印条形码  
string `text`:条形码内容  
string `type`:条形码类型  
number `width`:条形码单条线宽度1-8像素
number `height`:条形码高度90像素
```
this.barcode('1234567890128','CODE128',2,90);
```

### qrcode(text,size) 打印二维码  
需要打印机支持QRCODE条码类型,否则会打印乱码,只支持英文字符和URL特殊符号(:/?=&.)  
string `text`:二维码内容  
number `size`:二维码大小,默认8, 数值1-8  
```
this.qrcode('https://mp.weixin.qq.com/s/1j25TtjLiyrFGmsOPlkccw', 8);
```

### beep(times,interval) 蜂鸣警报  
string `times`:蜂鸣次数,16进制,1-9.默认'\x09'  
string `interval`:蜂鸣间隔,16进制,实际间隔时间为interval*50ms,默认'\x01'  
```
this.beep();
```
注:compile中16进制参数请使用\转义,如`<% beep:'\\x03','\\x01' %>` 

### compile(string) 编译
string `string`:编译整个字符串  
使用<% 方法名:[参数] %>进行快速设置`\n`或`\r`表示换行.
```
this.compile('<% setAlign:c %><% setSize:2 %>这里开始是放大\n<% setSize:1 %>恢复正常大小');
```

### print(callback) 打印当前内容
function `callback`:回传err以及msg,当成功时,err为null  
```
this.print(function(err,msg){
   if(err){
    console.log('打印出错,回传信息:');
   }
   console.log(msg);
});
```
### empty() 清空当前内容
```
this.empty();
```

### openCashbox() 发送钱箱脉冲
钱箱脉冲不能同打印命令一同发送(钱箱脉冲命令会执行但不会进行打印)  
```
this.openCashbox();
```

### sendCmd(callback) 发送打印指令
function `callback`:回传err以及msg,当成功时,err为null  
```
this.sendCmd(function(err,msg){
   if(err){
    console.log('打印出错,回传信息:');
   }
   console.log(msg);
});
```  

更多方法和使用，自行查看/lib/printer.js文件  

### Screencast

![img](http://img.nala.com.cn/images/b2b/printer-screen.jpg!wh800)