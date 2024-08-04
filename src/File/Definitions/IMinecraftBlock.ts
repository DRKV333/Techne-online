// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne.File.Definitions {
    export interface IMinecraftFaceData {
        uv: number[];
        textureFacing: string;
        rotation?: number;
        tint?: boolean;
        overlay?: boolean;
        tintOverlay?: boolean;
        cull?: boolean;
        shade?: number;
    }

    export interface IMinecraftBlockElement {
        /* 
         * Type of the element
         * can only be "Cube" or "Plane"
         */
        type: string;
        /*
         * Start coordinates of the block in minecraft coordinates
         */
        from: number[];
        /*
         * End coordinates of the block in minecraft coordinates
         */
        to: number[];
        /*
         * Origin (rotational-center)
         */
        origin?: number[];
        /*
         * Rotation in radians
         */
        rotation?: number[];

        name?: string;

        faceData?: IMinecraftFaceData[];
    }

    export interface IMinecraftInheritedBlockJSON {
        name: string;
        inheritFrom: string;
        translation: number[];
        rotationOrigin: number[];
        rotation: number[];
    }

    export interface IMinecraftBlockJSON {
        angleVariants?: number;
        elements: IMinecraftBlockElement[];
        useAmbientOcclusion?: boolean;
        randomOffsetX?: boolean;
        randomOffsetY?: boolean;
        randomOffsetZ?: boolean;
        inventoryRender3D?: boolean;
        name?: string;
    }
}