module Techne.Tools {
	export class ToolBase extends THREE.Object3D implements ITool {
        public selectedObject: Objects.IEditableObject;
        public isActive: boolean = false;
        public isHover: boolean = false;
        public lastPosition: THREE.Vector3;
        public positionDelta: THREE.Vector3;
        public name: string;


        constructor(public controller: Controller) {
            super();
            this.renderDepth = 10;
        }
/*
         * Called when a new object is selected
         */
        public objectSelected(object: Objects.IEditableObject): void {
            this.selectedObject = object;

            this.attachControls();
        }

        /*
         * Called when an object is deselected
         */
        public objectDeselected(): void {
            this.removeControls();

            this.selectedObject = null;
        }
        
        /*
         * Called when the mouse enters the bounds of this tool
         */
        public mouseEnter(intersection: THREE.Intersection) {
            this.isHover = true;
            this.startHover(intersection);
        }
        /*
         * Called when the mouse leaves the bounds of this tool
         */
        public mouseLeave() {
            this.isHover = false;
            this.endHover();
        }
        /*
         * called when the mouse button is down (once)
         */
        public mouseDown(event: MouseEvent) {
            // if we don't hover, we can't get active.
            // we shouldn't get here in the first place
            // think about throwing an error
            if (!this.isHover || this.isActive) {
                return;
            }

            this.isActive = true;
            this.lastPosition = null;
            this.start();
        }
        /*
         * Called after the mouse transitioned to the up state
         */
        public mouseUp(event: MouseEvent) {
            this.isActive = false;
            this.lastPosition = null;
            this.end();
        }

        /*
         * Called everytime the mouse moves and the tool is active.
         */
        public mouseMove(intersection: THREE.Intersection) {
            // So far the only call to this method is in mousehandler
            // and that checks for isActive already
            // but I might want to move this in here
            // that'd require doing the raycasting in here too (no point in performing the action if the tool's not active anyway
            if (!this.isActive) {
                return;
            }

            if (!this.lastPosition) {
                this.lastPosition = intersection.point.clone();
            }

            this.positionDelta = intersection.point.clone().sub(this.lastPosition);
            if (this.update()) {
                this.lastPosition = intersection.point;
            }
        }

        /*
         * callback to intersect stuff
         */
        public intersect(raycaster: THREE.Raycaster): THREE.Intersection {
            return null;
        }

        /*
         * Attach controls to the scene/child/wherever
         */
        public attachControls() { }
        /*
         * Detach controls
         */
        public removeControls() { }

        /*
         * Called when the tool should begin performing the action
         */
        public start() { }
        /*
         * Called when the tool should stop performing the action
         */
        public end() { }
        /*
         * Called as long as the tool is performing an action
         */
        public update() { }
        /*
         * Pretty much a onMouseEnter
         */
        public startHover(intersection: THREE.Intersection) { }
        /*
         * Pretty much a onMouseLeave
         */
        public endHover() { }

        public dispose() { }
    }
}