module Techne.Mock {
	export class Editor implements Techne.IEditor {
		controller: Controller;
        current: KnockoutObservable<Objects.IEditableObject>;
        objects: KnockoutObservableArray<Objects.IEditableObject>;
        /**
     * Holds the scene
     */
    scene: THREE.Scene;
    /**
     * Holds the camera
     */
    camera: THREE.Camera;
    /**
     * Holds the controller
     * Usually a THREE.OrbitControl
     */
    controls: THREE.OrbitControls;
    /**
     * The container that holds the canvas
     */
    container: HTMLDivElement;
    /**
     * The WebGL-renderer
     * We don't do canvas.
     */
    renderer: THREE.WebGLRenderer;
    modelTexture: THREE.Texture;
    modelMaterial: THREE.MeshLambertMaterial;

    textureElement: HTMLImageElement;

    observedChildren: KnockoutObservableArray<Objects.IEditableObject>;

    /**
     * The actual render-loop
     */
    animate(b: TechneBase): void { }
    /**
     * Updates the controls and renders the scene
     * @virtual
     */
    render(): void { }

    /*
     * Initializes a webgl renderer
     * Adds a new container and a canvas to the site
     */
    initWebGlRenderer(settings: Techne.ISettings): void { }
    /*
     * Centers and positions the camera properly
     * @virtual
     */
    centerCamera(): void { }
    /**
     * Initializes Techne
     * @returns {boolean} true if the browser supports WebGL
     */
    init(settings: Techne.ISettings):boolean { return true; }
    /*
     * Creates a fixed grid
     */
    createGrid(): void { }

    /*
     * Initializes a canvas renderer.
     * Except we don't do that.
     * Show images instead?
     */
    initCanvasRenderer(settings: Techne.ISettings): void { }

    /*
     * Initializes a camera and set default values for position and target
     */
    initCamera(settings: Techne.ISettings) : void { }

    /*
     * Initializes the controls and applies the settings
     * @virtual
     */
    initControls(settings: Techne.ISettings): void { }
    /*
     * Loads the texture and initializes the texturemapper
     * @virtual
     */
    initTexture(settings: Techne.ISettings) : void { }
    /*
     * Applies any changes to the texture.
     * @virtual
     */
    updateTexture() : void { }

    /*
     * Initializes a scenery.
     * Right now, that's just a block underneath and some lights
     */
    initScenery(settings: Techne.ISettings): void { }

    /*
    * Loads a model
    * @todo make it work properly and load it from the api via the model-id the fact that it gets passed a model parameter too has to change!
    * @virtual
    */
    loadModel(modelId: string, model: any) : void { }

    /*
     * Creates a new null
     * Used so that the viewer and editor can return different objects
     * @virtual
     */
    createNullElement(name: string, position?: number[], rotation?: number[]): Techne.Objects.NullElement { return null; }
    /*
     * Creats a new cube
     * Used so that the viewer and editor can return different objects
     * @virtual
     */
    createCube(name: string, size: number[], position: number[], rotation: number[], textureOffset: number[]): Techne.Objects.Cube { return null;}

        /*
         * Initilializes Keyboard, Mouse and Dragevents
         */
        initEvents(settings: Techne.ISettings): void{ }

        /*
         * Adds any element of type Objects.IObject to the scene
         */
        addElement(element: Techne.Objects.IEditableObject, parent?: Objects.EditableCollectionBase): void{ }
   
        /*
         * Selects a new element
         * Used to call setSelected in Controller from html
         * NOTE: think about calling it directly so you don't need the singleton anymore
         */
        selectObject(cube: Objects.IEditableObject): void{ }

        /*
         * Toggles the visibility of teh passed object
         * Used to call toggleVisibility of the cube
         * NOTE: think about calling it directly so you don't need the singleton anymore (why is there none?)
         */
        toggleVisibility(cube: Objects.IEditableObject): boolean{ return true; }

        /*
         * Removes the object from the scene or its parent
         * Used to call setSelected in Controller from html
         * NOTE: think about calling it directly so you don't need the singleton anymore (why is there none?)
         */
        removeObject(cube: Objects.IEditableObject): void{ }

        /*
         * Selects a new object
         * Used to call setSelected in Controller from html
         * NOTE: think about calling it directly so you don't need the singleton anymore (why is there none?)
         */
        setSelected(object?: Objects.IEditableObject) : void{ }

        importCraftStudioBlock(data: ArrayBuffer) : void{ }

        /*
         * Import a minecraft block
         */
        importMinecraftBlock(json: Techne.File.Definitions.IMinecraftBlockJSON): void{ }
        /*
         * Export a minecraft block
         */
        exportMinecraftBlock(): Techne.File.Definitions.IMinecraftBlockJSON{ return null; }
        
        changeTool(tool: string): void{ }

        redo(): void{ }
        undo(): void{ }

        copy(): void { }
        paste(): void { }
	}
}