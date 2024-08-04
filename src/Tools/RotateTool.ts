module Techne.Tools {
    export class RotateTool extends ToolBase{
        private ribbons: Helper.CircularRibbtonHelper[] = [];
        private tool: Helper.CircularRibbtonHelper;
        private axis: THREE.Vector3;
        private toolAxisPlane: THREE.Plane;
        private startingPoint: THREE.Vector3;
        private currentPosition: THREE.Vector3;
        private startingRotation: THREE.Euler;
        private protractor: Protractor;
        private totalAngle: number;
        private startAngle: number;

        constructor(controller: Controller) {
            super(controller);
            this.name = "rotate";
        }

        public attachControls() {
            this.ribbons = [
                new Helper.CircularRibbtonHelper(new THREE.Vector3(), Tools.Axis.X),
                new Helper.CircularRibbtonHelper(new THREE.Vector3(), Tools.Axis.Y),
                new Helper.CircularRibbtonHelper(new THREE.Vector3(), Tools.Axis.Z)
            ];

            this.ribbons.map((a) => { this.add(a); });

            this.position = this.selectedObject.position;
            this.rotation = this.selectedObject.rotation.clone();
        }

        public removeControls() {
            this.ribbons.map((a) => { this.remove(a); });
        }

        public start() {
            if (!this.isHover) {
                throw new Error("Invalid state");
            }

            this.updateMatrix();
            this.updateMatrixWorld(true);

            this.axis = this.selectedObject.localToWorld(this.tool.axis.vector.clone()).sub(this.selectedObject.position).normalize();
            var distance;
            var pos = this.selectedObject.position.clone();

            if (this.tool.axis == Techne.Tools.Axis.X) {
                distance = pos.x;
             } else if (this.tool.axis == Techne.Tools.Axis.Y) {
                distance = pos.y;
            } else if (this.tool.axis == Techne.Tools.Axis.Z) {
                distance = pos.z;
            }
            
            this.toolAxisPlane = new THREE.Plane(this.axis, distance);
            this.protractor = new Protractor(this.tool.axis, this.selectedObject.position.clone(), this.selectedObject.position.clone(), this.selectedObject.position.clone());
            this.protractor.rotation = this.rotation.clone();
            //this.add(this.protractor);
            Editor.Instance.scene.add(this.protractor);
        }
        public end() {
            if (!this.isHover && this.tool) {
                this.tool.endHover();
                this.tool = null;
            }

            this.startingPoint = null;
            Editor.Instance.scene.remove(this.protractor);
        }
        public update(): boolean {
            // todo: make is snap to 1 unit
            // do it properly too.
            if (this.isActive) {
                // I don't need that, I can just return false and never have lastPosition update.
                if (!this.startingPoint) {
                    this.startingPoint = this.lastPosition;
                    this.startingRotation = this.rotation.clone();
                    this.protractor.setStart(this.startingPoint.clone());
                    this.totalAngle = 0;
                    this.startAngle = 0;
                    this.startAngle = -this.getCurrentAngleDelta();
                    this.totalAngle = 0;
                }

                var angleDelta = this.getCurrentAngleDelta();
                //this.totalAngle += angleDelta;
//                console.log(angleDelta, this.totalAngle, this.currentPosition.x, this.currentPosition.z, this.lastPosition.x, this.lastPosition.z);

                // adapted version https://gist.github.com/clavis-magna/4138387
                var rotationMatrix = new THREE.Matrix4();
                rotationMatrix.makeRotationAxis(this.tool.axis.vector, angleDelta);
                rotationMatrix = this.matrix.multiply(rotationMatrix);
                this.rotation.setFromRotationMatrix(rotationMatrix, this.selectedObject.rotation.order);

                this.controller.rotationX(THREE.Math.radToDeg(this.rotation.x));
                this.controller.rotationY(THREE.Math.radToDeg(this.rotation.y));
                this.controller.rotationZ(THREE.Math.radToDeg(this.rotation.z));

                this.protractor.update(this.currentPosition, this.totalAngle);
            }

            return true;
        }

        private getCurrentAngleDelta():number {
            var result;
            if (this.tool.axis == Techne.Tools.Axis.X) {
                //result = Math.atan2(this.lastPosition.y, this.lastPosition.z) - Math.atan2(this.currentPosition.y, this.currentPosition.z);
                result = Math.atan2(this.currentPosition.y, this.currentPosition.z);
            } else if (this.tool.axis == Techne.Tools.Axis.Y) {
                result = Math.atan2(this.currentPosition.x, this.currentPosition.z);
            } else if (this.tool.axis == Techne.Tools.Axis.Z) {
                result = Math.atan2(this.currentPosition.x, this.currentPosition.y);
            }

            if (result < 0) {
                result = result;
            }

            var tmp = this.totalAngle;
            this.totalAngle = this.startAngle - result;
            return this.totalAngle - tmp;
        }

        public mouseDown(event: MouseEvent) {
            super.mouseDown(event);
        }

        public startHover(intersection: THREE.Intersection) {
            if (intersection && intersection.object) {
                this.tool = <Helper.CircularRibbtonHelper>intersection.object.parent;
                this.tool.startHover();
            }
        }
        public endHover() {
            if (!this.isActive) {
                this.tool.endHover();
                this.tool = null;
            }
        }

        public intersect(raycaster: THREE.Raycaster): THREE.Intersection {
            this.currentPosition = raycaster.ray.intersectPlane(this.toolAxisPlane);

            return {
                point: this.currentPosition,
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