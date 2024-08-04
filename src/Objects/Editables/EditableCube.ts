// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne.Objects {
    export class EditableCube extends Cube implements IVisibleEditableObject {
        /*
         * Observed version of the name property
         */
        public observedName: KnockoutObservable<string>;
        /*
         * idk why I'm using this too...
         */
        public publicName: KnockoutComputed<string>;
        /*
         * true if the cube is currently selected
         */
        public selected: KnockoutObservable<boolean>;

        public logicalParent: Objects.IEditableCollection;

        constructor(name: string, size: number[], position: number[], rotation: number[], textureOffset: number[], material: THREE.Material) {
            super(name, size, position, rotation, textureOffset, material);

            this.observedName = ko.observable<string>();
            this.selected = ko.observable(false);

            this.publicName = ko.computed({
                read: function () {
                    return this.observedName();
                },
                write: function (newName) {
                    this.observedName(newName)
                    this.name = newName;
                },
                owner: this
            });

            this.publicName(name || "new cube");
            this.name = this.publicName();
        }

        /*
         * Toggles this cube's visibility
         */
        public toggleVisibility(visibility?: boolean): void {
            this.visible = visibility || !this.visible;
        }
        /*
         * Updates this cube's position
         */
        public updatePosition(): void {
            var size = this.scale;
            this.position = new THREE.Vector3((this.minecraftPosition.x + size.x / 2), (this.minecraftPosition.y + size.y / 2), (this.minecraftPosition.z + size.z / 2));
        }
       
        /*
         * Updates this cube's position
         */
        public updateRotation(): void {
            if (TechneBase.projectType == Techne.EditMode.Block && this.parent && !(this.parent instanceof THREE.Scene)) {
                if ((<NullElement><any>this.parent).isRotated()) {
                    this.rotation.x = 0;
                    this.rotation.y = 0;
                    this.rotation.z = 0;
                }
            }

            this.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
        }
        /*
         * Updates this cube's position
         */
        public updateTexture(): void {
        }
        /*
         * returns true if the cube has any rotation
         */
        public isRotated(): boolean {
            return !(this.rotation.x == 0 && this.rotation.y == 0 && this.rotation.z == 0);
        }

        public techneClone(): EditableCube {
            var clone = new EditableCube(this.name, [this.scale.x, this.scale.y, this.scale.z], [this.minecraftPosition.x, this.minecraftPosition.y, this.minecraftPosition.z],[this.rotation.x, this.rotation.y, this.rotation.z], [this.textureOffset.x, this.textureOffset.y], this.material)
            return clone;
        }
    }
}