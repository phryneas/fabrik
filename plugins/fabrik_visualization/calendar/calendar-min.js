var fabrikCalendar=new Class({Implements:[Options],options:{days:["Sunday","Monday","Tuesday","Wednesday","Thursday","Friday","Saturday"],shortDays:["Sun","Mon","Tues","Wed","Thur","Fri","Sat"],months:["January","Feburary","March","April","May","June","July","August","September","October","November","December"],shortMonths:["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sept","Oct","Nov","Dec"],viewType:"month",calendarId:1,tmpl:"default",Itemid:0,colors:{bg:"#F7F7F7",highlight:"#FFFFDF",headingBg:"#C3D9FF",today:"#dddddd",headingColor:"#135CAE",entryColor:"#eeffff"},eventLists:[],listid:0,popwiny:0,urlfilters:[],url:{add:"index.php?option=com_fabrik&controller=visualization.calendar&view=visualization&task=getEvents&format=raw",del:"index.php?option=com_fabrik&controller=visualization.calendar&view=visualization&task=deleteEvent&format=raw"},monthday:{width:90,height:80}},initialize:function(a){this.el=$(a);this.SECOND=1000;this.MINUTE=this.SECOND*60;this.HOUR=this.MINUTE*60;this.DAY=this.HOUR*24;this.WEEK=this.DAY*7;this.date=new Date();this.selectedDate=new Date();this.entries=$H();this.droppables={month:[],week:[],day:[]};this.fx={};this.ajax={};if(typeOf(this.el.getElement(".calendar-message"))!=="null"){this.fx.showMsg=new Fx.Morph(this.el.getElement(".calendar-message"),{duration:700});this.fx.showMsg.set({opacity:0})}this.colwidth=[];this.windowopts={id:"addeventwin",title:"add/edit event",loadMethod:"xhr",minimizable:false,evalScripts:true,width:380,height:320,onContentLoaded:function(b){b.fitToContent()}.bind(this)};Fabrik.addEvent("fabrik.form.submitted",function(c,b){this.ajax.updateEvents.send();Fabrik.Windows.addeventwin.close()}.bind(this))},removeFormEvents:function(a){this.entries.each(function(c,b){if(typeof(c)!=="undefined"&&c.formid===a){this.entries.dispose(b)}}.bind(this))},_makeEventRelDiv:function(j,a,e){var i;var h=j.label;a.left===a.left?a.left:0;a["margin-left"]===a["margin-left"]?a["margin-left"]:0;a.height=a.height?a.height:1;var g=(j.colour!=="")?j.colour:this.options.colors.entryColor;if(a.startMin===0){a.startMin=a.startMin+"0"}if(a.endMin===0){a.endMin=a.endMin+"0"}var k=a.view?a.view:"dayView";var b={"background-color":this._getColor(g,e),width:a.width,cursor:"pointer","margin-left":a["margin-left"],height:a.height.toInt()+"px",top:a.top.toInt()+"px",position:"absolute",border:"1px solid #666666","border-right":"0","border-left":"0",overflow:"auto",opacity:0.6};if(a.left){b.left=a.left.toInt()+"px"}var c="fabrikEvent_"+j._listid+"_"+j.id;if(a.view==="monthView"){b.width-=1}var f=new Element("div",{"class":"fabrikEvent",id:c,styles:b});f.addEvent("mouseenter",this.doPopupEvent.bindWithEvent(this,[j,h]));if(j.link!==""){i=new Element("a",{href:j.link,"class":"fabrikEditEvent",events:{click:function(m){m.stop();var n={};var l=m.target.getParent(".fabrikEvent").id.replace("fabrikEvent_","").split("_");n.rowid=l[1];n.listid=l[0];this.addEvForm(n)}.bind(this)}}).appendText(h)}else{i=new Element("span").appendText(h)}f.adopt(i);return f},doPopupEvent:function(h,f,b){var i;var g=this.activeHoverEvent;this.activeHoverEvent=h.target.hasClass("fabrikEvent")?h.target:h.target.getParent(".fabrikEvent");if(!f._canDelete){this.popWin.getElement(".popupDelete").hide()}else{this.popWin.getElement(".popupDelete").show()}if(!f._canEdit){this.popWin.getElement(".popupEdit").hide();this.popWin.getElement(".popupView").show()}else{this.popWin.getElement(".popupEdit").show();this.popWin.getElement(".popupView").hide()}if(this.activeHoverEvent){i=this.activeHoverEvent.getCoordinates()}else{i={top:0,left:0}}var a=this.popup.getElement("div[class=popLabel]");a.empty();a.set("text",b);this.activeDay=h.target.getParent();var c=i.top-this.popWin.getSize().y;var j={opacity:[0,1],top:[i.top+50,i.top-10]};this.inFadeOut=false;this.popWin.setStyles({left:i.left+20,top:i.top});this.fx.showEventActions.cancel().set({opacity:0}).start.delay(500,this.fx.showEventActions,j)},_getFirstDayInMonthCalendar:function(e){var b=new Date();b.setTime(e.valueOf());if(e.getDay()!==this.options.first_week_day){var c=e.getDay()-this.options.first_week_day;if(c<0){c=7+c}e.setTime(e.valueOf()-(c*24*60*60*1000))}if(b.getMonth()===e.getMonth()){var a=7*24*60*60*1000;while(e.getDate()>1){e.setTime(e.valueOf()-this.DAY)}}return e},showMonth:function(){var f=new Date();f.setTime(this.date.valueOf());f.setDate(1);f=this._getFirstDayInMonthCalendar(f);var a=this.el.getElements(".monthView tr");var h=0;for(var b=1;b<a.length;b++){var e=a[b].getElements("td");var g=0;e.each(function(i){i.setProperties({"class":""});i.addClass(f.getTime());if(f.getMonth()!==this.date.getMonth()){i.addClass("otherMonth")}if(this.selectedDate.isSameDay(f)){i.addClass("selectedDay")}i.empty();i.adopt(new Element("div",{"class":"date",styles:{"background-color":this._getColor("#E8EEF7",f)}}).appendText(f.getDate()));var c=0;this.entries.each(function(n){if((n.enddate!==""&&f.isDateBetween(n.startdate,n.enddate))||(n.enddate===""&&n.startdate.isSameDay(f))){var k=i.getElements(".fabrikEvent").length;var j=20;var p=(i.getSize().y*(b-1))+this.el.getElement(".monthView .dayHeading").getSize().y+i.getElement(".date").getSize().y;this.colwidth[".monthView"]=this.colwidth[".monthView"]?this.colwidth[".monthView"]:i.getSize().x;var l=i.getSize().x;l=this.colwidth[".monthView"];p=p+(k*j);var o=l*g;var m={width:l,height:j,view:"monthView"};m.top=p;if(window.ie){m.left=o}m.startHour=n.startdate.getHours();m.endHour=n.enddate.getHours();m.startMin=n.startdate.getMinutes();m.endMin=n.enddate.getMinutes();m["margin-left"]=0;i.adopt(this._makeEventRelDiv(n,m,f))}c++}.bind(this));f.setTime(f.getTime()+this.DAY);g++}.bind(this))}document.addEvent("mousemove",function(j){var i=$(j.target);var c=j.client.x;var n=j.client.y;var l=this.activeArea;if(typeOf(l)!=="null"&&typeOf(this.activeDay)!=="null"){if((c<=l.left||c>=l.right)||(n<=l.top||n>=l.bottom)){if(!this.inFadeOut){var k=this.activeHoverEvent.getCoordinates();var m={opacity:[1,0],top:[k.top-10,k.top+50]};this.fx.showEventActions.cancel().start.delay(500,this.fx.showEventActions,m)}this.activeDay=null}}}.bind(this));this.entries.each(function(i){var c=this.el.getElement(".fabrikEvent_"+i._listid+"_"+i.id);if(c){}}.bind(this));this._highLightToday();this.el.getElement(".monthDisplay").innerHTML=this.options.months[this.date.getMonth()]+" "+this.date.getFullYear()},_makePopUpWin:function(){if(typeOf(this.popup)==="null"){var c=new Element("div",{"class":"popLabel"});var a=new Element("div",{"class":"popupDelete"}).adopt(new Element("a",{href:"#",events:{mouseenter:function(){},mouseleave:function(){},click:function(f){f.stop();this.deleteEntry(f)}.bind(this)}}).adopt(new Element("img",{src:Fabrik.liveSite+"plugins/fabrik_visualization/calendar/views/calendar/tmpl/"+this.options.tmpl+"/images/del.png",alt:"del","class":"fabrikDeleteEvent"})).appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_DELETE")));var b=new Element("div").adopt(new Element("a",{href:"#",events:{mouseenter:function(){},mouseleave:function(){},click:function(f){this.editEntry(f)}.bind(this)}}).adopt([new Element("span",{"class":"popupEdit"}).adopt(new Element("img",{src:Fabrik.liveSite+"plugins/fabrik_visualization/calendar/views/calendar/tmpl/"+this.options.tmpl+"/images/edit.png",alt:Joomla.JText._("PLG_VISUALIZATION_CALENDAR_EDIT"),"class":"fabrikEditEvent"})).appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_EDIT")),new Element("span",{"class":"popupView"}).adopt(new Element("img",{src:Fabrik.liveSite+"media/com_fabrik/images/view.png",alt:Joomla.JText._("PLG_VISUALIZATION_CALENDAR_VIEW"),"class":"fabrikViewEvent"})).appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_VIEW"))]));a.addEvent("mousewithin",function(){});this.popup=new Element("div",{"class":"popWin",styles:{position:"absolute"}}).adopt([c,a,b]);this.popup.inject(document.body);this.activeArea=null;this.fx.showEventActions=new Fx.Morph(this.popup,{duration:500,transition:Fx.Transitions.Quad.easeInOut,onCancel:function(){}.bind(this),onComplete:function(h){if(this.activeHoverEvent){var f=this.popup.getCoordinates();var j=this.activeHoverEvent.getCoordinates();var g=window.getScrollTop();var i={};i.left=(f.left<j.left)?f.left:j.left;i.top=(f.top<j.top)?f.top:j.top;i.top=i.top-g;i.right=(f.right>j.right)?f.right:j.right;i.bottom=(f.bottom>j.bottom)?f.bottom:j.bottom;i.bottom=i.bottom-g;this.activeArea=i;this.inFadeOut=false}}.bind(this)})}return this.popup},makeDragMonthEntry:function(a){},showWeek:function(){var g;var m=this.date.getDay();m=m-this.options.first_week_day.toInt();var a=new Date();a.setTime(this.date.getTime()-(m*this.DAY));var e=new Date();e.setTime(this.date.getTime()-(m*this.DAY));var c=new Date();c.setTime(this.date.getTime()+((6-m)*this.DAY));this.el.getElement(".monthDisplay").innerHTML=(a.getDate())+"  "+this.options.months[a.getMonth()]+" "+a.getFullYear()+" - ";this.el.getElement(".monthDisplay").innerHTML+=(c.getDate())+"  "+this.options.months[c.getMonth()]+" "+c.getFullYear();var l=this.el.getElements(".weekView tr");var b=l[0].getElements("th");for(var k=1;k<l.length;k++){a.setHours(k-1,0,0);if(k!==1){a.setTime(a.getTime()-(6*this.DAY))}var h=l[k].getElements("td");for(g=1;g<h.length;g++){if(g!==1){a.setTime(a.getTime()+this.DAY)}var f=h[g];f.empty();f.className="";f.addClass("day");f.addClass(a.getTime()-this.HOUR);if(this.selectedDate.isSameWeek(a)&&this.selectedDate.isSameDay(a)){f.addClass("selectedDay")}else{f.removeClass("selectedDay")}}}e=new Date();e.setTime(this.date.getTime()-(m*this.DAY));for(k=0;k<b.length;k++){b[k].className="dayHeading";b[k].addClass(e.getTime());b[k].innerHTML=this.options.shortDays[e.getDay()]+" "+e.getDate()+"/"+this.options.shortMonths[e.getMonth()];g=0;this.entries.each(function(j){if((j.enddate!==""&&e.isDateBetween(j.startdate,j.enddate))||(j.enddate===""&&j.startdate.isSameDay(e))){var i=this._buildEventOpts({entry:j,curdate:e,divclass:".weekView",tdOffset:k});f.adopt(this._makeEventRelDiv(j,i));g++}}.bind(this));e.setTime(e.getTime()+this.DAY)}},_buildEventOpts:function(a){var f=a.curdate;var p=new CloneObject(a.entry,true,["enddate","startdate"]);var l=this.el.getElements(a.divclass+" tr");var j=(p.startdate.isSameDay(f))?p.startdate.getHours():0;var k=a.tdOffset;p.label=p.label?p.label:"";var g=l[j+1].getElements("td")[k+1];var o=p.startdate.getHours();var n=g.getSize().y;this.colwidth[a.divclass]=this.colwidth[a.divclass]?this.colwidth[a.divclass]:g.getSize().x;var m=this.el.getElement(a.divclass).getElement("tr").getSize().y;colwidth=this.colwidth[a.divclass];var e=(colwidth*k);e+=this.el.getElement(a.divclass).getElement("td").getSize().x;var h=Math.ceil(p.enddate.getHours()-p.startdate.getHours());if(h===0){h=1}if(p.startdate.getDay()!==p.enddate.getDay()){h=24;if(p.startdate.isSameDay(f)){h=24-p.startdate.getHours()}else{p.startdate.setHours(0);if(p.enddate.isSameDay(f)){h=p.enddate.getHours()}}}m=m+(n*j);var r=(n*h);if(p.enddate.isSameDay(f)){r+=(p.enddate.getMinutes()/60*n)}if(p.startdate.isSameDay(f)){m+=(p.startdate.getMinutes()/60*n);r-=(p.startdate.getMinutes()/60*n)}var c=g.getElements(".fabrikEvent");var b=colwidth/(c.length+1);var s=b*c.length;c.setStyle("width",b+"px");var q=a.divclass.substr(1,a.divclass.length);b-=g.getStyle("border-left-width").toInt()+g.getStyle("border-right-width").toInt();a={"margin-left":s+"px",width:b+"px",height:r,view:"weekView","background-color":this._getColor(this.options.colors.headingBg)};a.left=e;a.top=m;a.color=this._getColor(this.options.colors.headingColor,p.startdate);a.startHour=p.startdate.getHours();a.endHour=a.startHour+h;a.startMin=p.startdate.getMinutes();a.endMin=p.enddate.getMinutes();p.startdate.setHours(o);return a},showDay:function(){var b;var e=new Date();e.setTime(this.date.valueOf());e.setHours(0,0);var a=this.el.getElements(".dayView tr");a[0].childNodes[1].innerHTML=this.options.days[this.date.getDay()];for(var c=1;c<a.length;c++){e.setHours(c-1,0);var f=a[c].getElements("td")[1];if(typeOf(f)!=="null"){f.empty();f.className="";f.addClass("day");f.addClass(e.getTime()-this.HOUR)}}this.entries.each(function(h){if((h.enddate!==""&&this.date.isDateBetween(h.startdate,h.enddate))||(h.enddate===""&&h.startdate.isSameDay(e))){var g=this._buildEventOpts({entry:h,curdate:this.date,divclass:".dayView",tdOffset:0});f.adopt(this._makeEventRelDiv(h,g))}}.bind(this));this.el.getElement(".monthDisplay").innerHTML=(this.date.getDate())+"  "+this.options.months[this.date.getMonth()]+" "+this.date.getFullYear()},renderMonthView:function(){var j,k;this.popWin.setStyle("opacity",0);var a=this._getFirstDayInMonthCalendar(new Date());var f=this.options.days.slice(this.options.first_week_day).concat(this.options.days.slice(0,this.options.first_week_day));var b=new Date();b.setTime(a.valueOf());if(a.getDay()!==this.options.first_week_day){var e=a.getDay()-this.options.first_week_day;b.setTime(a.valueOf()-(e*24*60*60*1000))}this.options.viewType="monthView";if(!this.mothView){tbody=new Element("tbody",{"class":"viewContainerTBody"});k=new Element("tr");for(j=0;j<7;j++){k.adopt(new Element("th",{"class":"dayHeading",styles:{width:"80px",height:"20px","text-align":"center",color:this._getColor(this.options.colors.headingColor,b),"background-color":this._getColor(this.options.colors.headingBg,b)}}).appendText(f[j]));b.setTime(b.getTime()+this.DAY)}tbody.appendChild(k);var n=this.options.colors.highlight;var l=this.options.colors.bg;var h=this.options.colors.today;for(var g=0;g<6;g++){k=new Element("tr");var m=this;for(j=0;j<7;j++){var o=this.options.colors.bg;var c=(this.selectedDate.isSameDay(a))?"selectedDay":"";k.adopt(new Element("td",{"class":"day "+(a.getTime())+c,styles:{width:this.options.monthday.width+"px",height:this.options.monthday.height+"px","background-color":o,"vertical-align":"top",padding:0,border:"1px solid #cccccc"},events:{mouseenter:function(){this.setStyles({"background-color":n})},mouseleave:function(){this.set("morph",{duration:500,transition:Fx.Transitions.Sine.easeInOut});var i=(this.hasClass("today"))?h:l;this.morph({"background-color":[n,i]})},click:function(i){m.selectedDate.setTime(this.className.split(" ")[1]);m.date.setTime(m._getTimeFromClassName(this.className));m.el.getElements("td").each(function(p){p.removeClass("selectedDay");if(p!==this){p.setStyles({"background-color":"#F7F7F7"})}}.bind(this));this.addClass("selectedDay")},dblclick:function(i){this.openAddEvent(i)}.bind(this)}}));a.setTime(a.getTime()+this.DAY)}tbody.appendChild(k)}this.mothView=new Element("div",{"class":"monthView",styles:{position:"relative"}}).adopt(new Element("table",{styles:{"border-collapse":"collapse"}}).adopt(tbody));this.el.getElement(".viewContainer").appendChild(this.mothView)}this.showView("monthView")},_getTimeFromClassName:function(a){return a.replace("today","").replace("selectedDay","").replace("day","").replace("otherMonth","").trim()},openAddEvent:function(i){var j;if(this.options.canAdd===0){return}i.stop();if(i.target.className==="addEventButton"){var a=new Date();j=a.getTime()}else{j=this._getTimeFromClassName(i.target.className)}this.date.setTime(j);d=0;if(!isNaN(j)&&j!==""){var h=new Date();h.setTime(j);var c=h.getMonth()+1;c=(c<10)?"0"+c:c;var k=h.getDate();k=(k<10)?"0"+k:k;var f=h.getHours();f=(f<10)?"0"+f:f;var g=h.getMinutes();g=(g<10)?"0"+g:g;this.doubleclickdate=h.getFullYear()+"-"+c+"-"+k+" "+f+":"+g+":00";d="&jos_fabrik_calendar_events___start_date="+this.doubleclickdate}if(this.options.eventLists.length>1){this.openChooseEventTypeForm(this.doubleclickdate,j)}else{var b={};b.rowid=0;b.id="";d="&"+this.options.eventLists[0].startdate_element+"="+this.doubleclickdate;b.listid=this.options.eventLists[0].value;this.addEvForm(b)}},openChooseEventTypeForm:function(c,a){var b="index.php?option=com_fabrik&tmpl=component&view=visualization&controller=visualization.calendar&task=chooseaddevent&id="+this.options.calendarId+"&d="+c+"&rawd="+a;this.windowopts.contentURL=b;this.windowopts.id="chooseeventwin";this.windowopts.onContentLoaded=function(){var e=new Fx.Scroll(window).toElement("chooseeventwin")};Fabrik.getWindow(this.windowopts)},addEvForm:function(c){var a="index.php?option=com_fabrik&controller=visualization.calendar&view=visualization&task=addEvForm&format=raw&listid="+c.listid+"&rowid="+c.rowid;a+="&jos_fabrik_calendar_events___visualization_id="+this.options.calendarId;a+="&visualizationid="+this.options.calendarId;if(typeof(this.doubleclickdate)!=="undefined"){a+="&start_date="+this.doubleclickdate}this.windowopts.type="window";this.windowopts.contentURL=a;this.windowopts.id="addeventwin";var b=this.options.filters;this.windowopts.onContentLoaded=function(e){var f=new Fx.Scroll(window).toElement("addeventwin");b.each(function(g){if($(g.key)){switch($(g.key).get("tag")){case"select":$(g.key).selectedIndex=g.val;break;case"input":$(g.key).value=g.val;break}}});e.fitToContent()}.bind(this);Fabrik.getWindow(this.windowopts)},_highLightToday:function(){var a=new Date();this.el.getElements(".viewContainerTBody td").each(function(c){var b=new Date(this._getTimeFromClassName(c.className).toInt());if(a.equalsTo(b)){c.addClass("today")}else{c.removeClass("today")}}.bind(this))},centerOnToday:function(){this.date=new Date();this.showView()},renderDayView:function(){var c,e;this.popWin.setStyle("opacity",0);this.options.viewType="dayView";if(!this.dayView){tbody=new Element("tbody");c=new Element("tr");for(e=0;e<2;e++){if(e===0){c.adopt(new Element("td",{"class":"day"}))}else{c.adopt(new Element("th",{"class":"dayHeading",styles:{width:"80px",height:"20px","text-align":"center",color:this.options.headingColor,"background-color":this.options.colors.headingBg}}).appendText(this.options.days[this.date.getDay()]))}}tbody.appendChild(c);for(var b=0;b<24;b++){c=new Element("tr");for(e=0;e<2;e++){if(e===0){var a=(b.length===1)?b+"0:00":b+":00";c.adopt(new Element("td",{"class":"day"}).appendText(a))}else{c.adopt(new Element("td",{"class":"day",styles:{width:"100%",height:"10px","background-color":"#F7F7F7","vertical-align":"top",padding:0,border:"1px solid #cccccc"},events:{mouseenter:function(f){this.setStyles({"background-color":"#FFFFDF"})},mouseleave:function(f){this.setStyles({"background-color":"#F7F7F7"})},dblclick:function(f){this.openAddEvent(f)}.bind(this)}}))}}tbody.appendChild(c)}this.dayView=new Element("div",{"class":"dayView",styles:{position:"relative"}}).adopt(new Element("table",{"class":"",styles:{"border-collapse":"collapse"}}).adopt(tbody));this.el.getElement(".viewContainer").appendChild(this.dayView)}this.showDay();this.showView("dayView")},showView:function(a){if(this.el.getElement(".dayView")){this.el.getElement(".dayView").style.display="none"}if(this.el.getElement(".weekView")){this.el.getElement(".weekView").style.display="none"}if(this.el.getElement(".monthView")){this.el.getElement(".monthView").style.display="none"}this.el.getElement("."+this.options.viewType).style.display="block";switch(this.options.viewType){case"dayView":this.showDay();break;case"weekView":this.showWeek();break;default:case"monthView":this.showMonth();break}Cookie.write("fabrik.viz.calendar.view",this.options.viewType)},renderWeekView:function(){var c,f,e,b;this.popWin.setStyle("opacity",0);this.options.viewType="weekView";if(!this.weekView){b=new Element("tbody");e=new Element("tr");for(f=0;f<8;f++){if(f===0){e.adopt(new Element("td",{"class":"day"}))}else{e.adopt(new Element("th",{"class":"dayHeading",styles:{width:"80px",height:"20px","text-align":"center",color:this.options.headingColor,"background-color":this.options.colors.headingBg},events:{click:function(h){h.stop();this.selectedDate.setTime($(h.target).className.replace("dayHeading ","").toInt());var g=new Date();$(h.target).getParent().getParent().getElements("td").each(function(j){var i=j.className.replace("day ","").replace(" selectedDay").toInt();g.setTime(i);if(g.getDayOfYear()===this.selectedDate.getDayOfYear()){j.addClass("selectedDay")}else{j.removeClass("selectedDay")}}.bind(this))}.bind(this)}}).appendText(this.options.days[f-1]))}}b.appendChild(e);for(c=0;c<24;c++){e=new Element("tr");for(f=0;f<8;f++){if(f===0){var a=(c.length===1)?c+"0:00":c+":00";e.adopt(new Element("td",{"class":"day"}).appendText(a))}else{e.adopt(new Element("td",{"class":"day",styles:{width:"90px",height:"10px","background-color":"#F7F7F7","vertical-align":"top",padding:0,border:"1px solid #cccccc"},events:{mouseenter:function(g){if(!this.hasClass("selectedDay")){this.setStyles({"background-color":"#FFFFDF"})}},mouseleave:function(g){if(!this.hasClass("selectedDay")){this.setStyles({"background-color":"#F7F7F7"})}},dblclick:function(g){this.openAddEvent(g)}.bind(this)}}))}}b.appendChild(e)}this.weekView=new Element("div",{"class":"weekView",styles:{position:"relative"}}).adopt(new Element("table",{styles:{"border-collapse":"collapse"}}).adopt(b));this.el.getElement(".viewContainer").appendChild(this.weekView)}this.showWeek();this.showView("weekView")},render:function(c){this.setOptions(c);this.windowopts.title=Joomla.JText._("PLG_VISUALIZATION_CALENDAR_ADD_EDIT_EVENT");this.windowopts.y=this.options.popwiny;this.popWin=this._makePopUpWin();var f=this.options.urlfilters;f.visualizationid=this.options.calendarId;this.ajax.updateEvents=new Request({url:this.options.url.add,data:f,evalScripts:true,onComplete:function(h){var i=h.stripScripts(true);var g=JSON.decode(i);this.addEntries(g);this.showView()}.bind(this)});this.ajax.deleteEvent=new Request({url:this.options.url.del,data:{visualizationid:this.options.calendarId},onComplete:function(h){h=h.stripScripts(true);var g=JSON.decode(h);this.entries=$H();this.addEntries(g)}.bind(this)});if(typeOf(this.el.getElement(".addEventButton"))!=="null"){this.el.getElement(".addEventButton").addEvent("click",this.openAddEvent.bindWithEvent(this))}var b=[];b.push(new Element("li",{"class":"centerOnToday"}).appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_TODAY")));if(this.options.show_day!==0){b.push(new Element("li",{"class":"dayViewLink"}).appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_DAY")))}if(this.options.show_week!==0){b.push(new Element("li",{"class":"weekViewLink"}).appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_WEEK")))}b.push(new Element("li",{"class":"monthViewLink"}).appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_MONTH")));var e=new Element("div",{"class":"calendarNav"}).adopt(new Element("input",{"class":"previousPage",type:"button",value:Joomla.JText._("PLG_VISUALIZATION_CALENDAR_PREVIOUS")}),new Element("input",{"class":"nextPage",type:"button",value:Joomla.JText._("PLG_VISUALIZATION_CALENDAR_NEXT")}),new Element("div",{"class":"monthDisplay"}),new Element("ul",{"class":"viewMode"}).adopt(b));this.el.appendChild(e);this.el.appendChild(new Element("div",{"class":"viewContainer",styles:{"background-color":"#EFEFEF",padding:"5px"}}));if($type(Cookie.read("fabrik.viz.calendar.date"))!==false){this.date=new Date(Cookie.read("fabrik.viz.calendar.date"))}var a=typeOf(Cookie.read("fabrik.viz.calendar.view"))==="null"?this.options.viewType:Cookie.read("fabrik.viz.calendar.view");switch(a){case"dayView":this.renderDayView();break;case"weekView":this.renderWeekView();break;default:case"monthView":this.renderMonthView();break}this.showView();this.el.getElement(".nextPage").addEvent("click",this.nextPage.bindWithEvent(this));this.el.getElement(".previousPage").addEvent("click",this.previousPage.bindWithEvent(this));if(this.options.show_day!==0){this.el.getElement(".dayViewLink").addEvent("click",this.renderDayView.bindWithEvent(this))}if(this.options.show_week!==0){this.el.getElement(".weekViewLink").addEvent("click",this.renderWeekView.bindWithEvent(this))}this.el.getElement(".monthViewLink").addEvent("click",this.renderMonthView.bindWithEvent(this));this.el.getElement(".centerOnToday").addEvent("click",this.centerOnToday.bindWithEvent(this));this.showMonth();this.watchFilters();this.ajax.updateEvents.send()},watchFilters:function(){var a=this.el.getElement(".clearFilters");if(a){a.addEvent("click",function(b){b.stop();a.findUp("form").getElements(".fabrik_filter").each(function(c){if(c.get("tag")==="select"){c.selectedIndex=0}else{c.value=""}});a.findUp("form").submit()}.bind(this))}},showMessage:function(a){this.el.getElement(".calendar-message").set("html",a);this.fx.showMsg.start({opacity:[0,1]}).chain(function(){this.start.delay(2000,this,{opacity:[1,0]})})},addEntry:function(b,g){var f,c,a,e;if(g.startdate){f=g.startdate.split(" ");f=f[0];if(f.trim()===""){return}e=g.startdate.split(" ");e=e[1];e=e.split(":");f=f.split("-");c=new Date();a=(f[1]).toInt()-1;c.setYear(f[0]);c.setMonth(a,f[2]);c.setDate(f[2]);c.setHours(e[0].toInt());c.setMinutes(e[1].toInt());c.setSeconds(e[2].toInt());g.startdate=c;this.entries.set(b,g);if(g.enddate){f=g.enddate.split(" ");f=f[0];if(f.trim()===""){return}if(f==="0000-00-00"){g.enddate=g.startdate;return}e=g.enddate.split(" ");e=e[1];e=e.split(":");f=f.split("-");c=new Date();a=(f[1]).toInt()-1;c.setYear(f[0]);c.setMonth(a,f[2]);c.setDate(f[2]);c.setHours(e[0].toInt());c.setMinutes(e[1].toInt());c.setSeconds(e[2].toInt());g.enddate=c}}},deleteEntry:function(f){var c=this.activeHoverEvent.id.replace("fabrikEvent_","");var b=c.split("_");var a=b[0];if(!this.options.deleteables.contains(a)){return}if(confirm(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_CONF_DELETE"))){this.ajax.deleteEvent.options.data={id:b[1],listid:a};this.ajax.deleteEvent.send();document.id(this.activeHoverEvent).fade("out");this.fx.showEventActions.start({opacity:[1,0]});this.removeEntry(c);this.activeDay=null}},editEntry:function(b){var c={};c.id=this.options.formid;var a=this.activeHoverEvent.id.replace("fabrikEvent_","").split("_");c.rowid=a[1];c.listid=a[0];this.addEvForm(c)},addEntries:function(b){b=$H(b);b.each(function(c,a){this.addEntry(a,c)}.bind(this));this.showView()},removeEntry:function(a){this.entries.erase(a);this.showView()},nextPage:function(){this.popWin.setStyle("opacity",0);switch(this.options.viewType){case"dayView":this.date.setTime(this.date.getTime()+this.DAY);this.showDay();break;case"weekView":this.date.setTime(this.date.getTime()+this.WEEK);this.showWeek();break;case"monthView":this.date.setDate(1);this.date.setMonth(this.date.getMonth()+1);this.showMonth();break}Cookie.write("fabrik.viz.calendar.date",this.date)},previousPage:function(){this.popWin.setStyle("opacity",0);switch(this.options.viewType){case"dayView":this.date.setTime(this.date.getTime()-this.DAY);this.showDay();break;case"weekView":this.date.setTime(this.date.getTime()-this.WEEK);this.showWeek();break;case"monthView":this.date.setMonth(this.date.getMonth()-1);this.showMonth();break}Cookie.write("fabrik.viz.calendar.date",this.date)},addLegend:function(b){var c=new Element("ul");b.each(function(e){var a=new Element("li");a.adopt(new Element("div",{styles:{"background-color":e.colour}}),new Element("span").appendText(e.label));c.appendChild(a)}.bind(this));new Element("div",{"class":"legend"}).adopt([new Element("h3").appendText(Joomla.JText._("PLG_VISUALIZATION_CALENDAR_KEY")),c]).inject(this.el,"after")},_getGreyscaleFromRgb:function(c){var f=parseInt(c.substring(1,3),16);var e=parseInt(c.substring(3,5),16);var a=parseInt(c.substring(5),16);var h=parseInt(0.3*f+0.59*e+0.11*a,10);return"#"+h.toString(16)+h.toString(16)+h.toString(16)},_getColor:function(a,e){if(this.options.greyscaledweekend===0){return a}var b=new Color(a);if(typeOf(e)!=="null"&&(e.getDay()===0||e.getDay()===6)){return this._getGreyscaleFromRgb(a)}else{return a}}});Date._MD=new Array(31,28,31,30,31,30,31,31,30,31,30,31);Date.SECOND=1000;Date.MINUTE=60*Date.SECOND;Date.HOUR=60*Date.MINUTE;Date.DAY=24*Date.HOUR;Date.WEEK=7*Date.DAY;Date.prototype.getMonthDays=function(b){var a=this.getFullYear();if(typeof b==="undefined"){b=this.getMonth()}if(((0===(a%4))&&((0!==(a%100))||(0===(a%400))))&&b===1){return 29}else{return Date._MD[b]}};Date.prototype.isSameWeek=function(a){return((this.getFullYear()===a.getFullYear())&&(this.getMonth()===a.getMonth())&&(this.getWeekNumber()===a.getWeekNumber()))};Date.prototype.isSameDay=function(a){return((this.getFullYear()===a.getFullYear())&&(this.getMonth()===a.getMonth())&&(this.getDate()===a.getDate()))};Date.prototype.isSameHour=function(a){return((this.getFullYear()===a.getFullYear())&&(this.getMonth()===a.getMonth())&&(this.getDate()===a.getDate())&&(this.getHours()===a.getHours()))};Date.prototype.isDateBetween=function(c,b){var e=c.getFullYear()*10000+(c.getMonth()+1)*100+c.getDate();var f=b.getFullYear()*10000+(b.getMonth()+1)*100+b.getDate();var a=this.getFullYear()*10000+(this.getMonth()+1)*100+this.getDate();return e<=a&&a<=f};