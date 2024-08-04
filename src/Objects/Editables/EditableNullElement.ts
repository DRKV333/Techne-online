// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne.Objects {
    export class EditableNullElement extends EditableCollectionBase {
        constructor(name: string, position?: number[], rotation?: number[]) {
            super(name, position, rotation);
        }

        public createSubscriptions(): void {
            this.observedChildren.subscribe((changes: any[]) => {
                for (var index in changes) {
                    if (!changes.hasOwnProperty(index)) {
                        continue;
                    }

                    var data = changes[index];

                    switch (data.status) {
                        case "deleted":
                            this.remove(data.value);
                            break;
                        case "added":
                            this.add(data.value);
                            break;
                    }
                }
            },
                null, 'arrayChange');

            super.createSubscriptions();
        }

        /*
         * Updates this elements's size
         */
        public updateSize(): void {
            this.scale.x = 1;
            this.scale.y = 1;
            this.scale.z = 1;
        }
        /*
         * Updates this elements's rotation
         */
        public updateRotation(): void {
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

        public techneClone():EditableNullElement {
            var clone = new EditableNullElement(this.name, [this.minecraftPosition.x, this.minecraftPosition.y, this.minecraftPosition.z], [this.rotation.x, this.rotation.y, this.rotation.z]);
            this.observedChildren().map((child) => {
                clone.addChild(child.techneClone());
            });
            return clone;
        }
    }
}