var FabrikModalRepeat=new Class({initialize:function(a,c,b){this.names=c;this.field=b;this.content=false;this.setup=false;this.elid=a;this.win={};this.el={};this.field={};if(!this.ready()){this.timer=this.testReady.periodical(500,this)}else{this.setUp()}},ready:function(){return typeOf(document.id(this.elid))==="null"?false:true},testReady:function(){if(!this.ready()){return}if(this.timer){clearInterval(this.timer)}this.setUp()},setUp:function(){console.log(document.id(this.elid));this.button=document.id(this.elid+"_button");document.addEvent("click:relay(*[data-modal="+this.elid+"])",function(b,a){var f=a.getNext("input").id;this.field[f]=a.getNext("input");if(!this.el[f]){var d=a.getParent("li");if(d.getElement("table")){this.el[f]=d.getElement("table");a.store("table",this.el[f])}else{this.el[f]=a.retrieve("table")}}console.log("click",f);this.openWindow(f)}.bind(this))},openWindow:function(b){if(!this.win[b]){this.win[b]=new Element("div",{"data-modal-content":b,styles:{padding:"5px","background-color":"#fff",display:"none","z-index":9999}}).inject(document.body);this.win[b].adopt(this.el[b]);var c=new Element("button.btn.button").set("text","close");c.addEvent("click",function(d){d.stop();this.store();this.close()}.bind(this));var a=new Element("div.controls",{styles:{"text-align":"right"}}).adopt(c);this.win[b].adopt(a);this.win[b].position();this.mask=new Mask(document.body,{style:{"background-color":"#000",opacity:0.4,"z-index":9998}});this.content=this.el[b];this.build(b);this.watchButtons(this.win[b],b)}this.win[b].show();this.win[b].position();this.resizeWin(true);this.win[b].position();this.mask.show()},resizeWin:function(a){Object.each(this.win,function(e,d){console.log(this.el,d);var c=this.el[d].getDimensions(true);var b=e.getDimensions(true);var f=a?b.y:c.y+30;e.setStyles({width:c.x+"px",height:(f)+"px"})}.bind(this))},close:function(){Object.each(this.win,function(b,a){b.hide()});this.mask.hide()},_getRadioValues:function(b){var a=[];this.getTrs(b).each(function(d){var c=(sel=d.getElement("input[type=radio]:checked"))?sel.get("value"):c="";a.push(c)});return a},_setRadioValues:function(a,b){this.getTrs(b).each(function(d,c){if(r=d.getElement("input[type=radio][value="+a[c]+"]")){r.checked="checked"}})},watchButtons:function(b,a){b.addEvent("click:relay(a.add)",function(d){if(tr=this.findTr(d)){var c=this._getRadioValues(a);if(tr.getChildren("th").length!==0){this.tmpl.clone().inject(tr,"after")}else{tr.clone().inject(tr,"after")}this.stripe(a);this._setRadioValues(c,a);this.resizeWin(b)}b.position();d.stop()}.bind(this));b.addEvent("click:relay(a.remove)",function(d){var c=this.content.getElements("tbody tr");if(c.length<=1){}if(tr=this.findTr(d)){tr.dispose()}this.resizeWin(b);b.position();d.stop()}.bind(this))},getTrs:function(a){return this.win[a].getElement("tbody").getElements("tr")},stripe:function(b){trs=this.getTrs(b);for(var a=0;a<trs.length;a++){trs[a].removeClass("row1").removeClass("row0");trs[a].addClass("row"+a%2);var c=trs[a].getElements("input[type=radio]");c.each(function(d){d.name=d.name.replace(/\[([0-9])\]/,"["+a+"]")})}},build:function(j){var c=JSON.decode(this.field[j].get("value"));if(typeOf(c)==="null"){c={}}var h=this.win[j].getElement("tbody").getElement("tr");var e=Object.keys(c);var g=e.length===0||c[e[0]].length===0?true:false;var f=g?1:c[e[0]].length;for(var d=1;d<f;d++){h.clone().inject(h,"after")}this.stripe(j);var b=this.getTrs(j);for(d=0;d<f;d++){e.each(function(a){b[d].getElements("*[name*="+a+"]").each(function(i){if(i.get("type")==="radio"){if(i.value===c[a][d]){i.checked=true}}else{i.value=c[a][d]}})})}if(g||typeOf(this.tmpl)==="null"){this.tmpl=h}if(g){h.dispose()}},findTr:function(b){var a=b.target.getParents().filter(function(c){return c.get("tag")==="tr"});return(a.length===0)?false:a[0]},store:function(){var c={};for(var b=0;b<this.names.length;b++){var d=this.names[b];var a=this.content.getElements("*[name*="+d+"]");c[d]=[];a.each(function(e){if(e.get("type")==="radio"){if(e.get("checked")===true){c[d].push(e.get("value"))}}else{c[d].push(e.get("value"))}}.bind(this))}this.field.value=JSON.encode(c);return true}});