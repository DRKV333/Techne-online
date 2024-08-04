// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
///<chutzpah_reference path="../../three.js" />
///<chutzpah_reference path="../../Techne/Techne.js" />
///<chutzpah_reference path="../../Techne/Objects/NullElement.js" />
///<chutzpah_reference path="../../Techne/Objects/Cube.js" />
///<chutzpah_reference path="../../Techne/Objects/Editables/EditableNullElement.js" />
///<chutzpah_reference path="../../Techne/Objects/Editables/EditableCube.js" />
///<chutzpah_reference path="../../Techne/File/Importer/BlockImporter.js" />
///<chutzpah_reference path="../../Techne/Helper/TextureHelper.js" />

describe("History tests", () => {
    var controller;
    var techne;

    beforeEach(() => {
        techne = new Techne.Editor();
        techne.init({});
        controller = techne.controller;
    });

    it("add a new element and then undo it", () => {
        var elem = techne.createCube("new cube", [1, 1, 1], [0, 0, 0], [0, 0, 0], [0, 0]);
        var elemsCount = techne.scene.children.length;
        techne.addChild(elem);

        expect(controller.history.stack().length).toEqual(1);
        expect(controller.redoHistory.stack().length).toEqual(0);
        expect(techne.scene.children.length).toEqual(elemsCount + 1);

        techne.undo();

        expect(controller.history.stack().length).toEqual(0);
        expect(controller.redoHistory.stack().length).toEqual(1);
        expect(techne.scene.children.length).toEqual(elemsCount);
    });

    it("add a new element, undo then redo", () => {
        var elem = techne.createCube("new cube", [1, 1, 1], [0, 0, 0], [0, 0, 0], [0, 0]);
        var elemsCount = techne.scene.children.length;
        techne.addChild(elem);

        expect(controller.history.stack().length).toEqual(1);
        expect(controller.redoHistory.stack().length).toEqual(0);
        expect(techne.scene.children.length).toEqual(elemsCount + 1);

        techne.undo();

        expect(controller.history.stack().length).toEqual(0);
        expect(controller.redoHistory.stack().length).toEqual(1);
        expect(techne.scene.children.length).toEqual(elemsCount);

        techne.redo();

        expect(controller.history.stack().length).toEqual(1);
        expect(controller.redoHistory.stack().length).toEqual(0);
        expect(techne.scene.children.length).toEqual(elemsCount + 1);
    });


    it("adds a new element, changes settings, then undos them all.", () => {
        var elem = techne.createCube("new cube", [1, 1, 1], [0, 0, 0], [0, 0, 0], [0, 0]);
        var elemsCount = techne.scene.children.length;
        techne.addChild(elem);

        expect(controller.history.stack().length).toEqual(1);
        expect(controller.redoHistory.stack().length).toEqual(0);
        expect(techne.scene.children.length).toEqual(elemsCount + 1);

        controller.setSelected(elem);

        controller.sizeX(2);
        controller.sizeX(3);
        controller.sizeX(4);

        expect(controller.history.stack().length).toEqual(2);

        controller.sizeY(2);
        controller.sizeY(3);
        controller.sizeY(4);

        expect(controller.history.stack().length).toEqual(3);

        controller.sizeX(5);

        expect(elem.scale.x).toEqual(5);
        expect(elem.scale.y).toEqual(4);
        
        techne.undo();
        expect(controller.history.stack().length).toEqual(3);
        expect(elem.scale.x).toEqual(4);
        expect(elem.scale.y).toEqual(4);

        techne.redo();
        expect(controller.history.stack().length).toEqual(4);
        expect(elem.scale.x).toEqual(5);
        expect(elem.scale.y).toEqual(4);

        techne.undo();
        expect(controller.history.stack().length).toEqual(3);
        expect(elem.scale.x).toEqual(4);
        expect(elem.scale.y).toEqual(4);

        techne.undo();
        expect(controller.history.stack().length).toEqual(2);
        expect(elem.scale.x).toEqual(4);
        expect(elem.scale.y).toEqual(1);

        techne.undo();
        expect(controller.history.stack().length).toEqual(1);
        expect(elem.scale.y).toEqual(1);
        expect(elem.scale.y).toEqual(1);

        techne.redo();
        expect(controller.history.stack().length).toEqual(2);
        expect(elem.scale.x).toEqual(4);
        expect(elem.scale.y).toEqual(1);

        techne.redo();
        expect(controller.history.stack().length).toEqual(3);
        expect(elem.scale.x).toEqual(4);
        expect(elem.scale.y).toEqual(4);

        techne.redo();
        expect(controller.history.stack().length).toEqual(4);
        expect(elem.scale.x).toEqual(5);
        expect(elem.scale.y).toEqual(4);
    });
});