(function(){
var PK="calc3dlaser.products",g=function(i){return document.getElementById(i)};
window.PRD=[];
function ld(){try{PRD=JSON.parse(localStorage.getItem(PK)||"[]")||[]}catch(e){PRD=[]}}
function sv(){try{localStorage.setItem(PK,JSON.stringify(PRD))}catch(e){g("prm").textContent="No se pudo guardar en este dispositivo."}}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,5)}
function say(t){g("prm").textContent=t}
window.prdRefresh=function(){
  var s=g("prs"),L=PRD.filter(function(p){return p.mode===mode});s.textContent="";
  if(!L.length){var o=document.createElement("option");o.value="";o.textContent="Sin productos guardados";s.appendChild(o)}
  else L.forEach(function(p){var o=document.createElement("option");o.value=p.id;o.textContent=p.name;s.appendChild(o)});
  g("prl").disabled=g("prd").disabled=!L.length;
};
g("prg").onclick=function(){
  var b=snap(),nm=$("name").value.trim();
  if(!nm){say("Poné un nombre al trabajo para guardarlo como producto.");return}
  var p={id:null,name:nm,mode:b.mode,v:b.v,rows:b.rows,mrows:b.mrows,ts:Date.now(),upd:Date.now()};
  delete p.v.cli;delete p.v.ctel;
  var ex=PRD.filter(function(x){return x.mode===p.mode&&x.name.toLowerCase()===nm.toLowerCase()})[0];
  if(ex){p.id=ex.id;PRD[PRD.indexOf(ex)]=p;say("Producto actualizado: "+nm+".")}
  else{p.id=uid();PRD.unshift(p);say("Producto guardado: "+nm+".")}
  sv();prdRefresh();g("prs").value=p.id;
};
g("prl").onclick=function(){
  var p=PRD.filter(function(x){return x.id===g("prs").value})[0];if(!p)return;
  var b=JSON.parse(JSON.stringify(p));b.v.cli=$("cli").value;b.v.ctel=$("ctel").value;b.id=null;
  openB(b);say("Producto cargado: "+p.name+".");
};
g("prd").onclick=function(){
  var p=PRD.filter(function(x){return x.id===g("prs").value})[0];if(!p)return;
  if(confirm("¿Borrar el producto “"+p.name+"”?")){PRD=PRD.filter(function(x){return x!==p});sv();prdRefresh();say("Producto borrado.")}
};
window.prdMerge=function(a){
  if(!Array.isArray(a))return;
  var m={};PRD.forEach(function(p){m[p.id]=p});
  a.forEach(function(p){if(p&&p.id&&p.v&&(!m[p.id]||(p.upd||0)>=(m[p.id].upd||0)))m[p.id]=p});
  PRD=Object.keys(m).map(function(k){return m[k]});sv();prdRefresh();
};
ld();
var _sm=setMode;
setMode=function(m){_sm(m);prdRefresh()};
prdRefresh();
})();
