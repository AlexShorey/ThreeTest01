///<reference path='Three/three.d.ts' />
///<reference path='GreenSock/greensock.d.ts' />
///<reference path='Flock.ts' />
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
    //otherlight: THREE.PointLight;
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
        ///this.renderer.domElement.id = ....
        this.theCube = new ThreeCube();
        this.flock = new Flock();
        this.flock.camera = this.camera;
        this.flock.boids.forEach(function (b) {
            _this.scene.add(b.mesh);
        });
        //this.theCube.startUpdating();
        this.scene.add(this.theCube.mesh);
        this.theLight = new THREE.PointLight(0xffffff);
        this.theLight.position.y = 300;
        this.theLight.position.z = 500;
        this.scene.add(this.theLight);
        this.mouseV = new THREE.Vector3(0, 0, 0.5);
        //window.onresize = (e) => this.onResize(e);
            }
    ThreeObj.prototype.onMouseDown = function (e) {
        this.flock.mDown(e);
    };
    ThreeObj.prototype.onMouseMove = function (e) {
        this.theCube.mesh.position = this.mouseToCamSpace(new THREE.Vector3(e.x, e.y, 0.5), 300);
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
    ThreeObj.prototype.mouseToCamSpace = function (m, d) {
        m = new THREE.Vector3(2 * m.x / window.innerWidth - 1, 2 * -m.y / window.innerHeight + 1, m.z);
        m = this.projector.unprojectVector(m, this.camera);
        m.subVectors(m, this.camera.position);
        m.normalize();
        m.addVectors(this.camera.position, m.multiplyScalar(d));
        return m;
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
window.onload = function () {
    var el = document.getElementById('content');
    hook = new UpdateHook(el);
    hook.start();
    threeObj = new ThreeObj();
    threeObj.draw();
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
};
function windowResize(e) {
    threeObj.onResize(e);
}
function mouseDown(e) {
    threeObj.onMouseDown(e);
}
function mouseMove(e) {
    threeObj.onMouseMove(e);
}
function mouseUp(e) {
    threeObj.onMouseUp(e);
}
//@ sourceMappingURL=app.js.map
