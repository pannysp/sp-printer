const iconv = require('iconv-lite');
const cmds = require('./commands');
const node_printer = require('printer');
const BufferHelper = require('bufferhelper');


/**
 * 打印任务
 * @param  {function} callback     function(err,msg),当获取打印机后执行,如果不存在指定打印机，返回err信息
 * @param  {string}   printerName  打印机名，不传参则为默认打印机
 */
const printer = function(callback, printerName) {
    if (!printerName) {
        this.printer = node_printer.getDefaultPrinterName();
    }else{
        this.printer = printerName;
    }
    
    try {
        node_printer.getPrinter(this.printer);
    } catch (err) {
        if (callback) callback.call(this, err, 'Can\'t find the printer');
        return false;
    }
    this.msg = 'Get printer success';
    this._queue = new BufferHelper();
    this._writeCmd('INITIAL_PRINTER');
    this._writeCmd('CHN_TEXT');
    this._writeCmd('LINE_HEIGHT');
    if (callback) callback.call(this, null, this.msg);
};

printer.prototype = {
    /**
     * 打印文字
     * @param  {string} text    文字内容
     * @param  {boolen} inline  是否换行
     * @return {object}         当前对象
     */
    text: function(text, inline) {
        if (text) {
            this._queue.concat(iconv.encode(text, 'gbk'));
            if (!inline) this._writeCmd('NEW_LINE');
        }
        return this;
    },

    /**
     * 打印间隔线
     * @param  {string} str 字符，如：-|*|=
     * @param  {number} length 字符个数
     * @return {object}        当前对象
     */
    line: function(str, length) {
        let txt = '';
        this.setAlign('L');
        length = length || 32;
        for (let i = 0; i < length; i++) {
            txt += str;
        }
        this.text(txt);
        return this;
    },

    /**
     * 打印空行
     * @param  {number} number 行数
     * @return {object}        当前对象
     */
    blank: function(number) {
        this.setAlign('L');
        number = number || 1;
        this.setLineheight(14);
        for (let i = 0; i < number; i++) {
            this._writeCmd('NEW_LINE');
        }
        this.setLineheight();
        return this;
    },
    /**
     * 设置文字对齐
     * @param  {string} align 居中类型,L/C/R
     * @return {object}       当前对象
     */
    setAlign: function(align) {
        this._writeCmd('TXT_ALIGN_' + align.toUpperCase());
        return this;
    },
    /**
     * 设置字体
     * @param  {string} family A/B/C/D
     * @return {object}        当前对象
     */
    setFont: function(family) {
        this._writeCmd('TXT_FONT_' + family.toUpperCase());
        return this;
    },
    /**
     * 设置行高
     * @param {number} num 整数
     */
    setLineheight: function(num) {
        if (num) {
            num = num.toString(16);
            this._queue.concat(new Buffer(['0x1b','0x33', '0x'+num]));
        }else{
            this._writeCmd('LINE_HEIGHT');
        }
        return this;
    },
    /**
     * 设置格式（加粗，普通）
     * @param  {string} type Bold/Normal
     * @return {object}      当前对象
     */
    setStyle: function(type) {
        type = type || 'normal';
        switch (type.toUpperCase()) {
            case 'B':
                this._writeCmd('TXT_BOLD_ON');
                break;
            default:
                this._writeCmd('TXT_BOLD_OFF');
                break;
        }
        return this;
    },
    /**
     * 设置文字大小
     * @param  {string} size  3/2/1/null
     * @return {object}       当前对象
     */
    setSize: function(size) {
        this._writeCmd('TXT_NORMAL');
        this._writeCmd('LINE_HEIGHT');
        switch(parseInt(size)){
            case 2:
                // this._queue.concat(new Buffer([29,33,17]));
                this.setLineheight(58);
                this._queue.concat(new Buffer(cmds['TXT_SIZE']+'\x11'));
                break;
            case 3:
                // this._queue.concat(new Buffer([29,33,34]));
                this.setLineheight(70);
                this._queue.concat(new Buffer(cmds['TXT_SIZE']+'\x22'));
                break;
        }
        return this;
    },
    /**
     * 条形码
     * @param  {string} code     打印内容
     * @param  {string} type     打印类型: EAN13/CODE128
     * @param  {number} barWidth 单条线宽度
     * @param  {number} height   高度
     * @return {object}          当前对象
     */
    barcode: function(code, type, barWidth, height) {
        let w = barWidth.toString(16);
        let h = height.toString(16);
        this._queue.concat(new Buffer(['0x1d','0x68','0x'+h]));
        this._queue.concat(new Buffer(['0x1d','0x77','0x'+w]));
        this._writeCmd('BARCODE_FONT_A');
        this._writeCmd('BARCODE_TXT_BLW');
        this._writeCmd('BARCODE_' + type);

        if(type==='CODE128'){
            this._queue.concat(new Buffer([code.length+2]));
            // 使用codeB字符集打印code128数据
            this._queue.concat(new Buffer([0x7b,0x42]));
        }
        
        this._queue.concat(new Buffer(code));
        this._queue.concat(new Buffer(0));
        return this;
    },

    /**
     * 打印二维码,需要打印机支持
     * @param  {string} text    打印文字内容
     * @param  {string} size   二维码大小,16进制字符串,如'\x01'.默认为'\x06'
     * @return {object}          当前对象
     */
    qrcode:function(text, size){
        let pL = '';
        let pH = '';
        let len = text.length+3;
        
        if(!/^[\w\:\/\.\_\-\?\&\=]+$/.test(text)){
            this.text('二维码请使用英文和数字打印');
            return this;
        }

        size = size?size:8;
        size = size.toString(16);
        pL = (len%256).toString(16);
        pH = (parseInt(len/256)).toString(16);
        // this._writeCmd('QRCODE_SIZE_MODAL');
        this._queue.concat(new Buffer(cmds['QRCODE_SIZE']));
        this._queue.concat(new Buffer(['0x'+size]));
        this._writeCmd('QRCODE_ERROR');
        this._queue.concat(new Buffer(cmds['QRCODE_AREA_LSB']));
        this._queue.concat(new Buffer(['0x'+pL,'0x'+pH]));
        this._queue.concat(new Buffer(cmds['QRCODE_AREA_MSB']));
        this._queue.concat(new Buffer(text));
        this._writeCmd('QRCODE_PRINT');
        return this;
    },
    
    /**
     * 打开钱箱
     * @return {object} 当前对象
     */
    openCashbox: function() {
        this._writeCmd('CASHBOX_OPEN');
        this._writeCmd('INITIAL_PRINTER');
        return this;
    },

    /**
     * 蜂鸣警报
     * @param  {string} times    蜂鸣次数,16进制,1-9.默认'\x09'
     * @param  {string} interval 蜂鸣间隔,16进制,实际间隔时间为interval*50ms,默认'\x01'
     * @return {object}          当前对象
     */
    beep:function(times,interval){
        times=times?times:'\x09';
        interval=interval?interval:'\x01';
        this._queue.concat(new Buffer(cmds['BEEP']+times+interval));
        return this;
    },

    /**
     * 执行命令
     * @param  {string} cmd 命令名
     */
    _writeCmd: function(cmd) {
        if (cmds[cmd]) {
            this._queue.concat(new Buffer(cmds[cmd]));
        }
    },
   
    /**
     * 执行打印
     * @param  {Function} callback function(err,msg),当执行打印后，回调该函数，打印错误返回err信息
     */
    print: function(callback) {
        this._writeCmd('FOOT_LINE');
        this._writeCmd('PAPER_CUTTING');
        this._writeCmd('INITIAL_PRINTER');
        this.sendCmd(callback);
    },
    /**
     * 发送命令
     * @param  {Function} callback function(err,msg),当执行打印后，回调该函数，打印错误返回err信息
     */
    sendCmd:function(callback){
        let _this = this;
        node_printer.printDirect({
            data: _this._queue.toBuffer(),
            printer: _this.printer,
            type: 'RAW',
            success: function() {
                _this.msg = 'Print Success';
                callback.call(_this, null, _this.msg);
                _this._queue.empty();
            },
            error: function(err) {
                _this.msg = 'Print Failed';
                callback.call(_this, null, _this.msg);
            }
        });
    },
    /**
     * 清空打印内容
     * @return {object} 当前对象
     */
    empty: function() {
        this._queue.empty();
        return this;
    }
};

module.exports = printer;