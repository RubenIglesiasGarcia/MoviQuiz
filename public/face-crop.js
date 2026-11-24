// The camera guide and rendered oval use the same aspect ratio (0.9:1).
export const FACE_WIDTH=.648, FACE_HEIGHT=.72;
export function faceCrop(width,height,zoom=1,x=0,y=0){const side=Math.min(width,height),w=side*FACE_WIDTH/zoom,h=side*FACE_HEIGHT/zoom;return {x:Math.max(0,Math.min(width-w,(width-w)/2+x*(width-w)/2)),y:Math.max(0,Math.min(height-h,(height-h)/2+y*(height-h)/2)),w,h};}
export function captureFace(source,width,height,{mirror=false,zoom=1,x=0,y=0}={}){const rect=faceCrop(width,height,zoom,x,y),c=document.createElement('canvas');c.width=c.height=192;const ctx=c.getContext('2d');if(mirror){ctx.translate(192,0);ctx.scale(-1,1);}ctx.drawImage(source,rect.x,rect.y,rect.w,rect.h,0,0,192,192);return c.toDataURL('image/jpeg',.8);}
