(function () {
    const svgXmlns = 'http://www.w3.org/2000/svg';
    let innerStyle = `
        @keyframes path-enter{
            from{
                stroke-dasharray: 5000;
                stroke-dashoffset: 5000;
            }
            to{
                stroke-dasharray: 5000;
                stroke-dashoffset: 0;
            }
        }
        svg{
            position:absolute;
            bottom:0;
            left:0;
        }
        svg path{
            animation:path-enter 3s;
        }
    `;
    function computePathSize(pathDesc) {
        let seps = pathDesc.match(/\d+(\.\d+)?\s+\d+(\.\d+)?/g);
        let maxX = 0,maxY = 0;
        seps.forEach(function (sep) {
            let points = sep.split(/\s+/);
            maxX = Math.max(points[0] * 1,maxX);
            maxY = Math.max(points[1] * 1,maxY);
        });
        return {
            width:maxX,
            height:maxY
        }
    }
    function create() {
        let self = this;
        let d = self.getAttribute('d');
        let size = computePathSize(d);
        let shadowRoot = self.hasShadow ? self.shadowRoot : self.attachShadow({mode: 'open'});
        if( self.hasShadow){
            shadowRoot.innerHTML = '';
        }
        let svg = document.createElementNS(svgXmlns,'svg');
        self._cvs = svg;

        svg.setAttribute('width',size.width + '');
        svg.setAttribute('height',size.height + '');

        let path = document.createElementNS(svgXmlns,'path');
        this._el = path;
        if(typeof d === 'string'){
            path.setAttribute('d',d);
        }
        ['stroke','fill'].forEach(function (attr) {
            let val = self.getAttribute(attr);
            if(val){
                path.setAttribute(attr,val);
            }
        });
        svg.appendChild(path);

        let style = document.createElement('style');
        style.setAttribute('type','text/css');
        style.innerText = innerStyle;

        shadowRoot.appendChild(style);
        shadowRoot.appendChild(svg);
    }
    class Path extends HTMLElement{
        constructor(){
            super();
        }
        connectedCallback(){
            create.call(this);
            this.hasShadow = true;
        }
        attributeChangedCallback(name,oldValue,newValue){
            if(name === 'd'){
                let size = computePathSize(newValue);
                this._cvs.setAttribute('width',size.width + '');
                this._cvs.setAttribute('height',size.height + '');
                return;
            }
            this._el.setAttribute(name,newValue);
        }
    }
    customElements.define('html-path',Path)
})();
