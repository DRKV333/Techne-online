// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne.Objects {
    export class Cube extends THREE.Mesh implements IVisibleObject {
        public minecraftPosition: THREE.Vector3;
        public textureOffset: THREE.Vector2;

        constructor(name: string, size: number[], position: number[], rotation: number[], textureOffset: number[], material: THREE.Material) {
            var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
            super(cubeGeometry, material);

            this.minecraftPosition = new THREE.Vector3(position[0], position[1], position[2]);
            this.textureOffset = new THREE.Vector2(textureOffset[0], textureOffset[1]);

            this.castShadow = this.receiveShadow = true;
            this.rotation.set(rotation[0], rotation[1], rotation[2], "YZX");
            this.rotation.order = "YZX";
            this.rotation.reorder("YZX");
            this.updateRotation();

            this.position = new THREE.Vector3((position[0] + size[0] / 2), (position[1] + size[1] / 2), (position[2] + size[2] / 2));
            this.scale.set(size[0], size[1], size[2]);

            this.updateSize();
        }

        public updatePosition() {
        }

        public updateSize() {
            var helper = new Techne.Helper.TextureHelper(this, this.textureOffset);

            var right = helper.getRight();
            var left = helper.getLeft();
            var bottom = helper.getBottom();
            var top = helper.getTop();
            var back = helper.getBack();
            var front = helper.getFront();

            this.geometry.faceVertexUvs[0] = []
            this.geometry.faceVertexUvs[0].push([right[0], right[1], right[3]]);
            this.geometry.faceVertexUvs[0].push([right[1], right[2], right[3]]);

            this.geometry.faceVertexUvs[0].push([left[0], left[1], left[3]]);
            this.geometry.faceVertexUvs[0].push([left[1], left[2], left[3]]);

            this.geometry.faceVertexUvs[0].push([bottom[0], bottom[1], bottom[3]]);
            this.geometry.faceVertexUvs[0].push([bottom[1], bottom[2], bottom[3]]);

            this.geometry.faceVertexUvs[0].push([top[0], top[1], top[3]]);
            this.geometry.faceVertexUvs[0].push([top[1], top[2], top[3]]);

            this.geometry.faceVertexUvs[0].push([back[0], back[1], back[3]]);
            this.geometry.faceVertexUvs[0].push([back[1], back[2], back[3]]);

            this.geometry.faceVertexUvs[0].push([front[0], front[1], front[3]]);
            this.geometry.faceVertexUvs[0].push([front[1], front[2], front[3]]);

            //{ 0, 2, 3, 1},  // Right Face (Counter-Clockwise Order Starting RTF)
            //{ 4, 6, 7, 5},  // Left Face (Counter-Clockwise Order Starting LTB)
            //{ 4, 5, 0, 1},  // Top Face (Counter-Clockwise Order Starting LTB)
            //{ 7, 6, 3, 2},  // Bottom Face (Counter-Clockwise Order Starting LBF)
            //{ 5, 7, 2, 0},  // Front Face (Counter-Clockwise Order Starting LTF)
            //{ 1, 3, 6, 4}   // Back Face (Counter-Clockwise Order Starting RTB)

            this.geometry.uvsNeedUpdate = true;
            this.geometry.computeFaceNormals();

            if (this.scale.x == 0)
                this.scale.x = 0.0001;
            if (this.scale.y == 0)
                this.scale.y = 0.0001;
            if (this.scale.z == 0)
                this.scale.z = 0.0001;

            this.updatePosition();
        }

        public updateRotation() {
        }

        public updateTexture() {
        }

        public isRotated(): boolean {
            return false;
        }

        public techneClone(): Cube {
            var clone = new Cube(this.name, [this.scale.x, this.scale.y, this.scale.z], [this.minecraftPosition.x, this.minecraftPosition.y, this.minecraftPosition.z],[this.rotation.x, this.rotation.y, this.rotation.z], [this.textureOffset.x, this.textureOffset.y], this.material)
            return clone;
        }

        public threeClone(): THREE.Object3D {
            return super.clone();
        }
    }
}