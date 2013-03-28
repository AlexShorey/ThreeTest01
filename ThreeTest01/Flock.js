/// <reference path='Three/three.d.ts' />
var Flock = (function () {
    function Flock() {
        var _this = this;
        this.boids = [];
        this.boids = [];
        this.material = new THREE.MeshLambertMaterial({
            color: 0xFF0000
        });
        this.projector = new THREE.Projector();
        for(var i = 0; i < 300; i++) {
            this.boids.push(new Boid((Math.random() - 0.5) * 400, (Math.random() - 0.5) * 400, (Math.random() - 0.5) * 400));
        }
        this.boids.forEach(function (b) {
            b.setMaterial(_this.material);
        });
    }
    Flock.prototype.mDown = function (e) {
        var _this = this;
        this.sinker = this.mouseToCamSpace(new THREE.Vector3(e.x, e.y, 0.5), 300);
        this.boids.forEach(function (b) {
            b.sinkV = _this.sinker;
            b.isPressed = true;
        });
    };
    Flock.prototype.mMove = function (e) {
        var _this = this;
        this.sinker = this.mouseToCamSpace(new THREE.Vector3(e.x, e.y, 0.5), 300);
        this.boids.forEach(function (b) {
            b.sinkV = _this.sinker;
        });
    };
    Flock.prototype.mUp = function (e) {
        var sinker = this.mouseToCamSpace(new THREE.Vector3(e.x, e.y, 0.5), 300);
        this.boids.forEach(function (b) {
            b.sinkV = sinker;
            b.isPressed = false;
        });
    };
    Flock.prototype.run = function () {
        var _this = this;
        this.boids.forEach(function (b) {
            b.run(_this.boids);
        });
    };
    Flock.prototype.addBoid = function (b) {
        this.boids.push(b);
    };
    Flock.prototype.mouseToCamSpace = function (m, d) {
        m = new THREE.Vector3(2 * m.x / window.innerWidth - 1, 2 * -m.y / window.innerHeight + 1, m.z);
        m = this.projector.unprojectVector(m, this.camera);
        m.subVectors(m, this.camera.position);
        m.normalize();
        m.addVectors(this.camera.position, m.multiplyScalar(d));
        return m;
    };
    return Flock;
})();
var Boid = (function () {
    function Boid(x, y, z) {
        this.acceleration = new THREE.Vector3(0, 0, 0);
        this.velocity = new THREE.Vector3((Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2, (Math.random() - 0.5) * 2);
        this.location = new THREE.Vector3(x, y, z);
        this.r = 2.0;
        // ORIGINAL VALUES
        //this.maxspeed = 2;
        //this.maxforce = 0.03;
        // be sure to adjust the sink value multiplier
        this.maxspeed = 7;
        this.maxforce = 0.8;
        this.geometry = new THREE.CubeGeometry(5, 5, 10);
        this.material = new THREE.MeshLambertMaterial();
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    }
    Boid.prototype.setMaterial = function (mtl) {
        this.material = mtl;
        this.mesh = new THREE.Mesh(this.geometry, this.material);
    };
    Boid.prototype.run = function (bds) {
        this.flock(bds);
        this.update();
        this.borders();
        this.render();
    };
    Boid.prototype.applyForce = function (force) {
        this.acceleration.add(force);
    };
    Boid.prototype.flock = function (bds) {
        var sep = this.separate(bds);
        var ali = this.align(bds);
        var coh = this.cohesion(bds);
        sep.multiplyScalar(1.5);
        ali.multiplyScalar(1);
        coh.multiplyScalar(1);
        this.applyForce(sep);
        this.applyForce(ali);
        this.applyForce(coh);
        //*****************************************************************
        //compensate for subtle positive value bias
        //affects loaners more than groupies
        this.applyForce(new THREE.Vector3(-0.012, -0.012, -0.012));
        //*****************************************************************
        if(this.isPressed) {
            this.applyForce(this.sink(this.sinkV));
        }
    };
    Boid.prototype.update = function () {
        this.velocity.add(this.acceleration);
        if(this.velocity.length() > this.maxspeed) {
            this.velocity.setLength(this.maxspeed);
        }
        // clamp doesn't do what i thought it did
        //this.velocity.clamp(new THREE.Vector3(0, 0, 0),
        //                   new THREE.Vector3(this.maxspeed, this.maxspeed, this.maxspeed));
        this.location.add(this.velocity);
        this.acceleration.multiplyScalar(0);
    };
    Boid.prototype.seek = function (target) {
        var desired = new THREE.Vector3();
        desired.subVectors(target, this.location);
        desired.normalize();
        desired.multiplyScalar(this.maxspeed);
        var steer = new THREE.Vector3();
        steer.subVectors(desired, this.velocity);
        steer.clamp(new THREE.Vector3(0, 0, 0), new THREE.Vector3(this.maxforce, this.maxforce, this.maxforce));
        return steer;
    };
    Boid.prototype.render = function () {
        this.mesh.position = this.location;
        this.mesh.lookAt(new THREE.Vector3().addVectors(this.mesh.position, this.velocity));
    };
    Boid.prototype.borders = function () {
        var bound = 200;
        if(this.location.x < -bound - this.r) {
            this.location.x = bound + this.r;
        }
        if(this.location.x > bound + this.r) {
            this.location.x = -bound - this.r;
        }
        if(this.location.y < -bound - this.r) {
            this.location.y = bound + this.r;
        }
        if(this.location.y > bound + this.r) {
            this.location.y = -bound - this.r;
        }
        if(this.location.z < -bound - this.r) {
            this.location.z = bound + this.r;
        }
        if(this.location.z > bound + this.r) {
            this.location.z = -bound - this.r;
        }
    };
    Boid.prototype.separate = function (bds) {
        var _this = this;
        //var desiredseparation = 10.0;
        var desiredseparation = 15;
        var steer = new THREE.Vector3(0, 0, 0);
        var count = 0;
        // For every boid in the system, check if it's too close
        bds.forEach(function (b) {
            var d = _this.location.distanceTo(b.location);
            if((d > 0) && (d < desiredseparation)) {
                var diff = new THREE.Vector3();
                diff.subVectors(_this.location, b.location);
                diff.normalize();
                diff.divideScalar(d);
                steer.add(diff);
                count++;
            }
        });
        if(count > 0) {
            steer.divideScalar(count);
        }
        if(steer.length() > 0) {
            steer.normalize();
            steer.multiplyScalar(this.maxspeed);
            steer.sub(this.velocity);
            if(steer.length() > this.maxforce) {
                steer.setLength(this.maxforce);
            }
        }
        return steer;
    };
    Boid.prototype.align = function (bds) {
        var _this = this;
        var neighbordist = 25;
        var sum = new THREE.Vector3(0, 0, 0);
        var count = 0;
        bds.forEach(function (b) {
            var d = _this.location.distanceTo(b.location);
            if((d > 0) && (d < neighbordist)) {
                sum.add(b.velocity);
                count++;
            }
        });
        if(count > 0) {
            sum.divideScalar(count);
            sum.normalize();
            sum.multiplyScalar(this.maxspeed);
            var steer = new THREE.Vector3();
            steer.subVectors(sum, this.velocity);
            if(steer.length() > this.maxforce) {
                steer.setLength(this.maxforce);
            }
            return steer;
        } else {
            return new THREE.Vector3(0, 0, 0);
        }
    };
    Boid.prototype.cohesion = function (boids) {
        var _this = this;
        var neighbordist = 25;
        var sum = new THREE.Vector3(0, 0, 0);
        var count = 0;
        boids.forEach(function (b) {
            var d = _this.location.distanceTo(b.location);
            if((d > 0) && (d < neighbordist)) {
                sum.add(b.location);
                count++;
            }
        });
        if(count > 0) {
            sum.divideScalar(count);
            return this.seek(sum);
        } else {
            return new THREE.Vector3(0, 0, 0);
        }
    };
    Boid.prototype.sink = function (target) {
        var desired = new THREE.Vector3();
        var dist = this.location.distanceTo(target);
        var steer = new THREE.Vector3();
        desired.subVectors(target, this.location);
        desired.normalize();
        desired.multiplyScalar(this.maxspeed);
        steer.subVectors(desired, this.velocity);
        //modify when maxSpeed and maxForce are modified
        steer.setLength(dist / 1500 * 20);
        if(dist > 100 && dist < 150) {
            return steer;
        } else {
            //else if (dist < 50)
            //  return steer.negate().multiplyScalar(2);
            return new THREE.Vector3(0, 0, 0);
        }
    };
    return Boid;
})();
//@ sourceMappingURL=Flock.js.map
