(self["webpackChunkfireformily"]=self["webpackChunkfireformily"]||[]).push([[72,553],{27965:function(e,o,n){"use strict";n.r(o),n.d(o,{default:function(){return w}});var r=n(2824),t=n(67294),l=n(28991),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M300 328a60 60 0 10120 0 60 60 0 10-120 0zM852 64H172c-17.7 0-32 14.3-32 32v660c0 17.7 14.3 32 32 32h680c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-32 660H204V128h616v596zM604 328a60 60 0 10120 0 60 60 0 10-120 0zm250.2 556H169.8c-16.5 0-29.8 14.3-29.8 32v36c0 4.4 3.3 8 7.4 8h729.1c4.1 0 7.4-3.6 7.4-8v-36c.1-17.7-13.2-32-29.7-32zM664 508H360c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"}}]},name:"robot",theme:"outlined"},a=c,s=n(30076),p=function(e,o){return t.createElement(s.Z,(0,l.Z)((0,l.Z)({},e),{},{ref:o,icon:a}))};p.displayName="RobotOutlined";var d=t.forwardRef(p),i=n(36158),u=n(49229),m=n(18042),v=n(48429),g=n(63628),f=e=>{var o=new WeakMap,n=e=>{if(Array.isArray(e))return e.map(n);if("function"===typeof e)return"f ".concat(e.displayName||e.name,"(){ }");if("object"===typeof e){if(o.get(e))return"#CircularReference";if(!e)return e;if("$$typeof"in e&&"_owner"in e)return o.set(e,!0),"#ReactNode";if(e.toJS)return o.set(e,!0),e.toJS();if(e.toJSON)return o.set(e,!0),e.toJSON();o.set(e,!0);var r={};for(var t in e)r[t]=n(e[t]);return o.set(e,!1),r}return e};return JSON.stringify(n(e),null,2)},h=(n(56741),4),x="https://unpkg.com/china-location@2.1.0/dist/location.json",y=e=>{var o=[],n=Object.values(e).map(((e,n)=>{if(!(n>h))return o.push({code:e.code,name:e.name}),e.children=Object.values(e.cities).map(((n,t)=>{if(t>h)return null;var l=n.code===e.code?"".concat(n.code,"00"):n.code;return o.push({code:l,name:n.name,parent:e.code}),n.children=Object.entries(n.districts).map(((n,t)=>{var c=(0,r.default)(n,2),a=c[0],s=c[1];if(!(t>h)){var p=a===l||a==e.code?"".concat(a,"0000"):a;return o.push({code:p,name:s,parent:l}),{code:a,name:s}}})).filter(Boolean),n})).filter(Boolean),e})).filter(Boolean);return{flatten:o,tree:n}},b=e=>fetch(x).then((e=>e.json())).then((e=>y(e))).then((o=>{var n=o.flatten;return n.filter((o=>o.parent===e))})),$=()=>fetch(x).then((e=>e.json())).then((e=>y(e))).then((e=>{var o=e.tree,n=null===o||void 0===o?void 0:o.map(((e,o)=>{var n;if(!(o>h))return{label:e.name,value:e.code,isLeaf:!1,children:null===(n=e.children)||void 0===n?void 0:n.map(((o,n)=>{if(!(n>h))return{label:o.name,value:o.code===e.code?"".concat(o.code,"00"):o.code,isLeaf:!1,children:o.children.map(((e,o)=>{if(!(n>h))return{label:e.name,value:e.code,isLeaf:!0}})).filter(Boolean)}})).filter(Boolean)}})).filter(Boolean);return n})),E=e=>{var o=[void 0,...e.map((e=>e.value))],n=e[e.length-1],r=Boolean(e.find((e=>void 0===e.label||e.__init)));return r?Promise.all(o.map(b)).then((e=>{var n=e.reduceRight(((e,n,r)=>e?n.map((n=>{var t=n.code===o[r+1];return{value:n.code,label:n.name,isLeaf:!1,children:t?e:void 0}})):n.map((e=>({value:e.code,label:e.name,isLeaf:!0})))),null);return n})):b(null===n||void 0===n?void 0:n.value).then((e=>e.map((e=>({value:e.code,label:e.name,isLeaf:3===o.length})))))},N=(e,o)=>{console.log("LABEL:",e);try{console.group(f(o))}catch(n){console.log("stringify error, origin: ",o)}console.groupEnd()},S={update:{load:e=>(N("add load args",e),Promise.resolve(e.$record)),cancel:e=>{N("add cancel args",e)},submit:(e,o)=>(N("add submit args",{data:e,scope:o}),Promise.resolve())}},O=(0,u.Np)(),j=e=>{var o,n=(0,t.useState)(""),l=(0,r.default)(n,2),c=l[0],a=l[1],s=(0,t.useMemo)((()=>c.split("-").filter((e=>""!=e)).map(Number).filter((e=>!Number.isNaN(e)))),[c]),p=null===(o=g.TreeBase.useNode)||void 0===o?void 0:o.call(g.TreeBase,s);return t.createElement("div",null,t.createElement("div",null,"Input Node Pos"),t.createElement(i.II,{placeholder:"\u4f8b\u5982: 2-0-1",value:c,onChange:e=>a(e.target.value)}),t.createElement(v.Z,{type:p&&s.length>0?"primary":"dashed",onClick:()=>{p?(console.groupCollapsed("\u70b9\u51fb\u67e5\u770b node scope"),console.group("---node.$pos"),console.log(f(p.$pos)),console.groupEnd(),console.group("---node.$record"),console.log(f(p.$record)),console.groupEnd(),console.group("---node.$index"),console.log(f(p.$index)),console.groupEnd(),console.group("---node.$records"),console.log(f(p.$records)),console.groupEnd(),console.group("---node.$extra"),console.log(f(p.$extra)),console.groupEnd(),console.group("---node.$root"),console.log(f(p.$root)),console.groupEnd()):console.log("---not found node by pos",s)}},"LOOK NODE SCOPE"))},I=()=>{var e=(0,g.useExpressionScope)();return t.createElement(d,{onClick:()=>{console.groupCollapsed("\u70b9\u51fb\u67e5\u770b scope"),console.group("---scope.$pos"),console.log(f(e.$pos)),console.groupEnd(),console.group("---scope.$record"),console.log(f(e.$record)),console.groupEnd(),console.group("---scope.$index"),console.log(f(e.$index)),console.groupEnd(),console.group("---scope.$records"),console.log(f(e.$records)),console.groupEnd(),console.group("---scope.$extra"),console.log(f(e.$extra)),console.groupEnd(),console.group("---scope.$root"),console.log(f(e.$root)),console.groupEnd()}})},T=e=>t.createElement("div",null,"\u5171\u6709 ".concat(e.count," \u4e2a\u4e0b\u7ea7")),B=e=>{var o=(0,g.useExpressionScope)();return t.createElement("div",{style:{margin:"8px 0"}},t.createElement("hr",null),"SHOULD BE FOOTER",t.createElement(v.Z,{size:"small",onClick:()=>o.$lookup.children.push({value:o.$pos.join("+"),label:"neo"}),type:"primary"},"index: ",o.$index," | length: ",o.$records.length," | pos: ",o.$pos.join(","),e.hidden?"true":"false"))},C=(0,m.createSchemaField)({components:{TreeNodes:g.TreeNodes,Space:i.T,PopActions:g.PopActions,NodeHeader:T,NodeFooter:B,Debug:j,ScopeLogger:I,Input:i.II,FormItem:i.xJ},scope:{loadData:E,loadAll:$,actions:S}}),L={type:"object",properties:{layout:{type:"void","x-component":"Space","x-component-props":{style:{display:"flex",justifyContent:"space-between"}},properties:{tree:{type:"object","x-decorator":"FormItem","x-component":"TreeNodes","x-component-props":{loadData:"{{loadData}}",loadAll:"{{loadAll}}",checkable:!0,selectable:!0,draggable:!0,layout:{align:"top"}},items:{type:"object",properties:{pos:{type:"void","x-component":"TreeNodes.Pos"},label:{type:"string","x-visible":"{{$record !== $root}}","x-component":"Input","x-component-props":{size:"small",style:{width:"140px"}}},moveup:{type:"void","x-component":"TreeNodes.Move","x-component-props":{to:"up"}},movedown:{type:"void","x-component":"TreeNodes.Move","x-component-props":{to:"down"}},remove:{type:"void","x-component":"TreeNodes.Remove"},copy:{type:"void","x-component":"TreeNodes.Copy","x-component-props":{clone:e=>JSON.parse(JSON.stringify(e,((e,o)=>"value"===e?"clone_".concat(o):o)))}},add:{title:"{{$record === $root ? '\u6dfb\u52a0\u6839\u8282\u70b9': ''}}",type:"void","x-component":"TreeNodes.Append","x-component-props":{factory:e=>{var o,n,r,t;return{label:"".concat(e.label,"\u4e4b ").concat(null!==(o=null===(n=e.children)||void 0===n?void 0:n.length)&&void 0!==o?o:0," \u5b50"),value:"".concat(e.value).concat(null!==(r=null===(t=e.children)||void 0===t?void 0:t.length)&&void 0!==r?r:0)}}}},edit:{title:"\u7f16\u8f91","x-visible":"{{$record !== $root}}",type:"object","x-component":"PopActions","x-component-props":{actions:"{{actions.update}}"},properties:{label:{type:"string","x-decorator":"FormItem","x-component":"Input"},value:{type:"string","x-decorator":"FormItem","x-component":"Input"}}},scopelog:{type:"void","x-component":"ScopeLogger"}}},properties:{code:{type:"object","x-component":"Debug"}}}}}}},k=()=>t.createElement(m.FormProvider,{form:O},t.createElement(C,{schema:L})),w=k}}]);