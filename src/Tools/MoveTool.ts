module Techne.Tools {
    export class MoveTool extends ToolBase {
        private arrows: Helper.ArrowHelper[];
        private tool: Helper.ArrowHelper;
        private toolAxisPlane: THREE.Plane;

        constructor(controller: Controller) {
            super(controller);
            this.name = "move";
        }

        public attachControls() {
            //this.arrows = [
            //    new THREE.ArrowHelper(new THREE.Vector3(1, 0, 0), new THREE.Vector3(), 8, 0x00FF00),
            //    new THREE.ArrowHelper(new THREE.Vector3(0, -1, 0), new THREE.Vector3(), 8, 0x00FF00),
            //    new THREE.ArrowHelper(new THREE.Vector3(0, 0, 1), new THREE.Vector3(), 8, 0x00FF00),
            //];

            this.arrows = [
                new Helper.ArrowHelper(new THREE.Vector3(), Tools.Axis.X),
                new Helper.ArrowHelper(new THREE.Vector3(), Tools.Axis.Y),
                new Helper.ArrowHelper(new THREE.Vector3(), Tools.Axis.Z)
            ];
            
            this.arrows.map((a) => { this.add(a); });

            this.position = this.selectedObject.minecraftPosition;
            //todo: think of cloning the vector so you don't assign the same thing multiple times
            //also need to take care of nay filtering in the controller
        }

        public removeControls() {
            this.arrows.map((a) => { this.remove(a); });
        }

        public start() {
            if (!this.isHover) {
                throw new Error("Invalid state");
            }

            //todo: add offset
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
                    if (Math.abs(this.positionDelta.x) < 1) {
                        return false;
                    }
                    
                    this.translateX(this.positionDelta.x);

                    this.controller.positionX(this.position.x);
                } else if (this.tool.axis == Tools.Axis.Y) {
                    if (Math.abs(this.positionDelta.y) < 1) {
                        return false;
                    }

                    this.translateY(this.positionDelta.y);

                    this.controller.positionY(this.position.y);
                } else if (this.tool.axis == Tools.Axis.Z) {
                    if (Math.abs(this.positionDelta.z) < 1) {
                        return false;
                    }

                    this.translateZ(this.positionDelta.z);

                    this.controller.positionZ(this.position.z);
                }
            }

            return true;
        }

        public startHover(intersection: THREE.Intersection) {
            this.tool = <Helper.ArrowHelper>intersection.object.parent;
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