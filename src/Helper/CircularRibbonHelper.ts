// Based on ArrowHelper class in three.js

module Techne.Helper {
    export class CircularRibbtonHelper extends THREE.Object3D {
        private material: THREE.MeshBasicMaterial;
        private ribbon: THREE.Object3D;

        constructor(origin: THREE.Vector3, public axis: Tools.IAxis, private hex?: number) {
            super();

            if (!hex) {
                this.hex = axis.color;
            }

            this.material = new THREE.MeshBasicMaterial({ color: this.hex });
            var geometry = new THREE.SphereGeometry(8, 32,32,0, Math.PI * 2, Math.PI / 2 - Math.PI / 48, Math.PI / 24);

            

            this.ribbon = new THREE.Mesh(geometry, this.material);
            //this.material.side = THREE.DoubleSide;
            this.material.opacity = 0.5;

            this.setDirection(axis.rotation.clone());
            this.add(this.ribbon);
        }

        public setDirection(dir: THREE.Vector3) {
            if (this.axis == Techne.Tools.Axis.X) {
                dir.set(1, 0, 1);
            } else {
                dir.x += 1;
            }

            dir = dir.multiplyScalar(Math.PI / 2);
            this.quaternion.setFromEuler(new THREE.Euler(dir.x, dir.y, dir.z, "XYZ"), true);
        }

        
        public setColor(hex: number) {
            this.material.color.setHex(hex);
        }

        public mouseDown() {
            this.material.color.offsetHSL(0, 0, 0.3);
        }
        public mouseUp() {
            this.setColor(this.hex);
        }
        public startHover() {
            //this.material.color.offsetHSL(0, 0, 0.3);
            this.material.opacity = 1;
        }

        public endHover() {
            //this.setColor(this.hex);
            this.material.opacity = 0.5;
        }
    }
}