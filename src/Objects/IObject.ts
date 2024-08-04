// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne.Objects {
    export interface IObject extends THREE.Object3D {
        /*
         * Updates this elements's position
         */
        updatePosition(): void;
        /*
         * Updates this elements's size
         */
        updateSize(): void;
        /*
         * Updates this elements's rotation
         */
        updateRotation(): void;
        /*
         * Updates this elements's texture
         */
        updateTexture(): void;
        /*
         * return true if this element is rotated
         */
        isRotated(): void;
        /*
         * This element's position in minecraft coordinates
         */
        minecraftPosition: THREE.Vector3;

        techneClone(): IObject;

        threeClone(): THREE.Object3D;

    }
}