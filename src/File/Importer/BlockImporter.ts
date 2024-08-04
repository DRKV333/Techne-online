// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne.File.Importer {
    export class BlockImporter implements IImporter<File.Definitions.IMinecraftBlockJSON> {
        private result: IImportResult = {
            textureSize: [64, 32],
            data: []
        };

        constructor(private techne: TechneBase) {
        }

        import(data: Definitions.IMinecraftBlockJSON): IImportResult {
            var nullElement = this.techne.createNullElement(data.name, [0, 0, 0], [0, 0, 0]);

            this.addElement(nullElement);

            data.elements.map((element) => {
                switch (element.type) {
                    case "cube":
                        this.createCube(element, nullElement);
                        break;
                    case "plane":
                        this.createCube(element, nullElement);
                        break;
                }
            });

            return this.result;
        }

        /*
         * Creates a cube from a minecraft block element and adds it to parent
         */
        private createCube (element: Definitions.IMinecraftBlockElement, parent: Objects.NullElement): void {
            var position:number[] = [];
            position[0] = element.from[0] - 8;
            position[1] = (element.from[1] - 24) * (-1);
            position[2] = element.from[2] - 8;
            var size = [
                element.to[0] - position[0] - 8,
                (element.to[1] - element.from[1]),
                element.to[2] - position[2] - 8
            ];

            position[1] -= size[1];

            var rotation = [0, 0, 0];
            if (element.rotation) {
                rotation = element.rotation.map((x) => { return x / 180 * Math.PI });
            }

            var offset = [0, 0, 0];
            if (element.origin) {
                offset = element.origin; //TODO: convert this too!
            }

            var nullElement = this.techne.createNullElement(element.name, position, rotation);
            nullElement.addChild(this.techne.createCube(element.name, size, offset, [0, 0, 0], [0, 0, 0]));

            this.addElement(nullElement, parent);
        }

        ///*
        // * So I can test this.
        // * @todo think of a better way
        // */
        //private createNullElement(name: string, position: number[], rotation: number[]) {
        //    return new Objects.NullElement(name, position, rotation);
        //}

        /*
         * adds an element to either the passed parent object or if that's null to the top level result instance
         */
        private addElement(element: Objects.IObject, parent?: Objects.NullElement) {
            if (parent) {
                parent.addChild(element);
            } else {
                this.result.data.push(element);
            }
        }
    }
}