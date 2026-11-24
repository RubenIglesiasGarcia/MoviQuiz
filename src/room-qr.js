import QRCode from 'qrcode';
export function drawRoomQR(canvas,url){return QRCode.toCanvas(canvas,url,{width:240,margin:2,errorCorrectionLevel:'M',color:{dark:'#101320',light:'#ffffff'}});}
