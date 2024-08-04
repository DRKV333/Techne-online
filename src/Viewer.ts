// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne {
    export class Viewer extends TechneBase {
        constructor() {
            super();
            TechneBase.projectType = Techne.EditMode.View;
        }
        
        /*
         * Initializes the controls and applies the settings
         */
        public initControls(settings: Techne.ISettings) {
            this.controls = new THREE.OrbitControls(this.camera, this.container);

            this.controls.noRotate = false;
            this.controls.noPan = false;
            this.controls.noZoom = false;
            this.controls.autoRotate = true;
            this.controls.autoRotateSpeed = 0.5;
        }

        /**
         *  renders the scene
         */
        public render() {
            this.controls.update();
            super.render();
        }
        /*
         * Creates a new null
         * Used so that the viewer and editor can return different objects
         */
        public createNullElement(name: string, position?: number[], rotation?: number[]): Objects.NullElement {
            return new Objects.NullElement(name, position, rotation);
        }
        /*
         * Creats a new cube
         * Used so that the viewer and editor can return different objects
         */
        public createCube(name: string, size: number[], position: number[], rotation: number[], textureOffset: number[]): Objects.Cube {
            return new Objects.Cube(name, size, position, rotation, textureOffset, this.modelMaterial);
        }
    }
}