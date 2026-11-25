(function(){
var KS="calc3dlaser.settings",S={start:"3",theme:"auto",pal:"orig",bk:"7"},g=function(i){return document.getElementById(i)},
PAL={
ocean:{"3":["#0369a1","#5cb8f0"],L:["#1d4ed8","#7ea6ff"],C:["#4338ca","#a5a8ff"]},
bosque:{"3":["#15803d","#5fd28a"],L:["#a16207","#e8b84a"],C:["#0f766e","#4ad1c0"]},
atardecer:{"3":["#c2410c","#ff9a62"],L:["#be185d","#ff7fb3"],C:["#a21caf","#e49bff"]},
grafito:{"3":["#334155","#a9b8cc"],L:["#475569","#b7c3d4"],C:["#52525b","#c3c3cb"]}};
function ld(){try{var x=JSON.parse(localStorage.getItem(KS)||"null");if(x)for(var k in S)if(x[k]!==undefined)S[k]=x[k]}catch(e){}}
function sv(){try{localStorage.setItem(KS,JSON.stringify(S))}catch(e){}}
function dk(pre,a){return pre+'{--ac:'+a["3"][1]+';--on:#0b1114}'+pre+' body[data-mode="L"]{--ac:'+a.L[1]+';--on:#0b1114}'+pre+' body[data-mode="C"]{--ac:'+a.C[1]+';--on:#0b1114}'}
function css(a){
  if(!a)return"";
  return ':root{--ac:'+a["3"][0]+'}body[data-mode="L"]{--ac:'+a.L[0]+'}body[data-mode="C"]{--ac:'+a.C[0]+'}'+
    '@media (prefers-color-scheme:dark){'+dk(':root:not([data-theme="light"])',a)+'}'+dk(':root[data-theme="dark"]',a);
}
function apply(){
  var h=document.documentElement;
  if(S.theme==="light"||S.theme==="dark")h.setAttribute("data-theme",S.theme);else h.removeAttribute("data-theme");
  var st=g("palst");if(!st){st=document.createElement("style");st.id="palst";document.head.appendChild(st)}
  st.textContent=css(PAL[S.pal]);
  window.BKDAYS=+S.bk;
}
function bkSched(){
  if(!(window.NB&&NB.native)||!NB.notifBk)return;
  var N=window.BKDAYS,t=0;
  try{t=+localStorage.getItem("calc3dlaser.lastbk")||0}catch(e){}
  var has=(typeof LIST!=="undefined"&&LIST.length)||(window.ORD&&ORD.length);
  if(!N||!has){NB.notifBk(null);return}
  var due=new Date((t||Date.now())+N*864e5);due.setHours(11,0,0,0);
  var now=new Date();if(due<=now)due=new Date(now.getFullYear(),now.getMonth(),now.getDate()+1,11,0,0);
  NB.notifBk(due);
}
window.bkSched=bkSched;
ld();apply();
g("sst").value=S.start;g("stm").value=S.theme;g("spl").value=S.pal;g("sbk").value=S.bk;
g("sst").onchange=function(){S.start=this.value;sv()};
g("stm").onchange=function(){S.theme=this.value;sv();apply()};
g("spl").onchange=function(){S.pal=this.value;sv();apply()};
g("sbk").onchange=function(){S.bk=this.value;sv();apply();bkSched();bkCheck()};
if(S.start!=="3"&&typeof setMode==="function")setMode(S.start);
window.addEventListener("nb-resume",bkSched);
window.addEventListener("nb-open-bk",function(){window.__openBk=false;view(1)});
bkSched();bkCheck();
if(window.__openBk){window.__openBk=false;view(1)}
})();
