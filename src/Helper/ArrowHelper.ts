// Based on ArrowHelper class in three.js

module Techne.Helper {
    export class ArrowHelper extends THREE.Object3D {
        private cone: THREE.Mesh;
        private cylinder: THREE.Mesh;
        private material: THREE.MeshBasicMaterial;

        constructor(origin: THREE.Vector3, public axis: Tools.IAxis, private hex?: number) {
            super();

            if (!hex) {
                this.hex = axis.color;
            }

            this.position = origin;

            this.material = new THREE.MeshBasicMaterial({ color: this.hex });

            var cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1);
            cylinderGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
            this.cylinder = new THREE.Mesh(cylinderGeometry, this.material);
            this.add(this.cylinder)

            var coneGeometry = new THREE.CylinderGeometry(0, 0.5, 1, 25, 1);
            coneGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -0.5, 0));

            this.cone = new THREE.Mesh(coneGeometry, this.material);
            this.cone.matrixAutoUpdate = false;
            this.add(this.cone);
            this.setDirection(axis.vector);
            this.setLength(8, 2, 2);
        }

        public setDirection(dir: THREE.Vector3) {

            var axis = new THREE.Vector3();
            var radians;

            // dir is assumed to be normalized
            if (dir.y > 0.99999) {

                this.quaternion.set(0, 0, 0, 1);

            } else if (dir.y < - 0.99999) {

                this.quaternion.set(1, 0, 0, 0);

            } else {

                axis.set(dir.z, 0, - dir.x).normalize();

                radians = Math.acos(dir.y);

                this.quaternion.setFromAxisAngle(axis, radians);

            }
        }

        public setLength(length, headLength, headWidth) {

            if (headLength === undefined) headLength = 0.2 * length;
            if (headWidth === undefined) headWidth = 0.2 * headLength;

            this.cylinder.scale.set(1, length, 1);
            this.cylinder.updateMatrix();

            this.cone.scale.set(headWidth, headLength, headWidth);
            this.cone.position.y = length;
            this.cone.updateMatrix();
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
            this.material.color.offsetHSL(0, 0, 0.3);
        }
        public endHover() {
            this.setColor(this.hex);
        }
    }
}