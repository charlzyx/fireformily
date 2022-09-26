(self["webpackChunkfireformily"]=self["webpackChunkfireformily"]||[]).push([[72,553],{22112:function(e,o,t){"use strict";t.r(o),t.d(o,{default:function(){return C}});var n=t(44742),r=t(67294),a=t(45937),c={icon:{tag:"svg",attrs:{viewBox:"64 64 896 896",focusable:"false"},children:[{tag:"path",attrs:{d:"M300 328a60 60 0 10120 0 60 60 0 10-120 0zM852 64H172c-17.7 0-32 14.3-32 32v660c0 17.7 14.3 32 32 32h680c17.7 0 32-14.3 32-32V96c0-17.7-14.3-32-32-32zm-32 660H204V128h616v596zM604 328a60 60 0 10120 0 60 60 0 10-120 0zm250.2 556H169.8c-16.5 0-29.8 14.3-29.8 32v36c0 4.4 3.3 8 7.4 8h729.1c4.1 0 7.4-3.6 7.4-8v-36c.1-17.7-13.2-32-29.7-32zM664 508H360c-4.4 0-8 3.6-8 8v60c0 4.4 3.6 8 8 8h304c4.4 0 8-3.6 8-8v-60c0-4.4-3.6-8-8-8z"}}]},name:"robot",theme:"outlined"},l=c,s=t(30076),p=function(e,o){return r.createElement(s.Z,(0,a.Z)((0,a.Z)({},e),{},{ref:o,icon:l}))};p.displayName="RobotOutlined";var i=r.forwardRef(p),d=t(36158),m=t(49229),u=t(18042),v=t(48429),f=t(40020),g="https://unpkg.com/china-location@2.1.0/dist/location.json",h=e=>{var o=[],t=4,r=Object.values(e).map(((e,r)=>{if(!(r>t))return o.push({code:e.code,name:e.name}),e.children=Object.values(e.cities).map(((r,a)=>{if(a>t)return null;var c=r.code===e.code?"".concat(r.code,"00"):r.code;return o.push({code:c,name:r.name,parent:e.code}),r.children=Object.entries(r.districts).map(((r,a)=>{var l=(0,n.default)(r,2),s=l[0],p=l[1];if(!(a>t)){var i=s===c||s==e.code?"".concat(s,"0000"):s;return o.push({code:i,name:p,parent:c}),{code:s,name:p}}})).filter(Boolean),r})).filter(Boolean),e})).filter(Boolean);return{flatten:o,tree:r}},y=e=>fetch(g).then((e=>e.json())).then((e=>h(e))).then((o=>{var t=o.flatten;return t.filter((o=>o.parent===e))})),x=e=>{var o=[void 0,...e.map((e=>e.value))],t=e[e.length-1],n=Boolean(e.find((e=>void 0===e.label||e.__init)));return n?Promise.all(o.map(y)).then((e=>{var t=e.reduceRight(((e,t,n)=>e?t.map((t=>{var r=t.code===o[n+1];return{value:t.code,label:t.name,isLeaf:!1,children:r?e:void 0}})):t.map((e=>({value:e.code,label:e.name,isLeaf:!0})))),null);return t})):y(null===t||void 0===t?void 0:t.value).then((e=>e.map((e=>({value:e.code,label:e.name,isLeaf:3===o.length})))))},b=(e,o)=>{console.log("LABEL:",e);try{console.group((0,f.safeStringify)(o))}catch(t){console.log("stringify error, origin: ",o)}console.groupEnd()},E={update:{load:e=>(b("add load args",e),Promise.resolve(e.$record)),cancel:e=>{b("add cancel args",e)},submit:(e,o)=>(b("add submit args",{data:e,scope:o}),Promise.resolve())}},S=(0,m.Np)(),B=e=>{var o,t=(0,r.useState)(""),a=(0,n.default)(t,2),c=a[0],l=a[1],s=null===(o=f.TreeBase.useNodeScope)||void 0===o?void 0:o.call(f.TreeBase,c.split("-").map(Number));return r.createElement("div",null,r.createElement("div",null,"Input Node Pos"),r.createElement(d.II,{placeholder:"\u4f8b\u5982: 2-0-1",value:c,onChange:e=>l(e.target.value)}),r.createElement(v.Z,{onClick:()=>{console.log("node scope",(0,f.safeStringify)(s))}},"LOOK NODE SCOPE"))},T=()=>{var e=(0,u.useExpressionScope)();return r.createElement(i,{onClick:()=>{console.log("---scope.$pos",(0,f.safeStringify)(e.$pos)),console.log("---scope.$index",(0,f.safeStringify)(e.$index)),console.log("---scope.$records.length",(0,f.safeStringify)(e.$records.length)),console.log("---scope.$record",(0,f.safeStringify)(e.$record))}})},$=e=>r.createElement("div",null,"\u5171\u6709 ".concat(e.count," \u4e2a\u4e0b\u7ea7")),N=e=>{var o=(0,u.useExpressionScope)();return r.createElement("div",{style:{margin:"8px 0"}},r.createElement("hr",null),"SHOULD BE FOOTER",r.createElement(v.Z,{size:"small",onClick:()=>o.$lookup.children.push({value:o.$pos.join("+"),label:"neo"}),type:"primary"},"index: ",o.$index," | length: ",o.$records.length," | pos:"," ",o.$pos.join(","),e.hidden?"true":"false"))},O=(0,u.createSchemaField)({components:{TreeNodes:f.TreeNodes,Space:d.T,PopActions:f.PopActions,TreeBase:f.TreeBase,NodeHeader:$,NodeFooter:N,Debug:B,ScopeLogger:T,Input:d.II,FormItem:d.xJ},scope:{loadData:x,actions:E}}),j={type:"object",properties:{layout:{type:"void","x-component":"Space","x-component-props":{style:{display:"flex",justifyContent:"space-between"}},properties:{tree:{type:"object","x-decorator":"FormItem","x-component":"TreeNodes","x-component-props":{loadData:"{{loadData}}"},items:{type:"void",properties:{pos:{type:"void","x-component":"TreeBase.Pos"},label:{type:"string","x-component":"Input","x-component-props":{style:{width:"200px"}}},moveup:{type:"void","x-component":"TreeBase.Move","x-component-props":{to:"up"}},movedown:{type:"void","x-component":"TreeBase.Move","x-component-props":{to:"down"}},remove:{type:"void","x-component":"TreeBase.Remove"},copy:{type:"void","x-component":"TreeBase.Copy","x-component-props":{clone:e=>JSON.parse(JSON.stringify(e,((e,o)=>"value"===e?"clone_".concat(o):o)))}},add:{type:"void","x-component":"TreeBase.Addition","x-component-props":{factory:e=>({label:"".concat(e.label,"\u4e4b ").concat(e.children.length," \u5b50"),value:"".concat(e.value).concat(e.children.length)})}},scopelog:{type:"void","x-component":"ScopeLogger"}}},properties:{code:{type:"object","x-component":"Debug"}}}}}}},k=()=>r.createElement(u.FormProvider,{form:S},r.createElement(O,{schema:j})),C=k}}]);