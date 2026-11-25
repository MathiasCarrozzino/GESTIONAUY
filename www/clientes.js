(function(){
var CK3="calc3dlaser.clients",g=function(i){return document.getElementById(i)};
window.CLI={};
function ld(){try{CLI=JSON.parse(localStorage.getItem(CK3)||"{}")||{}}catch(e){CLI={}}}
function sv(){try{localStorage.setItem(CK3,JSON.stringify(CLI))}catch(e){}}
function key(n){return String(n||"").trim().toLowerCase().normalize("NFD").replace(/[\u0300-\u036f]/g,"")}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
function cs(){var c=g("cur");return(c&&c.value)||"$"}
function mn(v,c){return(c||cs())+" "+(+v||0).toLocaleString("es-UY",{maximumFractionDigits:2})}
function lst(){return typeof LIST!=="undefined"?LIST:[]}
function ords(){return window.ORD||[]}
function all(){
  var m={};
  function get(n){var k=key(n);if(!k)return null;return m[k]||(m[k]={n:String(n).trim(),t:"",b:[],o:[]})}
  Object.keys(CLI).forEach(function(k){var r=CLI[k],c=get(r.n);if(c&&r.t)c.t=r.t});
  lst().forEach(function(b){var c=get(b.cli);if(c){c.b.push(b);if(!c.t&&b.tel)c.t=b.tel}});
  ords().forEach(function(o){var c=get(o.cli);if(c){c.o.push(o);if(!c.t&&o.tel)c.t=o.tel}});
  return m;
}
function dl(){
  var m=all(),box=g("dcl");box.textContent="";
  Object.keys(m).sort().forEach(function(k){var o=document.createElement("option");o.value=m[k].n;box.appendChild(o)});
}
window.cliSet=function(n,t){
  var k=key(n);if(!k)return;
  var r=CLI[k]||(CLI[k]={n:String(n).trim(),t:""});
  r.n=String(n).trim();if(t&&String(t).trim())r.t=String(t).trim();
  sv();dl();
};
window.cliTel=function(n){var r=CLI[key(n)];return r&&r.t||""};
window.cliMerge=function(o){
  if(!o||typeof o!=="object")return;
  Object.keys(o).forEach(function(k){if(o[k]&&o[k].n&&(!CLI[k]||(o[k].t&&!CLI[k].t)))CLI[k]=o[k]});
  sv();dl();
};
window.renderCli=function(){
  var q=key(g("cq").value),m=all(),box=g("cl8");box.textContent="";
  var ks=Object.keys(m).filter(function(k){return!q||k.indexOf(q)>-1}).sort();
  if(!ks.length){box.appendChild(el("p","note",q?"No hay clientes con ese nombre.":"Todavía no hay clientes. Se crean solos al cargar un nombre en un presupuesto o un pedido."));return}
  ks.forEach(function(k){
    var x=m[k],c=el("div","it"),tp=el("div","top"),l=el("div");
    var apr=x.b.filter(function(b){return b.ok}).reduce(function(s,b){return s+((b.R&&b.R.tot)||0)},0),
    sd=x.o.reduce(function(s,o){return s+Math.max(0,(+o.monto||0)-(+o.sena||0))},0);
    l.appendChild(el("h3","",x.n));l.appendChild(el("small","",x.t||"Sin teléfono"));
    tp.appendChild(l);c.appendChild(tp);
    c.appendChild(el("p","note",x.b.length+" presupuesto"+(x.b.length===1?"":"s")+" · "+x.o.length+" pedido"+(x.o.length===1?"":"s")+(apr?" · Aprobado: "+mn(apr):"")+(sd?" · Saldo por cobrar: "+mn(sd):"")));
    var d=el("div");d.hidden=true;
    var a=el("div","acts"),bh=el("button","btn","Historial");
    if(x.t){var bw=el("button","btn p","WhatsApp");bw.onclick=function(){waOpen(x.t,"Hola "+x.n+", ")};a.appendChild(bw)}
    bh.onclick=function(){d.hidden=!d.hidden;bh.textContent=d.hidden?"Historial":"Ocultar"};
    a.appendChild(bh);c.appendChild(a);
    var row=el("div");row.style.cssText="display:grid;grid-template-columns:1fr auto;gap:8px;margin:8px 0";
    var inp=el("input");inp.style.cssText="min-width:0;font:inherit;color:var(--ink);background:var(--bg);border:1px solid var(--ln);border-radius:10px;padding:10px";inp.type="tel";inp.setAttribute("inputmode","tel");inp.placeholder="Teléfono";inp.value=x.t||"";inp.setAttribute("aria-label","Teléfono de "+x.n);
    var bs=el("button","btn","Guardar teléfono");bs.onclick=function(){cliSet(x.n,inp.value);renderCli()};
    row.appendChild(inp);row.appendChild(bs);d.appendChild(row);
    x.b.slice().sort(function(a,b){return(b.ts||0)-(a.ts||0)}).slice(0,10).forEach(function(b){
      d.appendChild(el("p","note",new Date(b.ts).toLocaleDateString("es-UY")+" · "+(b.name||"Presupuesto")+" · "+mn(b.R&&b.R.tot,b.cur)+(b.ok?" · Aprobado":"")));
    });
    x.o.slice().sort(function(a,b){return(b.ts||0)-(a.ts||0)}).slice(0,10).forEach(function(o){
      d.appendChild(el("p","note","Pedido: "+(o.det||o.tipo)+" · "+o.est+(+o.monto?" · "+mn(o.monto,o.cur):"")));
    });
    c.appendChild(d);box.appendChild(c);
  });
};
g("cq").oninput=function(){renderCli()};
ld();
var _sb=saveB;
saveB=function(a){_sb(a);cliSet($("cli").value,$("ctel").value)};
var ci=$("cli"),ct=$("ctel");
ci.setAttribute("list","dcl");ct.setAttribute("type","tel");ct.setAttribute("inputmode","tel");
ci.addEventListener("input",function(){var t=cliTel(this.value);if(t&&!ct.value){ct.value=t;calc()}});
dl();
})();
