///<reference path='Three/three.d.ts' />

class BoidTracker {
    cam: THREE.Camera;
    pts: THREE.Vector3[];
    domE: HTMLElement;

    constructor(e: HTMLElement, points: THREE.Vector3[], camera: THREE.Camera) {
        this.cam = camera;
        this.pts = points;

        this.domE = e;
        this.domE.id = "boidTracker";

        document.body.appendChild(this.domE);
    }

    update() {
        
    }
}