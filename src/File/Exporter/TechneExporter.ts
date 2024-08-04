// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne.File.Exporter {
    export interface ITechneJson {
        Techne: any;
    }

    export class TechneExporter implements IExporter<ITechneJson> {
        export(objects: Objects.IObject[]): ITechneJson {
            return {
                "Techne": {
                    "@Version": "2.2",
                    "Author": "ZeuX",
                    "Name": "",
                    "PreviewImage": "",
                    "ProjectName": "",
                    "ProjectType": "",
                    "Description": "",
                    "DateCreated": "",
                    "Models": [{
                        "Model": {
                            "GlScale": "1,1,1",
                            "Name": "",
                            "TextureSize": TechneBase.textureSize.x + "," + TechneBase.textureSize.y,
                            "@texture": "texture.png",
                            "BaseClass": "ModelBase",
                            "Geometry": this.serializeObjects(objects)
                        }
                    }]
                }
            };
        }

        /*
         * serializes objects as Techne Collection
         */
        private serializeObjects(objects: Objects.IObject[]) {
            var result = { "Folder": [], "Shape": [], "Piece": [], "Null": [] };

            objects.map((obj: Objects.IObject) => {
                if (obj instanceof Objects.NullElement)
                    result.Null.push(this.serializeNull(<Objects.NullElement>obj));
                else
                    result.Shape.push(this.serializeShape(<Objects.IVisibleObject>obj));
            });

            return result;
        }

        /*
         * Serializes a NullElement
         */
        private serializeNull(obj: Objects.NullElement) {
            return {
                "@Type": "3b3bb6e5-2f8b-4bbd-8dbb-478b67762fd0",
                "@Name": obj.name,
                "Position": [obj.minecraftPosition.x, obj.minecraftPosition.y, obj.minecraftPosition.z].join(","),
                "Rotation": [obj.rotation.x, obj.rotation.y, obj.rotation.z].join(","),
                "Children": this.serializeObjects(<Objects.IObject[]><any[]>obj.children)
            };
        }

        /*
         * Serializes a cube
         */
        private serializeShape(obj: Objects.IVisibleObject) {
            return {
                "Id": obj.uniqueId,
                "@Type": "d9e621f7-957f-4b77-b1ae-20dcd0da7751",
                "@Name": obj.name,
                "IsDecorative": "False",
                "IsFixed": "False",
                "IsMirrored": "False",
                "Position": [obj.minecraftPosition.x, obj.minecraftPosition.y, obj.minecraftPosition.z].join(","),
                "Rotation": [obj.rotation.x, obj.rotation.y, obj.rotation.z].join(","),
                "Size": [obj.scale.x, obj.scale.y, obj.scale.z].join(","),
                "TextureOffset": [obj.textureOffset.x, obj.textureOffset.y].join(",")
            };
        }
    }
}