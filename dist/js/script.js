const Editor=monaco_react.default,available_icons=["csv","file","folder","html","php","txt"],languages={js:"javascript",jsx:"javascript",php:"php",htaccess:"text",css:"css",scss:"scss",html:"html"};class WPUltimateDeveloper extends React.Component{constructor(e){super(e),this.state={code:"",lang:"",tree:[],full_tree:[],path:"/",line:null,errors:[],showContext:!1,context_pos:{x:0,y:0},context_data:{folder:!1,path:!1},showModal:!1,modal_type:null,modal_data:null,open_files:{},seted_code:!1,saving:!1,last_saved:null},this.editor=React.createRef(),this.setCode=this.setCode.bind(this),this.saveCode=this.saveCode.bind(this),this.handleEditorMount=this.handleEditorMount.bind(this),this.handleValidate=this.handleValidate.bind(this),this.handleEditorChange=this.handleEditorChange.bind(this),this.openContextMenu=this.openContextMenu.bind(this),this.handleNewFile=this.handleNewFile.bind(this),this.handleNewFolder=this.handleNewFolder.bind(this),this.handleDelete=this.handleDelete.bind(this),this.handleRename=this.handleRename.bind(this),this.wrap_ref=React.createRef()}componentDidMount(){document.addEventListener("keydown",e=>{83==e.keyCode&&(navigator.platform.match("Mac")?e.metaKey:e.ctrlKey)&&(e.preventDefault(),this.saveCode())},!1)}handleEditorChange(e,t){this.state.seted_code?this.setState({seted_code:!1}):(this.setState({errors:[],open_files:{...this.state.open_files,[this.state.path]:{...this.state.open_files[this.state.path],code:e,unsaved:!0}}}),console.log(t))}handleValidate(e){this.setState({errors:e})}handleEditorMount(e,t){this.editor.current=e}saveCode(){this.setState({saving:!0},()=>{const e=new FormData;e.append("action","set_file_content"),e.append("path",this.state.path),e.append("content",this.editor.current.getValue()),fetch("/wp-admin/admin-ajax.php",{method:"POST",credentials:"same-origin",body:e}).then(e=>e.json()).then(e=>{this.setState({open_files:{...this.state.open_files,[this.state.path]:{...this.state.open_files[this.state.path],unsaved:!1}}},()=>{this.setState({saving:!1,last_saved:e.time})})}).catch(e=>{})})}setCode(t,a){this.setState({seted_code:!0},()=>{if(this.state.open_files.hasOwnProperty(t))this.setState({code:this.state.open_files[t].code,lang:this.state.open_files[t].lang,path:t,last_saved:null});else{const e=new FormData;e.append("action","get_file_content"),e.append("path",t),fetch("/wp-admin/admin-ajax.php",{method:"POST",credentials:"same-origin",body:e}).then(e=>e.json()).then(e=>{this.setState({code:e.content,lang:a,path:t,line:1,last_saved:null,open_files:this.state.open_files.hasOwnProperty(t)?this.state.open_files:{...this.state.open_files,[t]:{path:t,lang:a,unsaved:!1,code:e.content}}})}).catch(e=>{this.setState({code:"File too big to load",lang:"text"})})}})}openContextMenu(e,t,a,s){console.log(t,a);var n=this.wrap_ref.current.getBoundingClientRect(),i=e.clientX-n.left,n=e.clientY-n.top;this.setState({showContext:!0,context_pos:{x:i,y:n},context_data:{folder:t,path:a,folder_path:s}})}handleNewFile(e){this.setState({showModal:!0,modal_type:"new-file"})}handleNewFolder(e){}handleDelete(e){}handleRename(e){}render(){const a=[];this.state.errors.forEach((e,t)=>{a.push(React.createElement("div",{className:"entry type-error"},React.createElement("div",{className:"code"},e.code),React.createElement("div",{className:"msg"},e.message),React.createElement("div",{className:"line"},"Line ",e.startLineNumber)))});const e=[];"new-file"===this.state.modal_type&&e.push([React.createElement("label",{className:"name"},"Title of file"),React.createElement("input",{type:"text",onChange:e=>this.setState({modal_data:e.target.value})}),React.createElement("button",{onClick:()=>{if(console.log(this.state.context_data,this.state.modal_data),this.state.modal_data){const e=new FormData;e.append("action","new_file"),e.append("path",this.state.context_data.folder_path),e.append("filename",this.state.modal_data),fetch("/wp-admin/admin-ajax.php",{method:"POST",credentials:"same-origin",body:e}).then(e=>e.json()).then(e=>{console.log(e)}).catch(e=>{})}this.setState({showModal:!1,modal_type:null})}},"Save")]);const t=[];for(const o in this.state.open_files){var s=this.state.open_files[o].path.split("/");const l=this.state.open_files[o].lang;var n=this.state.open_files[o].unsaved,i=available_icons.includes(l)?l:"file";t.push(React.createElement("div",{className:"tab "+(this.state.open_files[o].path===this.state.path?"open":""),onClick:e=>{this.setState({seted_code:!0},()=>{this.setState({code:this.state.open_files[o].code,lang:l,path:this.state.open_files[o].path,last_saved:null},()=>{this.setState({seted_code:!1})})})}},React.createElement("div",{className:"icon",style:{backgroundImage:`url(/wp-content/plugins/wp-ultimate-developer/assets/${i}.png)`}}),s[s.length-1]," ",n?"*":""))}return React.createElement("div",{id:"wp-ultimate-developer-wrap",ref:this.wrap_ref},React.createElement("div",{className:"context-wrap "+(this.state.showContext?"show":""),onClick:()=>this.setState({showContext:!1}),onContextMenu:e=>e.preventDefault()},React.createElement("div",{className:"context-menu",style:{top:this.state.context_pos.y,left:this.state.context_pos.x},onContextMenu:e=>e.preventDefault()},React.createElement("ul",null,React.createElement("li",{onClick:this.handleNewFile},"New File"),React.createElement("li",{onClick:this.handleNewFolder},"New Folder"),React.createElement("li",{className:"separator"}),React.createElement("li",{onClick:this.handleRename},"Rename"),React.createElement("li",{onClick:this.handleDelete},"Delete")))),React.createElement("div",{className:"modal-wrap "+(this.state.showModal?"show":"")},React.createElement("div",{className:"modal-content"},e)),React.createElement("div",{className:"sidebar"},React.createElement("div",{className:"side-panel"},React.createElement("div",{className:"head"},"Files"),React.createElement("div",{className:"content"},React.createElement(TreeWrap,{setCode:(e,t)=>this.setCode(e,t),openContextMenu:(e,t,a,s)=>this.openContextMenu(e,t,a,s)})))),React.createElement("div",{className:"content"},React.createElement("div",{className:"tabs"},t),React.createElement(Editor,{value:this.state.code,language:this.state.lang,defaultValue:"",defaultLanguage:"text",theme:"vs-dark",path:this.state.path,onMount:this.handleEditorMount,onValidate:this.handleValidate,onChange:this.handleEditorChange,line:this.state.line}),React.createElement("div",{className:"path"},this.state.path,this.state.saving?React.createElement("span",{className:"saving"},"Saving..."):null,this.state.last_saved?React.createElement("span",{className:"last-saved"},"Last saved: ",this.state.last_saved):null),React.createElement("div",{className:"console"},React.createElement("div",{className:"head"},"Console"),React.createElement("div",{className:"content"},a))))}}class TreeWrap extends React.Component{constructor(e){super(e),this.state={tree:[]},this.getTree=this.getTree.bind(this),this.setRootTree=this.setRootTree.bind(this),this.setChildTree=this.setChildTree.bind(this),this.setCode=e.setCode,this.openContextMenu=e.openContextMenu}componentDidMount(){this.setRootTree()}async setRootTree(){const e=await this.getTree(""),a=[];e.forEach((e,t)=>{a.push(React.createElement(Tree,{key:e.name,title:e.name,folder:e.folder,path:e.info.dirname+"/"+e.info.basename,folder_path:e.folder?e.info.dirname+"/"+e.info.basename:e.info.dirname,lang:e.folder?"folder":languages.hasOwnProperty(e.info.extension)?languages[e.info.extension]:"text",extension:e.info.extension||"folder",setCode:this.setCode,openContextMenu:this.openContextMenu}))}),this.setState({tree:a})}async setChildTree(e){e=await this.getTree(e);console.log(e)}async getTree(e){const t=new FormData;t.append("action","get_tree"),t.append("root",e);const a=await fetch("/wp-admin/admin-ajax.php",{method:"POST",credentials:"same-origin",body:t});e=await a.json();return e?e.tree:[]}render(){return this.state.tree}}class Tree extends React.Component{constructor(e){super(e),this.state={title:e.title,folder:e.folder,collapsed:!!e.folder,root:e.root||!1,ext:e.extension,setCode:e.setCode,openContextMenu:e.openContextMenu,path:e.path,folder_path:e.folder_path,lang:e.lang,gotSubs:!1,subs:[]},this.onClick=e.onClick||(()=>{}),this.icon||(this.icon=available_icons.includes(e.extension)?e.extension:"file"),this.setSubs=this.setSubs.bind(this),this.getTree=this.getTree.bind(this)}async getTree(e){const t=new FormData;t.append("action","get_tree"),t.append("root",e);const a=await fetch("/wp-admin/admin-ajax.php",{method:"POST",credentials:"same-origin",body:t});e=await a.json();return e?e.tree:[]}async setSubs(e){const t=await this.getTree(e),a=[];t.forEach((e,t)=>{a.push(React.createElement(Tree,{key:e.name,title:e.name,folder:e.folder,path:e.info.dirname+"/"+e.info.basename,folder_path:e.folder?e.info.dirname+"/"+e.info.basename:e.info.dirname,lang:e.folder?"folder":languages.hasOwnProperty(e.info.extension)?languages[e.info.extension]:"text",extension:e.info.extension||"folder",setCode:this.state.setCode,openContextMenu:this.state.openContextMenu}))}),this.setState({subs:a,gotSubs:!0})}render(){return React.createElement("div",{className:"tree-item-wrap"},React.createElement("div",{title:this.state.title,className:"tree-head",onClick:e=>{this.state.folder?this.setState({collapsed:!this.state.collapsed},()=>{this.state.gotSubs||this.setSubs(this.state.path+"/")}):this.state.setCode(this.state.path,this.state.lang)},onContextMenu:e=>{e.preventDefault(),this.state.openContextMenu(e,this.state.folder,this.state.path,this.state.folder_path)}},React.createElement("div",{className:`collapse-indicator ${this.state.folder?"__arrow":""} `+(this.state.collapsed?"__collapsed":"")}),React.createElement("div",{className:"file-icon "+this.icon,style:{backgroundImage:`url(/wp-content/plugins/wp-ultimate-developer/assets/${this.icon}.png)`}}),React.createElement("span",null,this.state.title)),React.createElement("div",{className:"tree-children",style:{display:this.state.collapsed?"none":"block"}},this.state.children,this.state.folder&&this.state.gotSubs?this.state.subs:null))}}const root_node=document.getElementById("root");ReactDOM.render(React.createElement(WPUltimateDeveloper,null),root_node);