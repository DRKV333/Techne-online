// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne.Handler {
    /*
     * @todo check for mouseleave of the entire container and act accrodingly
     */
    export class MouseHandler {
        private projector: THREE.Projector;
        private hasMoved: boolean = false;
        private mouse = { x: 0, y: 0 };
        private width: number;
        private height: number;
        private lastIntersected: THREE.Object3D;

        constructor(private techne: Editor) {
            this.projector = new THREE.Projector();
        }

        /*
         * Registers event listeners
         */
        public init() {
            this.techne.container.addEventListener('mouseup', (e) => this.onDocumentMouseUp(e), false);
            this.techne.container.addEventListener('mousedown', (e) => this.onDocumentMouseDown(e), false);
            this.techne.container.addEventListener('mousemove', (e) => { this.onDocumentMouseMove(e) }, false);

            var doubleClickHandler = this.makeDoubleRightClickHandler(this.onDocumentDoubleClick);
            $(this.techne.container).on("contextmenu", (e) => doubleClickHandler(e));
            (<any>this.techne.controls).addEventListener('change', (e) => { this.hasMoved = true; });
            //(<any>this.techne.controls).addEventListener('end', (e) => { this.hasMoved = false; });

            $('.spinner').on('DOMMouseScroll mousewheel', this.onMouseWheel);

            this.width = $("#techne-canvas").width();
            this.height = $("#techne-canvas").height();
        }

        public onDocumentDoubleClick(event: JQueryEventObject) {
            if (event.button == 2 &&
                // this.techne.camera.hasMoved != true &&
                event.target == this.techne.renderer.domElement) {
                var intersects = this.intersect(event.offsetX, event.offsetY);
            }

            if (intersects.length > 0) {
                this.techne.controls.target = intersects[0].point;
            }
        }

        public onDocumentMouseDown(event: MouseEvent) {
            if (this.techne.controller.selectedTool && this.techne.controller.selectedTool.isHover) {
                this.techne.controller.selectedTool.mouseDown(event);
                event.preventDefault();
            }
        }

        public onMouseWheel(event) {
            var count = event.originalEvent.wheelDelta / Math.abs(event.originalEvent.wheelDelta);
            var that = <HTMLInputElement><any>this; // TS you make me mad..
            that.value = (parseInt(that.value) + count).toString();
            $(that).trigger("change");
        }

        public onDocumentMouseMove(event: MouseEvent) {
            //this.mouse.x = (event.offsetX / this.width) * 2 - 1;
            //this.mouse.y = - (event.offsetY / this.height) * 2 + 1;

            this.mouse.x = 2 * (event.clientX / this.width) - 1;
            this.mouse.y = 1 - 2 * (event.clientY / this.height);

            if (this.techne.controller.selectedTool && this.techne.controller.selectedTool.isActive) {
                // I do the raycasting in this funciton because I already have a projector here.
                var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 2);
                var raycaster = this.projector.pickingRay(vector.clone(), this.techne.camera);

                // call the tool's intersect function, different tools will use different objects to intersect with.
                var intersection = this.techne.controller.selectedTool.intersect(raycaster);
                this.techne.controller.selectedTool.mouseMove(intersection);
            }
        }

        public onDocumentMouseUp(event: MouseEvent) {
            if (event.button == 0 &&
                this.hasMoved != true &&
                event.target == this.techne.renderer.domElement) {

                if (this.techne.controller.selectedTool && (this.techne.controller.selectedTool.isActive || this.techne.controller.selectedTool.isHover)) {
                    this.techne.controller.selectedTool.mouseUp(event);
                } else {
                    var intersects = this.intersect(event.offsetX, event.offsetY);

                    if (intersects.length > 0) {
                        this.techne.setSelected(<Objects.IEditableObject><any>(intersects[0].object));
                    } else {
                        this.techne.setSelected();
                    }
                }
            }

            this.hasMoved = false;
        }

        /*
         * Creates a doubleclick handler
         */
        public makeDoubleRightClickHandler(handler: (event: JQueryEventObject) => void): (e: JQueryEventObject) => void {
            var timeout = 0;
            var clicked = false;

            return (e) => {
                //e.preventDefault();

                if (clicked) {
                    clearTimeout(timeout);
                    clicked = false;
                    return handler.apply(this, arguments);
                } else {
                    clicked = true;
                    timeout = setTimeout(() => {
                        clicked = false;
                    }
                        , 300);
                }
            }
        }

        /*
         * Intersects objects in the scene with a ray starting at the mousecoordinates
         * Returns an array of all objects the ray passed through
         */
        public intersect(mouseX: number, mouseY: number): THREE.Intersection[] {

            var vector = new THREE.Vector3((mouseX / this.width) * 2 - 1, - (mouseY / this.height) * 2 + 1, 0.5);
            var raycaster = this.projector.pickingRay(vector.clone(), this.techne.camera);
            var intersects = raycaster.intersectObjects(this.techne.observedChildren(), true);
            return intersects;
        }

        /*
         * Handles tool enter and leave calls
         * Also disables controls if hovering
         * @TODO don't disable tool if using the control already. Also always allow mousewheel
         */
        public update() {
            // only check for updates if there's either no last selection
            // if we were using it, we want to keep using it even if we've stopped hovering but we don't need lastintersected.
            // just making sure we don't enter again until we've stopped using the tool
            // also don't check if the camera has moved, should fix the @todo (except the mousewheel part)
            if ((!this.lastIntersected || !this.techne.controller.selectedTool.isActive) && !this.hasMoved) {
                var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
                var raycaster = this.projector.pickingRay(vector.clone(), this.techne.camera);

                var intersects = raycaster.intersectObjects(this.techne.controller.getTools(), true);

                // here I just want to check enter and leave and track the state in the tool
                // let the tool determine when it's time to release etc.
                if (intersects.length) {
                    // we can't get here if it's active, so if we are hvoering over a new element, leave the old one and enter the new one.
                    if (this.lastIntersected != intersects[0].object.parent) {
                        if (this.lastIntersected) {
                            this.techne.controller.selectedTool.mouseLeave();
                        }

                        this.lastIntersected = <Tools.ToolBase>intersects[0].object.parent;

                        this.techne.controller.selectedTool.mouseEnter(intersects[0]);
                    }
                } else if (this.lastIntersected) {
                    this.techne.controller.selectedTool.mouseLeave();
                    this.lastIntersected = null;
                }
            }

            if (this.techne.controller.selectedTool && (this.techne.controller.selectedTool.isActive || this.techne.controller.selectedTool.isHover)) {
                this.techne.controls.enabled = false;
            } else {
                this.techne.controls.enabled = true;
            }
        }
    }
}