function create() {
    return document.createElement.apply(document,arguments);
}
let createShape;
(function () {
    function Shape(el) {
        this.el = el;
        this.parent = null;
        this.children = [];
    }
    Shape.prototype = {
        style:style,
        'class':clazz,
        appendChild:appendChild,
        removeChild:removeChild,
        clear:clear,
        render:render,
        renderItem:renderItem
    };
    createShape = function createShape() {
        let ele = create.apply(document,arguments);
        let shape = new Shape(ele);
        let proxy = new Proxy(shape,{
            get:function (obj,prop) {
                let propVal,target;
                if(prop in shape){
                    propVal = shape[prop];
                    target = proxy;
                }else{
                    target = shape.el;
                    propVal = shape.el[prop];
                }
                if(typeof propVal === 'function'){
                    propVal = propVal.bind(target);
                }
                return propVal;
            },
            set:function (obj,prop,value) {
                if(prop in shape.el){
                    shape.el[prop] = value;
                }else{
                    shape[prop] = value;
                }
                return proxy;
            }
        });
        return proxy;
    }
    function style(attrs,val) {
        let ele = this.el;
        let sty = ele.style;
        if(arguments.length === 1 && typeof attrs === 'string'){
            return sty[attrs];
        }
        if(arguments.length === 2 && typeof attrs === 'string'){
            sty[attrs] = val;
            return this;
        }
        Object.keys(attrs).forEach(function (key) {
            sty[key] = attrs[key];
        });
        return this;
    }
    function clazz(className,value) {
        let getOp = arguments.length === 0;
        if(arguments.length === 1){
            value = true;
        }
        let ele = this.el;
        let classList = ele.classList;
        if(classList){
            if(getOp){
                return classList.contains(className);
            }
            if(value){
                classList.add(className);
            }else{
                classList.remove(className);
            }
            return this;
        }
        let classNames = ele.className || '';
        classNames = classNames.split(/\s+/);
        let index = classNames.indexOf(className);
        if(getOp){
            return index >= 0;
        }
        if(value && index === -1){
            classNames.push(className);
            ele.className = classNames.join(' ');
        }
        if(!value && index >= 0){
            classNames.splice(index,1);
            ele.className = classNames.join(' ');
        }
        return this;
    }
    function appendChild(shape) {
        let children = this.children;
        let index = children.indexOf(shape);
        if(index === -1){
            children.push(shape);
        }
        return this;
    }
    function removeChild(shape) {
        let children = this.children;
        let index = children.indexOf(shape);
        if(index >= 0){
            children.splice(index,1);
            if(shape.parent === this){
                this.el.removeChild(shape.el);
                shape.parent = null;
            }
        }
        return this;
    }
    function clear() {
        let el = this.el;
        el.innerHTML = '';
    }
    function render(deep) {
        renderShape(this,deep);
        return this;
    }
    function renderItem(shape,deep) {
        let children = this.children,el = this.el;
        if(children.indexOf(shape) === -1){
            return;
        }
        renderShape(shape,deep);
        shape.parent = this;
        el.appendChild(shape.el);
    }
    function renderShape(shape,deep) {
        if(deep !== false){
            deep = true;
        }
        let children = shape.children,el = shape.el;
        if(children.length){
            el.innerHTML = '';
        }
        children.forEach(function (sha) {
            if(deep){
                renderShape(sha);
            }
            sha.parent = shape;
            el.appendChild(sha.el);
        });
    }
})();
