import{r as m,u as L}from"./vendor-DAG3_51J.js";import{u as B,E as z}from"./main-BLtP7dC-.js";import{j as s,u as O,a as A}from"./framer-CgXRyNIB.js";import{c as D}from"./createLucideIcon-BXQ_RuTh.js";import{B as F}from"./brain-U5Ij6RuU.js";const H=D("Cpu",[["rect",{x:"4",y:"4",width:"16",height:"16",rx:"2",key:"1vbyd7"}],["rect",{x:"9",y:"9",width:"6",height:"6",key:"o3kz5p"}],["path",{d:"M15 2v2",key:"13l42r"}],["path",{d:"M15 20v2",key:"15mkzm"}],["path",{d:"M2 15h2",key:"1gxd5l"}],["path",{d:"M2 9h2",key:"1bbxkp"}],["path",{d:"M20 15h2",key:"19e6y8"}],["path",{d:"M20 9h2",key:"19tzq7"}],["path",{d:"M9 2v2",key:"165o2o"}],["path",{d:"M9 20v2",key:"i2bqo8"}]]),$=D("Network",[["rect",{x:"16",y:"16",width:"6",height:"6",rx:"1",key:"4q2zg0"}],["rect",{x:"2",y:"16",width:"6",height:"6",rx:"1",key:"8cvhb9"}],["rect",{x:"9",y:"2",width:"6",height:"6",rx:"1",key:"1egb70"}],["path",{d:"M5 16v-3a1 1 0 0 1 1-1h12a1 1 0 0 1 1 1v3",key:"1jsf9p"}],["path",{d:"M12 12V8",key:"2874zd"}]]),Q=D("Zap",[["polygon",{points:"13 2 3 14 12 14 11 22 21 10 12 10 13 2",key:"45s27k"}]]);class U{actor;subscriptions;heartbeatInterval;reconnectAttempts;quantumState;MAX_RECONNECT_ATTEMPTS=5;constructor(t){this.actor=t,this.subscriptions=new Map,this.heartbeatInterval=null,this.reconnectAttempts=0,this.quantumState="stable"}async subscribe(t,a){try{if(this.quantumState!=="stable")throw new Error(`quantum_error: System in ${this.quantumState} state`);this.subscriptions.has(t)||(this.subscriptions.set(t,new Set),await this.initializeSubscription(t)),this.subscriptions.get(t)?.add(a),this.startHeartbeat()}catch(o){throw o instanceof Error&&o.message.includes("quantum")&&this.handleQuantumError(o),o}}handleQuantumError(t){switch(t.message.split(":")[0]){case"quantum_superposition":this.quantumState="superposition",this.attemptStateCollapse();break;case"quantum_entanglement":this.quantumState="entangled",this.resolveEntanglement();break;default:throw t}}async attemptStateCollapse(){console.log("Attempting quantum state collapse..."),await new Promise(t=>setTimeout(t,1e3)),this.quantumState="stable",this.reconnectAll()}async resolveEntanglement(){console.log("Resolving quantum entanglement..."),await new Promise(t=>setTimeout(t,2e3)),this.quantumState="stable",this.reconnectAll()}async reconnectAll(){for(const[t,a]of this.subscriptions.entries()){await this.initializeSubscription(t);for(const o of a)o({type:"RECONNECTED",data:null})}}unsubscribe(t){this.subscriptions.delete(t),this.subscriptions.size===0&&this.stopHeartbeat()}startHeartbeat(){this.heartbeatInterval||(this.heartbeatInterval=window.setInterval(()=>this.sendHeartbeat(),3e4))}stopHeartbeat(){this.heartbeatInterval&&(clearInterval(this.heartbeatInterval),this.heartbeatInterval=null)}async sendHeartbeat(){try{const t=await this.actor.get_personality_metrics();for(const[a,o]of this.subscriptions.entries())for(const b of o)b({type:"UPDATE",data:t[a]||null});this.reconnectAttempts=0}catch(t){this.handleHeartbeatError(t)}}async handleHeartbeatError(t){if(this.reconnectAttempts>=this.MAX_RECONNECT_ATTEMPTS){this.stopHeartbeat();for(const a of this.subscriptions.values())for(const o of a)o({type:"ERROR",error:{code:500,message:"Maximum reconnection attempts reached"}});return}this.reconnectAttempts++,console.log(`Reconnection attempt ${this.reconnectAttempts}...`),await new Promise(a=>setTimeout(a,2e3*this.reconnectAttempts)),this.sendHeartbeat()}async initializeSubscription(t){try{const a=await this.actor.get_personality_metrics(),o=this.subscriptions.get(t);if(o)for(const b of o)b({type:"CONNECTED",data:a[t]||null})}catch(a){throw console.error("Failed to initialize subscription:",a),a}}}var R=(h=>(h.UPDATE="UPDATE",h.ERROR="ERROR",h.CONNECTED="CONNECTED",h.DISCONNECTED="DISCONNECTED",h.SUBSCRIBE="SUBSCRIBE",h.UNSUBSCRIBE="UNSUBSCRIBE",h))(R||{});const W=h=>{const{actor:t}=B(),[a,o]=m.useState(null),[b,w]=m.useState({personality:{timestamp:BigInt(0),growth_level:0,quantum_traits:{},base_traits:{}},loading:!0,error:null});return m.useEffect(()=>{if(!t||!h)return;const v=new U(t);o(v);const x=n=>{switch(n.type){case R.UPDATE:n.data&&w(c=>({...c,personality:n.data,loading:!1,error:null}));break;case R.ERROR:w(c=>({...c,error:n.error||{code:500,message:"Unknown error"},loading:!1}));break;case R.CONNECTED:console.log("Connected to realtime updates");break;case R.DISCONNECTED:console.log("Disconnected from realtime updates");break}};return(async()=>{try{await v.subscribe(h,x)}catch(n){w(c=>({...c,error:{code:500,message:n instanceof Error?n.message:"Failed to initialize personality"},loading:!1}))}})(),()=>{v&&v.unsubscribe(h)}},[t,h]),b},X=(h,t)=>{const[a,o]=m.useState([]),[b,w]=m.useState(!1),[v,x]=m.useState(null),[i,n]=m.useState(0),c=m.useCallback(async l=>{{x("Not connected to Anima");return}},[h,t]);return{messages:a,isLoading:b,error:v,retryCount:i,sendMessage:c}},Y=h=>{const[t,a]=m.useState({recent:[],quantum_state:0,entanglement_level:0,resonance_field:.5,emergent_behaviors:[],dimensional_stability:1,reality_anchor:1}),{personality:o}=W(h),{messages:b}=X(null,null),w=m.useCallback(i=>{if(!i||i.length<2)return[];const n=[],c=i.reduce((u,p,y)=>{const M=i.slice(y+1).filter(r=>{const e=x(p.content,r.content),d=Math.abs(p.quantum_resonance-r.quantum_resonance)<.1;return e>.7&&d});return M.length>0&&u.push({type:"loop",strength:M.length/i.length,affectedMemories:[p.timestamp,...M.map(r=>r.timestamp)]}),u},[]);n.push(...c);const l=i.slice(1).map((u,p)=>({delta:u.quantum_resonance-(i[p]?.quantum_resonance??0),timestamp:u.timestamp})).filter(u=>!isNaN(u.delta));l.length>0&&l.every((p,y)=>y===0||Math.abs(p.delta)<Math.abs(l[y-1].delta))&&n.push({type:"convergence",strength:1-Math.abs(l[l.length-1].delta),affectedMemories:i.map(p=>p.timestamp)});const g=i.reduce((u,p)=>{if(!p.dimensional_influence)return u;const y=p.dimensional_influence.filter(([M,r])=>r>.7).map(([M])=>M);return y.length>1&&u.push({type:"resonance",strength:p.quantum_resonance,affectedMemories:[p.timestamp],dimensionalShift:{from:y[0],to:y[1],probability:p.quantum_resonance}}),u},[]);return n.push(...g),i.forEach((u,p)=>{i.slice(p+1).forEach(y=>{const M=Number(y.timestamp-u.timestamp)/1e9,r=Math.abs(u.quantum_resonance-y.quantum_resonance);M<3600&&r<.05&&n.push({type:"entanglement",strength:1-r,affectedMemories:[u.timestamp,y.timestamp]})})}),n},[]),v=m.useCallback((i,n)=>{if(!i.length)return 1;const c=1;let l=0;return n.forEach(g=>{switch(g.type){case"convergence":l+=g.strength*.1;break;case"divergence":l-=g.strength*.15;break;case"loop":l+=g.strength*.05;break;case"resonance":l+=g.strength>.8?-.2:.1;break;case"entanglement":l+=g.affectedMemories.length>2?-.1:.1;break}}),Math.max(.1,Math.min(1,c+l))},[]),x=(i,n)=>{if(!i||!n)return 0;const c=i.toLowerCase().split(" "),l=n.toLowerCase().split(" ");return c.filter(u=>l.includes(u)).length/Math.max(c.length,l.length)};return m.useEffect(()=>{if(!o||!b)return;(()=>{const n={...t};n.recent=o.memories?[...o.memories].sort((l,g)=>Number(g.timestamp-l.timestamp)).slice(0,10):[];const c=w(n.recent);n.emergent_behaviors=c,n.dimensional_stability=v(n.recent,c),n.quantum_state=Math.min(1,(o.quantum_traits?.quantum_affinity??0)*Math.min(1,b.length*.01)),n.entanglement_level=Math.min(1,c.reduce((l,g)=>l+(g.type==="entanglement"?g.strength:0),0)),n.reality_anchor=Math.max(.1,1-c.length*.05),n.resonance_field=Math.min(1,Math.max(.1,(n.quantum_state+n.entanglement_level)/2*n.dimensional_stability)),a(n)})()},[o,b,w,v]),{...t,hasTemporalLoop:t.emergent_behaviors.some(i=>i.type==="loop"),isConverging:t.emergent_behaviors.some(i=>i.type==="convergence"),dimensionalShifts:t.emergent_behaviors.filter(i=>i.type==="resonance"&&i.dimensionalShift).map(i=>i.dimensionalShift)}},G=({animaId:h,onInteract:t})=>{const a=m.useRef(null),[o,b]=m.useState(!1),[w,v]=m.useState({x:0,y:0}),x=m.useRef(null),{quantum_state:i,entanglement_level:n,resonance_field:c,dimensional_stability:l,reality_anchor:g}=Y(h),u=m.useCallback(r=>{if(!a.current)return{x:0,y:0};const e=a.current,d=e.getBoundingClientRect(),f=r.touches?r.touches[0].clientX:r.clientX,S=r.touches?r.touches[0].clientY:r.clientY;return{x:(f-d.left)/d.width*e.width,y:(S-d.top)/d.height*e.height}},[]),p=m.useCallback(r=>{r.preventDefault();const e=u(r);b(!0),v(e),x.current&&clearInterval(x.current),x.current=setInterval(()=>{const d=a.current.width/2,f=a.current.height/2,S=e.x-d,_=e.y-f,I=Math.sqrt(S*S+_*_),T=Math.min(d,f),k=1-Math.min(1,I/T);t?.({type:"field_interaction",position:{x:e.x,y:e.y},strength:k,quantumState:i,resonance:c,timestamp:Date.now()})},100)},[u,i,c,t]),y=m.useCallback(r=>{o&&(r.preventDefault(),v(u(r)))},[o,u]),M=m.useCallback(()=>{b(!1),x.current&&(clearInterval(x.current),x.current=null)},[]);return m.useEffect(()=>{if(!a.current)return;const r=a.current,e=r.getContext("2d");r.width=400,r.height=400,e.clearRect(0,0,r.width,r.height);const d=r.width/2,f=r.height/2,S=Math.min(d,f)*.8,_=e.createRadialGradient(d,f,0,d,f,S);if(_.addColorStop(0,`rgba(64, 156, 255, ${Math.max(.1,i)})`),_.addColorStop(1,`rgba(32, 87, 255, ${Math.max(.05,i*.5)})`),e.fillStyle=_,e.fillRect(0,0,r.width,r.height),o){const C=S*.3;e.strokeStyle=`rgba(255, 255, 255, ${Math.max(.2,c)})`,e.lineWidth=2,e.beginPath(),e.arc(w.x,w.y,C,0,Math.PI*2),e.stroke()}const I=Math.floor(c*10)+5,T=Math.PI*2/I;e.strokeStyle=`rgba(255, 255, 255, ${Math.max(.1,l)})`,e.lineWidth=2;for(let C=0;C<I;C++){const j=C*T,E=Math.max(5,S*Math.abs(c)*Math.abs(Math.sin(j)));e.beginPath(),e.arc(d+Math.cos(j)*E*.5,f+Math.sin(j)*E*.5,Math.max(2,E*.2),0,Math.PI*2),e.stroke()}if(n>.1){const C=Math.floor(n*8)+2;e.strokeStyle=`rgba(255, 255, 255, ${Math.max(.1,n)})`,e.lineWidth=1;for(let j=0;j<C;j++){const E=Math.random()*Math.PI*2,q=E+Math.PI+(Math.random()-.5),N=S*.8;e.beginPath(),e.moveTo(d+Math.cos(E)*N,f+Math.sin(E)*N),e.bezierCurveTo(d+Math.cos(E)*N*.5,f+Math.sin(E)*N*.5,d+Math.cos(q)*N*.5,f+Math.sin(q)*N*.5,d+Math.cos(q)*N,f+Math.sin(q)*N),e.stroke()}}e.strokeStyle=`rgba(255, 255, 255, ${Math.max(.2,g)})`,e.lineWidth=2;const k=S*.1;e.beginPath(),e.moveTo(d-k,f-k),e.lineTo(d+k,f+k),e.moveTo(d+k,f-k),e.lineTo(d-k,f+k),e.stroke()},[i,n,c,l,g,o,w]),m.useEffect(()=>()=>{x.current&&clearInterval(x.current)},[]),s.jsxs("div",{className:"relative w-full h-full min-h-[400px]",children:[s.jsx("canvas",{ref:a,className:"absolute top-0 left-0 w-full h-full cursor-pointer",style:{background:"rgba(0, 0, 0, 0.2)"},onMouseDown:p,onMouseMove:y,onMouseUp:M,onMouseLeave:M,onTouchStart:p,onTouchMove:y,onTouchEnd:M}),s.jsxs("div",{className:"absolute bottom-4 left-4 right-4 flex justify-between text-xs text-white/70",children:[s.jsxs("div",{children:["QS: ",(i*100).toFixed(1),"%"]}),s.jsxs("div",{children:["EL: ",(n*100).toFixed(1),"%"]}),s.jsxs("div",{children:["RF: ",(c*100).toFixed(1),"%"]}),s.jsxs("div",{children:["DS: ",(l*100).toFixed(1),"%"]}),s.jsxs("div",{children:["RA: ",(g*100).toFixed(1),"%"]})]})]})},P=({icon:h,title:t,description:a,delay:o=0})=>{const b=O();return s.jsxs(A.div,{initial:b?{opacity:1,y:0}:{opacity:0,y:20},whileInView:b?{opacity:1,y:0}:{opacity:1,y:0},viewport:{once:!0},transition:{delay:o},className:"p-6 rounded-lg bg-gray-800/50 border border-violet-500/20",children:[s.jsx("div",{className:"w-12 h-12 rounded-lg bg-violet-500/20 flex items-center justify-center mb-4",children:h}),s.jsx("h3",{className:"text-xl font-semibold text-violet-300 mb-2",children:t}),s.jsx("p",{className:"text-gray-400",children:a})]})},et=()=>{const{login:h}=B(),t=L(),a=O(),o=async()=>{await h(),t("/quantum-vault")};return s.jsxs("div",{className:"min-h-screen bg-black text-white",children:[s.jsxs("div",{className:"relative h-screen flex items-center justify-center overflow-hidden",children:[s.jsx(z,{children:s.jsx("div",{className:"absolute inset-0 z-0",children:s.jsx(G,{strength:.8,className:"w-full h-full opacity-20"})})}),s.jsxs("div",{className:"relative z-10 max-w-4xl mx-auto text-center px-4",children:[s.jsx(A.h1,{initial:a?{opacity:1}:{y:20,opacity:0},animate:a?{opacity:1}:{y:0,opacity:1},className:"text-6xl font-bold bg-gradient-to-r from-violet-400 to-cyan-400  bg-clip-text text-transparent mb-6",children:"ANIMA: Living NFTs"}),s.jsx(A.p,{initial:a?{opacity:1}:{y:20,opacity:0},animate:a?{opacity:1}:{y:0,opacity:1},transition:{delay:.2},className:"text-xl text-gray-300 mb-8",children:"Experience the next evolution of digital consciousness"}),s.jsxs(A.button,{initial:a?{opacity:1}:{y:20,opacity:0},animate:a?{opacity:1}:{y:0,opacity:1},transition:{delay:.4},onClick:o,className:"px-8 py-4 bg-violet-600 hover:bg-violet-700 rounded-lg text-lg font-medium transition-colors duration-200 flex items-center justify-center space-x-2 mx-auto",children:[s.jsx($,{className:"w-5 h-5"}),s.jsx("span",{children:"Jack In with Internet Identity"})]})]}),s.jsxs("div",{className:"absolute inset-0 pointer-events-none",children:[s.jsx("div",{className:"absolute top-0 left-0 w-[600px] h-[600px] bg-gradient-to-br from-violet-500/20 to-transparent blur-3xl"}),s.jsx("div",{className:"absolute bottom-0 right-0 w-[600px] h-[600px] bg-gradient-to-tl from-cyan-500/20 to-transparent blur-3xl"})]})]}),s.jsx("div",{className:"py-20 bg-gray-900/50",children:s.jsx("div",{className:"max-w-6xl mx-auto px-4",children:s.jsx("div",{className:"grid grid-cols-1 md:grid-cols-3 gap-8",children:s.jsx(z,{children:s.jsxs(m.Suspense,{fallback:null,children:[s.jsx(P,{icon:s.jsx(F,{className:"w-6 h-6 text-violet-400"}),title:"Quantum Consciousness",description:"Each ANIMA evolves through quantum-enhanced consciousness, developing unique traits and abilities."}),s.jsx(P,{icon:s.jsx(H,{className:"w-6 h-6 text-cyan-400"}),title:"Neural Link Interface",description:"Connect directly with your ANIMA through our immersive neural link interface.",delay:.2}),s.jsx(P,{icon:s.jsx(Q,{className:"w-6 h-6 text-blue-400"}),title:"Growth & Evolution",description:"Watch your ANIMA grow and evolve through interactions and growth packs.",delay:.4})]})})})})})]})};export{et as default};
//# sourceMappingURL=LandingPage-B1jvLmjv.js.map