//// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
/////<chutzpah_reference path="../../three.js" />
/////<chutzpah_reference path="../../Techne/Techne.js" />
/////<chutzpah_reference path="../../Techne/Objects/NullElement.js" />
/////<chutzpah_reference path="../../Techne/Objects/Cube.js" />
/////<chutzpah_reference path="../../Techne/Objects/Editables/EditableNullElement.js" />
/////<chutzpah_reference path="../../Techne/Objects/Editables/EditableCube.js" />
/////<chutzpah_reference path="../../Techne/File/Importer/BlockImporter.js" />
/////<chutzpah_reference path="../../Techne/Helper/TextureHelper.js" />

//class FakeDOM {

//}

//class MockTechne {
//    public container = {
//        domElement: {},
//        addEventListener: function() {}
//    };
//    public controls = {
//        addEventListener: function() {}
//    };
//    public objects = function() { return []; };
//    public camera = {};
//    public renderer = {domElement: {}};
//    public setSelected (objects?: Techne.Objects.IEditableObject) {

//    }
//    public objects: Techne.Objects.IObject[];
//    public controller = {
//        getTools: function():Techne.Tools.ITool[] { return null; },
//        selectedTool: {
//            isHover: false,
//            isActive: false,
//            mouseDown: function (event): void {},
//            mouseUp: function (event): void {},
//            mouseMove: function (event): void {},
//            intersect: function (raycaster): THREE.Intersection {
//                return null;
//                },
//            mouseLeave: function (): void {}
//        }
//    };
//}

//describe("Mouse Handler", () => {
//    var mouseHandler: Techne.Handler.MouseHandler;
//    var techne: MockTechne;

//    beforeEach(() => {
//        techne = new MockTechne();
//        techne.camera = new THREE.PerspectiveCamera(45, 512 / 512, 0.1, 1000);
//        techne.camera.up = new THREE.Vector3(0, -1, 0);
//        techne.camera.position.x = 80;
//        techne.camera.position.y = 0;
//        techne.camera.position.z = 0;
//        techne.camera.rotation.order = "YZX";
//        techne.camera.updateProjectionMatrix();

//        mouseHandler = new Techne.Handler.MouseHandler(<Techne.Editor><any>techne);
//        spyOn(mouseHandler, "onDocumentDoubleClick").and.callThrough();
//        spyOn(mouseHandler, "onDocumentMouseDown").and.callThrough();
//        spyOn(mouseHandler, "onDocumentMouseMove").and.callThrough();
//        spyOn(mouseHandler, "onDocumentMouseUp").and.callThrough();
//        spyOn(mouseHandler, "update").and.callThrough();
//        spyOn(mouseHandler, "intersect").and.callThrough();
//    });

//    it("just calls init", () => {
//        spyOn(techne.container, "addEventListener");
//        spyOn(techne.controls, "addEventListener");
//        mouseHandler.init();

//        var registeredListeners = ["mouseup", "mousedown", "mousemove", "contextmenu"];
//        expect(techne.container.addEventListener.calls.count()).toEqual(4);
//        expect(techne.container.addEventListener.calls.allArgs().map((val) => registeredListeners.indexOf(val[0]) > -1).join('')).toBeTruthy();
//        expect(techne.controls.addEventListener.calls.count()).toEqual(1);
//    });

//    describe("checks all possible mouseup callbackoptions", () => {
//        it("should call intersect because the selected tool is not hovering", () => {
//            var mouseUpEvent = jQuery.Event("mouseup");
//            mouseUpEvent.button = 0;
//            mouseUpEvent.target = <EventTarget>techne.renderer.domElement;
//            mouseUpEvent.offsetX = 0;
//            mouseUpEvent.offsetY = 0;

//            mouseHandler.onDocumentMouseUp(<MouseEvent><any>mouseUpEvent);
//            expect(mouseHandler.intersect.calls.count()).toEqual(1);
//        })
//        it("should NOT call intersect because the selected tool is hovering", () => {
//            var mouseUpEvent = jQuery.Event("mouseup");
//            mouseUpEvent.button = 0;
//            mouseUpEvent.target = <EventTarget>techne.renderer.domElement;
//            mouseUpEvent.offsetX = 0;
//            mouseUpEvent.offsetY = 0;

//            techne.controller.selectedTool.isHover = true;

//            spyOn(techne.controller.selectedTool, "mouseUp");

//            mouseHandler.onDocumentMouseUp(<MouseEvent><any>mouseUpEvent);
//            expect(mouseHandler.intersect.calls.count()).toEqual(0);
//            expect(techne.controller.selectedTool.mouseUp.calls.count()).toEqual(1);
//        })
//        it("should NOT call intersect because the selected tool is active", () => {
//            var mouseUpEvent = jQuery.Event("mouseup");
//            mouseUpEvent.button = 0;
//            mouseUpEvent.target = <EventTarget>techne.renderer.domElement;
//            mouseUpEvent.offsetX = 0;
//            mouseUpEvent.offsetY = 0;

//            techne.controller.selectedTool.isActive = true;

//            spyOn(techne.controller.selectedTool, "mouseUp");

//            mouseHandler.onDocumentMouseUp(<MouseEvent><any>mouseUpEvent);
//            expect(mouseHandler.intersect.calls.count()).toEqual(0);
//            expect(techne.controller.selectedTool.mouseUp.calls.count()).toEqual(1);
//        })
//    });

//    describe("checks the update method", () => {
//        xit("does nothing because the camera moved", () => {
//            mouseHandler.hasMoved = true;
//            mouseHander.update();
//        })

//        xit("tries to intersect but wont find anything", () => {
//            mouseHandler.lastIntersected = null;
//            mouseHandler.hasMoved = false;


//            mouseHandler.update();
//        })

//        xit("finds no result but had one the last time", () => {

//        })

//        xit("intersects and finds a result but didn't have anything before", () => {

//        })

//        xit("finds a result and finds another one in the second run", () => {

//        })

//        xit("tests if the controls are disabled when they should be", () => {

//        })
//    });

//    describe("checks intersects", () => {
//        beforeEach(() => {
//            techne.objects = function () {
//            return new [{
//                position: new THREE.Vector3(0,0,0)
//            }];
//            }
//            mouseHandler.width = 512;
//            mouseHandler.height = 512;
//        });

//        xit("it intersects the testcube in the middle", () => {
//            mouseHandler.intersect(256, 256);
//        });
//    });
    
//});