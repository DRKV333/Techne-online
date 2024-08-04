// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne.File.Exporter {
    export class BlockExporter implements IExporter<Definitions.IMinecraftBlockJSON> {
        export(objects: Objects.IObject[]): Definitions.IMinecraftBlockJSON {
            return {
                elements: this.createElementsArray(objects)
            };
        }

        /*
         * Creates the array with all the cube and plane definitions
         */
        private createElementsArray(objects: Objects.IObject[], parentOffset?: number[], parentRotation?: number[]): Definitions.IMinecraftBlockElement[] {
            if (!parentOffset) {
                parentOffset = [0, 0, 0]
            }
            if (!parentRotation) {
                parentRotation = [0, 0, 0]
            }

            var elements: Definitions.IMinecraftBlockElement[] = [];

            objects.map((object) => {
                if (object instanceof Objects.CollectionBase) {
                    var propagatedOffset: number[] = [];
                    propagatedOffset[0] = parentOffset[0] + object.minecraftPosition.x;
                    propagatedOffset[1] = parentOffset[1] + object.minecraftPosition.y;
                    propagatedOffset[2] = parentOffset[2] + object.minecraftPosition.z;

                    var propagatedRotation: number[] = [];
                    propagatedRotation[0] = parentRotation[0] + object.rotation.x;
                    propagatedRotation[1] = parentRotation[1] + object.rotation.y;
                    propagatedRotation[2] = parentRotation[2] + object.rotation.z;

                    elements = elements.concat(this.createElementsArray((<Objects.ICollection>object).getChildrenForExport(), propagatedOffset, propagatedRotation));
                } else {
                    var position = this.convertToMinecraft(object);

                    if (parentRotation[0] == 0 && parentRotation[1] == 0 && parentRotation[2] == 0) {
                        position[0] += parentOffset[0];
                        position[1] -= parentOffset[1];
                        position[2] += parentOffset[2];
                        parentOffset = [0, 0, 0];
                    }

                    var to: number[] = [
                        object.scale.x + position[0],
                        object.scale.y + position[1],
                        object.scale.z + position[2]
                    ];

                    var newElement: Definitions.IMinecraftBlockElement = {
                        "type": "cube",
                        "from": position,
                        "to": to
                    };

                    if (!(parentRotation[0] == 0 && parentRotation[1] == 0 && parentRotation[2] == 0)) {
                        newElement.rotation = parentRotation;
                    }
                    if (!(parentRotation[0] == 0 && parentRotation[1] == 0 && parentRotation[2] == 0)) {
                        newElement.origin = parentOffset;
                    }

                    elements.push(newElement);
                }
            });

            return elements;
        }

        /*
         * Converts coordinates to minecraft block coordinates
         * not sure what I'm doing here
         */
        private convertToMinecraft(object: Objects.IObject): number[] {
            return [
                object.minecraftPosition.x + 8,
                (object.minecraftPosition.y - 24 + object.scale.y) * (-1),
                object.minecraftPosition.z + 8
            ];
        }
    }
}