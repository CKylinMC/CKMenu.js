/**
    CKMenu.js
    @author CKylinMC
    @version 1.1
    @description 一个简单的页面右键菜单js
*/

var CKMenu = (function () {
    var settings = {
        "width": "200px",
        "debug": false
    };
    function closeAll(){
        var es = document.querySelectorAll(".CKMenu");
        es.forEach((e,i)=>{
            e.remove();
        });
    }
    function _e(str){
        console.error("[CKMenu] Error: "+str);
        return false;
    }
    function _o(str){
        console.error("[CKMenu] "+str);
    }
    function _w(str){
        console.error("[CKMenu] Warn: "+str);
    }
    function _d(str){
        console.error("[CKMenu] Debug: "+str);
    }
    return function () {
        // window.oncontextmenu = function (event) {
        //     event.preventDefault();
        // };
        this.config = {
            "id": (Math.floor(Math.random()*100000000)+10000000),
            "options":[],
            // options:[
            //     {
            //         type: "",//line,title,button,raw
            //         text: "",
            //         callback: "",
            //         style: "",
            //         class: ""
            //     },
            // ]
            "beforeCall": function(){},
            "afterCall": function () { },
            "animation": "Fade",//Fade,Scale,Expand
        };
        this.el = null;
        this.binded = false;
        this.getMenuFrameName = function(){
            return "CKMenuFrame"+this.config.id;
        };
        this.setAnimation = function (anim) {
            if (!anim == "Fade"
                || !anim == "Scale"
                || !anim == "Expand") {
                this.config.animation = "Fade";
            } else this.config.animation = anim;
            this.initStyles();
        }
        this.initStyles = function(){
            var css = document.querySelector("#ckmenu-stylesheet");
            if(css) css.remove();
            css = document.createElement("style");
            css.id = "ckmenu-stylesheet";
            css.innerHTML = "\
            #"+this.getMenuFrameName()+"{\
                position: fixed;\
                border-radius: 12px;\
                box-shadow: 0 0 6px #d2d2d2;\
                background: white;\
                width: "+settings.width+";\
                padding: 12px 0;\
                z-index: 9999;\
                animation: CKMenu"+this.config.animation+"Out .3s;\
            }\
            #"+this.getMenuFrameName()+">.*{\
                font-family: MS YaHei;\
            }\
            ."+"CKMenuOpts"+this.config.id+">.CKMenuTitle{\
                margin-top: 0px;\
                padding: 12px;\
                display: block;\
                height: .3em;\
                line-height: .3em;\
                font-weight:bold;\
                color: grey;\
                border-left: solid 3px rgb(0,135,255);\
            }\
            ."+"CKMenuOpts"+this.config.id+">.CKMenuButton{\
                padding: 12px;\
                display: block;\
                height: 1em;\
                line-height: 1em;\
                cursor:pointer;\
            }\
            ."+"CKMenuOpts"+this.config.id+">.CKMenuLine{\
                margin: 0 12px;\
                display: block;\
                height: 2px;\
                border-bottom: solid 1px #80808040;\
            }\
            ."+"CKMenuOpts"+this.config.id+">.CKMenuButton:hover{\
                background:#d5d5d5;\
            }\
            @keyframes CKMenuFadeOut{\
                from{\
                    opacity: 0;\
                }\
                to{\
                    opacity: 1;\
                }\
            }\
            @keyframes CKMenuScaleOut{\
                from{\
                    transform: scale(0) translate(0,0);\
                    opacity: 0;\
                }\
                10%{\
                    transform: scale(0) translate(-100%,-100%);\
                    opacity: 0;\
                }\
                to{\
                    opacity: 1;\
                    transform: scale(1) translate(0,0);\
                }\
            }\
            @keyframes CKMenuExpandOut{\
                from{\
                    transform: scaleY(0) translateY(0);\
                    opacity: 0;\
                }\
                10%{\
                    transform: scale(0) translateY(-100%);\
                    opacity: 0;\
                }\
                to{\
                    opacity: 1;\
                    transform: scaleY(1) translateY(0);\
                }\
            }\
            ";
            if ("backdropFilter" in document.documentElement.style) {
                css.innerHTML += "#" + this.getMenuFrameName() + "{\
                    background: #ffffff9e;\
                    backdrop-filter: blur(6px);\
                }\
                #"+this.getMenuFrameName()+" > div{\
                    text-shadow: 0 0 10px white;\
                }\
                ";
            }
            document.body.appendChild(css);
        };
        this.bind = function(e){
            if(!e instanceof HTMLElement){
                e = document.querySelector(e);
            }
            if(!e){
                if(debug) _e("Argument \""+e+"\" can NOT parsed as an HTMLElement!");
                return false;
            }
            if(e.getAttribute("data-ckmenu-id")){
                if(debug) _e("Element \""+e+"\" is already been bound by other instance!");
                return false;
            }

            this.el = e;
            this.el.setAttribute("data-ckmenu-id","CKMenuElement"+this.config.id);
            this.binded = true;
            this.initStyles();
            this.el.onmousedown = (event)=>{
                var e = event||window.event;
                if(event.button=="2") this.open(event);
            }
            this.el.oncontextmenu = function (event) {
                event.preventDefault();
            };
            return true;
        };
        this.resetOptions = function () {
            this.config.options = [];
        }
        this.optGen = function(cfg){
            var tmpcfg = {
                "name": "opt"+(Math.floor(Math.random()*100000000)+10000000),
                "type": "raw",//line,title,button,raw
                "text": "",
                "callback": ()=>{return;},
                "style": "",
                "class": ""
            };
            if('name' in cfg) tmpcfg.name = cfg.name;
            if('type' in cfg) tmpcfg.type = cfg.type;
            if('text' in cfg) tmpcfg.text = cfg.text;
            if('style' in cfg) tmpcfg.style = cfg.style;
            if('callback' in cfg) tmpcfg.callback = cfg.callback;
            if('class' in cfg) tmpcfg.class = cfg.class;
            return tmpcfg;
        };
        this.removeElement = function(name){
            var tmpopts = this.config.options;
            this.config.options.forEach((e,i) => {
                if(e.name==name) {
                    tmpopts.splice(i,1);
                    return;
                }
            });
            this.config.options = tmpopts;
        };
        this.addOption = function(text,callback){
            this.config.options.push(this.optGen({"type":"button","text":text,"callback":callback}));
            return this.config.options[this.config.options.length-1];
        };
        this.addLine = function(){
            this.config.options.push(this.optGen({type:"line"}));
            return this.config.options[this.config.options.length-1];
        };
        this.addTitle = function(text){
            this.config.options.push(this.optGen({"type":"title","text":text}));
            return this.config.options[this.config.options.length-1];
        };
        this.addElement = function(raw){
            this.config.options.push(this.optGen({"type":"raw","text":raw}));
            return this.config.options[this.config.options.length-1];
        };
        this.render = function(){
            var el = document.createElement("div");
            el.className = "CKMenuOpts"+this.config.id;
            this.config.options.forEach((e,i)=>{
                var item = null;
                switch (e.type) {
                    case "button":
                        item = document.createElement("span");
                        item.className = "CKMenuButton";
                        item.innerHTML = e.text;
                        item.onclick = ()=>{
                            this.close();
                            e.callback();
                        };
                        break;
                    case "line":
                        item = document.createElement("span");
                        item.className = "CKMenuLine";
                        break;
                    case "title":
                        item = document.createElement("span");
                        item.className = "CKMenuTitle";
                        item.innerHTML = e.text;
                        break;
                    case "raw":
                        item = document.createElement("span");
                        item.className = "CKMenuRAW";
                        item.innerHTML = e.text;
                        break;
                    default:
                        if(debug) _e("Unknow type \""+e.type+"\", skipped.");
                        break;
                }
                if(item) el.appendChild(item);
            });
            return el;
        }
        this.open = function (ev, y) {
            this.config.beforeCall(ev, this);
            // window.call(this.config.beforeCall,[ev,this])
            if(!"CKMENUBAKONCLICK"in window)
                window["CKMENUBAKONCLICK"] = window.onclick||function(){};
            window.onclick = (e)=>{
                if("CKMENUBAKONCLICK"in window)window["CKMENUBAKONCLICK"](e);
                this.close();
            }
            var e = document.querySelector("#"+this.getMenuFrameName());
            if(e)e.remove();
            e = document.createElement("div");
            e.id = this.getMenuFrameName();
            e.className = "CKMenu";
            e.appendChild(this.render());
            e.oncontextmenu = (eve) => eve.preventDefault();
            if(!ev&&!y){
                // console.log("NON-PARAM");
                ev = 0;
                y = 0;
            }else if(ev instanceof Event){
                ev.preventDefault();
                // console.log("EVENT-PARAM");
                // console.log(event);
                // window.lastEvent = event;
                var x = ev.clientX;
                y = ev.clientY;
            }else{
                // console.log("STATIC-PARAM");
                var x = ev;
            }
            document.body.appendChild(e);
            var safey = window.innerHeight - e.offsetHeight;
            if (y > safey) {
                if (y > safey - y * 2) {
                    y -= e.offsetHeight;
                }
                else y = safey;
            }
            var safex = window.innerWidth - e.offsetWidth;
            if (x > safex) {
                if (x > safex - x * 2) {
                    x -= e.offsetWidth;
                }
                else x = safex;
            }
            e.style.top = y+"px";
            e.style.left = x+"px";
            // console.log(e);
            return e;
        };
        this.close = function () {
            this.config.afterCall(this);
            var e = document.querySelector("#"+this.getMenuFrameName());
            if(e)e.remove();
        };
    }
})();
