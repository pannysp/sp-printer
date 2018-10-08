//
// esc/pos命令集
//

module.exports = {
	INITIAL_PRINTER: '\x1B\x40', //Initial paper
	NEW_LINE: '\x0A', //Add new line
	FOOT_LINE: '\x1b\x64\x04', //Add new line
	PAPER_CUTTING: '\x1d\x56\x41', //Cut paper
	LINE_HEIGHT: '\x1b\x33\x26', //Normal line height 
	LINE_HEIGHT_B: '\x1b\x33\x6e', //Normal line height large
	CHN_TEXT: '\x1b\x52\x0f', //CHN text
	// text style
	TXT_NORMAL: '\x1d\x21\x00', // Normal text
	TXT_SIZE: '\x1d\x21', // Double height text

	TXT_BOLD_OFF: '\x1b\x45\x00', // Bold font OFF
	TXT_BOLD_ON: '\x1b\x45\x01', // Bold font ON

	TXT_ALIGN_L: '\x1b\x61\x00', // Left justification
	TXT_ALIGN_C: '\x1b\x61\x01', // Centering
	TXT_ALIGN_R: '\x1b\x61\x02', // Right justification

	//字体
	TXT_FONT_A: '\x1b\x4d\x00', // Font type A
	TXT_FONT_B: '\x1b\x4d\x01', // Font type B
	TXT_FONT_C: '\x1b\x4d\x02', // Font type C
	TXT_FONT_D: '\x1b\x4d\x03', // Font type D，汉字

	//barcode
	BARCODE_TXT_OFF: '\x1d\x48\x00', // HRI barcode chars OFF
	BARCODE_TXT_ABV: '\x1d\x48\x01', // HRI barcode chars above
	BARCODE_TXT_BLW: '\x1d\x48\x02', // HRI barcode chars below
	BARCODE_TXT_BTH: '\x1d\x48\x03', // HRI barcode chars both above and below

	BARCODE_FONT_A: '\x1d\x66\x00', // Font type A for HRI barcode chars
	BARCODE_FONT_B: '\x1d\x66\x01', // Font type B for HRI barcode chars

	BARCODE_HEIGHT: '\x1d\x68\x64', // Barcode Height [1-255]
	// 条形码单条线的宽度
	BARCODE_WIDTH: '\x1d\x77\x02', // Barcode Width  [1-6]

	//barcode类型
	BARCODE_UPC_A: '\x1d\x6b\x00', // Barcode type UPC-A
	BARCODE_UPC_E: '\x1d\x6b\x01', // Barcode type UPC-E
	BARCODE_EAN13: '\x1d\x6b\x02', // Barcode type EAN13
	BARCODE_EAN8: '\x1d\x6b\x03', // Barcode type EAN8
	BARCODE_CODE39: '\x1d\x6b\x04', // Barcode type CODE39
	BARCODE_ITF: '\x1d\x6b\x05', // Barcode type ITF
	BARCODE_NW7: '\x1d\x6b\x06', // Barcode type NW7
	BARCODE_CODE93: '\x1d\x6b\x48', // Barcode type CODE93
  	BARCODE_CODE128: '\x1d\x6b\x49', // Barcode type CODE128

	//qrcode
	
	QRCODE_SIZE_MODAL: '\x1D\x28\x6B\x03\x00\x31\x41\x32\x00', //Select the model,[49 x31, model 1] [50 x32, model 2] [51 x33, micro qr code]
	QRCODE_SIZE: '\x1D\x28\x6B\x03\x00\x31\x43',  //Set the size of module
	QRCODE_ERROR: '\x1D\x28\x6B\x03\x00\x31\x45\x31', //Set n for error correction [48 x30 -> 7%] [49 x31-> 15%] [50 x32 -> 25%] [51 x33 -> 30%]
	QRCODE_AREA_LSB: '\x1D\x28\x6B', //Store the data in the symbol storage area LSB
	QRCODE_AREA_MSB: '\x31\x50\x30', //Store the data in the symbol storage area MSB
	QRCODE_PRINT:'\x1D\x28\x6B\x03\x00\x31\x51\x30', //Print the symbol data in the symbol storage area

	//钱箱
	CASHBOX_OPEN: '\x1B\x70\x00\xFF\xFF', //Open casebox

	//蜂鸣
	BEEP:'\x1b\x42' //beep
}