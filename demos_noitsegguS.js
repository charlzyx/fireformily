(self["webpackChunkfireformily"]=self["webpackChunkfireformily"]||[]).push([[539,553],{13858:function(e,t,o){"use strict";o.r(t),o.d(t,{default:function(){return b}});var n=o(36158),r=o(49229),s=o(18042),l=o(96748),p=o(67294),u=o(92176),i=o.n(u),a=o(92090),c=o.n(a),m=e=>{console.log("search params",e);var t=c().stringify({code:"utf-8",q:e.kw});return i()("https://suggest.taobao.com/sug?".concat(t)).then((e=>e.json())).then((e=>{var t=e.result,o=t.map((e=>({value:e[0],label:e[0]})));return o}))},g=e=>p.createElement("div",null,p.createElement("pre",null,p.createElement("code",null,JSON.stringify(e.value,null,2)))),d=(0,s.createSchemaField)({components:{FormGrid:n.T5,FormLayout:n.lt,FormItem:n.xJ,Suggestion:l.Suggestion,Code:g},scope:{suggest:m}}),x=(0,r.Np)({effects(e){}}),f={type:"object",properties:{layout:{type:"void","x-decorator":"FormLayout","x-decorator-props":{layout:"vertical"},"x-component":"FormGrid","x-component-props":{maxColumns:4,minColumns:2},properties:{s1:{title:"\u6dd8\u5b9d\u641c\u7d22",description:"string",type:"string","x-decorator":"FormItem","x-component":"Suggestion","x-component-props":{suggest:"{{suggest}}"}},s2:{title:"\u6dd8\u5b9d\u641c\u7d22",description:"labelInValue",type:"string","x-decorator":"FormItem","x-component":"Suggestion","x-component-props":{labelInValue:!0,suggest:"{{suggest}}"}},s3:{title:"\u6dd8\u5b9d\u641c\u7d22",description:"multiple",type:"string","x-decorator":"FormItem","x-component":"Suggestion","x-component-props":{multiple:!0,suggest:"{{suggest}}"}},s4:{title:"\u6dd8\u5b9d\u641c\u7d22",description:"multiple & labelInValue",type:"string","x-decorator":"FormItem","x-component":"Suggestion","x-component-props":{multiple:!0,labelInValue:!0,suggest:"{{suggest}}"}},code:{type:"object","x-component":"Code","x-decorator":"FormItem","x-decorator-props":{span:4},"x-reactions":{dependencies:[".s1",".s2",".s3",".s4"],fulfill:{schema:{"x-value":"{{{string: $deps[0], labelInValue: $deps[1], multiple: $deps[2],multipleAndLabelInValue: $deps[3]} }}"}}}}}}}},y=()=>p.createElement(s.FormProvider,{form:x},p.createElement(d,{schema:f})),b=y},24654:function(){}}]);