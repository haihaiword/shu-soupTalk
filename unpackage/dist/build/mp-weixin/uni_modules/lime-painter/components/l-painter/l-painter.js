"use strict";const t=require("../../../../common/vendor.js"),e=require("../common/relation.js"),s=require("./props.js"),i=require("./utils.js"),a=require("./painter.js"),n={name:"lime-painter",mixins:[s.props,e.parent("painter"),{}],data:()=>({use2dCanvas:!1,canvasHeight:150,canvasWidth:null,parentWidth:0,inited:!1,progress:0,firstRender:0,done:!1,tasks:[]}),computed:{styles(){return`${this.size}${this.customStyle||""};`+(this.hidden&&"position: fixed; left: 1500rpx;")},canvasId(){return`l-painter${this._&&this._.uid||this._uid}`},size(){if(this.boardWidth&&this.boardHeight)return`width:${this.boardWidth}px; height: ${this.boardHeight}px;`},dpr(){return this.pixelRatio||t.index.getSystemInfoSync().pixelRatio},boardWidth(){const{width:t=0}=this.elements&&this.elements.css||this.elements||this,e=i.toPx(t||this.width);return e||Math.max(e,i.toPx(this.canvasWidth))},boardHeight(){const{height:t=0}=this.elements&&this.elements.css||this.elements||this,e=i.toPx(t||this.height);return e||Math.max(e,i.toPx(this.canvasHeight))},hasBoard(){return this.board&&Object.keys(this.board).length},elements(){return this.hasBoard?this.board:JSON.parse(JSON.stringify(this.el))}},created(){this.use2dCanvas="2d"===this.type&&i.canIUseCanvas2d()&&!i.isPC},async mounted(){await i.sleep(30),await this.getParentWeith(),this.$nextTick((()=>{setTimeout((()=>{this.$watch("elements",this.watchRender,{deep:!0,immediate:!0})}),30)}))},unmounted(){this.done=!1,this.inited=!1,this.firstRender=0,this.progress=0,this.painter=null,clearTimeout(this.rendertimer)},methods:{async watchRender(t,e){t&&t.views&&(this.firstRender?this.firstRender:t.views.length)&&Object.keys(t).length&&JSON.stringify(t)!=JSON.stringify(e)&&(this.firstRender=1,this.progress=0,this.done=!1,clearTimeout(this.rendertimer),this.rendertimer=setTimeout((()=>{this.render(t)}),this.beforeDelay))},async setFilePath(t,e){let s=t;const{pathType:a=this.pathType}=e||this;return"base64"!=a||i.isBase64(t)?"url"==a&&i.isBase64(t)&&(s=await i.base64ToPath(t)):s=await i.pathToBase64(t),e&&e.isEmit&&this.$emit("success",s),s},async getSize(t){const{width:e}=t.css||t,{height:s}=t.css||t;this.size||(e||s?(this.canvasWidth=e||this.canvasWidth,this.canvasHeight=s||this.canvasHeight,await i.sleep(30)):await this.getParentWeith())},canvasToTempFilePathSync(t){this.tasks.push(t),this.done&&this.runTask()},runTask(){for(;this.tasks.length;){const t=this.tasks.shift();this.canvasToTempFilePath(t)}},getParentWeith(){return new Promise((e=>{t.index.createSelectorQuery().in(this).select(".lime-painter").boundingClientRect().exec((t=>{const{width:s,height:i}=t[0]||{};this.parentWidth=Math.ceil(s||0),this.canvasWidth=this.parentWidth||300,this.canvasHeight=i||this.canvasHeight||150,e(t[0])}))}))},async render(t={}){if(!Object.keys(t).length)return console.error("空对象");this.progress=0,this.done=!1,await this.getSize(t);const e=await this.getContext();let{use2dCanvas:s,boardWidth:n,boardHeight:h,canvas:r,afterDelay:c}=this;if(s&&!r)return Promise.reject(new Error("canvas 没创建"));if(this.boundary={top:0,left:0,width:n,height:h},this.painter=null,!this.painter){const{width:s}=t.css||t;t.css,!s&&this.parentWidth&&Object.assign(t,{width:this.parentWidth});const c={context:e,canvas:r,width:n,height:h,pixelRatio:this.dpr,useCORS:this.useCORS,createImage:i.getImageInfo.bind(this),performance:this.performance,listen:{onProgress:t=>{this.progress=t,this.$emit("progress",t)},onEffectFail:t=>{this.$emit("faill",t)}}};this.painter=new a.kt(c)}try{const{width:a,height:n}=await this.painter.source(JSON.parse(JSON.stringify(t)));return this.boundary.height=this.canvasHeight=n,this.boundary.width=this.canvasWidth=a,await i.sleep(this.sleep),await this.painter.render(),await new Promise((t=>this.$nextTick(t))),s||await this.canvasDraw(),c&&s&&await i.sleep(c),this.$emit("done"),this.done=!0,this.isCanvasToTempFilePath&&this.canvasToTempFilePath().then((t=>{this.$emit("success",t.tempFilePath)})).catch((t=>{this.$emit("fail",new Error(JSON.stringify(t)))})),this.runTask(),Promise.resolve({ctx:e,draw:this.painter,node:this.node})}catch(o){}},canvasDraw(t=!1){return new Promise(((e,s)=>this.ctx.draw(t,(()=>setTimeout((()=>e()),this.afterDelay)))))},async getContext(){if(!this.canvasWidth)return this.$emit("fail","painter no size"),console.error("[lime-painter]: 给画板或父级设置尺寸"),Promise.reject();if(this.ctx&&this.inited)return Promise.resolve(this.ctx);const{type:e,use2dCanvas:s,dpr:i,boardWidth:a,boardHeight:n}=this,h=()=>new Promise((e=>{t.index.createSelectorQuery().in(this).select(`#${this.canvasId}`).boundingClientRect().exec((s=>{if(s){const i=t.index.createCanvasContext(this.canvasId,this);if(this.inited||(this.inited=!0,this.use2dCanvas=!1,this.canvas=s),!i.measureText){let t=function(t){let e=0;for(let s=0;s<t.length;s++)t.charCodeAt(s)>0&&t.charCodeAt(s)<128?e++:e+=2;return e};i.measureText=e=>{let s=i.state&&i.state.fontSize||12;const a=i.__font;return a&&12==s&&(s=parseInt(a.split(" ")[3],10)),s/=2,{width:t(e)*s}}}this.ctx=i,e(this.ctx)}else console.error("[lime-painter] no node")}))}));return s?new Promise((s=>{t.index.createSelectorQuery().in(this).select(`#${this.canvasId}`).node().exec((t=>{let{node:i}=t&&t[0]||{};if(i){const t=i.getContext(e);this.inited||(this.inited=!0,this.use2dCanvas=!0,this.canvas=i),this.ctx=t,s(this.ctx)}else console.error("[lime-painter]: no size")}))})):h()},canvasToTempFilePath(e={}){return new Promise((async(s,i)=>{const{use2dCanvas:a,canvasId:n,dpr:h,fileType:r,quality:c}=this;this.boundary;const o=Object.assign({canvasId:n,id:n,fileType:r,quality:c},e,{success:async t=>{try{const i=await this.setFilePath(t.tempFilePath||t,e),a=Object.assign(t,{tempFilePath:i});e.success&&e.success(a),s(a)}catch(i){this.$emit("fail",i)}}});if(a){o.canvas=this.canvas;try{const i=this.canvas.toDataURL(`image/${e.fileType||r}`.replace(/pg/,"peg"),e.quality||c);if(/data:,/.test(i))t.index.canvasToTempFilePath(o,this);else{const t=await this.setFilePath(i,e);e.success&&e.success({tempFilePath:t}),s({tempFilePath:t})}}catch(d){e.fail&&e.fail(d),i(d)}}else t.index.canvasToTempFilePath(o,this)}))}}};const h=t._export_sfc(n,[["render",function(e,s,i,a,n,h){return t.e({a:h.canvasId&&h.size},h.canvasId&&h.size?t.e({b:n.use2dCanvas},n.use2dCanvas?{c:h.canvasId,d:t.s(h.size)}:{e:h.canvasId,f:h.canvasId,g:t.s(h.size),h:h.boardWidth*h.dpr,i:h.boardHeight*h.dpr,j:e.hidpi},{k:t.s(h.styles)}):{})}]]);wx.createComponent(h);
