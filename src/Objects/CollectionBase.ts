module Techne.Objects {
    export class CollectionBase extends THREE.Object3D implements IObject, ICollection {
        public minecraftPosition: THREE.Vector3;
        public textureOffset: THREE.Vector2;

        constructor(name: string, position?: number[], rotation?: number[]) {
            super();

            if (!position) {
                position = [0, 0, 0];
            }
            if (!rotation) {
                rotation = [0, 0, 0];
            }

            this.minecraftPosition = new THREE.Vector3(position[0], position[1], position[2]);
            this.position = this.minecraftPosition;

            this.rotation.set(rotation[0], rotation[1], rotation[2], "YZX");
            this.rotation.order = "YZX";
            this.rotation.reorder("YZX");
            this.updateRotation();
        }

        public updatePosition() {
        }
        public updateSize() {
        }
        public updateRotation() {
        }
        public updateTexture() {
        }

        public hasRotatedChild() {
            for (var index in this.children) {
                if (!this.children.hasOwnProperty(index)) {
                    continue;
                }

                var child = <IObject><any>this.children[index];

                if (child instanceof NullElement)
                    if ((<NullElement>child).hasRotatedChild())
                        return true;
                if (child.isRotated())
                    return true;
            }
        }

        public isRotated() {
            if (this.parent && !(this.parent instanceof THREE.Scene)) {
                if ((<IObject><any>this.parent).isRotated()) {
                    return true;
                }
            }

            if (!(this.rotation.x == 0 && this.rotation.y == 0 && this.rotation.z == 0)) {
                return true;
            }

            return false;
        }

        public addChild(object) {
            if (object == this) {
                console.warn('THREE.Object3D.add: An object can\'t be added as a child of itself.');
                return;
            }

            this.add(object);
        }

        public removeChild(child) {
            var index = this.children.indexOf(child);

            if (index == -1)
                return;

            this.remove(child);
        }

        public techneClone():CollectionBase {
            var clone = new CollectionBase(this.name, [this.minecraftPosition.x, this.minecraftPosition.y, this.minecraftPosition.z], [this.rotation.x, this.rotation.y, this.rotation.z]);
            this.children.map((child) => {
                clone.addChild((<Objects.IObject>child).techneClone());
            })
            return clone;
        }

        public threeClone(): THREE.Object3D {
            return super.clone();
        }

        public getChildrenForExport(): Objects.IObject[]{
            return <Objects.IObject[]>this.children;
        }
    }
}