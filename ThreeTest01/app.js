///<reference path='Three/three.d.ts' />
///<reference path='GreenSock/greensock.d.ts' />
///<reference path='Flock.ts' />
///<reference path='TargetReticle.ts' />
var UpdateHook = (function () {
    function UpdateHook(e) {
        this.element = e;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
    }
    UpdateHook.prototype.update = function () {
        var _this = this;
        this.span.innerHTML = new Date().toUTCString();
        window.requestAnimationFrame(function () {
            return _this.update();
        });
    };
    UpdateHook.prototype.start = function () {
        this.update();
    };
    UpdateHook.prototype.stop = function () {
        clearTimeout(this.timerToken);
    };
    return UpdateHook;
})();
var ThreeObj = (function () {
    function ThreeObj() {
        var _this = this;
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.element = document.getElementById('webglDiv');
        this.camera = new THREE.PerspectiveCamera(70, this.width / this.height, 1, 10000);
        this.projector = new THREE.Projector();
        this.camera.position.y = 150;
        this.camera.position.z = 300;
        this.scene = new THREE.Scene();
        this.renderer = new THREE.WebGLRenderer();
        this.renderer.setSize(this.width, this.height);
        //this.element.appendChild(this.renderer.domElement);
        document.body.appendChild(this.renderer.domElement);
        this.renderer.domElement.id = "glid";
        this.flock = new Flock();
        this.flock.camera = this.camera;
        this.theCube = new ThreeCube();
        this.theLight = new THREE.PointLight(0xffffff);
        this.theLight.position.y = 300;
        this.theLight.position.z = 500;
        this.scene.add(this.theCube.mesh);
        this.scene.add(this.theLight);
        this.flock.boids.forEach(function (b) {
            _this.scene.add(b.mesh);
        });
    }
    ThreeObj.prototype.onMouseDown = function (e) {
        this.flock.mDown(e);
    };
    ThreeObj.prototype.onMouseMove = function (e) {
        this.theCube.mesh.position = this.screenToSpace(new THREE.Vector3(e.x, e.y, 0.5), 300);
        this.flock.mMove(e);
    };
    ThreeObj.prototype.onMouseUp = function (e) {
        this.flock.mUp(e);
    };
    ThreeObj.prototype.onResize = function (e) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    };
    ThreeObj.prototype.draw = function () {
        var _this = this;
        this.flock.run();
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));
        this.renderer.render(this.scene, this.camera);
        window.requestAnimationFrame(function () {
            return _this.draw();
        });
    };
    ThreeObj.prototype.screenToSpace = function (m, d) {
        m = new THREE.Vector3(2 * m.x / window.innerWidth - 1, 2 * -m.y / window.innerHeight + 1, m.z);
        m = this.projector.unprojectVector(m, this.camera);
        m.subVectors(m, this.camera.position);
        m.normalize();
        m.addVectors(this.camera.position, m.multiplyScalar(d));
        return m;
    };
    ThreeObj.prototype.spaceToScreen = function (v) {
        v = this.projector.projectVector(v, this.camera);
        v.x = v.x * window.innerWidth / 2 + window.innerWidth / 2;
        v.y = window.innerHeight - (v.y * window.innerHeight / 2 + window.innerHeight / 2);
        v.z = 0;
        console.log(v);
        return v;
    };
    return ThreeObj;
})();
var ThreeCube = (function () {
    function ThreeCube() {
        this.geometry = new THREE.CubeGeometry(10, 10, 10);
        this.material = new THREE.MeshLambertMaterial({
            color: 0xFF0000
        });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position = new THREE.Vector3(0, 0, 0);
    }
    return ThreeCube;
})();
var hook;
var threeObj;
var tgt;
window.onload = function () {
    /*
    include dependencies exclusively from javascript.
    Doesn't work yet because objects are declared before
    resources are referenced.
    
    var ref = <HTMLScriptElement>document.createElement("script");
    ref.type = 'text/javascript';
    ref.src = "<script src='TargetReticle.js'></script>";
    document.body.appendChild(ref);
    */
    var el = document.getElementById('content');
    hook = new UpdateHook(el);
    hook.start();
    threeObj = new ThreeObj();
    threeObj.draw();
    tgt = new TargetReticle();
    //set global even subscribers
    document.onmousedown = function (e) {
        return mouseDown(e);
    };
    document.onmousemove = function (e) {
        return mouseMove(e);
    };
    document.onmouseup = function (e) {
        return mouseUp(e);
    };
    window.onresize = function (e) {
        return windowResize(e);
    };
    updateElements();
};
function updateElements() {
    tgt.setPos(threeObj.spaceToScreen(threeObj.flock.boids[100].mesh.position.clone()));
    window.requestAnimationFrame(function () {
        return updateElements();
    });
}
function windowResize(e) {
    threeObj.onResize(e);
    var skizzle = document.getElementById('tRet');
    console.log('target top: ' + skizzle.style.top);
}
function mouseDown(e) {
    threeObj.onMouseDown(e);
    var something = threeObj.spaceToScreen(threeObj.flock.boids[0].sinkV);
}
function mouseMove(e) {
    threeObj.onMouseMove(e);
}
function mouseUp(e) {
    threeObj.onMouseUp(e);
}
//@ sourceMappingURL=app.js.map
