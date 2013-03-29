///<reference path='Three/three.d.ts' />
///<reference path='GreenSock/greensock.d.ts' />
///<reference path='Flock.ts' />
///<reference path='TargetReticle.ts' />

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

    theLight: THREE.PointLight;

    trackedPt: THREE.Vector3;

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

        this.flock = new Flock();
        this.flock.camera = this.camera;
        
        this.theCube = new ThreeCube();
        
        this.theLight = new THREE.PointLight(0xffffff);
        this.theLight.position.y = 300;
        this.theLight.position.z = 500;

        this.scene.add(this.theCube.mesh);
        this.scene.add(this.theLight);
        this.flock.boids.forEach((b) => {
            this.scene.add(b.mesh);
        });
    }

    onMouseDown(e: MouseEvent) {
        this.flock.mDown(e);
    }

    onMouseMove(e: MouseEvent) {
        this.theCube.mesh.position = this.screenToSpace(new THREE.Vector3(e.x, e.y, 0.5), 300);
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
        this.camera.lookAt(new THREE.Vector3(0, 0, 0));

        this.renderer.render(this.scene, this.camera);

        window.requestAnimationFrame(() => this.draw());
    }

    screenToSpace(m: THREE.Vector3, d: number): THREE.Vector3 {
        m = new THREE.Vector3(2 * m.x / window.innerWidth - 1, 2 * -m.y / window.innerHeight + 1, m.z);
        m = this.projector.unprojectVector(m, this.camera);
        m.subVectors(m, this.camera.position);
        m.normalize();
        m.addVectors(this.camera.position, m.multiplyScalar(d));
        return m;
    }

    spaceToScreen(v: THREE.Vector3): THREE.Vector3 {
        v = this.projector.projectVector(v, this.camera);
        v.x = v.x * window.innerWidth/2 + window.innerWidth/2;
        v.y = window.innerHeight - (v.y * window.innerHeight / 2 + window.innerHeight / 2);
        v.z = 0;
        return v;
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

//reference inclusions
document.writeln("<script src='TargetReticle.js'></script>");
document.writeln("<script src='Three/three.min.js'></script>");
document.writeln("<script src='Flock.js'></script>");
document.writeln("<script src='CSS3D_Polyfill.js'></script>");

var hook: UpdateHook;
var threeObj: ThreeObj;
var tgt: TargetReticle;

window.onload = () => {
    /*
    include dependencies exclusively from javascript.
    Doesn't work yet because objects are declared before 
    resources are referenced.

    FIXED: see above. document.writeln(""); can accomplish references
    before object instantiation occurs.

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

    tgt = new TargetReticle(threeObj.camera);
    

    //set global even subscribers
    document.onmousedown = (e) => mouseDown(e);
    document.onmousemove = (e) => mouseMove(e);
    document.onmouseup   = (e) => mouseUp(e);
    window.onresize = (e) => windowResize(e);

    updateElements();
};

function updateElements() {
    //tgt.setPos(threeObj.spaceToScreen(threeObj.flock.boids[100].mesh.position.clone()));
    tgt.setPosM(threeObj.flock.boids[100].mesh.matrix);
    window.requestAnimationFrame(() => updateElements());
}

function windowResize(e:UIEvent) {
    threeObj.onResize(e);
    //var skizzle = document.getElementById('tRet');
    //console.log('target top: ' + skizzle.style.top);
}

function mouseDown(e: MouseEvent) {
    threeObj.onMouseDown(e);
    var something = threeObj.spaceToScreen(threeObj.flock.boids[0].sinkV);
}

function mouseMove(e: MouseEvent) {
    threeObj.onMouseMove(e);
}

function mouseUp(e: MouseEvent) {
    threeObj.onMouseUp(e);
}

