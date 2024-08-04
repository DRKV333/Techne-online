// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne.Objects {
    export class NullElement extends CollectionBase {

        public minecraftPosition: THREE.Vector3;
        public textureOffset: THREE.Vector2;

        constructor(name: string, position?: number[], rotation?: number[]) {
            super(name, position, rotation);
        }
        public updateSize() {
            this.scale.x = 1;
            this.scale.y = 1;
            this.scale.z = 1;
        }

        public updateRotation() {
            if (TechneBase.projectType == Techne.EditMode.Block) {
                if (this.parent && !(this.parent instanceof THREE.Scene)) {
                    if ((<IObject><any>this.parent).isRotated()) {
                        this.rotation.x = 0;
                        this.rotation.y = 0;
                        this.rotation.z = 0;
                    }

                    if (this.hasRotatedChild()) {
                        this.rotation.x = 0;
                        this.rotation.y = 0;
                        this.rotation.z = 0;
                    }
                }
            }
        }

        public techneClone():NullElement {
            var clone = new NullElement(this.name, [this.minecraftPosition.x, this.minecraftPosition.y, this.minecraftPosition.z], [this.rotation.x, this.rotation.y, this.rotation.z]);
            this.children.map((child) => {
                clone.addChild((<Objects.IObject>child).techneClone());
            });
            return clone;
        }
    }
}