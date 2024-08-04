// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne.Objects {
    export interface IVisibleObject extends IObject {
        /*
         * This element's textureoffset
         */
        textureOffset: THREE.Vector2;

        material: THREE.Material;
        /*
         * unique Id of this object
         * Shouldn't that be on every object?
         */
        uniqueId?: string; // property dynamically created and added to [Object] in Techne.ts
    }
}