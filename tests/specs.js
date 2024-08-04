var Techne;
(function (Techne) {
    (function (Mock) {
        var Editor = (function () {
            function Editor() {
            }
            Editor.prototype.animate = function (b) {
            };

            Editor.prototype.render = function () {
            };

            Editor.prototype.initWebGlRenderer = function (settings) {
            };

            Editor.prototype.centerCamera = function () {
            };

            Editor.prototype.init = function (settings) {
                return true;
            };

            Editor.prototype.createGrid = function () {
            };

            Editor.prototype.initCanvasRenderer = function (settings) {
            };

            Editor.prototype.initCamera = function (settings) {
            };

            Editor.prototype.initControls = function (settings) {
            };

            Editor.prototype.initTexture = function (settings) {
            };

            Editor.prototype.updateTexture = function () {
            };

            Editor.prototype.initScenery = function (settings) {
            };

            Editor.prototype.loadModel = function (modelId, model) {
            };

            Editor.prototype.createNullElement = function (name, position, rotation) {
                return null;
            };

            Editor.prototype.createCube = function (name, size, position, rotation, textureOffset) {
                return null;
            };

            Editor.prototype.initEvents = function (settings) {
            };

            Editor.prototype.addElement = function (element, parent) {
            };

            Editor.prototype.selectObject = function (cube) {
            };

            Editor.prototype.toggleVisibility = function (cube) {
                return true;
            };

            Editor.prototype.removeObject = function (cube) {
            };

            Editor.prototype.setSelected = function (object) {
            };

            Editor.prototype.importCraftStudioBlock = function (data) {
            };

            Editor.prototype.importMinecraftBlock = function (json) {
            };

            Editor.prototype.exportMinecraftBlock = function () {
                return null;
            };

            Editor.prototype.changeTool = function (tool) {
            };

            Editor.prototype.redo = function () {
            };
            Editor.prototype.undo = function () {
            };
            return Editor;
        })();
        Mock.Editor = Editor;
    })(Techne.Mock || (Techne.Mock = {}));
    var Mock = Techne.Mock;
})(Techne || (Techne = {}));
describe("Test for the standard minecraft block importer", function () {
    var techne, importer = null;

    beforeEach(function () {
        techne = new Techne.Editor();
        techne.init({});

        importer = new Techne.File.Importer.BlockImporter(techne);
    });

    it("imports a simple block", function () {
        var result = importer.import({
            name: "test block",
            elements: [{
                    type: "cube",
                    from: [0, 0, 0],
                    to: [1, 1, 1]
                }]
        });

        var equalsPosition = function (x, y, z) {
            return jasmine.objectContaining({ x: x, y: y, z: z });
        };
        var equalsRotation = function (x, y, z) {
            return jasmine.objectContaining({ _x: x, _y: y, _z: z });
        };
        var equalsObject = function (result, position, rotation, size) {
            expect(result.minecraftPosition).toEqual(equalsPosition.apply(this, position));
            expect(result.rotation).toEqual(equalsRotation.apply(this, rotation));

            if (size) {
                expect(result.scale).toEqual(equalsPosition.apply(this, size));
            }
        };

        expect(result.data.length).toEqual(1);
        equalsObject(result.data[0], [0, 0, 0], [0, 0, 0]);

        expect(result.data[0].children.length).toEqual(1);
        equalsObject(result.data[0].children[0], [-8, 23, -8], [0, 0, 0]);

        expect(result.data[0].children[0].children.length).toEqual(1);
        equalsObject(result.data[0].children[0].children[0], [0, 0, 0], [0, 0, 0]);
    });

    it("imports a simple block with origin", function () {
        var result = importer.import({
            name: "test block",
            elements: [{
                    type: "cube",
                    from: [0, 0, 0],
                    to: [1, 1, 1],
                    origin: [1, 1, 1]
                }]
        });

        var equalsPosition = function (x, y, z) {
            return jasmine.objectContaining({ x: x, y: y, z: z });
        };
        var equalsRotation = function (x, y, z) {
            return jasmine.objectContaining({ _x: x, _y: y, _z: z });
        };
        var equalsObject = function (result, position, rotation, size) {
            expect(result.minecraftPosition).toEqual(equalsPosition.apply(this, position));
            expect(result.rotation).toEqual(equalsRotation.apply(this, rotation));

            if (size) {
                expect(result.scale).toEqual(equalsPosition.apply(this, size));
            }
        };

        expect(result.data.length).toEqual(1);
        equalsObject(result.data[0], [0, 0, 0], [0, 0, 0]);

        expect(result.data[0].children.length).toEqual(1);
        equalsObject(result.data[0].children[0], [-8, 23, -8], [0, 0, 0]);

        expect(result.data[0].children[0].children.length).toEqual(1);
        equalsObject(result.data[0].children[0].children[0], [1, 1, 1], [0, 0, 0]);
    });
});
describe("History tests", function () {
    var controller;
    var techne;

    beforeEach(function () {
        techne = new Techne.Editor();
        techne.init({});
        controller = techne.controller;
    });

    it("add a new element and then undo it", function () {
        var elem = new Techne.Objects.EditableCube("new cube", [1, 1, 1], [0, 0, 0], [0, 0, 0], [0, 0]);
        var elemsCount = techne.scene.children.length;
        techne.addElement(elem);

        expect(controller.history.stack.length).toEqual(1);
        expect(controller.redoHistory.stack.length).toEqual(0);
        expect(techne.scene.children.length).toEqual(elemsCount + 1);

        techne.undo();

        expect(controller.history.stack.length).toEqual(0);
        expect(controller.redoHistory.stack.length).toEqual(1);
        expect(techne.scene.children.length).toEqual(elemsCount);
    });

    it("add a new element, undo then redo", function () {
        var elem = new Techne.Objects.EditableCube("new cube", [1, 1, 1], [0, 0, 0], [0, 0, 0], [0, 0]);
        var elemsCount = techne.scene.children.length;
        techne.addElement(elem);

        expect(controller.history.stack.length).toEqual(1);
        expect(controller.redoHistory.stack.length).toEqual(0);
        expect(techne.scene.children.length).toEqual(elemsCount + 1);

        techne.undo();

        expect(controller.history.stack.length).toEqual(0);
        expect(controller.redoHistory.stack.length).toEqual(1);
        expect(techne.scene.children.length).toEqual(elemsCount);

        techne.redo();

        expect(controller.history.stack.length).toEqual(1);
        expect(controller.redoHistory.stack.length).toEqual(0);
        expect(techne.scene.children.length).toEqual(elemsCount + 1);
    });

    it("adds a new element, changes settings, then undos them all.", function () {
        var elem = new Techne.Objects.EditableCube("new cube", [1, 1, 1], [0, 0, 0], [0, 0, 0], [0, 0]);
        var elemsCount = techne.scene.children.length;
        techne.addElement(elem);

        expect(controller.history.stack.length).toEqual(1);
        expect(controller.redoHistory.stack.length).toEqual(0);
        expect(techne.scene.children.length).toEqual(elemsCount + 1);

        controller.setSelected(elem);

        controller.sizeX(2);
        controller.sizeX(3);
        controller.sizeX(4);

        expect(controller.history.stack.length).toEqual(2);

        controller.sizeY(2);
        controller.sizeY(3);
        controller.sizeY(4);

        expect(controller.history.stack.length).toEqual(3);

        controller.sizeX(5);

        expect(elem.scale.x).toEqual(5);
        expect(elem.scale.y).toEqual(4);
        techne.undo();
        expect(elem.scale.x).toEqual(4);
        expect(elem.scale.y).toEqual(4);
        techne.redo();
        expect(elem.scale.x).toEqual(5);
        expect(elem.scale.y).toEqual(4);
        techne.undo();
        expect(elem.scale.x).toEqual(4);
        expect(elem.scale.y).toEqual(4);
        techne.undo();
        expect(elem.scale.x).toEqual(4);
        expect(elem.scale.y).toEqual(1);
        techne.undo();
        expect(elem.scale.y).toEqual(1);
        expect(elem.scale.y).toEqual(1);
        techne.redo();
        expect(elem.scale.x).toEqual(4);
        expect(elem.scale.y).toEqual(1);
        techne.redo();
        expect(elem.scale.x).toEqual(4);
        expect(elem.scale.y).toEqual(4);
        techne.redo();
        expect(elem.scale.x).toEqual(5);
        expect(elem.scale.y).toEqual(4);
    });
});
