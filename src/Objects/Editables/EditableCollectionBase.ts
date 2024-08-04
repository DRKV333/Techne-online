module Techne.Objects {
    export class EditableCollectionBase extends CollectionBase implements IEditableCollection, IEditableObject {
        /*
         * an observable array that holds the children
         * use this if you want to manipulate .children too
         */
        public observedChildren: KnockoutObservableArray<IEditableObject>;
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
        /*
         * This element's position in minecraft coordinates
         */
        public minecraftPosition: THREE.Vector3;
        /*
         * This element's textureoffset
         */
        public textureOffset: THREE.Vector2;
        public logicalParent: Objects.IEditableCollection;


        constructor(name: string, position?: number[], rotation?: number[]) {
            super(name, position, rotation);
            this.selected = ko.observable(false);

            this.observedName = ko.observable<string>();
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

            this.publicName(name || "null element");
            this.observedChildren = ko.observableArray<IEditableObject>();
            this.selected = ko.observable(false);

            this.createSubscriptions();
        }

        public createSubscriptions(): void {
            this.observedChildren.subscribe((changes: any[]) => {
                changes.map((data) => {
                    switch (data.status) {
                        case "deleted":
                            amplify.publish("ObjectRemoved", { element: data.value, parent: this });
                            data.value.logicalParent = undefined;
                            break;
                        case "added":
                            data.value.logicalParent = this;
                            amplify.publish("ObjectAdded", { element: data.value, parent: this });
                            break;
                    }

                    this.onChildChanged(data.value, data.status, 0);
                });
            },
                null, 'arrayChange');
        }


        /*
         * Toggles visibility of this element and children
         */
        public toggleVisibility(visibility?: boolean): void {
            this.visible = visibility || !this.visible

            var children = this.observedChildren();

            children.map((child) => {
                child.toggleVisibility(this.visible);
            });
        }
        /*
         * Updates this elements's position
         */
        public updatePosition(): void {
        }
        /*
         * Updates this elements's size
         */
        public updateSize(): void {
        }
        /*
         * Updates this elements's rotation
         */
        public updateRotation(): void {
        }
        /*
         * returns true if any of this elemen'ts children is rotated
         * This check is needed for block models.
         */
        public hasRotatedChild(): boolean {
            var children = this.observedChildren();
            return !children.map((child) => {
                return children.map((child) => {
                    if (child instanceof EditableCollectionBase)
                        if ((<Objects.IEditableCollection><any>child).hasRotatedChild())
                            return true;
                    if (child.isRotated())
                        return true;
                });
            }).some((value) => !value);
        }
        /*
         * return true if this element or any of its parents is rotated
         */
        public isRotated(): boolean {
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
        /*
         * Adds a child to this element
         */
        public addChild(object: Objects.IEditableObject): void {
            if (object == this) {
                console.warn('THREE.Object3D.add: An object can\'t be added as a child of itself.');
                return;
            }

            this.observedChildren.push(object);
        }
        /*
         * Removes a child from this element
         */
        public removeChild(child: Objects.IEditableObject): void {
            var index = this.observedChildren.indexOf(child);

            if (index == -1)
                return;

            this.observedChildren.remove(child);
        }
        /*
         * Updates this elements's texture
         */
        public updateTexture(): void {
        }

        public techneClone():EditableCollectionBase {
            //never clone logical parent!
            var clone = new EditableCollectionBase(this.name, [this.minecraftPosition.x, this.minecraftPosition.y, this.minecraftPosition.z], [this.rotation.x, this.rotation.y, this.rotation.z]);
            this.observedChildren().map((child) => {
                clone.addChild(child.techneClone());
            })
            return clone;
        }

        public onChildChanged(child: Objects.IEditableObject, status: string, depth: number): void {
            console.log("Child changed", status, child, this, this.parent);
            if (this.logicalParent) {
                this.logicalParent.onChildChanged(child, status, depth++);
            }
        }

        public onChildPropertyChanged(child: Objects.IEditableObject, depth: number): void {
            if (this.logicalParent) {
                this.logicalParent.onChildPropertyChanged(child, depth++);
            }
        }
    }
}