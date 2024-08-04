module Techne.Objects {
    export class Array extends EditableCollectionBase {
        public count: number;
        public radius: number;
        public element: IEditableObject;


        constructor(name: string, position?: number[], rotation?: number[]) {
            super(name, position, rotation);

            this.count = 5;
            this.radius = 16;
        }

        public createSubscriptions(): void {
            var that = this; //wtf, why do I need this?

            this.observedChildren.subscribe((changes: any[]) => {
                for (var index in changes) {
                    if (!changes.hasOwnProperty(index)) {
                        continue;
                    }

                    var data = changes[index];

                    if (data.status == "deleted") {
                        data.value.parent = undefined;
                    }
                    var oldElem = that.element;
                    that.element = <IEditableObject>that.observedChildren()[0];
                    console.log("changed to", that.element);
                    if (that.element != oldElem) {
                        //this.updateArray();
                    }
                }
            },
                null, 'arrayChange');

            super.createSubscriptions();
        }

        public updateArray() {
            while (this.children.length > 0) {
                this.remove(this.children[0]);
            }
            
            if (this.observedChildren().length > 0 && this.element) {
                console.log("updating array", this);
                var theta = 2 * Math.PI / this.count;
                var radius = this.radius;

                for (var i = 0; i < this.count; i++) {
                    var parent = new THREE.Object3D();
                    var elem = this.element.threeClone();

                    // cancel out position either here or do that on the property changed callback
                    elem.position.set(0,0,0);
                    console.log("updating array", elem);
                    elem.translateX(radius);
                    parent.add(elem);
                    parent.rotateY(theta * i);
                    this.add(parent);
                }
            }
        }

        public techneClone(): Array {
            var clone = new Array(this.name, [this.minecraftPosition.x, this.minecraftPosition.y, this.minecraftPosition.z], [this.rotation.x, this.rotation.y, this.rotation.z]);
            this.observedChildren().map((child) => {
                clone.addChild(child.techneClone());
            })
            clone.radius = this.radius;
            clone.count = this.count;
            clone.updateArray();

            return clone;
        }

        public onChildChanged(child: Objects.IEditableObject, status: string, depth: number): void {
            this.updateArray();
            super.onChildChanged(child, status, depth);
        }
        public onChildPropertyChanged(child: Objects.IEditableObject, depth: number): void {
            this.updateArray();
            super.onChildPropertyChanged(child, depth);
        }

        public hasRotatedChild(): boolean {
            return true;
        }

        public getChildrenForExport(): Objects.IObject[] {
            var arr: Objects.IObject[] = [];
            arr.push(this.convertToObjects());
            return arr;
        }

        public convertToObjects(): Objects.IEditableCollection {
            var arr: Objects.IEditableCollection = new Objects.EditableNullElement(this.name, [0,0,0], [0,0,0]);
            var theta = 2 * Math.PI / this.count;
            var radius = this.radius;

            //todo: add on nullelement triggers history!
            //maybe set default pause state to true and only turn on when needed?
            for (var i = 0; i < this.count; i++) {
                    var parent = new Objects.EditableNullElement("Null Element", [0,0,0], [0,0,0]);
                    var elem = this.element.techneClone();
                    // cancel out position either here or do that on the property changed callback
                    elem.position.set(0,0,0);
                    elem.translateX(radius);
                    parent.addChild(elem);
                    parent.rotateY(theta * i);
                    arr.addChild(parent);
                }

            return arr;
        }
    }
}