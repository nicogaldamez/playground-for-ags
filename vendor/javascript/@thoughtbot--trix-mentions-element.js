import t from"@github/combobox-nav";const e=/\s|\(|\[/;function query(t,n,i,{multiWord:s,lookBackIndex:o,lastMatchPosition:r}={multiWord:false,lookBackIndex:0,lastMatchPosition:null}){let a=t.lastIndexOf(n,i-1);if(-1===a)return;if(a<o)return;if(s){if(null!=r){if(r===a)return;a=r-n.length}const e=t[a+1];if(" "===e&&i>=a+n.length+1)return;const s=t.lastIndexOf("\n",i-1);if(s>a)return;const o=t.lastIndexOf(".",i-1);if(o>a)return}else{const e=t.lastIndexOf(" ",i-1);if(e>a)return}const c=t[a-1];if(c&&!e.test(c))return;const u=t.substring(a+n.length,i);return{text:u,position:a+n.length}}function textFieldSelectionPosition(t,e){const n=Math.max(0,e-1);return t.editor.getClientRectAtPosition(n)}class TrixEditorElementAdapter{constructor(t){this.element=t}focus(t){this.element.focus(t)}removeAttribute(t){this.element.removeAttribute(t)}setAttribute(t,e){this.element.setAttribute(t,e)}get selectionEnd(){return this.editor.getPosition()+1}get value(){return this.editor.getDocument().toString()}get editor(){return this.element.editor}}function getJSONAttribute(t,e){try{const n=t.getAttribute(e);return JSON.parse(n||"{}")}catch(t){return{}}}function extractDataAttribute(t,e,n){const i=t[e];const s=e.replace(n,"");const o=s[0];const r=s.substring(1);const a=o.toLowerCase()+r;return[a,i]}function buildTrixAttachment(t){const e="data-trix-attachment";const n="trixAttachment";if(t instanceof HTMLElement){const i=t;const s={content:i.innerHTML};const o=getJSONAttribute(i,e);const r={};const{dataset:a}=i;for(const t in a)if(t.startsWith(n)&&t!==n){const[e,i]=extractDataAttribute(a,t,n);r[e]=i}return new Trix.Attachment(Object.assign(Object.assign(Object.assign({},s),o),r))}if(t){const e=t;return new Trix.Attachment(e)}return null}function assertTrixEditorElement(t){if(!t||"trix-editor"!==t.localName)throw new Error("Only trix-editor elements are supported")}function getFrameElementById(t){return document.querySelector(`turbo-frame#${t}:not([disabled])`)}function setSearchParam(t,e,n,i){const s=new URL(e||t.getAttribute("src")||"",t.baseURI);s.searchParams.set(n,i);t.setAttribute("src",s.toString());return t.loaded||Promise.resolve()}const n=new WeakMap;class TrixMentionsExpander{constructor(t){this.expander=t;this.combobox=null;this.menu=null;this.match=null;this.justPasted=false;this.lookBackIndex=0;this.oninput=this.onInput.bind(this);this.onpaste=this.onPaste.bind(this);this.onkeydown=this.onKeydown.bind(this);this.oncommit=this.onCommit.bind(this);this.onmousedown=this.onMousedown.bind(this);this.onblur=this.onBlur.bind(this);this.interactingWithList=false;t.addEventListener("paste",this.onpaste);t.addEventListener("input",this.oninput,{capture:true});t.addEventListener("keydown",this.onkeydown);t.addEventListener("focusout",this.onblur)}get input(){const t=this.expander.querySelector("trix-editor");assertTrixEditorElement(t);return new TrixEditorElementAdapter(t)}destroy(){this.expander.removeEventListener("paste",this.onpaste);this.expander.removeEventListener("input",this.oninput,{capture:true});this.expander.removeEventListener("keydown",this.onkeydown);this.expander.removeEventListener("focusout",this.onblur)}dismissMenu(){this.deactivate()&&(this.lookBackIndex=this.input.selectionEnd||this.lookBackIndex)}activate(e,n){var i,s;if(this.input.element!==document.activeElement&&this.input.element!==(null===(s=null===(i=document.activeElement)||void 0===i?void 0:i.shadowRoot)||void 0===s?void 0:s.activeElement))return;this.deactivate();this.menu=[n,n.isConnected];n.id||(n.id=`trix-mentions-${Math.floor(1e5*Math.random()).toString()}`);n.isConnected?n.hidden=false:this.expander.append(n);this.combobox=new t(this.input.element,n);this.input.setAttribute("role","combobox");this.input.setAttribute("aria-multiline","false");const{bottom:o,left:r}=textFieldSelectionPosition(this.input,e.position);n.style.top=`${o}px`;n.style.left=`${r}px`;this.combobox.start();n.addEventListener("combobox-commit",this.oncommit);n.addEventListener("mousedown",this.onmousedown);this.combobox.navigate(1)}deactivate(){if(!this.menu||!this.combobox)return false;const[t,e]=this.menu;this.menu=null;t.removeEventListener("combobox-commit",this.oncommit);t.removeEventListener("mousedown",this.onmousedown);this.combobox.destroy();this.combobox=null;this.input.removeAttribute("aria-multiline");this.input.setAttribute("role","textbox");e?t.hidden=true:t.remove();return true}onCommit({target:t}){const e=t;if(!(e instanceof HTMLElement))return;if(!this.combobox)return;const n=this.match;if(!n)return;const i=n.position-n.key.length;const s=n.position+n.text.length;const o={item:e,key:n.key,value:null};const r=!this.expander.dispatchEvent(new CustomEvent("trix-mentions-value",{cancelable:true,detail:o}));if(r)return;const a=buildTrixAttachment(o.value||e);if(!a)return;this.input.editor.setSelectedRange([i,s]);this.input.editor.deleteInDirection("backward");this.input.editor.insertAttachment(a);const c=this.input.selectionEnd;this.deactivate();this.input.focus({preventScroll:true});this.lookBackIndex=c;this.match=null}onBlur({target:t}){t===this.input.element&&(this.interactingWithList?this.interactingWithList=false:this.deactivate())}onPaste({target:t}){t===this.input.element&&(this.justPasted=true)}async onInput({target:t}){if(t!==this.input.element)return;if(this.justPasted){this.justPasted=false;return}const e=this.findMatch();if(e){this.match=e;const t=await this.notifyProviders(e);if(!this.match)return;t?this.activate(e,t):this.deactivate()}else{this.match=null;this.deactivate()}}findMatch(){const t=this.input.selectionEnd||0;const e=this.input.value.replace(/\n+$/,"");t<=this.lookBackIndex&&(this.lookBackIndex=t-1);for(const{key:n,multiWord:i}of this.expander.keys){const s=query(e,n,t,{multiWord:i,lookBackIndex:this.lookBackIndex,lastMatchPosition:this.match?this.match.position:null});if(s)return{text:s.text,key:n,position:s.position}}}async notifyProviders(t){const e=[];const provide=t=>e.push(t);const n=!this.expander.dispatchEvent(new CustomEvent("trix-mentions-change",{cancelable:true,detail:{provide:provide,text:t.text,key:t.key}}));if(!n){if(e.length>0){const t=await Promise.all(e);const n=t.filter((t=>t.matched)).map((t=>t.fragment));return n[0]}return this.driveTurboFrame(t)}}onMousedown(){this.interactingWithList=true}onKeydown(t){if(t.target===this.input.element&&"Escape"===t.key){this.match=null;if(this.deactivate()){this.lookBackIndex=this.input.selectionEnd||this.lookBackIndex;t.stopImmediatePropagation();t.preventDefault()}}}async driveTurboFrame(t){const e=this.expander.name;const n=getFrameElementById(this.expander.getAttribute("data-turbo-frame"));if(e&&n){await setSearchParam(n,this.expander.src,e,t.text);if(n.childElementCount>0)return n}}}class TrixMentionsElement extends HTMLElement{get keys(){const t=this.getAttribute("keys");const e=t?t.split(" "):[];const n=this.getAttribute("multiword");const i=n?n.split(" "):[];const s=0===i.length&&this.hasAttribute("multiword");return e.map((t=>({key:t,multiWord:s||i.includes(t)})))}get src(){return this.getAttribute("src")}set src(t){null===t||"undefined"===typeof t?this.removeAttribute("src"):this.setAttribute("src",t)}get name(){return this.getAttribute("name")}set name(t){null===t||"undefined"===typeof t?this.removeAttribute("name"):this.setAttribute("name",t)}connectedCallback(){const t=new TrixMentionsExpander(this);n.set(this,t)}disconnectedCallback(){const t=n.get(this);if(t){t.destroy();n.delete(this)}}dismiss(){const t=n.get(this);t&&t.dismissMenu()}}if(!window.customElements.get("trix-mentions")){window.TrixMentionsElement=TrixMentionsElement;window.customElements.define("trix-mentions",TrixMentionsElement)}export{TrixMentionsElement as default};
