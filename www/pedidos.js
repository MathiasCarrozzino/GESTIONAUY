(function(){
var OK="calc3dlaser.orders",TK="calc3dlaser.ordtimes",flt="p",eid=null,TM={on:true,t1:"10:00",t2:"19:00"},g=function(i){return document.getElementById(i)},
TP={"3":"Impresión 3D","L":"Láser diodo","C":"Costura"},ST=["Por hacer","En producción","Listo","Entregado"],
CH=[["p","Pendientes"],["Por hacer","Por hacer"],["En producción","En producción"],["Listo","Listo"],["Entregado","Entregados"],["a","Todos"]];
window.ORD=[];
function mig(){ORD.forEach(function(o){if(!o.est)o.est=o.done?"Entregado":"Por hacer";o.done=o.est==="Entregado"})}
function ld(){try{ORD=JSON.parse(localStorage.getItem(OK)||"[]")||[]}catch(e){ORD=[]}try{var t=JSON.parse(localStorage.getItem(TK)||"null");if(t&&t.t1)TM=t}catch(e){}mig()}
function sv(){try{localStorage.setItem(OK,JSON.stringify(ORD))}catch(e){g("om").textContent="No se pudo guardar en este dispositivo."}}
function svt(){try{localStorage.setItem(TK,JSON.stringify(TM))}catch(e){}}
function pad(n){return("0"+n).slice(-2)}
function iso(d){return d.getFullYear()+"-"+pad(d.getMonth()+1)+"-"+pad(d.getDate())}
function fm(s){if(!s)return"Sin fecha";var p=s.split("-");return p[2]+"/"+p[1]+"/"+p[0]}
function cs(){var c=g("cur");return(c&&c.value)||"$"}
function fn(n){return(+n||0).toLocaleString("es-UY",{maximumFractionDigits:2})}
function mny(o){return(o.cur||cs())+" "+fn(o.monto)}
function sal(o){return Math.max(0,(+o.monto||0)-(+o.sena||0))}
function el(t,c,x){var e=document.createElement(t);if(c)e.className=c;if(x!==undefined)e.textContent=x;return e}
function nd(o){return o.est!=="Entregado"}
function uid(){return Date.now().toString(36)+Math.random().toString(36).slice(2,5)}
function plan(){
  var out=[],pe=ORD.filter(nd),now=new Date();
  if(!pe.length)return out;
  var so=pe.slice().sort(function(a,b){return(a.fec||"9999").localeCompare(b.fec||"9999")}),f=so[0],nm=(f.cli||f.det||"pedido").slice(0,28),
  lis=pe.filter(function(o){return o.est==="Listo"}).length;
  for(var d=0;d<30;d++){
    var day=new Date(now.getFullYear(),now.getMonth(),now.getDate()+d),ds=iso(day);
    var due=pe.filter(function(o){return o.fec===ds}).length,late=pe.filter(function(o){return o.fec&&o.fec<ds}).length,n=pe.length;
    var b="Tenés "+n+(n>1?" pedidos pendientes":" pedido pendiente");
    var x=[];if(due)x.push(due+" para hoy");if(late)x.push(late+(late>1?" atrasados":" atrasado"));if(lis)x.push(lis+(lis>1?" listos para entregar":" listo para entregar"));
    if(x.length)b+=": "+x.join(", ");
    b+=". Próximo: "+nm+(f.fec?" ("+fm(f.fec)+")":"")+".";
    [TM.t1,TM.t2].forEach(function(t,k){
      var h=String(t||"").split(":");if(h.length<2)return;
      var at=new Date(day.getFullYear(),day.getMonth(),day.getDate(),+h[0],+h[1]);
      if(at<=now)return;
      out.push({id:d*2+k+1,at:at,title:"Pedidos pendientes",body:b});
    });
  }
  return out;
}
window.ordPlan=plan;
function rs(ask){
  if(!window.NB||!NB.native)return;
  (async function(){
    if(ask&&TM.on&&ORD.some(nd))await NB.notifPerm();
    await NB.notifSet(TM.on?plan():[]);
  })();
}
function setEst(o,e){
  o.est=e;o.done=e==="Entregado";o.upd=Date.now();
  if(e==="Entregado"&&sal(o)>0&&confirm("Quedó un saldo de "+mny({monto:sal(o),cur:o.cur})+". ¿Lo marcás como cobrado?"))o.sena=o.monto;
  sv();rd();rs(false);
}
function waT(o){
  var n=o.cli?"Hola "+o.cli+", ":"Hola, ",d=o.det?" ("+o.det+")":"";
  if(o.est==="Listo")return n+"tu pedido"+d+" está listo para retirar."+(sal(o)>0?" Saldo a abonar: "+mny({monto:sal(o),cur:o.cur})+".":"");
  if(o.est==="En producción")return n+"tu pedido"+d+" ya está en producción.";
  return n+"te escribo por tu pedido"+d+".";
}
function rd(){
  var t=iso(new Date()),pe=ORD.filter(nd),
  due=pe.filter(function(o){return o.fec===t}).length,late=pe.filter(function(o){return o.fec&&o.fec<t}).length,
  cob=ORD.reduce(function(s,o){return s+sal(o)},0);
  g("bpd").textContent="Pedidos ("+pe.length+")";
  var k=g("ok");k.textContent="";
  [["Pendientes",pe.length],["Para hoy",due],["Atrasados",late],["A cobrar",cs()+" "+fn(cob)]].forEach(function(a){var d=el("div");d.appendChild(el("small","",a[0]));d.appendChild(el("b","",a[1]));k.appendChild(d)});
  var cc=g("ofc");cc.textContent="";
  CH.forEach(function(c){
    var n=c[0]==="a"?ORD.length:c[0]==="p"?pe.length:ORD.filter(function(o){return o.est===c[0]}).length,b=el("button","",c[1]+" ("+n+")");
    b.setAttribute("aria-pressed",String(flt===c[0]));b.onclick=function(){flt=c[0];rd()};cc.appendChild(b);
  });
  var L=ORD.filter(function(o){return flt==="a"||(flt==="p"?nd(o):o.est===flt)}).sort(function(a,b){return(a.fec||"9999").localeCompare(b.fec||"9999")});
  var box=g("ol");box.textContent="";
  if(!L.length){box.appendChild(el("p","note","No hay pedidos para mostrar."));return}
  L.forEach(function(o){
    var c=el("div","it"+(o.est==="Entregado"?" ok":"")),tp=el("div","top"),l=el("div");
    l.appendChild(el("span","stg"+(o.est==="Entregado"?" e":""),o.est));l.appendChild(document.createElement("br"));
    l.appendChild(el("h3","",o.cli||"Sin cliente"));l.appendChild(el("small","",o.tipo+(+o.monto?" · "+mny(o):"")));
    if(+o.monto){l.appendChild(document.createElement("br"));l.appendChild(el("small","","Seña "+fn(o.sena||0)+" · Saldo "+fn(sal(o))))}
    var r=el("span","t",fm(o.fec));
    if(nd(o)&&o.fec){if(o.fec<t){r.style.color="#dc2626";r.textContent+=" · atrasado"}else if(o.fec===t)r.textContent+=" · hoy"}
    tp.appendChild(l);tp.appendChild(r);c.appendChild(tp);
    if(o.det)c.appendChild(el("p","note",o.det));
    var a=el("div","acts"),i=ST.indexOf(o.est),b1=el("button","btn p",i<3?"Pasar a "+ST[i+1]:"Reabrir"),b2=el("button","btn","Editar"),b3=el("button","btn","Borrar");
    b1.onclick=function(){setEst(o,i<3?ST[i+1]:"Listo")};
    b2.onclick=function(){eid=o.id;g("oc").value=o.cli;g("otl").value=o.tel||"";g("od").value=o.det;g("ot").value=o.tipo;g("oet").value=o.est;g("of").value=o.fec;g("omt").value=o.monto||"";g("osn").value=o.sena||"";g("osv").textContent="Guardar cambios";g("oh").textContent="Editar pedido";opn(true);window.scrollTo(0,0)};
    b3.onclick=function(){if(confirm("¿Borrar este pedido?")){ORD=ORD.filter(function(x){return x!==o});sv();rd();rs(false)}};
    a.appendChild(b1);
    var ph=o.tel||(window.cliTel&&cliTel(o.cli))||"";
    if(ph){var bw=el("button","btn","WhatsApp");bw.onclick=function(){waOpen(ph,waT(o))};a.appendChild(bw)}
    if(sal(o)>0){var b4=el("button","btn","Cobrar saldo");b4.onclick=function(){o.sena=o.monto;o.upd=Date.now();sv();rd()};a.appendChild(b4)}
    a.appendChild(b2);a.appendChild(b3);c.appendChild(a);box.appendChild(c);
  });
}
function opn(show){g("opn").hidden=!show;g("onw").textContent=show?"Cerrar":"Nuevo pedido";if(show){fill();g("omc").textContent=g("osc").textContent=cs()}}
function rst(){eid=null;g("oc").value="";g("otl").value="";g("od").value="";g("ot").selectedIndex=0;g("oet").selectedIndex=0;g("of").value="";g("omt").value="";g("osn").value="";g("om").textContent="";g("osv").textContent="Guardar pedido";g("oh").textContent="Nuevo pedido";opn(false)}
function fill(){g("oav").checked=!!TM.on;g("ot1").value=TM.t1;g("ot2").value=TM.t2;g("oan").textContent=""}
window.renderOrd=function(){rd()};
g("onw").onclick=function(){if(g("opn").hidden)opn(true);else rst()};
g("oc").addEventListener("input",function(){var t=window.cliTel&&cliTel(this.value);if(t&&!g("otl").value)g("otl").value=t});
g("osv").onclick=function(){
  var c=g("oc").value.trim(),d=g("od").value.trim();
  if(!c&&!d){g("om").textContent="Cargá al menos el cliente o el detalle.";return}
  var o={cli:c,tel:g("otl").value.trim(),det:d,tipo:g("ot").value,est:g("oet").value,fec:g("of").value,monto:Math.max(0,parseFloat(g("omt").value)||0),sena:Math.max(0,parseFloat(g("osn").value)||0)};
  o.done=o.est==="Entregado";
  if(eid){ORD.forEach(function(x){if(x.id===eid){x.cli=o.cli;x.tel=o.tel;x.det=o.det;x.tipo=o.tipo;x.est=o.est;x.done=o.done;x.fec=o.fec;x.monto=o.monto;x.sena=o.sena;x.upd=Date.now()}})}
  else{o.id=uid();o.cur=cs();o.ts=o.upd=Date.now();ORD.unshift(o)}
  if(window.cliSet)cliSet(o.cli,o.tel);
  sv();rst();rd();rs(true);
};
g("oav").onchange=async function(){
  var c=this,w=c.checked;
  if(w&&window.NB&&NB.native&&!(await NB.notifPerm())){c.checked=false;g("oan").textContent="Permití las notificaciones de la app en los ajustes del teléfono.";return}
  TM.on=w;svt();rs(false);
};
g("ot1").onchange=function(){if(this.value){TM.t1=this.value;svt();rs(false)}};
g("ot2").onchange=function(){if(this.value){TM.t2=this.value;svt();rs(false)}};
g("bpd").onclick=function(){view(6)};g("back6").onclick=function(){view(1)};
g("bhp").onclick=function(){view(7)};g("back7").onclick=function(){view(1)};
g("bcl").onclick=function(){view(8)};g("back8").onclick=function(){view(6)};
window.ordFromBudget=function(b){
  if(ORD.some(function(o){return o.bid===b.id}))return false;
  ORD.unshift({id:uid(),bid:b.id,cli:b.cli||"",tel:b.tel||"",det:(b.name||"Presupuesto")+(b.qty>1?" (x"+b.qty+")":"")+(b.mat?" · "+b.mat:""),tipo:TP[b.mode]||"Impresión 3D",fec:"",monto:Math.round(((b.R&&b.R.tot)||0)*100)/100,cur:b.cur||"",sena:0,est:"Por hacer",done:false,ts:Date.now(),upd:Date.now()});
  if(window.cliSet)cliSet(b.cli,b.tel);
  sv();rd();rs(true);return true;
};
window.ordMerge=function(a){
  if(!Array.isArray(a))return;
  var m={};ORD.forEach(function(o){m[o.id]=o});
  a.forEach(function(o){if(o&&o.id&&(!m[o.id]||(o.upd||0)>=(m[o.id].upd||0)))m[o.id]=o});
  ORD=Object.keys(m).map(function(k){return m[k]});mig();sv();rd();rs(false);
};
function go(){window.__openOrders=false;view(6)}
window.addEventListener("nb-open-orders",go);
window.addEventListener("nb-resume",function(){rs(false)});
ld();rd();rs(false);
if(window.__openOrders)go();
})();
