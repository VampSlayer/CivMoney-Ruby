(function(e){function t(t){for(var r,a,o=t[0],u=t[1],i=t[2],f=0,l=[];f<o.length;f++)a=o[f],s[a]&&l.push(s[a][0]),s[a]=0;for(r in u)Object.prototype.hasOwnProperty.call(u,r)&&(e[r]=u[r]);d&&d(t);while(l.length)l.shift()();return c.push.apply(c,i||[]),n()}function n(){for(var e,t=0;t<c.length;t++){for(var n=c[t],r=!0,a=1;a<n.length;a++){var o=n[a];0!==s[o]&&(r=!1)}r&&(c.splice(t--,1),e=u(u.s=n[0]))}return e}var r={},a={index:0},s={index:0},c=[];function o(e){return u.p+"js/"+({dashboard:"dashboard",login:"login",canvg:"canvg",pdfmake:"pdfmake",xlsx:"xlsx"}[e]||e)+"."+{dashboard:"fd81fba6",login:"52c7a343",canvg:"22fd1d8c",pdfmake:"da5152c0",xlsx:"92d10d45"}[e]+".js"}function u(t){if(r[t])return r[t].exports;var n=r[t]={i:t,l:!1,exports:{}};return e[t].call(n.exports,n,n.exports,u),n.l=!0,n.exports}u.e=function(e){var t=[],n={dashboard:1};a[e]?t.push(a[e]):0!==a[e]&&n[e]&&t.push(a[e]=new Promise(function(t,n){for(var r="css/"+({dashboard:"dashboard",login:"login",canvg:"canvg",pdfmake:"pdfmake",xlsx:"xlsx"}[e]||e)+"."+{dashboard:"3e0429ce",login:"31d6cfe0",canvg:"31d6cfe0",pdfmake:"31d6cfe0",xlsx:"31d6cfe0"}[e]+".css",s=u.p+r,c=document.getElementsByTagName("link"),o=0;o<c.length;o++){var i=c[o],f=i.getAttribute("data-href")||i.getAttribute("href");if("stylesheet"===i.rel&&(f===r||f===s))return t()}var l=document.getElementsByTagName("style");for(o=0;o<l.length;o++){i=l[o],f=i.getAttribute("data-href");if(f===r||f===s)return t()}var d=document.createElement("link");d.rel="stylesheet",d.type="text/css",d.onload=t,d.onerror=function(t){var r=t&&t.target&&t.target.src||s,c=new Error("Loading CSS chunk "+e+" failed.\n("+r+")");c.code="CSS_CHUNK_LOAD_FAILED",c.request=r,delete a[e],d.parentNode.removeChild(d),n(c)},d.href=s;var p=document.getElementsByTagName("head")[0];p.appendChild(d)}).then(function(){a[e]=0}));var r=s[e];if(0!==r)if(r)t.push(r[2]);else{var c=new Promise(function(t,n){r=s[e]=[t,n]});t.push(r[2]=c);var i,f=document.createElement("script");f.charset="utf-8",f.timeout=120,u.nc&&f.setAttribute("nonce",u.nc),f.src=o(e),i=function(t){f.onerror=f.onload=null,clearTimeout(l);var n=s[e];if(0!==n){if(n){var r=t&&("load"===t.type?"missing":t.type),a=t&&t.target&&t.target.src,c=new Error("Loading chunk "+e+" failed.\n("+r+": "+a+")");c.type=r,c.request=a,n[1](c)}s[e]=void 0}};var l=setTimeout(function(){i({type:"timeout",target:f})},12e4);f.onerror=f.onload=i,document.head.appendChild(f)}return Promise.all(t)},u.m=e,u.c=r,u.d=function(e,t,n){u.o(e,t)||Object.defineProperty(e,t,{enumerable:!0,get:n})},u.r=function(e){"undefined"!==typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},u.t=function(e,t){if(1&t&&(e=u(e)),8&t)return e;if(4&t&&"object"===typeof e&&e&&e.__esModule)return e;var n=Object.create(null);if(u.r(n),Object.defineProperty(n,"default",{enumerable:!0,value:e}),2&t&&"string"!=typeof e)for(var r in e)u.d(n,r,function(t){return e[t]}.bind(null,r));return n},u.n=function(e){var t=e&&e.__esModule?function(){return e["default"]}:function(){return e};return u.d(t,"a",t),t},u.o=function(e,t){return Object.prototype.hasOwnProperty.call(e,t)},u.p="/",u.oe=function(e){throw console.error(e),e};var i=window["webpackJsonp"]=window["webpackJsonp"]||[],f=i.push.bind(i);i.push=t,i=i.slice();for(var l=0;l<i.length;l++)t(i[l]);var d=f;c.push([0,"chunk-vendors"]),n()})({0:function(e,t,n){e.exports=n("56d7")},"034f":function(e,t,n){"use strict";var r=n("64a9"),a=n.n(r);a.a},"2ce5":function(e,t,n){"use strict";n("96cf");var r=n("3b8d"),a=n("bc3a"),s=n.n(a);t["a"]={years:function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,s.a.get("/api/transactions/yearsTotals");case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)}));function t(){return e.apply(this,arguments)}return t}(),getTotalPerMonthForYear:function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,s.a.get("/api/transactions/yearsMonthTotals?year=".concat(t));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)}));function t(t){return e.apply(this,arguments)}return t}(),getTotalPerDayForMonth:function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(t,n){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,s.a.get("/api/transactions/dailyTotalMonth?year=".concat(t,"&month=").concat(n));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)}));function t(t,n){return e.apply(this,arguments)}return t}(),getMonthGroupedToals:function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(t,n){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,s.a.get("/api/transactions/monthGroupedToals?year=".concat(t,"&month=").concat(n));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)}));function t(t,n){return e.apply(this,arguments)}return t}(),getTransactionsForDate:function(){var e=Object(r["a"])(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,s.a.get("/api/transactions/date?date=".concat(t));case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)}));function t(t){return e.apply(this,arguments)}return t}()}},4678:function(e,t,n){var r={"./af":"2bfb","./af.js":"2bfb","./ar":"8e73","./ar-dz":"a356","./ar-dz.js":"a356","./ar-kw":"423e","./ar-kw.js":"423e","./ar-ly":"1cfd","./ar-ly.js":"1cfd","./ar-ma":"0a84","./ar-ma.js":"0a84","./ar-sa":"8230","./ar-sa.js":"8230","./ar-tn":"6d83","./ar-tn.js":"6d83","./ar.js":"8e73","./az":"485c","./az.js":"485c","./be":"1fc1","./be.js":"1fc1","./bg":"84aa","./bg.js":"84aa","./bm":"a7fa","./bm.js":"a7fa","./bn":"9043","./bn.js":"9043","./bo":"d26a","./bo.js":"d26a","./br":"6887","./br.js":"6887","./bs":"2554","./bs.js":"2554","./ca":"d716","./ca.js":"d716","./cs":"3c0d","./cs.js":"3c0d","./cv":"03ec","./cv.js":"03ec","./cy":"9797","./cy.js":"9797","./da":"0f14","./da.js":"0f14","./de":"b469","./de-at":"b3eb","./de-at.js":"b3eb","./de-ch":"bb71","./de-ch.js":"bb71","./de.js":"b469","./dv":"598a","./dv.js":"598a","./el":"8d47","./el.js":"8d47","./en-SG":"cdab","./en-SG.js":"cdab","./en-au":"0e6b","./en-au.js":"0e6b","./en-ca":"3886","./en-ca.js":"3886","./en-gb":"39a6","./en-gb.js":"39a6","./en-ie":"e1d3","./en-ie.js":"e1d3","./en-il":"7333","./en-il.js":"7333","./en-nz":"6f50","./en-nz.js":"6f50","./eo":"65db","./eo.js":"65db","./es":"898b","./es-do":"0a3c","./es-do.js":"0a3c","./es-us":"55c9","./es-us.js":"55c9","./es.js":"898b","./et":"ec18","./et.js":"ec18","./eu":"0ff2","./eu.js":"0ff2","./fa":"8df4","./fa.js":"8df4","./fi":"81e9","./fi.js":"81e9","./fo":"0721","./fo.js":"0721","./fr":"9f26","./fr-ca":"d9f8","./fr-ca.js":"d9f8","./fr-ch":"0e49","./fr-ch.js":"0e49","./fr.js":"9f26","./fy":"7118","./fy.js":"7118","./ga":"5120","./ga.js":"5120","./gd":"f6b4","./gd.js":"f6b4","./gl":"8840","./gl.js":"8840","./gom-latn":"0caa","./gom-latn.js":"0caa","./gu":"e0c5","./gu.js":"e0c5","./he":"c7aa","./he.js":"c7aa","./hi":"dc4d","./hi.js":"dc4d","./hr":"4ba9","./hr.js":"4ba9","./hu":"5b14","./hu.js":"5b14","./hy-am":"d6b6","./hy-am.js":"d6b6","./id":"5038","./id.js":"5038","./is":"0558","./is.js":"0558","./it":"6e98","./it-ch":"6f12","./it-ch.js":"6f12","./it.js":"6e98","./ja":"079e","./ja.js":"079e","./jv":"b540","./jv.js":"b540","./ka":"201b","./ka.js":"201b","./kk":"6d79","./kk.js":"6d79","./km":"e81d","./km.js":"e81d","./kn":"3e92","./kn.js":"3e92","./ko":"22f8","./ko.js":"22f8","./ku":"2421","./ku.js":"2421","./ky":"9609","./ky.js":"9609","./lb":"440c","./lb.js":"440c","./lo":"b29d","./lo.js":"b29d","./lt":"26f9","./lt.js":"26f9","./lv":"b97c","./lv.js":"b97c","./me":"293c","./me.js":"293c","./mi":"688b","./mi.js":"688b","./mk":"6909","./mk.js":"6909","./ml":"02fb","./ml.js":"02fb","./mn":"958b","./mn.js":"958b","./mr":"39bd","./mr.js":"39bd","./ms":"ebe4","./ms-my":"6403","./ms-my.js":"6403","./ms.js":"ebe4","./mt":"1b45","./mt.js":"1b45","./my":"8689","./my.js":"8689","./nb":"6ce3","./nb.js":"6ce3","./ne":"3a39","./ne.js":"3a39","./nl":"facd","./nl-be":"db29","./nl-be.js":"db29","./nl.js":"facd","./nn":"b84c","./nn.js":"b84c","./pa-in":"f3ff","./pa-in.js":"f3ff","./pl":"8d57","./pl.js":"8d57","./pt":"f260","./pt-br":"d2d4","./pt-br.js":"d2d4","./pt.js":"f260","./ro":"972c","./ro.js":"972c","./ru":"957c","./ru.js":"957c","./sd":"6784","./sd.js":"6784","./se":"ffff","./se.js":"ffff","./si":"eda5","./si.js":"eda5","./sk":"7be6","./sk.js":"7be6","./sl":"8155","./sl.js":"8155","./sq":"c8f3","./sq.js":"c8f3","./sr":"cf1e","./sr-cyrl":"13e9","./sr-cyrl.js":"13e9","./sr.js":"cf1e","./ss":"52bd","./ss.js":"52bd","./sv":"5fbd","./sv.js":"5fbd","./sw":"74dc","./sw.js":"74dc","./ta":"3de5","./ta.js":"3de5","./te":"5cbb","./te.js":"5cbb","./tet":"576c","./tet.js":"576c","./tg":"3b1b","./tg.js":"3b1b","./th":"10e8","./th.js":"10e8","./tl-ph":"0f38","./tl-ph.js":"0f38","./tlh":"cf75","./tlh.js":"cf75","./tr":"0e81","./tr.js":"0e81","./tzl":"cf51","./tzl.js":"cf51","./tzm":"c109","./tzm-latn":"b53d","./tzm-latn.js":"b53d","./tzm.js":"c109","./ug-cn":"6117","./ug-cn.js":"6117","./uk":"ada2","./uk.js":"ada2","./ur":"5294","./ur.js":"5294","./uz":"2e8c","./uz-latn":"010e","./uz-latn.js":"010e","./uz.js":"2e8c","./vi":"2921","./vi.js":"2921","./x-pseudo":"fd7e","./x-pseudo.js":"fd7e","./yo":"7f33","./yo.js":"7f33","./zh-cn":"5c3a","./zh-cn.js":"5c3a","./zh-hk":"49ab","./zh-hk.js":"49ab","./zh-tw":"90ea","./zh-tw.js":"90ea"};function a(e){var t=s(e);return n(t)}function s(e){var t=r[e];if(!(t+1)){var n=new Error("Cannot find module '"+e+"'");throw n.code="MODULE_NOT_FOUND",n}return t}a.keys=function(){return Object.keys(r)},a.resolve=s,e.exports=a,a.id="4678"},"56d7":function(e,t,n){"use strict";n.r(t);n("7f7f"),n("cadf"),n("551c"),n("f751"),n("097d");var r=n("2b0e"),a=function(){var e=this,t=e.$createElement,n=e._self._c||t;return n("div",[e.me?n("header",[n("b-navbar",{staticClass:"civ-nav-bg",attrs:{toggleable:"lg",type:"dark"}},[n("b-navbar-brand",{attrs:{to:"/"}},[e._v("Logo")]),n("b-navbar-toggle",{attrs:{target:"nav-collapse"}}),n("b-collapse",{attrs:{id:"nav-collapse","is-nav":""}},[n("b-navbar-nav",{staticClass:"ml-auto"},[n("b-nav-text",[e._v(e._s(e.me.firstName))]),n("b-nav-item",{attrs:{to:"/profile"}},[n("i",{staticClass:"fas fa-cog",attrs:{title:"Your Profile"}})]),n("b-nav-item",{on:{click:e.logout}},[n("i",{staticClass:"fas fa-power-off",attrs:{title:"Logout"}})])],1)],1)],1)],1):e._e(),n("router-view",{staticClass:"container-fluid"})],1)},s=[],c=(n("8e6e"),n("ac6a"),n("456d"),n("bd86")),o=n("2f62");function u(e,t){var n=Object.keys(e);return Object.getOwnPropertySymbols&&n.push.apply(n,Object.getOwnPropertySymbols(e)),t&&(n=n.filter(function(t){return Object.getOwnPropertyDescriptor(e,t).enumerable})),n}function i(e){for(var t=1;t<arguments.length;t++){var n=null!=arguments[t]?arguments[t]:{};t%2?u(n,!0).forEach(function(t){Object(c["a"])(e,t,n[t])}):Object.getOwnPropertyDescriptors?Object.defineProperties(e,Object.getOwnPropertyDescriptors(n)):u(n).forEach(function(t){Object.defineProperty(e,t,Object.getOwnPropertyDescriptor(n,t))})}return e}var f={name:"app",computed:i({},Object(o["c"])(["me"])),methods:i({},Object(o["b"])(["logout"]))},l=f,d=(n("034f"),n("2877")),p=Object(d["a"])(l,a,s,!1,null,null,null),b=p.exports,m=n("8c4f"),j=(n("96cf"),n("3b8d")),g=(n("6762"),n("2fdb"),n("2ce5")),h=n("c1df"),v=n.n(h);r["default"].use(o["a"]);var y=new o["a"].Store({state:{me:null,years:{},selectableYears:[],loggingIn:!1,loginError:null},mutations:{loginStart:function(e){return e.loggingIn=!0},loginStop:function(e,t){e.loggingIn=!1,e.loginError=t},updateMe:function(e,t){e.me=t},updateYears:function(e,t){e.years=t},updateSelectableYears:function(e,t){e.selectableYears=t}},actions:{getYears:function(){var e=Object(j["a"])(regeneratorRuntime.mark(function e(t){var n,r,a,s,c;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return n=t.commit,e.prev=1,e.next=4,g["a"].years();case 4:return r=e.sent,a=r.data,s={},c=[],e.next=10,a.forEach(function(){var e=Object(j["a"])(regeneratorRuntime.mark(function e(t){var n,r,a;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,g["a"].getTotalPerMonthForYear(t.dateyear);case 2:n=e.sent,r=n.data,r.forEach(function(e){e.datemonth=v()("".concat(t.dateyear,"-").concat(e.datemonth,"-01")).format()}),a=r.map(function(e){return e.datemonth}),[1,2,3,4,5,6,7,8,9,10,11,12].forEach(function(e){a.includes(e)||r.push({amount:0,datemonth:v()("".concat(t.dateyear,"-").concat(e,"-01")).format()})}),s[t.dateyear]={},s[t.dateyear].amount=t.amount,s[t.dateyear].months=r,c.push(t.dateyear);case 11:case"end":return e.stop()}},e)}));return function(t){return e.apply(this,arguments)}}());case 10:n("updateSelectableYears",c),n("updateYears",s),e.next=17;break;case 14:e.prev=14,e.t0=e["catch"](1),console.log(e.t0);case 17:case"end":return e.stop()}},e,null,[[1,14]])}));function t(t){return e.apply(this,arguments)}return t}(),login:function(){var e=Object(j["a"])(regeneratorRuntime.mark(function e(t,n){var r;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return r=t.commit,r("loginStart"),e.prev=2,e.next=5,x.login(n);case 5:R.push("/"),e.next=12;break;case 8:e.prev=8,e.t0=e["catch"](2),r("loginStop",e.t0.response),r("updateMe",null);case 12:case"end":return e.stop()}},e,null,[[2,8]])}));function t(t,n){return e.apply(this,arguments)}return t}(),logout:function(){var e=Object(j["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,x.logout();case 2:x.remove(),R.push("/login");case 4:case"end":return e.stop()}},e)}));function t(){return e.apply(this,arguments)}return t}()}}),w=n("bc3a"),k=n.n(w),x={user:function(){return y.state.me},check:function(){return y.state.me?y.state.me:sessionStorage.getItem("me")?(y.commit("updateMe",JSON.parse(sessionStorage.getItem("me"))),y.state.me):void 0},store:function(e){if(e)return sessionStorage.setItem("me",JSON.stringify(e)),y.commit("updateMe",e),y.state.me},remove:function(){sessionStorage.removeItem("me"),y.commit("updateMe",null)},get:function(){var e=Object(j["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,k.a.get("/api/user/getme");case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)}));function t(){return e.apply(this,arguments)}return t}(),login:function(){var e=Object(j["a"])(regeneratorRuntime.mark(function e(t){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,k.a.post("/api/login",t);case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)}));function t(t){return e.apply(this,arguments)}return t}(),logout:function(){var e=Object(j["a"])(regeneratorRuntime.mark(function e(){return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:return e.next=2,k.a.post("/api/logout");case 2:return e.abrupt("return",e.sent);case 3:case"end":return e.stop()}},e)}));function t(){return e.apply(this,arguments)}return t}()},O={guest:function(e,t,n){x.check()?n("/"):n()},auth:function(){var e=Object(j["a"])(regeneratorRuntime.mark(function e(t,n,r){var a;return regeneratorRuntime.wrap(function(e){while(1)switch(e.prev=e.next){case 0:if(!x.check()){e.next=4;break}r(),e.next=15;break;case 4:return e.prev=4,e.next=7,x.get();case 7:a=e.sent,x.store(a.data),r(),e.next=15;break;case 12:e.prev=12,e.t0=e["catch"](4),r({path:"/login"});case 15:case"end":return e.stop()}},e,null,[[4,12]])}));function t(t,n,r){return e.apply(this,arguments)}return t}()};r["default"].use(m["a"]);var R=new m["a"]({routes:[{path:"/login",name:"login",component:function(){return n.e("login").then(n.bind(null,"a55b"))},beforeEnter:O.guest},{path:"/",name:"home",component:function(){return n.e("dashboard").then(n.bind(null,"7277"))},beforeEnter:O.auth}]}),S=n("5f5b"),z=n("7ee8"),P=n.n(z),E=n("f827"),T=n.n(E);n("4f8c"),n("20cc"),n("4012"),n("f56e"),n("0eaa"),n("f9e3"),n("2dd8");r["default"].use(P.a),r["default"].component(T.a.name,T.a),r["default"].use(S["a"]),r["default"].config.productionTip=!1,new r["default"]({router:R,store:y,render:function(e){return e(b)}}).$mount("#app")},"64a9":function(e,t,n){}});
//# sourceMappingURL=index.d9583b93.js.map