(self["webpackChunkfireformily"]=self["webpackChunkfireformily"]||[]).push([[191],{82511:function(e,t,o){"use strict";o.r(t),o.d(t,{QueryListAll:function(){return S},default:function(){return A}});var r=o(36158),n=o(63224),a=o(9364),p=o(67294),i=o(49229),s=o(18042),c=o(60958),l=o(56051),m=o.n(l),d=o(35139);d.We.setLocale("zh_CN");var x,u,y=(e,t)=>{console.log("LABEL:",e);try{console.group(JSON.parse(JSON.stringify(t)))}catch(o){console.log("stringify error, origin: ",t)}console.groupEnd()},b=e=>{var t=e.params,o=e.pagination,r=e.sorter,n=e.filters,a=e.extra;y("search sevice args ",{params:t,pagination:o,sorter:r,filters:n,extra:a});var p=t||{},i=p.start,s=void 0===i?m()().toDate():i,c=p.end,l=void 0===c?m()().add(1,"year").toDate():c,x=p.classify,u=p.status,b=p.domain,v=o||{},g=v.current,f=v.pageSize;return Promise.resolve().then((()=>new Promise((e=>{setTimeout((()=>{var t=45,o=Array.from({length:g*f>t?t%f:f}).map(((e,t)=>({id:g*f+t,status:null!==u&&void 0!==u?u:+d.We.random.numeric(1)%5,domain:"".concat(b?"".concat(b,"."):"").concat(d.We.internet.domainName()),subdomains:Array.from(new Set(Array.from({length:Math.floor(3*Math.random())}).map((()=>d.We.internet.domainName())))).map((e=>({owner:d.We.company.name(),domain:e}))),classify:null!==x&&void 0!==x?x:Array.from(new Set(Array.from({length:Math.floor(3*Math.random())}).map((()=>+d.We.random.numeric(1)%5)))),date:m()(d.We.date.between(s,l)).format("YYYY-MM-DD"),img:d.We.image.avatar(),desc:d.We.lorem.paragraph()})));y("search response ",{list:o,total:t}),e({list:o,total:t})}),456)}))))},v=(e,t,o,r)=>(y("on sort args ",{oldIndex:e,neoIndex:t,array:o,scope:r}),Promise.resolve()),g={batch:{load:e=>(y("batch load args",e),Promise.resolve(e.$record)),cancel:e=>{y("batch cancel args",e)},submit:(e,t)=>(y("batch submit args",{data:e,scope:t}),Promise.resolve())},add:{load:e=>(y("add load args",e),Promise.resolve(e.$record)),cancel:e=>{y("add cancel args",e)},submit:(e,t)=>(y("add submit args",{data:e,scope:t}),Promise.resolve())},update:{load:e=>(y("update load args",e),Promise.resolve(e.$record)),cancel:e=>{y("update cancel args",e)},submit:(e,t)=>(y("update submit args",{data:e,scope:t}),Promise.resolve())},remove:{load:e=>(y("remove load args",e),Promise.resolve(e.$record)),cancel:e=>{y("remove cancel args",e)},submit:(e,t)=>(y("remove submit args",{data:e,scope:t}),Promise.resolve())}},f={bool:()=>{(0,c.registerDictLoader)("bool",(e=>Promise.resolve([{label:"\u662f",value:1,color:"success"},{label:"\u5426",value:0,color:"error"}]).then((t=>e(t)))))},status:()=>{(0,c.registerDictLoader)("status",(e=>Promise.resolve([{label:"\u5df2\u4e0a\u7ebf",value:0,color:"success"},{label:"\u8fd0\u884c\u4e2d",value:1,color:"processing"},{label:"\u5173\u95ed",value:2,color:"default"},{label:"\u5df2\u5b95\u673a",value:3,color:"error"},{label:"\u5df2\u8d85\u8f7d",value:4,color:"warning"}]).then((t=>e(t)))))},classify:()=>{(0,c.registerDictLoader)("classify",(e=>Promise.resolve([{label:"\u6587\u827a",value:0},{label:"\u559c\u5267",value:1},{label:"\u7231\u60c5",value:2},{label:"\u52a8\u753b",value:3},{label:"\u60ac\u7591",value:4},{label:"\u79d1\u5e7b",value:5}]).then((t=>e(t)))))}},I=(0,s.createSchemaField)({components:{QueryList:c.QueryList,QueryForm:c.QueryForm,FormItem:r.xJ,Input:r.II,Select:r.Ph,FormGrid:r.T5,FormLayout:r.lt,DatePicker:r.Mt,Editable:r.CX,QueryTable:c.QueryTable,ArrayTable:r.hf,PopActions:c.PopActions,ImageView:c.ImageView,Dict:c.Dict,LongText:c.LongText,Space:r.T},scope:{service:b,onSort:v,actions:g}}),h=(0,i.Np)({effects(e){(0,c.dictEffects)(e)}});f.bool(),f.status(),f.classify();var P=()=>({properties:{domain:{title:"\u57df\u540d",type:"string",required:!0,"x-decorator":"FormItem","x-component":"Input"},classify:{title:"\u5206\u7c7b",type:"string","x-decorator":"FormItem","x-component":"Select","x-component-props":{mode:"multiple"},"x-data":{dict:"classify"}},status:{title:"\u72b6\u6001",type:"string","x-decorator":"FormItem","x-component":"Select","x-data":{dict:"status"}},date:{title:"\u4e0a\u7ebf\u65f6\u95f4",type:"string","x-decorator":"FormItem","x-component":"DatePicker"}}}),F={type:"object","x-component":"QueryForm","x-decorator":"FormLayout","x-decorator-props":{layout:"vertical"},properties:{domain:{title:"\u57df\u540d",type:"string","x-decorator":"FormItem","x-component":"Input"},classify:{title:"\u5206\u7c7b",type:"string","x-decorator":"FormItem","x-component":"Select","x-component-props":{mode:"multiple"},"x-data":{dict:"classify"}},status:{title:"\u72b6\u6001",type:"string","x-decorator":"FormItem","x-component":"Select","x-data":{dict:"status"}},"[start, end]":{title:"\u65e5\u671f\u533a\u95f4",type:"string","x-decorator":"FormItem","x-decorator-props":{gridSpan:2},"x-component":"DatePicker.RangePicker"}}},T={title:"\u67e5\u8be2\u5217\u8868",type:"void","x-component":"QueryTable.Titlebar",properties:{selection:{type:"void","x-component":"QueryTable.Selection",properties:{batchExp:{type:"object",title:"\u6279\u91cf\u5bfc\u51fa","x-component":"PopActions.Popover","x-component-props":{actions:"{{actions.batch}}"}},batchDelete:{type:"object",title:"\u6279\u91cf\u5220\u9664","x-component":"PopActions.Popconfirm","x-component-props":{actions:"{{actions.batch}}"}}}},popover:{title:"\u65b0\u589e",type:"object","x-content":"Popover content","x-component":"PopActions","x-component-props":{actions:"{{actions.add}}",type:"primary"},properties:null===(x=P())||void 0===x?void 0:x.properties}}},Q={type:"array","x-decorator":"FormItem","x-component":"QueryTable","x-component-props":{scroll:{x:"100%"},onSort:"{{onSort}}",expandable:{rowExpandable:e=>e.subdomains.length>0}},items:{type:"object",properties:{sort:{type:"void","x-component":"QueryTable.Column","x-component-props":{width:80,title:"\u6392\u5e8f",align:"center"},properties:{sort:{type:"void","x-component":"QueryTable.SortHandle"}}},index:{type:"void","x-component":"QueryTable.Column","x-component-props":{width:80,title:"\u5e8f\u53f7",align:"center"},properties:{index:{type:"void","x-component":"QueryTable.Index"}}},id:{type:"void","x-component":"QueryTable.Column","x-component-props":{title:"ID",sorter:(e,t)=>e.id-t.id},properties:{id:{type:"string","x-read-pretty":!0,"x-decorator":"FormItem","x-component":"Input"}}},status:{type:"void","x-component":"QueryTable.Column","x-component-props":{title:"\u72b6\u6001"},properties:{status:{type:"string","x-read-pretty":!0,"x-data":{dict:"status"},"x-decorator":"FormItem","x-component":"Select","x-component-props":{type:"badge"}}}},domain:{type:"void","x-component":"QueryTable.Column","x-component-props":{title:"\u57df\u540d",filters:"{{$records ? $records.reduce((list, record) => {\n              if (list.find(x => record.domain.includes(x.value))) return list;\n              const parts = record.domain.split('.');\n              list.push({ text: '.'+parts[parts.length - 1],  value: '.'+parts[parts.length - 1] });\n              return list;\n            }, []): []}}",onFilter:(e,t)=>t.domain.includes(e)},properties:{domain:{type:"string","x-decorator":"FormItem","x-component":"LongText"}}},classify:{type:"void","x-component":"QueryTable.Column","x-component-props":{title:"\u7c7b\u578b\u6807\u7b7e"},properties:{classify:{type:"array","x-read-pretty":!0,"x-decorator":"FormItem","x-component":"Select","x-component-props":{type:"tag",mode:"multiple"},"x-data":{dict:"classify"}}}},img:{type:"void","x-component":"QueryTable.Column","x-component-props":{title:"\u56fe\u7247"},properties:{img:{type:"string","x-decorator":"FormItem","x-component":"ImageView"}}},date:{type:"void","x-component":"QueryTable.Column","x-component-props":{title:"\u4e0a\u7ebf\u65f6\u95f4"},properties:{date:{type:"string","x-read-pretty":!0,"x-decorator":"FormItem","x-component":"DatePicker"}}},operations:{type:"void","x-component":"QueryTable.Operations","x-component-props":{title:"\u64cd\u4f5c",width:"240px",fixed:"right"},properties:{popconfirm:{title:"\u5220\u9664",type:"object","x-content":"\u786e\u5b9a\u8981\u5220\u9664\u8fd9\u4e00\u6761\u8bb0\u5f55\u5417?","x-component":"PopActions.Popconfirm","x-component-props":{actions:"{{actions.remove}}"},properties:{}},drawer:{title:"\u7f16\u8f91",type:"object","x-content":"Drawer content","x-component":"PopActions.Drawer","x-component-props":{actions:"{{actions.update}}"},properties:null===(u=P())||void 0===u?void 0:u.properties}}}}},properties:{expandable:{type:"void","x-component":"QueryTable.Expandable",properties:{subdomains:{type:"void","x-component":"QueryList",properties:{titlebar:{type:"void",title:"\u4e8c\u7ea7\u57df\u540d","x-component":"QueryTable.Titlebar",properties:{add:{title:"\u65b0\u589e",type:"object","x-content":"Modal content","x-component":"PopActions","x-component-props":{actions:"{{actions.add}}"},properties:{owner:{title:"Owner",type:"string","x-decorator":"FormItem","x-component":"Input"},domain:{title:"\u57df\u540d",type:"string","x-decorator":"FormItem","x-component":"Input"}}}}},subdomains:{type:"array","x-component":"QueryTable",items:{type:"object",properties:{owner:{type:"void","x-component":"QueryTable.Column","x-component-props":{title:"Owner"},properties:{owner:{type:"string","x-read-pretty":!0,"x-decorator":"FormItem","x-component":"Input"}}},domain:{type:"void","x-component":"QueryTable.Column","x-component-props":{title:"\u57df\u540d"},properties:{domain:{type:"string","x-read-pretty":!0,"x-decorator":"FormItem","x-component":"Input"}}},operations:{type:"void","x-component":"QueryTable.Operations","x-component-props":{title:"\u64cd\u4f5c",width:"200px"},properties:{popconfirm:{title:"\u5220\u9664",type:"object","x-content":"\u786e\u5b9a\u8981\u5220\u9664\u8fd9\u4e00\u6761\u8bb0\u5f55\u5417?","x-component":"PopActions.Popconfirm","x-component-props":{actions:"{{actions.remove}}"},properties:{}},drawer:{title:"\u7f16\u8f91",type:"object","x-content":"Drawer content","x-component":"PopActions","x-component-props":{actions:"{{actions.update}}"},properties:{owner:{type:"string","x-decorator":"FormItem","x-component":"Input"},domain:{type:"string","x-decorator":"FormItem","x-component":"Input"}}}}}}}}}}}}}},w={type:"object",properties:{querylist:{type:"void","x-component":"QueryList","x-component-props":{size:"small",service:"{{service}}"},properties:{query:F,titlebar:T,list:Q}}}},S=()=>p.createElement("div",{style:{padding:"20px"}},p.createElement(n.ZP,{locale:a.Z},p.createElement(s.FormProvider,{form:h},p.createElement(I,{schema:w})))),A=S}}]);