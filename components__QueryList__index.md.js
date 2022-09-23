(self["webpackChunkfireformily"]=self["webpackChunkfireformily"]||[]).push([[857],{22231:function(e,n,t){"use strict";t.d(n,{m:function(){return a.m}});var a=t(9684);t(72255)},33618:function(e,n,t){"use strict";t.r(n);var a=t(67294),r=t(96089),l=t(88089),i=t(65659),c=a.memo((e=>{var n=e.demos,c=n["querylist-querylistall"].component;return a.createElement(a.Fragment,null,a.createElement(a.Fragment,null,a.createElement("div",{className:"markdown"},a.createElement("h2",{id:"-querylist---\u67e5\u8be2\u8868\u683c"},a.createElement(r.AnchorLink,{to:"#-querylist---\u67e5\u8be2\u8868\u683c","aria-hidden":"true",tabIndex:-1},a.createElement("span",{className:"icon icon-link"})),"\ud83d\ude80 QueryList - \u67e5\u8be2\u8868\u683c"),a.createElement("p",null,"QueryList \u662f\u4e3a\u4e86\u89e3\u51b3\u5e38\u89c1\u7684 CRUD \u67e5\u8be2\u5217\u8868\u7684\u6837\u677f\u4ee3\u7801\u7684\u95ee\u9898\u3002"),a.createElement("p",null,"\u601d\u8def\u57fa\u672c\u4e0a\u5c31\u662f\u7167\u7740\u5b98\u7f51\u6307\u5bfc ",a.createElement(r.Link,{to:"https://formilyjs.org/zh-CN/guide/scenes/query-list#%E6%9F%A5%E8%AF%A2%E5%88%97%E8%A1%A8"},"formilyjs.org/\u67e5\u8be2\u5217\u8868"),", \u5728\u4ea4\u4e92\u5f62\u5f0f\u548c\u914d\u7f6e\u9879\u4e0a\u5219\u66f4\u591a\u662f\u53c2\u8003",a.createElement(r.Link,{to:"https://procomponents.ant.design/components/table"},"ProComponents/ProTable"),";"),a.createElement("p",null,"\u53ef\u4ee5\u7406\u89e3\u4e3a\u662f ProTable \u7684\u4e00\u4e2a formily \u7248\u672c\u7684\u5b9e\u73b0\u3002"),a.createElement("h2",{id:"\u5e03\u5c40\u7ed3\u6784"},a.createElement(r.AnchorLink,{to:"#\u5e03\u5c40\u7ed3\u6784","aria-hidden":"true",tabIndex:-1},a.createElement("span",{className:"icon icon-link"})),"\u5e03\u5c40\u7ed3\u6784"),a.createElement("p",null,a.createElement("img",{src:t(91283),alt:"querylist.jpg"})),a.createElement("blockquote",null,a.createElement("p",null,"\u8fd9\u4e2a\u7ed3\u6784\u53ef\u4ee5\u7167\u8fd9\u6837\u6765\u7406\u89e3, \u81f3\u4e8e Toolbar \u4e3a\u4ec0\u4e48\u5728 QueryTbale \u4e0a, \u662f\u56e0\u4e3a\u5b83\u8ddf QueryTable \u8054\u52a8\u66f4\u591a\u4e00\u4e9b")),a.createElement(i.Z,{code:"<QueryList service={service}>\n  <QueryForm />\n  <QueryTable.Titlebar />\n  <QueryTable />\n</QueryList>",lang:"tsx"}),a.createElement("h2",{id:"\u4ee3\u7801\u6f14\u793a"},a.createElement(r.AnchorLink,{to:"#\u4ee3\u7801\u6f14\u793a","aria-hidden":"true",tabIndex:-1},a.createElement("span",{className:"icon icon-link"})),"\u4ee3\u7801\u6f14\u793a")),a.createElement(l.default,n["querylist-querylistall"].previewerProps,a.createElement(c,null)),a.createElement("div",{className:"markdown"},a.createElement("h2",{id:"api"},a.createElement(r.AnchorLink,{to:"#api","aria-hidden":"true",tabIndex:-1},a.createElement("span",{className:"icon icon-link"})),"API"),a.createElement("h2",{id:"querylist---\u67e5\u8a62\u5217\u8868"},a.createElement(r.AnchorLink,{to:"#querylist---\u67e5\u8a62\u5217\u8868","aria-hidden":"true",tabIndex:-1},a.createElement("span",{className:"icon icon-link"})),"QueryList - \u67e5\u8a62\u5217\u8868"),a.createElement(i.Z,{code:"{\n  scope: {\n    $query: {},\n    $list: []\n  }\n}",lang:"json"}),a.createElement("h3",{id:"querylistservice---\u67e5\u8a62\u670d\u52d9"},a.createElement(r.AnchorLink,{to:"#querylistservice---\u67e5\u8a62\u670d\u52d9","aria-hidden":"true",tabIndex:-1},a.createElement("span",{className:"icon icon-link"})),"QueryList#service - \u67e5\u8a62\u670d\u52d9"),a.createElement("p",null,"\u4e3b\u8981\u8bf7\u6c42\u51fd\u6570, \u8fd4\u56de\u6570\u636e\u5217\u8868\u4e0e\u603b\u6570, \u5165\u53c2\u5305\u62ec\u67e5\u8be2\u8868\u5355, \u5206\u9875\u3001\u7b5b\u9009\u3001\u6392\u5e8f"),a.createElement("p",null,"\u5165\u53c2\u4e0e ",a.createElement(r.Link,{to:"https://ant.design/components/table-cn/#API"},"AntD#Table/onChange")," \u4fdd\u6301\u4e00\u81f4, \u8ffd\u52a0\u4e86 ",a.createElement("code",null,"params")," \u5373\u67e5\u8be2\u8868\u5355\u7684\u53c2\u6570"),a.createElement(i.Z,{code:"type Service = (data:\n{\n  /** \u67e5\u8be2\u8868\u5355\u53c2\u6570 **/\n  params: {}\n  /** \u5206\u9875\u53c2\u6570, \u53c2\u8003 AntD **/\n  pagination: {\n    current: number,\n    pageSize: number\n  },\n  /** \u8fc7\u6ee4\u53c2\u6570, \u53c2\u8003 AntD **/\n  filters: [],\n  /** \u6392\u5e8f\u53c2\u6570, \u53c2\u8003 AntD **/\n  sorter: {},\n  /** \u989d\u5916\u4fe1\u606f, \u53c2\u8003 AntD **/\n  extra: {\n    action: 'paginate' | 'sort' | 'filter',\n    currentDataSouce: Record[]\n  }\n}) => Promise<{ list: Record[], total: number }>",lang:"ts"}),a.createElement("h3",{id:"querylistprops---\u5176\u4ed6\u914d\u7f6e\u9879"},a.createElement(r.AnchorLink,{to:"#querylistprops---\u5176\u4ed6\u914d\u7f6e\u9879","aria-hidden":"true",tabIndex:-1},a.createElement("span",{className:"icon icon-link"})),"QueryList#props - \u5176\u4ed6\u914d\u7f6e\u9879"),a.createElement(i.Z,{code:"/** \u9996\u6b21\u81ea\u52a8\u5237\u65b0, \u4e0d\u4e3a false \u5373\u9ed8\u8ba4\u5f00\u542f */\n  autoload?: boolean;\n  /** filter \u662f\u5426\u662f\u8fdc\u7a0b\u5904\u7406 */\n  filterRemote?: boolean;\n  /** sort \u662f\u5426\u662f\u8fdc\u7a0b\u5904\u7406 */\n  sortRemote?: boolean;\n  /** size \u5927\u5c0f */\n  size: 'default' | 'middle' | 'small';\n  /** \u662f\u5426\u5c06\u67e5\u8be2\u53c2\u6570\u540c\u6b65\u5230url\u4e0a */\n  syncUrl?: boolean;\n  /** \u5206\u9875\u5927\u5c0f, \u9ed8\u8ba4 10 */\n  pageSize?: number;",lang:"ts"}),a.createElement("h2",{id:"queryform---\u67e5\u8a62\u689d\u4ef6\u8868\u55ae"},a.createElement(r.AnchorLink,{to:"#queryform---\u67e5\u8a62\u689d\u4ef6\u8868\u55ae","aria-hidden":"true",tabIndex:-1},a.createElement("span",{className:"icon icon-link"})),"QueryForm - \u67e5\u8a62\u689d\u4ef6\u8868\u55ae"),a.createElement("h2",{id:"querytable---\u67e5\u8a62\u8868\u683c"},a.createElement(r.AnchorLink,{to:"#querytable---\u67e5\u8a62\u8868\u683c","aria-hidden":"true",tabIndex:-1},a.createElement("span",{className:"icon icon-link"})),"QueryTable - \u67e5\u8a62\u8868\u683c"),a.createElement("blockquote",null,a.createElement("p",null,"ArrayBase.mixin(QueryTable)")),a.createElement("h3",{id:"querytabletitlebar---\u67e5\u8a62\u8868\u683c\u6a19\u984c\u6b04"},a.createElement(r.AnchorLink,{to:"#querytabletitlebar---\u67e5\u8a62\u8868\u683c\u6a19\u984c\u6b04","aria-hidden":"true",tabIndex:-1},a.createElement("span",{className:"icon icon-link"})),"QueryTable.Titlebar - \u67e5\u8a62\u8868\u683c\u6a19\u984c\u6b04"),a.createElement("h3",{id:"querytableselection---\u8868\u683c\u591a\u9078\u5bb9\u5668"},a.createElement(r.AnchorLink,{to:"#querytableselection---\u8868\u683c\u591a\u9078\u5bb9\u5668","aria-hidden":"true",tabIndex:-1},a.createElement("span",{className:"icon icon-link"})),"QueryTable.Selection - \u8868\u683c\u591a\u9078\u5bb9\u5668"),a.createElement(i.Z,{code:"{\n  scope: {\n    $record: {\n      selectedRows: [],\n      selectedRowKeys: [],\n    }\n  }\n}",lang:"json"}),a.createElement("h3",{id:"querytablecolumn---\u5e38\u898f\u8868\u683c\u5217"},a.createElement(r.AnchorLink,{to:"#querytablecolumn---\u5e38\u898f\u8868\u683c\u5217","aria-hidden":"true",tabIndex:-1},a.createElement("span",{className:"icon icon-link"})),"QueryTable.Column - \u5e38\u898f\u8868\u683c\u5217"),a.createElement("h3",{id:"querytableoperations---\u64cd\u4f5c\u5217"},a.createElement(r.AnchorLink,{to:"#querytableoperations---\u64cd\u4f5c\u5217","aria-hidden":"true",tabIndex:-1},a.createElement("span",{className:"icon icon-link"})),"QueryTable.Operations - \u64cd\u4f5c\u5217"),a.createElement("h3",{id:"querytableexpandable---\u5d4c\u5957\u5b50\u8868\u683c"},a.createElement(r.AnchorLink,{to:"#querytableexpandable---\u5d4c\u5957\u5b50\u8868\u683c","aria-hidden":"true",tabIndex:-1},a.createElement("span",{className:"icon icon-link"})),"QueryTable.Expandable - \u5d4c\u5957\u5b50\u8868\u683c"))))}));n["default"]=e=>{var n=a.useContext(r.context),t=n.demos;return a.useEffect((()=>{var n;null!==e&&void 0!==e&&null!==(n=e.location)&&void 0!==n&&n.hash&&r.AnchorLink.scrollToAnchor(decodeURIComponent(e.location.hash.slice(1)))}),[]),a.createElement(c,{demos:t})}},91283:function(e,n,t){e.exports=t.p+"static/fireformily-querylist.3ef0bab6.jpg"}}]);