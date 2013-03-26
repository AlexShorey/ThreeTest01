///<reference path='Three/three.d.ts' />
var TargetReticle = (function () {
    function TargetReticle() {
        this.width = 64;
        this.height = 64;
        this.elm = document.createElement('div');
        this.elm.id = 'tRet';
        this.elm.style.position = "absolute";
        this.elm.style.margin = '0px';
        this.elm.style.padding = '0px';
        this.elm.style.width = this.width.toString() + 'px';
        this.elm.style.height = this.height.toString() + 'px';
        this.elm.style.top = '0px';
        this.elm.style.left = '0px';
        this.elm.style.background = 'rgba(38,255,0,0.2)';
        this.position = new THREE.Vector3(0, 0, 0);
        document.body.appendChild(this.elm);
    }
    TargetReticle.prototype.setPos = function (v) {
        this.elm.style.left = (v.x - this.width / 2).toString() + 'px';
        this.elm.style.top = (v.y - this.height / 2).toString() + 'px';
    };
    return TargetReticle;
})();
//@ sourceMappingURL=TargetReticle.js.map
