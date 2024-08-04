// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne {
    export interface IEditor extends ITechne {

        controller: Controller;
        current: KnockoutObservable<Objects.IEditableObject>;
        observedChildren: KnockoutObservableArray<Objects.IEditableObject>;

        /*
         * Initilializes Keyboard, Mouse and Dragevents
         */
        initEvents(settings: Techne.ISettings): void;
   
        /*
         * Selects a new element
         * Used to call setSelected in Controller from html
         * NOTE: think about calling it directly so you don't need the singleton anymore
         */
        selectObject(cube: Objects.IEditableObject): void;

        /*
         * Toggles the visibility of teh passed object
         * Used to call toggleVisibility of the cube
         * NOTE: think about calling it directly so you don't need the singleton anymore (why is there none?)
         */
        toggleVisibility(cube: Objects.IEditableObject): boolean;

        /*
         * Selects a new object
         * Used to call setSelected in Controller from html
         * NOTE: think about calling it directly so you don't need the singleton anymore (why is there none?)
         */
        setSelected(object?: Objects.IEditableObject) : void;

        importCraftStudioBlock(data: ArrayBuffer) : void;

        /*
         * Import a minecraft block
         */
        importMinecraftBlock(json: Techne.File.Definitions.IMinecraftBlockJSON): void;
        /*
         * Export a minecraft block
         */
        exportMinecraftBlock(): Techne.File.Definitions.IMinecraftBlockJSON;
        
        changeTool(tool: string): void;

        redo(index?: number): void;
        undo(index?: number): void;

        copy(): void;
        paste(): void;
    }

    export class Editor extends TechneBase implements IEditor {
        public controller: Controller;
        private textureMapper: TextureMapper;
        private mouseHandler: Handler.MouseHandler;
        private keyboardHandler: Handler.KeyboardHandler;
        private fileDropHandler: Handler.FileDropHandler
        public current: KnockoutObservable<Objects.IEditableObject>;
        public observedChildren: KnockoutObservableArray<Objects.IEditableObject>;
        private clipboard: Objects.IEditableObject;
        public minecraftPosition: THREE.Vector3;

        public static Instance: Editor;

        constructor() {
            super();
            this.controller = new Controller(this);
            this.textureMapper = new Techne.TextureMapper(this);

            this.minecraftPosition = new THREE.Vector3();

            this.current = ko.observable<Objects.IEditableObject>();
            this.observedChildren = ko.observableArray<Objects.IEditableObject>([]);
            this.observedChildren.subscribe((changes:any[]) => {
                changes.map((data) => {
                    switch (data.status) {
                        case "deleted":
                            this.scene.remove(data.value);
                            data.value.logicalParent = undefined;
                            amplify.publish("ObjectRemoved", { element: data.value, parent: this });
                            break;
                        case "added":
                            data.value.logicalParent = this;
                            this.scene.add(data.value);
                            amplify.publish("ObjectAdded", { element: data.value, parent: this });
                            break;
                    }
                });
            },
                null, 'arrayChange');
            //this.parent = this.objects;
        }

        /*
         * Initializes the editor
         */
        public init(settings: Techne.ISettings): boolean {
            Editor.Instance = this;
            var supportsWebGl = super.init(settings);

            if (!supportsWebGl) {
                return false;
            }

            this.initEvents(settings);
            return true;
        }

        /*
         * Loads the texture and initializes the texturemapper
         */
        public initTexture(settings: Techne.ISettings) {
            super.initTexture(settings);
            this.textureMapper.init();
            this.textureMapper.initTexture();
        }

        /*
         * Initilializes Keyboard, Mouse and Dragevents
         */
        public initEvents(settings: Techne.ISettings) {
            this.fileDropHandler = new Techne.Handler.FileDropHandler(this);
            this.fileDropHandler.init();

            this.mouseHandler = new Techne.Handler.MouseHandler(this);
            this.mouseHandler.init();

            this.keyboardHandler = new Techne.Handler.KeyboardHandler(this);
            this.keyboardHandler.init();
        }
        /*
         * Initializes the controls and applies the settings
         */
        public initControls(settings: Techne.ISettings) {
            this.controls = new THREE.OrbitControls(this.camera, this.container);

            this.controls.noRotate = settings.noRotate;
            this.controls.noPan = settings.noPan;
            this.controls.noZoom = settings.noZoom;
            this.controls.autoRotate = settings.autoRotate;
            this.controls.autoRotateSpeed = settings.autoRotateSpeed;
        }

        ///*
        // * Creates a new cube and adds it to the scene
        // */
        //public addCube(name: string, size: number[], position:number[], rotation:number[], textureOffset:number[], parent) { }
        /*
         * Adds any element of type Objects.IObject to the scene
         */
        public addChild(element: Objects.IEditableObject, parent?: Objects.EditableCollectionBase) {
            if (parent) {
                parent.observedChildren.push(element);
            } else {
                this.observedChildren.push(element);
            }
        }
        ///*
        // * Creates and adds a new NullElement to the scene
        // */
        //public addNull(name, position, rotation) { }

        /*
         * Applies any changes to the texture.
         */
        public updateTexture() {
            super.updateTexture();
            var tmp = new Image();
            tmp.src = this.textureElement.src;

            Editor.textureSize.x = tmp.width;
            Editor.textureSize.y = tmp.height;
            this.textureMapper.update();
            this.textureMapper.initTexture();
        }

        /*
         * Selects a new element
         * Used to call setSelected in Controller from html
         * NOTE: think about calling it directly so you don't need the singleton anymore
         */
        public selectObject(cube: Objects.IEditableObject) {
            Editor.Instance.controller.setSelected(cube);
        }

        /*
         * Toggles the visibility of teh passed object
         * Used to call toggleVisibility of the cube
         * NOTE: think about calling it directly so you don't need the singleton anymore (why is there none?)
         */
        public toggleVisibility(cube: Objects.IEditableObject) {
            cube.toggleVisibility();
            if (cube == this.current())
                this.controller.setSelected(null);

            return true;
        }

        /*
         * Removes the object from the scene or its parent
         * Used to call setSelected in Controller from html
         * NOTE: think about calling it directly so you don't need the singleton anymore (why is there none?)
         */
        public removeChild(cube: Objects.IEditableObject) {
            if (cube.parent instanceof THREE.Scene) {
                this.observedChildren.remove(cube);
            } else {
                (<Objects.EditableCollectionBase>cube.parent).removeChild(cube)
            }

            this.setSelected();
        }

        /*
         * Selects a new object
         * Used to call setSelected in Controller from html
         * NOTE: think about calling it directly so you don't need the singleton anymore (why is there none?)
         */
        public setSelected(object?: Objects.IEditableObject) {
            if (object && object.parent && object.parent.parent instanceof Techne.Objects.Array) {
                object = (<Objects.Array>object.parent.parent).element;
            }

            this.controller.setSelected(object);
        }

        public importCraftStudioBlock(data: ArrayBuffer) {
            var importer = new Techne.File.Importer.CraftStudioImporter(this);
            var result = importer.import(data);
            result.data.map((value: Techne.Objects.IEditableObject, index, objects) => {
                this.observedChildren.push(value);
            });
            TechneBase.textureSize.set(result.textureSize[0], result.textureSize[1]);
            this.updateTexture();
        }

        /*
         * Import a minecraft block
         */
        public importMinecraftBlock(json: Techne.File.Definitions.IMinecraftBlockJSON) {
            var importer = new Techne.File.Importer.BlockImporter(this);
            var result = importer.import(json);
            result.data.map((value: Techne.Objects.IEditableObject, index, objects) => {
                this.observedChildren.push(value);
            });
            TechneBase.textureSize.set(result.textureSize[0], result.textureSize[1]);
            this.updateTexture();
        }
        /*
         * Export a minecraft block
         */
        public exportMinecraftBlock(): Techne.File.Definitions.IMinecraftBlockJSON {
            var exporter = new Techne.File.Exporter.BlockExporter();
            return exporter.export(this.observedChildren());
        }

        /*
         * The render-method
         * renders the scene, the texturemapper and updates the controls (might want to move that)
         */
        public render() {
            super.render();
            this.textureMapper.render();
            this.controls.update();
            this.mouseHandler.update();
        }

        /*
         * Positions the camera properly, centered on the model and so that the model fill most of the screen.
         */          
        public centerCamera() {
            //var aabb = new THREE.Box3();

            //var boundingBoxes = [];

            //var objects = this.objects();
            //for (var index in objects) {
            //    if (!objects.hasOwnProperty(index)) {
            //        continue;
            //    }
            //    var cube = objects[index];
            //    var box = new THREE.Box3().setFromObject((<THREE.Object3D><any>cube));

            //    if (isFinite(box.min.x) && isFinite(box.min.y) && isFinite(box.min.z))
            //        boundingBoxes.push(box.min);
            //    if (isFinite(box.max.x) && isFinite(box.max.y) && isFinite(box.max.z))
            //        boundingBoxes.push(box.max);
            //}

            //aabb.setFromPoints(boundingBoxes);
            //var boundingSphere = aabb.getBoundingSphere();

            //this.controls.center = boundingSphere.center;

            //var length = aabb.size().length();
            //var radiusHorizontal = length / Math.tan(35 * Math.PI / 180) * 2;
            //var radiusVertical = length / Math.tan(35 * Math.PI / 180) * 2;
            //var radius = Math.max(radiusHorizontal, radiusVertical);

            //this.camera.position.set(0, boundingSphere.center.y, radius);
            //return;
        }
        
        /*
         * Loads a model
         * @todo make it work properly and load it from the api via the model-id the fact that it gets passed a model parameter too has to change!
         * think about using the base implementation?
         */
        public loadModel(modelId: string, model: any) {
            var importer = new Techne.File.Importer.TechneImporter(this);
            var result = importer.import(model);
            //todo: set texturesize

            result.data.map((value: Techne.Objects.IEditableObject, index, objects) => {
                this.observedChildren.push(value);
            });
            TechneBase.textureSize.set(result.textureSize[0], result.textureSize[1]);
            this.updateTexture();
        }

        /*
         * Creates a new null
         */
        public createNullElement(name: string, position?: number[], rotation?: number[]): Objects.NullElement {
            return new Objects.EditableNullElement(name, position, rotation);
        }
        /*
         * Creats a new cube
         * Used so that the viewer and editor can return different objects
         */
        public createCube(name: string, size: number[], position: number[], rotation: number[], textureOffset: number[]): Objects.Cube {
            return new Objects.EditableCube(name, size, position, rotation, textureOffset, this.modelMaterial);
        }

        public changeTool(tool: string) {
            this.controller.setTool(tool);
        }

        public redo(index?: number) {
            this.controller.redo(index);
        }

        public undo(index?: number) {
            this.controller.undo(index);
        }

        public copy(): void {
            this.clipboard = <Objects.IEditableObject>this.current().clone();
        }
        public paste(): void {
            if (this.clipboard) {
                this.addChild(<Objects.IEditableObject>this.clipboard.clone());
            }
        }

        public onChildChanged(child: Objects.IEditableObject, status: string, depth: number): void {
        }
        public onChildPropertyChanged(child: Objects.IEditableObject, depth: number): void {
        }

        public getChildrenForExport(): Objects.IObject[]{
            return this.observedChildren();
        }
    }
}