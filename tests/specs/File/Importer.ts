// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
///<chutzpah_reference path="../../three.js" />
///<chutzpah_reference path="../../Techne/Techne.js" />
///<chutzpah_reference path="../../Techne/Objects/NullElement.js" />
///<chutzpah_reference path="../../Techne/Objects/Cube.js" />
///<chutzpah_reference path="../../Techne/Objects/Editables/EditableNullElement.js" />
///<chutzpah_reference path="../../Techne/Objects/Editables/EditableCube.js" />
///<chutzpah_reference path="../../Techne/File/Importer/BlockImporter.js" />
///<chutzpah_reference path="../../Techne/Helper/TextureHelper.js" />

describe("Test for the standard minecraft block importer", () => {
    var techne: TechneBase, importer: Techne.File.Importer.BlockImporter = null;

    beforeEach(() => {
        techne = new Techne.Editor();
        techne.init({
            
        });

        importer = new Techne.File.Importer.BlockImporter(techne);
    });
    
    it("imports a simple block", () => {
        var result = importer.import({
            name: "test block",
            elements: [{
                type: "cube",
                from: [0, 0, 0],
                to: [1, 1, 1]
            }]
        });

        var equalsPosition = function (x: number, y: number, z: number) {
            return jasmine.objectContaining({ x: x, y: y, z: z });
        };
        var equalsRotation = function (x: number, y: number, z: number) {
            return jasmine.objectContaining({ _x: x, _y: y, _z: z });
        };
        var equalsObject = function (result, position: number[], rotation: number[], size?: number[]) {
            expect(result.minecraftPosition).toEqual(equalsPosition.apply(this, position));
            expect(result.rotation).toEqual(equalsRotation.apply(this, rotation));

            if (size) {
                expect(result.scale).toEqual(equalsPosition.apply(this, size));
            }
        }

        expect(result.data.length).toEqual(1);
        equalsObject(result.data[0], [0, 0, 0], [0, 0, 0]);

        expect(result.data[0].children.length).toEqual(1);
        equalsObject(result.data[0].children[0], [-8, 23, -8], [0, 0, 0]);

        expect(result.data[0].children[0].children.length).toEqual(1);
        equalsObject(result.data[0].children[0].children[0], [0, 0, 0], [0, 0, 0]);
    });


    it("imports a simple block with origin", () => {
        var result = importer.import({
            name: "test block",
            elements: [{
                type: "cube",
                from: [0, 0, 0],
                to: [1, 1, 1],
                origin: [1, 1, 1]
            }]
        });

        var equalsPosition = function (x: number, y: number, z: number) {
            return jasmine.objectContaining({ x: x, y: y, z: z });
        };
        var equalsRotation = function (x: number, y: number, z: number) {
            return jasmine.objectContaining({ _x: x, _y: y, _z: z });
        };
        var equalsObject = function (result, position: number[], rotation: number[], size?: number[]) {
            expect(result.minecraftPosition).toEqual(equalsPosition.apply(this, position));
            expect(result.rotation).toEqual(equalsRotation.apply(this, rotation));

            if (size) {
                expect(result.scale).toEqual(equalsPosition.apply(this, size));
            }
        }

        expect(result.data.length).toEqual(1);
        equalsObject(result.data[0], [0, 0, 0], [0, 0, 0]);

        expect(result.data[0].children.length).toEqual(1);
        equalsObject(result.data[0].children[0], [-8, 23, -8], [0, 0, 0]);

        expect(result.data[0].children[0].children.length).toEqual(1);
        equalsObject(result.data[0].children[0].children[0], [1, 1, 1], [0, 0, 0]);
    });
});