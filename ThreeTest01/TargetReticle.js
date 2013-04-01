///<reference path='Three/three.d.ts' />
///<reference path='CSS3D_Polyfill.d.ts' />
var TargetReticle = (function () {
    function TargetReticle(cam) {
        this.width = 64;
        this.height = 64;
        this.camera = cam;
        this.divContainer = document.createElement('div');
        this.divContainer.style.position = 'absolute';
        this.divContainer.style.margin = '0px';
        this.divContainer.style.padding = '0px';
        this.divContainer.style = CSS3D_TransformStyle(this.divContainer.style, 'preserve-3d');
        this.divWorld = document.createElement('div');
        //this.divWorld.style.position = 'absolute';
        this.divWorld.style.top = '0px';
        this.divWorld.style.left = '0px';
        this.divWorld.style.margin = '0px';
        this.divWorld.style.width = window.innerWidth + "px";
        this.divWorld.style.height = window.innerHeight + "px";
        this.divWorld.style = CSS3D_Perspective(this.divWorld.style, camToCSSFov(this.camera.fov) + "px");
        this.divWorld.style.position = 'absolute';
        this.divWorld.style = CSS3D_PerspectiveOrigin(this.divWorld.style, "50% 50%");
        this.divWorld.style = CSS3D_TransformStyle(this.divWorld.style, "preserve-3d");
        this.divWorld.style.zIndex = '20';
        this.divCamera = document.createElement('div');
        this.divCamera.style = CSS3D_Perspective(this.divCamera.style, camToCSSFov(this.camera.fov) * 200 + "px");
        this.divCamera.style.position = 'absolute';
        this.divCamera.style.margin = '0px';
        this.divCamera.style.padding = '0px';
        this.divCamera.style.left = '0px';
        this.divCamera.style.top = '0px';
        this.divCamera.style.width = window.innerWidth + "px";
        this.divCamera.style.height = window.innerHeight + "px";
        this.divCamera.style = CSS3D_PerspectiveOrigin(this.divCamera.style, "0% 0%");
        this.divCamera.style = CSS3D_Transform(this.divCamera.style, this.getCSS3D_cameraStyle(cam, camToCSSFov(this.camera.fov)));
        //this.divCamera.style = CSS3D_TransformStyle(this.divCamera.style, "preserve-3d");
        this.elm = document.createElement('div');
        this.elm.style = CSS3D_Perspective(this.elm.style, camToCSSFov(this.camera.fov) + "px");
        this.elm.style.position = "absolute";
        this.elm.style.width = this.width + 'px';
        this.elm.style.height = this.height + 'px';
        this.elm.style.background = 'rgba(38,255,0,0.2)';
        //this.elm.style = CSS3D_Transform(this.elm.style, "translate()");
        //document.body.style = CSS3D_Perspective(document.body.style, camToCSSFov(this.camera.fov) + "px");
        //this.elm.style = CSS3D_Transform(this.elm.style, "rotate(45deg)");
        //this.position = new THREE.Vector3(0, 0, 0);
        //document.body.appendChild(this.elm);
        document.body.appendChild(this.divContainer);
        this.divContainer.appendChild(this.divWorld);
        this.divWorld.appendChild(this.divCamera);
        this.divCamera.appendChild(this.elm);
    }
    TargetReticle.prototype.onResize = function () {
        this.divWorld.style.width = window.innerWidth + "px";
        this.divWorld.style.height = window.innerHeight + "px";
        this.divCamera.style.width = window.innerWidth + "px";
        this.divCamera.style.height = window.innerHeight + "px";
        this.divCamera.style = CSS3D_Transform(this.divCamera.style, this.getCSS3D_cameraStyle(this.camera, camToCSSFov(this.camera.fov)));
    };
    TargetReticle.prototype.setPos = function (v) {
        //this.elm.style.transform = "rotate(" + this.increment + ")";
        //this.elm.style.transform += "translateZ(" + this.increment + "px) ";
        this.setCSSCamera(this.camera, camToCSSFov(this.camera.fov));
    };
    TargetReticle.prototype.setPosM = function (m) {
        //this.elm.style.transform = "";
        this.elm.style = CSS3D_Transform(this.elm.style, toCSSMatrix(m, false));
        this.divCamera.style = CSS3D_Transform(this.divCamera.style, this.getCSS3D_cameraStyle(this.camera, camToCSSFov(this.camera.fov)));
        //this.elm.style = CSS3D_Transform(this.elm.style, "translate3d(-300px, -100px, 0px)");
        //console.log(this.elm.style.transform.toString());
            };
    TargetReticle.prototype.setCSSCamera = function (cam, fov) {
        var camStyle = this.getCSS3D_cameraStyle(this.camera, camToCSSFov(this.camera.fov));
        //this.elm.style = camStyle;
        document.body.style = CSS3D_Transform(document.body.style, camStyle);
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
            a.elements[14] + 100, 
            a.elements[15]
        ];
    }
    for(var e in f) {
        f[e] = epsilon(f[e]);
    }
    return "matrix3d(" + f.join(",") + ")";
}
function setDivPosition(s, glo) {
}
function CSStransform(width, height, matrix) {
    var scale = 1;
    return [
        toCSSMatrix(matrix, false), 
        "scale3d(1,1,1)", 
        "translate3d(" + epsilon(-0.5 * width) + "px," + epsilon(-0.5 * height) + "px,0"
    ].join(" ");
}
function epsilon(a) {
    if(Math.abs(a) < 0.000001) {
        return 0;
    }
    return a;
}
//@ sourceMappingURL=TargetReticle.js.map
