///<reference path='Three/three.d.ts' />
///<reference path='GreenSock/greensock.d.ts' />
///<reference path='Flock.ts' />

class UpdateHook {
    element: HTMLElement;
    span: HTMLElement;
    timerToken: number;
    

    constructor(e: HTMLElement) {

        this.element = e;
        this.element.innerHTML += "The time is: ";
        this.span = document.createElement('span');
        this.element.appendChild(this.span);
        this.span.innerText = new Date().toUTCString();
        
    }

    update() {
        this.span.innerHTML = new Date().toUTCString();
        window.requestAnimationFrame(() => this.update());
    }

    start() {
        this.update();
    }

    stop() {
        clearTimeout(this.timerToken);
    }
}

class ThreeObj {
    element:  HTMLElement;
    camera: THREE.PerspectiveCamera;
    projector: THREE.Projector;
    scene:    THREE.Scene;
    renderer: THREE.WebGLRenderer;

    width: number = window.innerWidth;
    height: number = window.innerHeight;

    theCube: ThreeCube;
    flock: Flock;
    mouseV: THREE.Vector3;

    theLight: THREE.PointLight;
    //otherlight: THREE.PointLight;

    constructor() {
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
        this.flock.boids.forEach((b) => { this.scene.add(b.mesh); });
        //this.theCube.startUpdating();
        this.scene.add(this.theCube.mesh);
        this.theLight = new THREE.PointLight(0xffffff);
        this.theLight.position.y = 300;
        this.theLight.position.z = 500;
        this.scene.add(this.theLight);

        this.mouseV = new THREE.Vector3(0, 0, 0.5);

        //window.onresize = (e) => this.onResize(e);
    }

    onMouseDown(e: MouseEvent) {
        this.flock.mDown(e);
    }

    onMouseMove(e: MouseEvent) {
        this.theCube.mesh.position = this.mouseToCamSpace(new THREE.Vector3(e.x, e.y, 0.5), 300);
        this.flock.mMove(e);
    }

    onMouseUp(e: MouseEvent) {
        this.flock.mUp(e);
    }

    onResize(e:UIEvent) {
        this.width = window.innerWidth;
        this.height = window.innerHeight;
        this.renderer.setSize(this.width, this.height);
        this.camera.aspect = window.innerWidth / window.innerHeight;
        this.camera.updateProjectionMatrix();
    }

    draw() {
        this.flock.run();
        this.camera.lookAt(new THREE.Vector3(0,0,0));

        this.renderer.render(this.scene, this.camera);

        window.requestAnimationFrame(() => this.draw());
    }

    mouseToCamSpace(m: THREE.Vector3, d: number): THREE.Vector3 {
        m = new THREE.Vector3(2 * m.x / window.innerWidth - 1, 2 * -m.y / window.innerHeight + 1, m.z);
        m = this.projector.unprojectVector(m, this.camera);
        m.subVectors(m, this.camera.position);
        m.normalize();
        m.addVectors(this.camera.position, m.multiplyScalar(d));
        return m;
    }

}

class ThreeCube {
    mesh: THREE.Mesh;
    geometry: THREE.CubeGeometry;
    material: THREE.MeshLambertMaterial;

    constructor() {
        this.geometry = new THREE.CubeGeometry(10, 10, 10);
        this.material = new THREE.MeshLambertMaterial({ color: 0xFF0000 });
        this.mesh = new THREE.Mesh(this.geometry, this.material);
        this.mesh.position = new THREE.Vector3(0, 0, 0);
    }
}

var hook: UpdateHook;
var threeObj: ThreeObj;

window.onload = () => {
    var el = document.getElementById('content');
    hook = new UpdateHook(el);
    hook.start();

    threeObj = new ThreeObj();
    threeObj.draw();

    //set global even subscribers
    document.onmousedown = (e) => mouseDown(e);
    document.onmousemove = (e) => mouseMove(e);
    document.onmouseup   = (e) => mouseUp(e);
    window.onresize      = (e) => windowResize(e);
};

function windowResize(e:UIEvent) {
    threeObj.onResize(e);
}

function mouseDown(e: MouseEvent) {
    threeObj.onMouseDown(e);
}

function mouseMove(e: MouseEvent) {
    threeObj.onMouseMove(e);
}

function mouseUp(e: MouseEvent) {
    threeObj.onMouseUp(e);
}