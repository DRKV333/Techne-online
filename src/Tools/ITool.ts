module Techne.Tools {
    export interface ITool extends THREE.Object3D {
        /*
         * Called when a new object is selected
         */
        objectSelected(object: Objects.IEditableObject): void;
        /*
         * Called when an object is deselected
         */
        objectDeselected(): void;
        /*
         * Called when the mouse enters the bounds of this tool
         */
        mouseEnter(intersection: THREE.Intersection): void;
        /*
         * Called when the mouse leaves the bounds of this tool
         */
        mouseLeave(): void;
        /*
         * called when the mouse button is down (once)
         */
        mouseDown(event: MouseEvent): void;
        /*
         * Called after the mouse transitioned to the up state
         */
        mouseMove(event: THREE.Intersection): void;
        /*
         * Called after the mouse transitioned to the up state
         */
        mouseUp(event: MouseEvent): void;
        /*
         * callback to intersect stuff
         */
        intersect(raycaster: THREE.Raycaster): THREE.Intersection;
        /*
         * called when switching tools
         * remove everything you have from the scene!
         */
        dispose(): void;

        /* 
         * if the tool is currently performing its action
         */
        isActive: boolean;
        /* 
         * true if the mouse-pointer hovers over the tool
         */
        isHover: boolean;

        /*
         * name of the tool
         */
        name: string;
    }

    export interface IAxis {
        vector: THREE.Vector3;
        normal: THREE.Vector3;
        color: number;
        rotation: THREE.Vector3;
    }

    export class Axis {
        public static X: IAxis = {
            vector: new THREE.Vector3(1, 0, 0),
            color: 0xFF0000,
            normal: new THREE.Vector3(0, 1, 0),
            rotation: new THREE.Vector3(0, -1, 0)
        };
        public static Y: IAxis = {
            vector: new THREE.Vector3(0, -1, 0),
            color: 0x00FF00,
            normal: new THREE.Vector3(0, 0, -1),
            rotation: new THREE.Vector3(0, 1, 1)
        };
        public static Z: IAxis = {
            vector: new THREE.Vector3(0, 0, 1),
            color: 0x0000FF,
            normal: new THREE.Vector3(-1, 0, 0),
            rotation: new THREE.Vector3(0, 0, 0)
        };
    }
}