// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
///<chutzpah_reference path="../../three.js" />
///<chutzpah_reference path="../../Techne/Techne.js" />
///<chutzpah_reference path="../../Techne/Objects/NullElement.js" />
///<chutzpah_reference path="../../Techne/Objects/Cube.js" />
///<chutzpah_reference path="../../Techne/Objects/Editables/EditableNullElement.js" />
///<chutzpah_reference path="../../Techne/Objects/Editables/EditableCube.js" />
///<chutzpah_reference path="../../Techne/File/Importer/BlockImporter.js" />
///<chutzpah_reference path="../../Techne/File/Exporter/BlockExporter.js" />
///<chutzpah_reference path="../../Techne/Helper/TextureHelper.js" />
/*
function blockEquality(first: Techne.File.Definitions.IMinecraftBlockJSON, second:Techne.File.Definitions.IMinecraftBlockJSON) {

}

describe("Import and export a block", () => {
    var techne: TechneBase = null;
    var importer: Techne.File.Importer.BlockImporter = null;
    var exporter: Techne.File.Exporter.BlockExporter = null;

    beforeEach(() => {
        techne = new Techne.Editor();
        techne.init({

        });

        importer = new Techne.File.Importer.BlockImporter(techne);
        exporter = new Techne.File.Exporter.BlockExporter();
    });

    it("uses a simple block", () => {
        var block = {
            name: "test block",
            elements: [{
                type: "cube",
                from: [0, 0, 0],
                to: [1, 1, 1]
            }]
        };
        var imported = importer.import(block);
        var result = exporter.export(imported.data);

        expect(result).toEqual(jasmine.objectContaining(block));     
    });


    it("imports and exports a simple block with offset", () => {
        var block = {
            name: "test block",
            elements: [{
                type: "cube",
                from: [0, 0, 0],
                to: [1, 1, 1],
                origin: [1, 1, 1]
            }]
        };

        var imported = importer.import(block);
        var result = exporter.export(imported.data);

        expect(result).toEqual(jasmine.objectContaining(block));     

    });
});
*/