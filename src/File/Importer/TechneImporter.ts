// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne.File.Importer {
    export class TechneImporter implements IImporter<any>{
        private result: IImportResult = {
            textureSize: [64, 32],
            data: []
        };
        private parent: Objects.IObject;

        constructor(private techne: TechneBase) {
        }

        public import(json): IImportResult {
            if (json && json.Techne) {
                for (var index in json.Techne.Models) {
                    if (!json.Techne.Models.hasOwnProperty(index)) {
                        continue;
                    }
                    var model = json.Techne.Models[index];

                    if (model.Model.TextureSize) {
                        this.result.textureSize = model.Model.TextureSize.split(",").map((x) => parseInt(x));
                        TechneBase.textureSize.set(this.result.textureSize[0], this.result.textureSize[1]);
                    }

                    this.parseFolder(model.Model.Geometry);
                }

                return this.result;
            }
        }

        private addElement(element: Objects.IObject, parent?: Objects.NullElement) {
            if (parent) {
                parent.addChild(element);
            } else {
                this.result.data.push(element);
            }
        }

        private ParseShape(shape, parent?: Objects.NullElement) {
            var size: number[] = shape.Size.split(",").map((x) => parseInt(x))
            var position: number[] = shape.Position.split(",").map((x) => parseFloat(x));
            var rotation: number[] = shape.Rotation.split(",").map((x) => parseFloat(x));
            var textureOffset: number[] = shape.TextureOffset.split(",").map((x) => parseInt(x))
            var name: string = <string>shape["@name"];

            if (shape.Offset) {
                var offset: number[] = shape.Offset.split(",").map((x) => parseInt(x));

                rotation = rotation.map((x) => x / 180 * Math.PI);

                var nullElement = this.techne.createNullElement("null element", position, rotation);
                nullElement.addChild(this.techne.createCube(name, size, offset, [0, 0, 0], textureOffset));
                
                this.addElement(nullElement, parent);
            } else {
                var cube = this.techne.createCube(name, size, position, rotation, textureOffset);
                this.addElement(cube, parent);
            }
        }

        private parseFolder(folder, parent?: Objects.NullElement) {
            if (folder.Shape) {
                if (!(folder.Shape instanceof Array)) {
                    this.ParseShape(folder.Shape, parent);
                } else {
                    for (var index = 0; index < folder.Shape.length; index++) {
                        this.ParseShape(folder.Shape[index], parent);
                    }
                }
            }
            if (folder.Folder) {
                for (var index = 0; index < folder.Folder.length; index++) {
                    
                    var f = folder.Folder[index];

                    var nullElement = this.techne.createNullElement(<string>f["@Name"]);
                    this.addElement(nullElement, parent);
                    this.parseFolder(f, nullElement);
                    
                    //if (f.Children) {
                    //    this.parseFolder(f.Children, nullElement);
                    //}
                }
            }
            if (folder.Null) {                
                for (var index = 0; index < folder.Null.length; index++) {
                    
                    var f = folder.Null[index];

                    var position: number[] = f.Position.split(",").map((x) => parseFloat(x));
                    var rotation: number[] = f.Rotation.split(",").map((x) => parseFloat(x));
                    var name: string = <string>f["@name"];

                    var nullElement = this.techne.createNullElement(<string>f["@Name"], position, rotation);
                    this.addElement(nullElement, parent);

                    if (f.Children) {
                        this.parseFolder(f.Children, nullElement);
                    }
                }
            }

            // TODO: this is just treating the pieces as folders!
            if (folder.Piece) {
                for (var index = 0; index < folder.Piece.length; index++) {
                    var f = folder.Folder[index];

                    var nullElement = this.techne.createNullElement(<string>f["@Name"]);
                    this.addElement(nullElement, parent);

                    if (f.Children) {
                        this.parseFolder(f.Children, nullElement);
                }
                }
            }
        }
    }
}