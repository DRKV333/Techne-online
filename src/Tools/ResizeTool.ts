module Techne.Tools {
    export class ResizeTool extends ToolBase{
        private ribbons: Helper.CircularRibbtonHelper[] = [];
        private tool: Helper.CircularRibbtonHelper;
        private toolAxisPlane: THREE.Plane;

        constructor(controller: Controller) {
            super(controller);
            this.name = "resize";
        }

        public attachControls() {
            this.ribbons = [
                new Helper.CircularRibbtonHelper(new THREE.Vector3(), Tools.Axis.X),
                new Helper.CircularRibbtonHelper(new THREE.Vector3(), Tools.Axis.Y),
                new Helper.CircularRibbtonHelper(new THREE.Vector3(), Tools.Axis.Z)
            ];

            this.ribbons.map((a) => { this.add(a); });

            this.position = this.selectedObject.position;
            this.rotation = this.selectedObject.rotation;
        }

        public removeControls() {
            this.ribbons.map((a) => { this.remove(a); });
        }

        public start() {
            if (!this.isHover) {
                throw new Error("Invalid state");
            }

            this.toolAxisPlane = new THREE.Plane(this.tool.axis.normal);
        }
        public end() {
            if (!this.isHover && this.tool) {
                this.tool.endHover();
                this.tool = null;
            }
        }
        public update(): boolean {
            // todo: make is snap to 1 unit
            // do it properly too.
            if (this.isActive) {
                if (this.tool.axis == Tools.Axis.X) {
                    this.selectedObject.rotation.x += THREE.Math.degToRad(this.positionDelta.x);
                    //this.rotateOnAxis(this.tool.axis.normal, THREE.Math.degToRad(this.positionDelta.x));
                } else if (this.tool.axis == Tools.Axis.Y) {
                    this.selectedObject.rotation.y += THREE.Math.degToRad(this.positionDelta.y);
                    //this.rotateOnAxis(this.tool.axis.normal, THREE.Math.degToRad(this.positionDelta.y));
                } else if (this.tool.axis == Tools.Axis.Z) {
                      this.selectedObject.rotation.z += THREE.Math.degToRad(this.positionDelta.z);
                    //this.rotateOnAxis(this.tool.axis.normal, THREE.Math.degToRad(this.positionDelta.z));
                }

                this.selectedObject.updateRotation();
            }

            return true;
        }
        public startHover(intersection: THREE.Intersection) {
            this.tool = <Helper.CircularRibbtonHelper>intersection.object.parent;
            this.tool.startHover();
        }
        public endHover() {
            if (!this.isActive && this.tool) {
                this.tool.endHover();
                this.tool = null;
            }
        }

        public intersect(raycaster: THREE.Raycaster): THREE.Intersection {
            return {
                point: raycaster.ray.intersectPlane(this.toolAxisPlane),
                object: this.tool,
                distance: 0,
                face: null
            };
        }

        public dispose() {
            this.end();
        }
    }
}