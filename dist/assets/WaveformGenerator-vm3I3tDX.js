import{r as a}from"./vendor-5D7zIO-3.js";import{H as b,c as d,a as v}from"./main-ChLVje_b.js";import{u as w}from"./QuantumField-BmR5BzGs.js";import{j as x}from"./framer-CEsFDmal.js";const E=()=>{const{identity:e}=w();return{getActor:a.useCallback(async()=>{if(!e)throw new Error("No identity available");const r=new b({identity:e});return d(v,{agent:r})},[e])}},C=e=>{const[s,r]=a.useState(!1),[g,i]=a.useState(!1),t=E(),n=a.useCallback(async()=>null,[t,e]),l=a.useCallback(async h=>!1,[t,e]),o=a.useCallback(async()=>null,[t,e]);return{observeState:n,initiateEntanglement:l,getMetrics:o,isObserving:s,isEntangling:g}},M=({type:e,amplitude:s,frequency:r,className:g=""})=>{const i=a.useRef(null);return a.useEffect(()=>{if(!i.current)return;const t=i.current,n=t.getContext("2d");if(!n)return;let l,o=0;const h=()=>{if(!(!t||!n)){n.clearRect(0,0,t.width,t.height),n.lineWidth=2,n.strokeStyle=e==="Entangled"?"#FF61DC":"#7B61FF",n.beginPath(),n.moveTo(0,t.height/2);for(let c=0;c<t.width;c++){let u=t.height/2;switch(e){case"Stable":u+=Math.random()*2-1;break;case"Fluctuating":u+=Math.sin(c*r+o)*s*(t.height/4);break;case"Entangled":const f=Math.sin(c*r+o)*s*(t.height/6),m=Math.sin(c*r+o+Math.PI)*s*(t.height/6);u+=(f+m)/2;break}n.lineTo(c,u)}n.stroke(),o+=.05,l=requestAnimationFrame(h)}};return h(),()=>{cancelAnimationFrame(l)}},[e,s,r]),x.jsx("canvas",{ref:i,className:`w-full h-full ${g}`,style:{filter:e==="Entangled"?"drop-shadow(0 0 8px rgba(255, 97, 220, 0.3))":"drop-shadow(0 0 8px rgba(123, 97, 255, 0.3))"}})};export{M as W,C as u};
//# sourceMappingURL=WaveformGenerator-vm3I3tDX.js.map