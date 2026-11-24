import {LitElement,html,css} from 'lit';
import '@fontsource/barlow-condensed/latin-700.css';
import '@fontsource/barlow-condensed/latin-800.css';
import '@fontsource/space-grotesk/latin-400.css';
import '@fontsource/space-grotesk/latin-600.css';
import '@fontsource/space-grotesk/latin-700.css';

class BuzzerCap extends LitElement {
 static properties={letter:{type:String}};
 static styles=css`:host{display:grid;place-items:center}span{display:grid;place-items:center;width:100%;aspect-ratio:1;border:1px solid currentColor;border-radius:50%;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:1.35em;line-height:1}`;
 render(){return html`<span>${this.letter||''}</span>`;}
}
class RoundMeter extends LitElement {
 static properties={progress:{type:Number}};
 static styles=css`:host{display:block}.track{display:grid;grid-template-columns:repeat(24,1fr);gap:3px;height:8px}.segment{background:#282c43;border-radius:1px}.segment.active{background:#f2d14f}.urgent .active{background:#ff5d77}`;
 constructor(){super();this.progress=100;}
 render(){const pct=Math.max(0,Math.min(100,this.progress||0));return html`<div class="track ${pct<=25?'urgent':''}" aria-hidden="true">${Array.from({length:24},(_,i)=>html`<i class="segment ${i<pct*24/100?'active':''}"></i>`)}</div>`;}
}
class Stage extends LitElement {
 static styles=css`:host{display:block;width:100%;max-width:530px}*{box-sizing:border-box}.stage{position:relative;border:1px solid #363b53;background:#111525;box-shadow:12px 12px 0 #090b13;padding:20px;isolation:isolate}.stage:before{content:'';position:absolute;left:-1px;top:-1px;width:80px;height:3px;background:#f8d64d}.top,.foot{display:flex;align-items:center;justify-content:space-between;font-family:'Space Grotesk',sans-serif;font-size:12px;color:#b5bdd3;font-weight:600;letter-spacing:1px}.live{display:flex;align-items:center;gap:7px}.live:before{content:'';width:7px;height:7px;background:#ff5672;border-radius:50%}.timer{font-family:'Barlow Condensed',sans-serif;font-size:30px;color:#f8d64d}.question{margin:16px 0 22px;font-family:'Barlow Condensed',sans-serif;font-weight:800;font-size:clamp(30px,5vw,51px);line-height:.98;letter-spacing:.01em;color:#fff}.category{font-size:11px;color:#929bb3;letter-spacing:2px;margin-top:20px}.keys{display:grid;grid-template-columns:repeat(2,1fr);gap:12px}.key{display:flex;align-items:center;gap:10px;color:#0d1120;border-radius:5px;padding:13px 10px;border-bottom:5px solid #0005;font-size:clamp(12px,2vw,17px);font-weight:700}.key b{font-size:25px;font-family:'Barlow Condensed',sans-serif}.key:nth-child(1){background:#ff6685}.key:nth-child(2){background:#65b6ff}.key:nth-child(3){background:#f8d64d}.key:nth-child(4){background:#6ee5a3}.foot{border-top:1px solid #363b53;margin-top:22px;padding-top:13px}.foot strong{color:#f8d64d;font-size:19px;font-family:'Barlow Condensed',sans-serif}@media(max-width:520px){.stage{padding:15px}.keys{gap:8px}.question{margin:12px 0 18px}.key{padding:10px 8px}}`;
 render(){return html`<div class="stage"><div class="top"><span class="live">EN DIRECTO</span><span class="timer">12s</span></div><mq-round-meter progress="66"></mq-round-meter><div class="category">RONDA 03 · CULTURA GENERAL</div><div class="question">¿Cuál es el planeta más grande?</div><div class="keys">${['Marte','Júpiter','Saturno','Neptuno'].map((x,i)=>html`<div class="key"><b>${String.fromCharCode(65+i)}</b>${x}</div>`)}</div><div class="foot"><span>4 JUGADORES</span><strong>1.850 PTS</strong></div></div>`;}
}
customElements.define('mq-buzzer-cap',BuzzerCap);
customElements.define('mq-round-meter',RoundMeter);
customElements.define('mq-stage',Stage);
