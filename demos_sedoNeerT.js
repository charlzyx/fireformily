(self["webpackChunkfireformily"]=self["webpackChunkfireformily"]||[]).push([[72,553],{22112:function(e,o,n){"use strict";n.r(o),n.d(o,{default:function(){return P}});var t=n(44742),r=n(67294),c=n(45937),l={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M300 328a60 60 0 10120 0 60 60 0 10-120 0zM852 64H172c-17.7 0-32 14.3-32 32v660c0 17.7 14.3 32 32 32h680c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-32 660H204V128h616v596zM604 328a60 60 0 10120 0 60 60 0 10-120 0zm250.2 556H169.8c-16.5 0-29.8 14.3-29.8 32v36c0 4.4 3.3 8 7.4 8h729.1c4.1 0 7.4-3.6 7.4-8v-36c.1-17.7-13.2-32-29.7-32zM664 508H360c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"}}]},name:"robot",theme:"outlined"},a=l,s=n(30076),p=function(e,o){return r.createElement(s.Z,(0,c.Z)((0,c.Z)({},e),{},{ref:o,icon:a}))};p.displayName="RobotOutlined";var i=r.forwardRef(p),d=n(36158),u=n(49229),m=n(18042),g=n(48429),v=n(96748),f="https://unpkg.com/china-location@2.1.0/dist/location.json",y=e=>{var o=[],n=4,r=Object.values(e).map(((e,r)=>{if(!(r>n))return o.push({code:e.code,name:e.name}),e.children=Object.values(e.cities).map(((r,c)=>{if(c>n)return null;var l=r.code===e.code?"".concat(r.code,"00"):r.code;return o.push({code:l,name:r.name,parent:e.code}),r.children=Object.entries(r.districts).map(((r,c)=>{var a=(0,t.default)(r,2),s=a[0],p=a[1];if(!(c>n)){var i=s===l||s==e.code?"".concat(s,"0000"):s;return o.push({code:i,name:p,parent:l}),{code:s,name:p}}})).filter(Boolean),r})).filter(Boolean),e})).filter(Boolean);return{flatten:o,tree:r}},h=e=>fetch(f).then((e=>e.json())).then((e=>y(e))).then((o=>{var n=o.flatten;return n.filter((o=>o.parent===e))})),x=e=>{var o=[void 0,...e.map((e=>e.value))],n=e[e.length-1],t=Boolean(e.find((e=>void 0===e.label||e.__init)));return t?Promise.all(o.map(h)).then((e=>{var n=e.reduceRight(((e,n,t)=>e?n.map((n=>{var r=n.code===o[t+1];return{value:n.code,label:n.name,isLeaf:!1,children:r?e:void 0}})):n.map((e=>({value:e.code,label:e.name,isLeaf:!0})))),null);return n})):h(null===n||void 0===n?void 0:n.value).then((e=>e.map((e=>({value:e.code,label:e.name,isLeaf:3===o.length})))))},b=(e,o)=>{console.log("LABEL:",e);try{console.group((0,v.safeStringify)(o))}catch(n){console.log("stringify error, origin: ",o)}console.groupEnd()},E={update:{load:e=>(b("add load args",e),Promise.resolve(e.$record)),cancel:e=>{b("add cancel args",e)},submit:(e,o)=>(b("add submit args",{data:e,scope:o}),Promise.resolve())}},$=(0,u.Np)(),S=e=>{var o,n=(0,r.useState)(""),c=(0,t.default)(n,2),l=c[0],a=c[1],s=(0,r.useMemo)((()=>l.split("-").filter((e=>""!=e)).map(Number).filter((e=>!Number.isNaN(e)))),[l]),p=null===(o=v.TreeBase.usePosNode)||void 0===o?void 0:o.call(v.TreeBase,s);return r.createElement("div",null,r.createElement("div",null,"Input Node Pos"),r.createElement(d.II,{placeholder:"\u4f8b\u5982: 2-0-1",value:l,onChange:e=>a(e.target.value)}),r.createElement(g.Z,{type:p&&s.length>0?"primary":"dashed",onClick:()=>{p?(console.groupCollapsed("\u70b9\u51fb\u67e5\u770b node scope"),console.group("---node.$pos"),console.log((0,v.safeStringify)(p.$pos)),console.groupEnd(),console.group("---node.$record"),console.log((0,v.safeStringify)(p.$record)),console.groupEnd(),console.group("---node.$index"),console.log((0,v.safeStringify)(p.$index)),console.groupEnd(),console.group("---node.$records"),console.log((0,v.safeStringify)(p.$records)),console.groupEnd(),console.group("---node.$extra"),console.log((0,v.safeStringify)(p.$extra)),console.groupEnd(),console.group("---node.$root"),console.log((0,v.safeStringify)(p.$root)),console.groupEnd()):console.log("---not found node by pos",s)}},"LOOK NODE SCOPE"))},N=()=>{var e=(0,m.useExpressionScope)();return r.createElement(i,{onClick:()=>{console.groupCollapsed("\u70b9\u51fb\u67e5\u770b scope"),console.group("---scope.$pos"),console.log((0,v.safeStringify)(e.$pos)),console.groupEnd(),console.group("---scope.$record"),console.log((0,v.safeStringify)(e.$record)),console.groupEnd(),console.group("---scope.$index"),console.log((0,v.safeStringify)(e.$index)),console.groupEnd(),console.group("---scope.$records"),console.log((0,v.safeStringify)(e.$records)),console.groupEnd(),console.group("---scope.$extra"),console.log((0,v.safeStringify)(e.$extra)),console.groupEnd(),console.group("---scope.$root"),console.log((0,v.safeStringify)(e.$root)),console.groupEnd()}})},j=e=>r.createElement("div",null,"\u5171\u6709 ".concat(e.count," \u4e2a\u4e0b\u7ea7")),I=e=>{var o=(0,m.useExpressionScope)();return r.createElement("div",{style:{margin:"8px 0"}},r.createElement("hr",null),"SHOULD BE FOOTER",r.createElement(g.Z,{size:"small",onClick:()=>o.$lookup.children.push({value:o.$pos.join("+"),label:"neo"}),type:"primary"},"index: ",o.$index," | length: ",o.$records.length," | pos:"," ",o.$pos.join(","),e.hidden?"true":"false"))},O=(0,m.createSchemaField)({components:{TreeNodes:v.TreeNodes,Space:d.T,PopActions:v.PopActions,NodeHeader:j,NodeFooter:I,Debug:S,ScopeLogger:N,Input:d.II,FormItem:d.xJ},scope:{loadData:x,actions:E}}),T={type:"object",properties:{layout:{type:"void","x-component":"Space","x-component-props":{style:{display:"flex",justifyContent:"space-between"}},properties:{tree:{type:"object","x-decorator":"FormItem","x-component":"TreeNodes","x-component-props":{loadData:"{{loadData}}",checkable:!0,selectable:!0,draggable:!0,layout:{align:"top"}},items:{type:"object",properties:{pos:{type:"void","x-component":"TreeNodes.Pos"},label:{type:"string","x-component":"Input","x-component-props":{size:"small",style:{width:"140px"}}},moveup:{type:"void","x-component":"TreeNodes.Move","x-component-props":{to:"up"}},movedown:{type:"void","x-component":"TreeNodes.Move","x-component-props":{to:"down"}},remove:{type:"void","x-component":"TreeNodes.Remove"},copy:{type:"void","x-component":"TreeNodes.Copy","x-component-props":{clone:e=>JSON.parse(JSON.stringify(e,((e,o)=>"value"===e?"clone_".concat(o):o)))}},add:{type:"void","x-component":"TreeNodes.Append","x-component-props":{factory:e=>{var o,n,t,r;return{label:"".concat(e.label,"\u4e4b ").concat(null!==(o=null===(n=e.children)||void 0===n?void 0:n.length)&&void 0!==o?o:0," \u5b50"),value:"".concat(e.value).concat(null!==(t=null===(r=e.children)||void 0===r?void 0:r.length)&&void 0!==t?t:0)}}}},edit:{title:"\u7f16\u8f91",type:"object","x-component":"PopActions","x-component-props":{actions:"{{actions.update}}"},properties:{label:{type:"string","x-decorator":"FormItem","x-component":"Input"},value:{type:"string","x-decorator":"FormItem","x-component":"Input"}}},scopelog:{type:"void","x-component":"ScopeLogger"}}},properties:{code:{type:"object","x-component":"Debug"}}}}}}},C=()=>r.createElement(m.FormProvider,{form:$},r.createElement(O,{schema:T})),P=C}}]);