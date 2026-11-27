// Only the component CSS we use, bundled locally: no runtime Tailwind or external CDN.
import '../node_modules/daisyui/base/properties.css';
import '../node_modules/daisyui/components/button.css';
import '../node_modules/daisyui/components/input.css';
import '../node_modules/daisyui/components/select.css';
import '@fontsource/bungee/latin-400.css';
import '@fontsource/bricolage-grotesque/latin-500.css';
import '@fontsource/bricolage-grotesque/latin-700.css';
import '@fontsource/bricolage-grotesque/latin-800.css';
class BuzzerCap extends HTMLElement {
 connectedCallback(){this.setAttribute('aria-hidden','true');this.textContent=this.getAttribute('letter')||this.textContent||'';}
}
class RoundMeter extends HTMLElement {
 static observedAttributes=['progress'];
 connectedCallback(){if(!this.firstChild){const track=document.createElement('div');track.className='mq-meter-track';track.setAttribute('aria-hidden','true');for(let i=0;i<24;i++)track.append(document.createElement('i'));this.append(track);}this.paint();}
 attributeChangedCallback(){this.paint();}
 paint(){const track=this.firstElementChild;if(!track)return;const pct=Math.max(0,Math.min(100,Number(this.getAttribute('progress')||0)));track.classList.toggle('urgent',pct<=25);[...track.children].forEach((x,i)=>x.classList.toggle('lit',i<pct*24/100));}
}
customElements.define('mq-buzzer-cap',BuzzerCap);
customElements.define('mq-round-meter',RoundMeter);
