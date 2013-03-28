///<reference path='Three/three.d.ts' />
var TargetReticle = (function () {
    function TargetReticle(cam) {
        this.width = 64;
        this.height = 64;
        this.camera = cam;
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
        this.elm.style.perspective = camToCSSFov(cam.fov) + "px";
        this.elm.style.transform = 'rotateX(45deg);';
        this.position = new THREE.Vector3(0, 0, 0);
        this.increment = 0;
        document.body.appendChild(this.elm);
    }
    TargetReticle.prototype.setPos = function (v) {
        //this.elm.style.left = (v.x - this.width/2).toString() + 'px';
        //this.elm.style.top = (v.y - this.height / 2).toString() + 'px';
        this.increment++;
        //this.elm.style.left = (this.increment % 512).toString() + "px";
        //this.elm.style.top = (this.increment % 512).toString() + "px";
        this.elm.style.transform = "rotate(" + this.increment + ")";
        this.elm.style.transform += "translateZ(" + this.increment + "px) ";
    };
    TargetReticle.prototype.setPosM = function (m) {
        this.elm.style.transform = "";
        this.elm.style.transform += toCSSMatrix(m, false);
        console.log(this.elm.style.transform.toString());
    };
    TargetReticle.prototype.setCSSCamera = function (cam, fov) {
        var camStyle = this.getCSS3D_cameraStyle(this.camera, camToCSSFov(this.camera.fov));
        //this.elm.style = camStyle;
            };
    TargetReticle.prototype.getCSS3D = function () {
        this.elm.style.transform = this.getCSS3D_cameraStyle(this.camera, camToCSSFov(this.camera.fov));
        //this.elm.style
            };
    TargetReticle.prototype.getCSS3D_cameraStyle = function (cam, fov) {
        var cssStyle = "";
        cssStyle += "translate3d(0,0," + epsilon(fov) + "px) ";
        cssStyle += toCSSMatrix(cam.matrixWorldInverse, true);
        cssStyle += " translate3d(" + window.innerWidth / 2 + "px," + window.innerHeight / 2 + "px, 0)";
        return cssStyle;
    };
    return TargetReticle;
})();
// Credit due to Luis Cruz of MSCS Project for these helper functions.
// These enable seamless blending between WebGL and CSS3 spaces.
/*
function setDivPosition(cssObject, glObject) {
var offset = 400; //value to offset the cube
glObject.updateMatrix();
cssObject.style.position = "absolute";
//Webkit:
cssObject.style.WebkitTransformOrigin = "50% 50%";
cssObject.style.WebkitTransform = CSStransform(200 + offset, 200, glObject.matrix);
//Mozilla:
cssObject.style.MozTransformOrigin = "50% 50%";
cssObject.style.MozTransform = CSStransform(200 + offset, 200, glObject.matrix);
}
*/
function camToCSSFov(f) {
    var fov = f;
    fov = 0.5 / Math.tan(fov * Math.PI / 360) * window.innerHeight;
    return fov;
}
function toCSSMatrix(threeMat4, b) {
    var a = threeMat4, f;
    if(b) {
        f = [
            a.elements[0], 
            -a.elements[1], 
            a.elements[2], 
            a.elements[3], 
            a.elements[4], 
            -a.elements[5], 
            a.elements[6], 
            a.elements[7], 
            a.elements[8], 
            -a.elements[9], 
            a.elements[10], 
            a.elements[11], 
            a.elements[12], 
            -a.elements[13], 
            a.elements[14], 
            a.elements[15]
        ];
    } else {
        f = [
            a.elements[0], 
            a.elements[1], 
            a.elements[2], 
            a.elements[3], 
            a.elements[4], 
            a.elements[5], 
            a.elements[6], 
            a.elements[7], 
            a.elements[8], 
            a.elements[9], 
            a.elements[10], 
            a.elements[11], 
            a.elements[12], 
            a.elements[13], 
            a.elements[14], 
            a.elements[15]
        ];
    }
    for(var e in f) {
        f[e] = epsilon(f[e]);
    }
    return "matrix3d(" + f.join(",") + ")";
}
function epsilon(a) {
    if(Math.abs(a) < 0.000001) {
        return 0;
    }
    return a;
}
//@ sourceMappingURL=TargetReticle.js.map
