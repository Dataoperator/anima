const __vite__mapDeps=(i,m=__vite__mapDeps,d=(m.f||(m.f=["assets/App-DrnumHld.js","assets/vendor-BFu1EOKW.js","assets/ErrorBoundary-Db6IuzRp.js","assets/framer-3L9ljYYv.js","assets/index-Da77hz6-.js","assets/LoadingFallback-B3L2Micw.js","assets/ic-init-CU-2w285.js"])))=>i.map(i=>d[i]);
import{a as kr,r as z,R as Dr}from"./vendor-BFu1EOKW.js";import{j as C}from"./framer-3L9ljYYv.js";(function(){const s=document.createElement("link").relList;if(s&&s.supports&&s.supports("modulepreload"))return;for(const l of document.querySelectorAll('link[rel="modulepreload"]'))w(l);new MutationObserver(l=>{for(const a of l)if(a.type==="childList")for(const f of a.addedNodes)f.tagName==="LINK"&&f.rel==="modulepreload"&&w(f)}).observe(document,{childList:!0,subtree:!0});function p(l){const a={};return l.integrity&&(a.integrity=l.integrity),l.referrerPolicy&&(a.referrerPolicy=l.referrerPolicy),l.crossOrigin==="use-credentials"?a.credentials="include":l.crossOrigin==="anonymous"?a.credentials="omit":a.credentials="same-origin",a}function w(l){if(l.ep)return;l.ep=!0;const a=p(l);fetch(l.href,a)}})();var ar={},G={};G.byteLength=$r;G.toByteArray=Vr;G.fromByteArray=qr;var L=[],R=[],Mr=typeof Uint8Array<"u"?Uint8Array:Array,X="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/";for(var M=0,Or=X.length;M<Or;++M)L[M]=X[M],R[X.charCodeAt(M)]=M;R[45]=62;R[95]=63;function pr(h){var s=h.length;if(s%4>0)throw new Error("Invalid string. Length must be a multiple of 4");var p=h.indexOf("=");p===-1&&(p=s);var w=p===s?0:4-p%4;return[p,w]}function $r(h){var s=pr(h),p=s[0],w=s[1];return(p+w)*3/4-w}function jr(h,s,p){return(s+p)*3/4-p}function Vr(h){var s,p=pr(h),w=p[0],l=p[1],a=new Mr(jr(h,w,l)),f=0,o=l>0?w-4:w,d;for(d=0;d<o;d+=4)s=R[h.charCodeAt(d)]<<18|R[h.charCodeAt(d+1)]<<12|R[h.charCodeAt(d+2)]<<6|R[h.charCodeAt(d+3)],a[f++]=s>>16&255,a[f++]=s>>8&255,a[f++]=s&255;return l===2&&(s=R[h.charCodeAt(d)]<<2|R[h.charCodeAt(d+1)]>>4,a[f++]=s&255),l===1&&(s=R[h.charCodeAt(d)]<<10|R[h.charCodeAt(d+1)]<<4|R[h.charCodeAt(d+2)]>>2,a[f++]=s>>8&255,a[f++]=s&255),a}function zr(h){return L[h>>18&63]+L[h>>12&63]+L[h>>6&63]+L[h&63]}function Gr(h,s,p){for(var w,l=[],a=s;a<p;a+=3)w=(h[a]<<16&16711680)+(h[a+1]<<8&65280)+(h[a+2]&255),l.push(zr(w));return l.join("")}function qr(h){for(var s,p=h.length,w=p%3,l=[],a=16383,f=0,o=p-w;f<o;f+=a)l.push(Gr(h,f,f+a>o?o:f+a));return w===1?(s=h[p-1],l.push(L[s>>2]+L[s<<4&63]+"==")):w===2&&(s=(h[p-2]<<8)+h[p-1],l.push(L[s>>10]+L[s>>4&63]+L[s<<2&63]+"=")),l.join("")}var K={};/*! ieee754. BSD-3-Clause License. Feross Aboukhadijeh <https://feross.org/opensource> */K.read=function(h,s,p,w,l){var a,f,o=l*8-w-1,d=(1<<o)-1,U=d>>1,I=-7,m=p?l-1:0,b=p?-1:1,A=h[s+m];for(m+=b,a=A&(1<<-I)-1,A>>=-I,I+=o;I>0;a=a*256+h[s+m],m+=b,I-=8);for(f=a&(1<<-I)-1,a>>=-I,I+=w;I>0;f=f*256+h[s+m],m+=b,I-=8);if(a===0)a=1-U;else{if(a===d)return f?NaN:(A?-1:1)*(1/0);f=f+Math.pow(2,w),a=a-U}return(A?-1:1)*f*Math.pow(2,a-w)};K.write=function(h,s,p,w,l,a){var f,o,d,U=a*8-l-1,I=(1<<U)-1,m=I>>1,b=l===23?Math.pow(2,-24)-Math.pow(2,-77):0,A=w?0:a-1,O=w?1:-1,$=s<0||s===0&&1/s<0?1:0;for(s=Math.abs(s),isNaN(s)||s===1/0?(o=isNaN(s)?1:0,f=I):(f=Math.floor(Math.log(s)/Math.LN2),s*(d=Math.pow(2,-f))<1&&(f--,d*=2),f+m>=1?s+=b/d:s+=b*Math.pow(2,1-m),s*d>=2&&(f++,d/=2),f+m>=I?(o=0,f=I):f+m>=1?(o=(s*d-1)*Math.pow(2,l),f=f+m):(o=s*Math.pow(2,m-1)*Math.pow(2,l),f=0));l>=8;h[p+A]=o&255,A+=O,o/=256,l-=8);for(f=f<<l|o,U+=l;U>0;h[p+A]=f&255,A+=O,f/=256,U-=8);h[p+A-O]|=$*128};/*!
 * The buffer module from node.js, for the browser.
 *
 * @author   Feross Aboukhadijeh <https://feross.org>
 * @license  MIT
 */(function(h){const s=G,p=K,w=typeof Symbol=="function"&&typeof Symbol.for=="function"?Symbol.for("nodejs.util.inspect.custom"):null;h.Buffer=o,h.SlowBuffer=dr,h.INSPECT_MAX_BYTES=50;const l=2147483647;h.kMaxLength=l,o.TYPED_ARRAY_SUPPORT=a(),!o.TYPED_ARRAY_SUPPORT&&typeof console<"u"&&typeof console.error=="function"&&console.error("This browser lacks typed array (Uint8Array) support which is required by `buffer` v5.x. Use `buffer` v4.x if you require old browser support.");function a(){try{const e=new Uint8Array(1),r={foo:function(){return 42}};return Object.setPrototypeOf(r,Uint8Array.prototype),Object.setPrototypeOf(e,r),e.foo()===42}catch{return!1}}Object.defineProperty(o.prototype,"parent",{enumerable:!0,get:function(){if(o.isBuffer(this))return this.buffer}}),Object.defineProperty(o.prototype,"offset",{enumerable:!0,get:function(){if(o.isBuffer(this))return this.byteOffset}});function f(e){if(e>l)throw new RangeError('The value "'+e+'" is invalid for option "size"');const r=new Uint8Array(e);return Object.setPrototypeOf(r,o.prototype),r}function o(e,r,t){if(typeof e=="number"){if(typeof r=="string")throw new TypeError('The "string" argument must be of type string. Received type number');return m(e)}return d(e,r,t)}o.poolSize=8192;function d(e,r,t){if(typeof e=="string")return b(e,r);if(ArrayBuffer.isView(e))return O(e);if(e==null)throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e);if(T(e,ArrayBuffer)||e&&T(e.buffer,ArrayBuffer)||typeof SharedArrayBuffer<"u"&&(T(e,SharedArrayBuffer)||e&&T(e.buffer,SharedArrayBuffer)))return $(e,r,t);if(typeof e=="number")throw new TypeError('The "value" argument must not be of type number. Received type number');const n=e.valueOf&&e.valueOf();if(n!=null&&n!==e)return o.from(n,r,t);const i=yr(e);if(i)return i;if(typeof Symbol<"u"&&Symbol.toPrimitive!=null&&typeof e[Symbol.toPrimitive]=="function")return o.from(e[Symbol.toPrimitive]("string"),r,t);throw new TypeError("The first argument must be one of type string, Buffer, ArrayBuffer, Array, or Array-like Object. Received type "+typeof e)}o.from=function(e,r,t){return d(e,r,t)},Object.setPrototypeOf(o.prototype,Uint8Array.prototype),Object.setPrototypeOf(o,Uint8Array);function U(e){if(typeof e!="number")throw new TypeError('"size" argument must be of type number');if(e<0)throw new RangeError('The value "'+e+'" is invalid for option "size"')}function I(e,r,t){return U(e),e<=0?f(e):r!==void 0?typeof t=="string"?f(e).fill(r,t):f(e).fill(r):f(e)}o.alloc=function(e,r,t){return I(e,r,t)};function m(e){return U(e),f(e<0?0:q(e)|0)}o.allocUnsafe=function(e){return m(e)},o.allocUnsafeSlow=function(e){return m(e)};function b(e,r){if((typeof r!="string"||r==="")&&(r="utf8"),!o.isEncoding(r))throw new TypeError("Unknown encoding: "+r);const t=Z(e,r)|0;let n=f(t);const i=n.write(e,r);return i!==t&&(n=n.slice(0,i)),n}function A(e){const r=e.length<0?0:q(e.length)|0,t=f(r);for(let n=0;n<r;n+=1)t[n]=e[n]&255;return t}function O(e){if(T(e,Uint8Array)){const r=new Uint8Array(e);return $(r.buffer,r.byteOffset,r.byteLength)}return A(e)}function $(e,r,t){if(r<0||e.byteLength<r)throw new RangeError('"offset" is outside of buffer bounds');if(e.byteLength<r+(t||0))throw new RangeError('"length" is outside of buffer bounds');let n;return r===void 0&&t===void 0?n=new Uint8Array(e):t===void 0?n=new Uint8Array(e,r):n=new Uint8Array(e,r,t),Object.setPrototypeOf(n,o.prototype),n}function yr(e){if(o.isBuffer(e)){const r=q(e.length)|0,t=f(r);return t.length===0||e.copy(t,0,0,r),t}if(e.length!==void 0)return typeof e.length!="number"||H(e.length)?f(0):A(e);if(e.type==="Buffer"&&Array.isArray(e.data))return A(e.data)}function q(e){if(e>=l)throw new RangeError("Attempt to allocate Buffer larger than maximum size: 0x"+l.toString(16)+" bytes");return e|0}function dr(e){return+e!=e&&(e=0),o.alloc(+e)}o.isBuffer=function(r){return r!=null&&r._isBuffer===!0&&r!==o.prototype},o.compare=function(r,t){if(T(r,Uint8Array)&&(r=o.from(r,r.offset,r.byteLength)),T(t,Uint8Array)&&(t=o.from(t,t.offset,t.byteLength)),!o.isBuffer(r)||!o.isBuffer(t))throw new TypeError('The "buf1", "buf2" arguments must be one of type Buffer or Uint8Array');if(r===t)return 0;let n=r.length,i=t.length;for(let u=0,c=Math.min(n,i);u<c;++u)if(r[u]!==t[u]){n=r[u],i=t[u];break}return n<i?-1:i<n?1:0},o.isEncoding=function(r){switch(String(r).toLowerCase()){case"hex":case"utf8":case"utf-8":case"ascii":case"latin1":case"binary":case"base64":case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return!0;default:return!1}},o.concat=function(r,t){if(!Array.isArray(r))throw new TypeError('"list" argument must be an Array of Buffers');if(r.length===0)return o.alloc(0);let n;if(t===void 0)for(t=0,n=0;n<r.length;++n)t+=r[n].length;const i=o.allocUnsafe(t);let u=0;for(n=0;n<r.length;++n){let c=r[n];if(T(c,Uint8Array))u+c.length>i.length?(o.isBuffer(c)||(c=o.from(c)),c.copy(i,u)):Uint8Array.prototype.set.call(i,c,u);else if(o.isBuffer(c))c.copy(i,u);else throw new TypeError('"list" argument must be an Array of Buffers');u+=c.length}return i};function Z(e,r){if(o.isBuffer(e))return e.length;if(ArrayBuffer.isView(e)||T(e,ArrayBuffer))return e.byteLength;if(typeof e!="string")throw new TypeError('The "string" argument must be one of type string, Buffer, or ArrayBuffer. Received type '+typeof e);const t=e.length,n=arguments.length>2&&arguments[2]===!0;if(!n&&t===0)return 0;let i=!1;for(;;)switch(r){case"ascii":case"latin1":case"binary":return t;case"utf8":case"utf-8":return Y(e).length;case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return t*2;case"hex":return t>>>1;case"base64":return sr(e).length;default:if(i)return n?-1:Y(e).length;r=(""+r).toLowerCase(),i=!0}}o.byteLength=Z;function wr(e,r,t){let n=!1;if((r===void 0||r<0)&&(r=0),r>this.length||((t===void 0||t>this.length)&&(t=this.length),t<=0)||(t>>>=0,r>>>=0,t<=r))return"";for(e||(e="utf8");;)switch(e){case"hex":return _r(this,r,t);case"utf8":case"utf-8":return rr(this,r,t);case"ascii":return Ar(this,r,t);case"latin1":case"binary":return Ur(this,r,t);case"base64":return Ir(this,r,t);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return Rr(this,r,t);default:if(n)throw new TypeError("Unknown encoding: "+e);e=(e+"").toLowerCase(),n=!0}}o.prototype._isBuffer=!0;function P(e,r,t){const n=e[r];e[r]=e[t],e[t]=n}o.prototype.swap16=function(){const r=this.length;if(r%2!==0)throw new RangeError("Buffer size must be a multiple of 16-bits");for(let t=0;t<r;t+=2)P(this,t,t+1);return this},o.prototype.swap32=function(){const r=this.length;if(r%4!==0)throw new RangeError("Buffer size must be a multiple of 32-bits");for(let t=0;t<r;t+=4)P(this,t,t+3),P(this,t+1,t+2);return this},o.prototype.swap64=function(){const r=this.length;if(r%8!==0)throw new RangeError("Buffer size must be a multiple of 64-bits");for(let t=0;t<r;t+=8)P(this,t,t+7),P(this,t+1,t+6),P(this,t+2,t+5),P(this,t+3,t+4);return this},o.prototype.toString=function(){const r=this.length;return r===0?"":arguments.length===0?rr(this,0,r):wr.apply(this,arguments)},o.prototype.toLocaleString=o.prototype.toString,o.prototype.equals=function(r){if(!o.isBuffer(r))throw new TypeError("Argument must be a Buffer");return this===r?!0:o.compare(this,r)===0},o.prototype.inspect=function(){let r="";const t=h.INSPECT_MAX_BYTES;return r=this.toString("hex",0,t).replace(/(.{2})/g,"$1 ").trim(),this.length>t&&(r+=" ... "),"<Buffer "+r+">"},w&&(o.prototype[w]=o.prototype.inspect),o.prototype.compare=function(r,t,n,i,u){if(T(r,Uint8Array)&&(r=o.from(r,r.offset,r.byteLength)),!o.isBuffer(r))throw new TypeError('The "target" argument must be one of type Buffer or Uint8Array. Received type '+typeof r);if(t===void 0&&(t=0),n===void 0&&(n=r?r.length:0),i===void 0&&(i=0),u===void 0&&(u=this.length),t<0||n>r.length||i<0||u>this.length)throw new RangeError("out of range index");if(i>=u&&t>=n)return 0;if(i>=u)return-1;if(t>=n)return 1;if(t>>>=0,n>>>=0,i>>>=0,u>>>=0,this===r)return 0;let c=u-i,y=n-t;const B=Math.min(c,y),E=this.slice(i,u),g=r.slice(t,n);for(let x=0;x<B;++x)if(E[x]!==g[x]){c=E[x],y=g[x];break}return c<y?-1:y<c?1:0};function Q(e,r,t,n,i){if(e.length===0)return-1;if(typeof t=="string"?(n=t,t=0):t>2147483647?t=2147483647:t<-2147483648&&(t=-2147483648),t=+t,H(t)&&(t=i?0:e.length-1),t<0&&(t=e.length+t),t>=e.length){if(i)return-1;t=e.length-1}else if(t<0)if(i)t=0;else return-1;if(typeof r=="string"&&(r=o.from(r,n)),o.isBuffer(r))return r.length===0?-1:v(e,r,t,n,i);if(typeof r=="number")return r=r&255,typeof Uint8Array.prototype.indexOf=="function"?i?Uint8Array.prototype.indexOf.call(e,r,t):Uint8Array.prototype.lastIndexOf.call(e,r,t):v(e,[r],t,n,i);throw new TypeError("val must be string, number or Buffer")}function v(e,r,t,n,i){let u=1,c=e.length,y=r.length;if(n!==void 0&&(n=String(n).toLowerCase(),n==="ucs2"||n==="ucs-2"||n==="utf16le"||n==="utf-16le")){if(e.length<2||r.length<2)return-1;u=2,c/=2,y/=2,t/=2}function B(g,x){return u===1?g[x]:g.readUInt16BE(x*u)}let E;if(i){let g=-1;for(E=t;E<c;E++)if(B(e,E)===B(r,g===-1?0:E-g)){if(g===-1&&(g=E),E-g+1===y)return g*u}else g!==-1&&(E-=E-g),g=-1}else for(t+y>c&&(t=c-y),E=t;E>=0;E--){let g=!0;for(let x=0;x<y;x++)if(B(e,E+x)!==B(r,x)){g=!1;break}if(g)return E}return-1}o.prototype.includes=function(r,t,n){return this.indexOf(r,t,n)!==-1},o.prototype.indexOf=function(r,t,n){return Q(this,r,t,n,!0)},o.prototype.lastIndexOf=function(r,t,n){return Q(this,r,t,n,!1)};function xr(e,r,t,n){t=Number(t)||0;const i=e.length-t;n?(n=Number(n),n>i&&(n=i)):n=i;const u=r.length;n>u/2&&(n=u/2);let c;for(c=0;c<n;++c){const y=parseInt(r.substr(c*2,2),16);if(H(y))return c;e[t+c]=y}return c}function mr(e,r,t,n){return V(Y(r,e.length-t),e,t,n)}function Er(e,r,t,n){return V(Lr(r),e,t,n)}function Br(e,r,t,n){return V(sr(r),e,t,n)}function gr(e,r,t,n){return V(Sr(r,e.length-t),e,t,n)}o.prototype.write=function(r,t,n,i){if(t===void 0)i="utf8",n=this.length,t=0;else if(n===void 0&&typeof t=="string")i=t,n=this.length,t=0;else if(isFinite(t))t=t>>>0,isFinite(n)?(n=n>>>0,i===void 0&&(i="utf8")):(i=n,n=void 0);else throw new Error("Buffer.write(string, encoding, offset[, length]) is no longer supported");const u=this.length-t;if((n===void 0||n>u)&&(n=u),r.length>0&&(n<0||t<0)||t>this.length)throw new RangeError("Attempt to write outside buffer bounds");i||(i="utf8");let c=!1;for(;;)switch(i){case"hex":return xr(this,r,t,n);case"utf8":case"utf-8":return mr(this,r,t,n);case"ascii":case"latin1":case"binary":return Er(this,r,t,n);case"base64":return Br(this,r,t,n);case"ucs2":case"ucs-2":case"utf16le":case"utf-16le":return gr(this,r,t,n);default:if(c)throw new TypeError("Unknown encoding: "+i);i=(""+i).toLowerCase(),c=!0}},o.prototype.toJSON=function(){return{type:"Buffer",data:Array.prototype.slice.call(this._arr||this,0)}};function Ir(e,r,t){return r===0&&t===e.length?s.fromByteArray(e):s.fromByteArray(e.slice(r,t))}function rr(e,r,t){t=Math.min(e.length,t);const n=[];let i=r;for(;i<t;){const u=e[i];let c=null,y=u>239?4:u>223?3:u>191?2:1;if(i+y<=t){let B,E,g,x;switch(y){case 1:u<128&&(c=u);break;case 2:B=e[i+1],(B&192)===128&&(x=(u&31)<<6|B&63,x>127&&(c=x));break;case 3:B=e[i+1],E=e[i+2],(B&192)===128&&(E&192)===128&&(x=(u&15)<<12|(B&63)<<6|E&63,x>2047&&(x<55296||x>57343)&&(c=x));break;case 4:B=e[i+1],E=e[i+2],g=e[i+3],(B&192)===128&&(E&192)===128&&(g&192)===128&&(x=(u&15)<<18|(B&63)<<12|(E&63)<<6|g&63,x>65535&&x<1114112&&(c=x))}}c===null?(c=65533,y=1):c>65535&&(c-=65536,n.push(c>>>10&1023|55296),c=56320|c&1023),n.push(c),i+=y}return Fr(n)}const tr=4096;function Fr(e){const r=e.length;if(r<=tr)return String.fromCharCode.apply(String,e);let t="",n=0;for(;n<r;)t+=String.fromCharCode.apply(String,e.slice(n,n+=tr));return t}function Ar(e,r,t){let n="";t=Math.min(e.length,t);for(let i=r;i<t;++i)n+=String.fromCharCode(e[i]&127);return n}function Ur(e,r,t){let n="";t=Math.min(e.length,t);for(let i=r;i<t;++i)n+=String.fromCharCode(e[i]);return n}function _r(e,r,t){const n=e.length;(!r||r<0)&&(r=0),(!t||t<0||t>n)&&(t=n);let i="";for(let u=r;u<t;++u)i+=Nr[e[u]];return i}function Rr(e,r,t){const n=e.slice(r,t);let i="";for(let u=0;u<n.length-1;u+=2)i+=String.fromCharCode(n[u]+n[u+1]*256);return i}o.prototype.slice=function(r,t){const n=this.length;r=~~r,t=t===void 0?n:~~t,r<0?(r+=n,r<0&&(r=0)):r>n&&(r=n),t<0?(t+=n,t<0&&(t=0)):t>n&&(t=n),t<r&&(t=r);const i=this.subarray(r,t);return Object.setPrototypeOf(i,o.prototype),i};function F(e,r,t){if(e%1!==0||e<0)throw new RangeError("offset is not uint");if(e+r>t)throw new RangeError("Trying to access beyond buffer length")}o.prototype.readUintLE=o.prototype.readUIntLE=function(r,t,n){r=r>>>0,t=t>>>0,n||F(r,t,this.length);let i=this[r],u=1,c=0;for(;++c<t&&(u*=256);)i+=this[r+c]*u;return i},o.prototype.readUintBE=o.prototype.readUIntBE=function(r,t,n){r=r>>>0,t=t>>>0,n||F(r,t,this.length);let i=this[r+--t],u=1;for(;t>0&&(u*=256);)i+=this[r+--t]*u;return i},o.prototype.readUint8=o.prototype.readUInt8=function(r,t){return r=r>>>0,t||F(r,1,this.length),this[r]},o.prototype.readUint16LE=o.prototype.readUInt16LE=function(r,t){return r=r>>>0,t||F(r,2,this.length),this[r]|this[r+1]<<8},o.prototype.readUint16BE=o.prototype.readUInt16BE=function(r,t){return r=r>>>0,t||F(r,2,this.length),this[r]<<8|this[r+1]},o.prototype.readUint32LE=o.prototype.readUInt32LE=function(r,t){return r=r>>>0,t||F(r,4,this.length),(this[r]|this[r+1]<<8|this[r+2]<<16)+this[r+3]*16777216},o.prototype.readUint32BE=o.prototype.readUInt32BE=function(r,t){return r=r>>>0,t||F(r,4,this.length),this[r]*16777216+(this[r+1]<<16|this[r+2]<<8|this[r+3])},o.prototype.readBigUInt64LE=N(function(r){r=r>>>0,D(r,"offset");const t=this[r],n=this[r+7];(t===void 0||n===void 0)&&j(r,this.length-8);const i=t+this[++r]*2**8+this[++r]*2**16+this[++r]*2**24,u=this[++r]+this[++r]*2**8+this[++r]*2**16+n*2**24;return BigInt(i)+(BigInt(u)<<BigInt(32))}),o.prototype.readBigUInt64BE=N(function(r){r=r>>>0,D(r,"offset");const t=this[r],n=this[r+7];(t===void 0||n===void 0)&&j(r,this.length-8);const i=t*2**24+this[++r]*2**16+this[++r]*2**8+this[++r],u=this[++r]*2**24+this[++r]*2**16+this[++r]*2**8+n;return(BigInt(i)<<BigInt(32))+BigInt(u)}),o.prototype.readIntLE=function(r,t,n){r=r>>>0,t=t>>>0,n||F(r,t,this.length);let i=this[r],u=1,c=0;for(;++c<t&&(u*=256);)i+=this[r+c]*u;return u*=128,i>=u&&(i-=Math.pow(2,8*t)),i},o.prototype.readIntBE=function(r,t,n){r=r>>>0,t=t>>>0,n||F(r,t,this.length);let i=t,u=1,c=this[r+--i];for(;i>0&&(u*=256);)c+=this[r+--i]*u;return u*=128,c>=u&&(c-=Math.pow(2,8*t)),c},o.prototype.readInt8=function(r,t){return r=r>>>0,t||F(r,1,this.length),this[r]&128?(255-this[r]+1)*-1:this[r]},o.prototype.readInt16LE=function(r,t){r=r>>>0,t||F(r,2,this.length);const n=this[r]|this[r+1]<<8;return n&32768?n|4294901760:n},o.prototype.readInt16BE=function(r,t){r=r>>>0,t||F(r,2,this.length);const n=this[r+1]|this[r]<<8;return n&32768?n|4294901760:n},o.prototype.readInt32LE=function(r,t){return r=r>>>0,t||F(r,4,this.length),this[r]|this[r+1]<<8|this[r+2]<<16|this[r+3]<<24},o.prototype.readInt32BE=function(r,t){return r=r>>>0,t||F(r,4,this.length),this[r]<<24|this[r+1]<<16|this[r+2]<<8|this[r+3]},o.prototype.readBigInt64LE=N(function(r){r=r>>>0,D(r,"offset");const t=this[r],n=this[r+7];(t===void 0||n===void 0)&&j(r,this.length-8);const i=this[r+4]+this[r+5]*2**8+this[r+6]*2**16+(n<<24);return(BigInt(i)<<BigInt(32))+BigInt(t+this[++r]*2**8+this[++r]*2**16+this[++r]*2**24)}),o.prototype.readBigInt64BE=N(function(r){r=r>>>0,D(r,"offset");const t=this[r],n=this[r+7];(t===void 0||n===void 0)&&j(r,this.length-8);const i=(t<<24)+this[++r]*2**16+this[++r]*2**8+this[++r];return(BigInt(i)<<BigInt(32))+BigInt(this[++r]*2**24+this[++r]*2**16+this[++r]*2**8+n)}),o.prototype.readFloatLE=function(r,t){return r=r>>>0,t||F(r,4,this.length),p.read(this,r,!0,23,4)},o.prototype.readFloatBE=function(r,t){return r=r>>>0,t||F(r,4,this.length),p.read(this,r,!1,23,4)},o.prototype.readDoubleLE=function(r,t){return r=r>>>0,t||F(r,8,this.length),p.read(this,r,!0,52,8)},o.prototype.readDoubleBE=function(r,t){return r=r>>>0,t||F(r,8,this.length),p.read(this,r,!1,52,8)};function _(e,r,t,n,i,u){if(!o.isBuffer(e))throw new TypeError('"buffer" argument must be a Buffer instance');if(r>i||r<u)throw new RangeError('"value" argument is out of bounds');if(t+n>e.length)throw new RangeError("Index out of range")}o.prototype.writeUintLE=o.prototype.writeUIntLE=function(r,t,n,i){if(r=+r,t=t>>>0,n=n>>>0,!i){const y=Math.pow(2,8*n)-1;_(this,r,t,n,y,0)}let u=1,c=0;for(this[t]=r&255;++c<n&&(u*=256);)this[t+c]=r/u&255;return t+n},o.prototype.writeUintBE=o.prototype.writeUIntBE=function(r,t,n,i){if(r=+r,t=t>>>0,n=n>>>0,!i){const y=Math.pow(2,8*n)-1;_(this,r,t,n,y,0)}let u=n-1,c=1;for(this[t+u]=r&255;--u>=0&&(c*=256);)this[t+u]=r/c&255;return t+n},o.prototype.writeUint8=o.prototype.writeUInt8=function(r,t,n){return r=+r,t=t>>>0,n||_(this,r,t,1,255,0),this[t]=r&255,t+1},o.prototype.writeUint16LE=o.prototype.writeUInt16LE=function(r,t,n){return r=+r,t=t>>>0,n||_(this,r,t,2,65535,0),this[t]=r&255,this[t+1]=r>>>8,t+2},o.prototype.writeUint16BE=o.prototype.writeUInt16BE=function(r,t,n){return r=+r,t=t>>>0,n||_(this,r,t,2,65535,0),this[t]=r>>>8,this[t+1]=r&255,t+2},o.prototype.writeUint32LE=o.prototype.writeUInt32LE=function(r,t,n){return r=+r,t=t>>>0,n||_(this,r,t,4,4294967295,0),this[t+3]=r>>>24,this[t+2]=r>>>16,this[t+1]=r>>>8,this[t]=r&255,t+4},o.prototype.writeUint32BE=o.prototype.writeUInt32BE=function(r,t,n){return r=+r,t=t>>>0,n||_(this,r,t,4,4294967295,0),this[t]=r>>>24,this[t+1]=r>>>16,this[t+2]=r>>>8,this[t+3]=r&255,t+4};function er(e,r,t,n,i){hr(r,n,i,e,t,7);let u=Number(r&BigInt(4294967295));e[t++]=u,u=u>>8,e[t++]=u,u=u>>8,e[t++]=u,u=u>>8,e[t++]=u;let c=Number(r>>BigInt(32)&BigInt(4294967295));return e[t++]=c,c=c>>8,e[t++]=c,c=c>>8,e[t++]=c,c=c>>8,e[t++]=c,t}function nr(e,r,t,n,i){hr(r,n,i,e,t,7);let u=Number(r&BigInt(4294967295));e[t+7]=u,u=u>>8,e[t+6]=u,u=u>>8,e[t+5]=u,u=u>>8,e[t+4]=u;let c=Number(r>>BigInt(32)&BigInt(4294967295));return e[t+3]=c,c=c>>8,e[t+2]=c,c=c>>8,e[t+1]=c,c=c>>8,e[t]=c,t+8}o.prototype.writeBigUInt64LE=N(function(r,t=0){return er(this,r,t,BigInt(0),BigInt("0xffffffffffffffff"))}),o.prototype.writeBigUInt64BE=N(function(r,t=0){return nr(this,r,t,BigInt(0),BigInt("0xffffffffffffffff"))}),o.prototype.writeIntLE=function(r,t,n,i){if(r=+r,t=t>>>0,!i){const B=Math.pow(2,8*n-1);_(this,r,t,n,B-1,-B)}let u=0,c=1,y=0;for(this[t]=r&255;++u<n&&(c*=256);)r<0&&y===0&&this[t+u-1]!==0&&(y=1),this[t+u]=(r/c>>0)-y&255;return t+n},o.prototype.writeIntBE=function(r,t,n,i){if(r=+r,t=t>>>0,!i){const B=Math.pow(2,8*n-1);_(this,r,t,n,B-1,-B)}let u=n-1,c=1,y=0;for(this[t+u]=r&255;--u>=0&&(c*=256);)r<0&&y===0&&this[t+u+1]!==0&&(y=1),this[t+u]=(r/c>>0)-y&255;return t+n},o.prototype.writeInt8=function(r,t,n){return r=+r,t=t>>>0,n||_(this,r,t,1,127,-128),r<0&&(r=255+r+1),this[t]=r&255,t+1},o.prototype.writeInt16LE=function(r,t,n){return r=+r,t=t>>>0,n||_(this,r,t,2,32767,-32768),this[t]=r&255,this[t+1]=r>>>8,t+2},o.prototype.writeInt16BE=function(r,t,n){return r=+r,t=t>>>0,n||_(this,r,t,2,32767,-32768),this[t]=r>>>8,this[t+1]=r&255,t+2},o.prototype.writeInt32LE=function(r,t,n){return r=+r,t=t>>>0,n||_(this,r,t,4,2147483647,-2147483648),this[t]=r&255,this[t+1]=r>>>8,this[t+2]=r>>>16,this[t+3]=r>>>24,t+4},o.prototype.writeInt32BE=function(r,t,n){return r=+r,t=t>>>0,n||_(this,r,t,4,2147483647,-2147483648),r<0&&(r=4294967295+r+1),this[t]=r>>>24,this[t+1]=r>>>16,this[t+2]=r>>>8,this[t+3]=r&255,t+4},o.prototype.writeBigInt64LE=N(function(r,t=0){return er(this,r,t,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))}),o.prototype.writeBigInt64BE=N(function(r,t=0){return nr(this,r,t,-BigInt("0x8000000000000000"),BigInt("0x7fffffffffffffff"))});function ir(e,r,t,n,i,u){if(t+n>e.length)throw new RangeError("Index out of range");if(t<0)throw new RangeError("Index out of range")}function or(e,r,t,n,i){return r=+r,t=t>>>0,i||ir(e,r,t,4),p.write(e,r,t,n,23,4),t+4}o.prototype.writeFloatLE=function(r,t,n){return or(this,r,t,!0,n)},o.prototype.writeFloatBE=function(r,t,n){return or(this,r,t,!1,n)};function ur(e,r,t,n,i){return r=+r,t=t>>>0,i||ir(e,r,t,8),p.write(e,r,t,n,52,8),t+8}o.prototype.writeDoubleLE=function(r,t,n){return ur(this,r,t,!0,n)},o.prototype.writeDoubleBE=function(r,t,n){return ur(this,r,t,!1,n)},o.prototype.copy=function(r,t,n,i){if(!o.isBuffer(r))throw new TypeError("argument should be a Buffer");if(n||(n=0),!i&&i!==0&&(i=this.length),t>=r.length&&(t=r.length),t||(t=0),i>0&&i<n&&(i=n),i===n||r.length===0||this.length===0)return 0;if(t<0)throw new RangeError("targetStart out of bounds");if(n<0||n>=this.length)throw new RangeError("Index out of range");if(i<0)throw new RangeError("sourceEnd out of bounds");i>this.length&&(i=this.length),r.length-t<i-n&&(i=r.length-t+n);const u=i-n;return this===r&&typeof Uint8Array.prototype.copyWithin=="function"?this.copyWithin(t,n,i):Uint8Array.prototype.set.call(r,this.subarray(n,i),t),u},o.prototype.fill=function(r,t,n,i){if(typeof r=="string"){if(typeof t=="string"?(i=t,t=0,n=this.length):typeof n=="string"&&(i=n,n=this.length),i!==void 0&&typeof i!="string")throw new TypeError("encoding must be a string");if(typeof i=="string"&&!o.isEncoding(i))throw new TypeError("Unknown encoding: "+i);if(r.length===1){const c=r.charCodeAt(0);(i==="utf8"&&c<128||i==="latin1")&&(r=c)}}else typeof r=="number"?r=r&255:typeof r=="boolean"&&(r=Number(r));if(t<0||this.length<t||this.length<n)throw new RangeError("Out of range index");if(n<=t)return this;t=t>>>0,n=n===void 0?this.length:n>>>0,r||(r=0);let u;if(typeof r=="number")for(u=t;u<n;++u)this[u]=r;else{const c=o.isBuffer(r)?r:o.from(r,i),y=c.length;if(y===0)throw new TypeError('The value "'+r+'" is invalid for argument "value"');for(u=0;u<n-t;++u)this[u+t]=c[u%y]}return this};const k={};function W(e,r,t){k[e]=class extends t{constructor(){super(),Object.defineProperty(this,"message",{value:r.apply(this,arguments),writable:!0,configurable:!0}),this.name=`${this.name} [${e}]`,this.stack,delete this.name}get code(){return e}set code(i){Object.defineProperty(this,"code",{configurable:!0,enumerable:!0,value:i,writable:!0})}toString(){return`${this.name} [${e}]: ${this.message}`}}}W("ERR_BUFFER_OUT_OF_BOUNDS",function(e){return e?`${e} is outside of buffer bounds`:"Attempt to access memory outside buffer bounds"},RangeError),W("ERR_INVALID_ARG_TYPE",function(e,r){return`The "${e}" argument must be of type number. Received type ${typeof r}`},TypeError),W("ERR_OUT_OF_RANGE",function(e,r,t){let n=`The value of "${e}" is out of range.`,i=t;return Number.isInteger(t)&&Math.abs(t)>2**32?i=cr(String(t)):typeof t=="bigint"&&(i=String(t),(t>BigInt(2)**BigInt(32)||t<-(BigInt(2)**BigInt(32)))&&(i=cr(i)),i+="n"),n+=` It must be ${r}. Received ${i}`,n},RangeError);function cr(e){let r="",t=e.length;const n=e[0]==="-"?1:0;for(;t>=n+4;t-=3)r=`_${e.slice(t-3,t)}${r}`;return`${e.slice(0,t)}${r}`}function br(e,r,t){D(r,"offset"),(e[r]===void 0||e[r+t]===void 0)&&j(r,e.length-(t+1))}function hr(e,r,t,n,i,u){if(e>t||e<r){const c=typeof r=="bigint"?"n":"";let y;throw r===0||r===BigInt(0)?y=`>= 0${c} and < 2${c} ** ${(u+1)*8}${c}`:y=`>= -(2${c} ** ${(u+1)*8-1}${c}) and < 2 ** ${(u+1)*8-1}${c}`,new k.ERR_OUT_OF_RANGE("value",y,e)}br(n,i,u)}function D(e,r){if(typeof e!="number")throw new k.ERR_INVALID_ARG_TYPE(r,"number",e)}function j(e,r,t){throw Math.floor(e)!==e?(D(e,t),new k.ERR_OUT_OF_RANGE("offset","an integer",e)):r<0?new k.ERR_BUFFER_OUT_OF_BOUNDS:new k.ERR_OUT_OF_RANGE("offset",`>= 0 and <= ${r}`,e)}const Tr=/[^+/0-9A-Za-z-_]/g;function Cr(e){if(e=e.split("=")[0],e=e.trim().replace(Tr,""),e.length<2)return"";for(;e.length%4!==0;)e=e+"=";return e}function Y(e,r){r=r||1/0;let t;const n=e.length;let i=null;const u=[];for(let c=0;c<n;++c){if(t=e.charCodeAt(c),t>55295&&t<57344){if(!i){if(t>56319){(r-=3)>-1&&u.push(239,191,189);continue}else if(c+1===n){(r-=3)>-1&&u.push(239,191,189);continue}i=t;continue}if(t<56320){(r-=3)>-1&&u.push(239,191,189),i=t;continue}t=(i-55296<<10|t-56320)+65536}else i&&(r-=3)>-1&&u.push(239,191,189);if(i=null,t<128){if((r-=1)<0)break;u.push(t)}else if(t<2048){if((r-=2)<0)break;u.push(t>>6|192,t&63|128)}else if(t<65536){if((r-=3)<0)break;u.push(t>>12|224,t>>6&63|128,t&63|128)}else if(t<1114112){if((r-=4)<0)break;u.push(t>>18|240,t>>12&63|128,t>>6&63|128,t&63|128)}else throw new Error("Invalid code point")}return u}function Lr(e){const r=[];for(let t=0;t<e.length;++t)r.push(e.charCodeAt(t)&255);return r}function Sr(e,r){let t,n,i;const u=[];for(let c=0;c<e.length&&!((r-=2)<0);++c)t=e.charCodeAt(c),n=t>>8,i=t%256,u.push(i),u.push(n);return u}function sr(e){return s.toByteArray(Cr(e))}function V(e,r,t,n){let i;for(i=0;i<n&&!(i+t>=r.length||i>=e.length);++i)r[i+t]=e[i];return i}function T(e,r){return e instanceof r||e!=null&&e.constructor!=null&&e.constructor.name!=null&&e.constructor.name===r.name}function H(e){return e!==e}const Nr=function(){const e="0123456789abcdef",r=new Array(256);for(let t=0;t<16;++t){const n=t*16;for(let i=0;i<16;++i)r[n+i]=e[t]+e[i]}return r}();function N(e){return typeof BigInt>"u"?Pr:e}function Pr(){throw new Error("BigInt not supported")}})(ar);window.Buffer=ar.Buffer;const Wr="modulepreload",Yr=function(h){return"/"+h},fr={},S=function(s,p,w){let l=Promise.resolve();if(p&&p.length>0){document.getElementsByTagName("link");const f=document.querySelector("meta[property=csp-nonce]"),o=f?.nonce||f?.getAttribute("nonce");l=Promise.allSettled(p.map(d=>{if(d=Yr(d),d in fr)return;fr[d]=!0;const U=d.endsWith(".css"),I=U?'[rel="stylesheet"]':"";if(document.querySelector(`link[href="${d}"]${I}`))return;const m=document.createElement("link");if(m.rel=U?"stylesheet":Wr,U||(m.as="script"),m.crossOrigin="",m.href=d,o&&m.setAttribute("nonce",o),document.head.appendChild(m),U)return new Promise((b,A)=>{m.addEventListener("load",b),m.addEventListener("error",()=>A(new Error(`Unable to preload CSS for ${d}`)))})}))}function a(f){const o=new Event("vite:preloadError",{cancelable:!0});if(o.payload=f,window.dispatchEvent(o),!o.defaultPrevented)throw f}return l.then(f=>{for(const o of f||[])o.status==="rejected"&&a(o.reason);return s().catch(a)})};var J={},lr=kr;J.createRoot=lr.createRoot,J.hydrateRoot=lr.hydrateRoot;const Hr=()=>{window.onerror=(h,s,p,w,l)=>(console.error("Global error:",{msg:h,url:s,lineNo:p,columnNo:w,error:l}),!1),window.onunhandledrejection=h=>{console.error("Unhandled promise rejection:",h.reason)}},Xr=z.lazy(()=>S(()=>import("./App-DrnumHld.js").then(h=>h.A),__vite__mapDeps([0,1,2,3,4,5]))),Jr=z.lazy(()=>S(()=>import("./ErrorBoundary-Db6IuzRp.js"),__vite__mapDeps([2,1,3])).then(h=>({default:h.ErrorBoundary}))),Kr=z.lazy(()=>S(()=>import("./LoadingFallback-B3L2Micw.js"),__vite__mapDeps([5,3,1])).then(h=>({default:h.LoadingFallback}))),Zr=({error:h})=>C.jsx("div",{className:"min-h-screen bg-black text-white flex items-center justify-center",children:C.jsxs("div",{className:"max-w-md text-center p-8",children:[C.jsx("h1",{className:"text-xl font-bold mb-4",children:"Neural Interface Error"}),C.jsx("p",{className:"text-red-400 mb-6",children:h.message}),C.jsx("button",{onClick:()=>window.location.reload(),className:"bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded",children:"Reinitialize"})]})}),Qr=async()=>{try{console.log("Initializing Internet Computer connection..."),await S(()=>import("./ic-init-CU-2w285.js"),__vite__mapDeps([6,4,1,3])),console.log("IC initialization complete")}catch(h){throw console.error("IC initialization failed:",h),new Error("Failed to establish quantum connection.")}},vr=async()=>{try{Hr(),await Qr();const h=document.getElementById("root");if(!h)throw new Error("Neural interface anchor not found");J.createRoot(h).render(C.jsx(Dr.StrictMode,{children:C.jsx(Jr,{FallbackComponent:Zr,children:C.jsx(z.Suspense,{fallback:C.jsx(Kr,{}),children:C.jsx(Xr,{})})})}))}catch(h){console.error("App initialization failed:",h),document.body.innerHTML=`
      <div class="min-h-screen bg-black text-white flex items-center justify-center">
        <div class="max-w-md text-center p-8">
          <h1 class="text-xl font-bold mb-4">Critical System Error</h1>
          <p class="text-red-400 mb-6">${h instanceof Error?h.message:"Unknown error"}</p>
          <button 
            onclick="window.location.reload()" 
            class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
            Reset System
          </button>
        </div>
      </div>
    `}};Promise.all([S(()=>import("./App-DrnumHld.js").then(h=>h.A),__vite__mapDeps([0,1,2,3,4,5])),S(()=>import("./ErrorBoundary-Db6IuzRp.js"),__vite__mapDeps([2,1,3])),S(()=>import("./LoadingFallback-B3L2Micw.js"),__vite__mapDeps([5,3,1])),S(()=>import("./framer-3L9ljYYv.js").then(h=>h.i),__vite__mapDeps([3,1])),S(()=>import("./vendor-BFu1EOKW.js").then(h=>h.i),[])]).then(()=>{vr().catch(console.error)}).catch(h=>{console.error("Failed to load critical dependencies:",h),document.body.innerHTML=`
    <div class="min-h-screen bg-black text-white flex items-center justify-center">
      <div class="max-w-md text-center p-8">
        <h1 class="text-xl font-bold mb-4">Critical Loading Error</h1>
        <p class="text-red-400 mb-6">Failed to load system components</p>
        <button 
          onclick="window.location.reload()" 
          class="bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded">
          Retry
        </button>
      </div>
    </div>
  `});export{S as _,G as a,ar as b,K as i};
//# sourceMappingURL=main-DlAblTGF.js.map