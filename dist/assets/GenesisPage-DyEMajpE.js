import{r as a,u as p}from"./vendor-DAG3_51J.js";import{u as h,P as v}from"./main-BLtP7dC-.js";import{u as N}from"./anima-context-D_6u8Pbw.js";import{d as o,C as j}from"./card-DKqYdLTm.js";import{j as e}from"./framer-CgXRyNIB.js";const u=a.forwardRef(({className:s,variant:t="default",size:r="default",...i},l)=>e.jsx("button",{className:o("inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-purple-400 focus-visible:ring-offset-2 disabled:opacity-50 disabled:pointer-events-none ring-offset-background",{"bg-primary text-primary-foreground hover:bg-primary/90":t==="default","bg-destructive text-destructive-foreground hover:bg-destructive/90":t==="destructive","border border-input hover:bg-accent hover:text-accent-foreground":t==="outline","hover:bg-accent hover:text-accent-foreground":t==="ghost","underline-offset-4 hover:underline text-primary":t==="link","h-10 py-2 px-4":r==="default","h-9 px-3":r==="sm","h-11 px-8":r==="lg","h-10 w-10":r==="icon"},s),ref:l,...i}));u.displayName="Button";const f=a.forwardRef(({className:s,type:t,...r},i)=>e.jsx("input",{type:t,className:o("flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",s),ref:i,...r}));f.displayName="Input";const b=a.forwardRef(({className:s,variant:t="default",...r},i)=>e.jsx("div",{ref:i,role:"alert",className:o("relative w-full rounded-lg border p-4",{"bg-background text-foreground":t==="default","bg-destructive/15 text-destructive border-destructive/50":t==="destructive"},s),...r}));b.displayName="Alert";const y=a.forwardRef(({className:s,...t},r)=>e.jsx("h5",{ref:r,className:o("mb-1 font-medium leading-none tracking-tight",s),...t}));y.displayName="AlertTitle";const A=a.forwardRef(({className:s,...t},r)=>e.jsx("div",{ref:r,className:o("text-sm [&_p]:leading-relaxed",s),...t}));A.displayName="AlertDescription";var w={};const k=BigInt(1e8);function S(){const s=p();h();const{createActor:t}=N(),[r,i]=a.useState(""),[l,d]=a.useState(!1),[m,c]=a.useState(null),g=async()=>{if(!r.trim()){c("Please enter a name for your Anima");return}d(!0),c(null);try{const n=t();await(await n.getLedgerActor()).approve({amount:k,spender:v.fromText(w.ANIMA_CANISTER_ID)});const x=await n.create_anima(r);s(`/anima/${x.toString()}`)}catch(n){console.error("Genesis failed:",n),c(n.message||"Failed to create Anima")}finally{d(!1)}};return e.jsx("div",{className:"min-h-screen bg-gradient-to-b from-indigo-900 via-purple-900 to-black p-8",children:e.jsx(j,{className:"max-w-md mx-auto bg-black/50 backdrop-blur border-amber-500/20",children:e.jsxs("div",{className:"p-6 space-y-6",children:[e.jsx("h1",{className:"text-3xl font-serif text-amber-400 text-center",children:"Anima Genesis"}),e.jsxs("div",{className:"space-y-4",children:[e.jsxs("div",{children:[e.jsx("label",{className:"block text-sm font-medium text-amber-300 mb-1",children:"Name Your Anima"}),e.jsx(f,{type:"text",value:r,onChange:n=>i(n.target.value),className:"bg-black/30 border-amber-500/30 text-amber-100",placeholder:"Enter a mystical name..."})]}),e.jsxs("div",{className:"p-4 rounded bg-amber-900/20 border border-amber-500/20",children:[e.jsx("h3",{className:"font-medium text-amber-400 mb-2",children:"Genesis Fee"}),e.jsx("p",{className:"text-amber-200",children:"1 ICP"}),e.jsx("p",{className:"text-sm text-amber-300/60 mt-1",children:"This fee is used to sustain the eternal flame of your Anima"})]}),m&&e.jsx(b,{variant:"destructive",children:m}),e.jsx(u,{onClick:g,disabled:l,className:"w-full bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-600 hover:to-orange-700",children:l?e.jsxs("span",{className:"flex items-center",children:[e.jsx("span",{className:"animate-spin mr-2",children:"⚡"}),"Initiating Genesis..."]}):"Begin Genesis Ritual"})]})]})})})}export{S as GenesisPage};
//# sourceMappingURL=GenesisPage-DyEMajpE.js.map