// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne {
    export enum EditMode {
        Block,
        Model,
        View
    }
}

interface ITechne {
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

    /**
     * The actual render-loop
     */
    animate(b: TechneBase): void;
    /**
     * Updates the controls and renders the scene
     * @virtual
     */
    render(): void;

    /*
     * Initializes a webgl renderer
     * Adds a new container and a canvas to the site
     */
    initWebGlRenderer(settings: Techne.ISettings): void;
    /*
     * Centers and positions the camera properly
     * @virtual
     */
    centerCamera(): void;
    /**
     * Initializes Techne
     * @returns {boolean} true if the browser supports WebGL
     */
    init(settings: Techne.ISettings):boolean;
    /*
     * Creates a fixed grid
     */
    createGrid(): void;

    /*
     * Initializes a canvas renderer.
     * Except we don't do that.
     * Show images instead?
     */
    initCanvasRenderer(settings: Techne.ISettings): void;

    /*
     * Initializes a camera and set default values for position and target
     */
    initCamera(settings: Techne.ISettings) : void;

    /*
     * Initializes the controls and applies the settings
     * @virtual
     */
    initControls(settings: Techne.ISettings): void;
    /*
     * Loads the texture and initializes the texturemapper
     * @virtual
     */
    initTexture(settings: Techne.ISettings) : void;
    /*
     * Applies any changes to the texture.
     * @virtual
     */
    updateTexture() : void;

    /*
     * Initializes a scenery.
     * Right now, that's just a block underneath and some lights
     */
    initScenery(settings: Techne.ISettings): void;

    /*
    * Loads a model
    * @todo make it work properly and load it from the api via the model-id the fact that it gets passed a model parameter too has to change!
    * @virtual
    */
    loadModel(modelId: string, model: any) : void;

    /*
     * Creates a new null
     * Used so that the viewer and editor can return different objects
     * @virtual
     */
    createNullElement(name: string, position?: number[], rotation?: number[]): Techne.Objects.NullElement;
    /*
     * Creats a new cube
     * Used so that the viewer and editor can return different objects
     * @virtual
     */
    createCube(name: string, size: number[], position: number[], rotation: number[], textureOffset: number[]): Techne.Objects.Cube;
}

class TechneBase implements ITechne {
    /**
     * Holds the scene
     */
    public scene: THREE.Scene;
    /**
     * Holds the camera
     */
    public camera: THREE.Camera;
    /**
     * Holds the controller
     * Usually a THREE.OrbitControl
     */
    public controls: THREE.OrbitControls;
    /**
     * The container that holds the canvas
     */
    public container: HTMLDivElement;
    /**
     * The WebGL-renderer
     * We don't do canvas.
     */
    public renderer: THREE.WebGLRenderer;
    public modelTexture: THREE.Texture;
    public modelMaterial: THREE.MeshLambertMaterial;

    public textureElement: HTMLImageElement;

    /**
     * Current mode Techne is in
     * Can be Block, Model or View at the moment
     */
    public static projectType: Techne.EditMode;
    /**
     * Texturesize as THREE.Vector2
     */
    public static textureSize: THREE.Vector2 = new THREE.Vector2(64, 32);

    /**
     * The actual render-loop
     */
    public animate(b: TechneBase) {
        var that = b;
        requestAnimationFrame(() => { that.animate(that) });
        this.render();
    }
    /**
     * Updates the controls and renders the scene
     * @virtual
     */
    public render() {
        this.renderer.render(this.scene, this.camera);
    } 

    /*
     * Initializes a webgl renderer
     * Adds a new container and a canvas to the site
     */
    public initWebGlRenderer(settings: Techne.ISettings) {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });

        this.container = document.createElement('div');
        this.container.setAttribute("id", "container");
        $("#Techne").append(this.container);
        this.scene = new THREE.Scene();

        this.initCamera(settings);
        this.initControls(settings);
        this.initTexture(settings);
        this.initScenery(settings);

        var cWidth = $("#container").width()
        var cHeight = $("#container").height()
        if (cHeight < 10)
            cHeight = cWidth / 16 * 10

        this.renderer.setSize(cWidth, cHeight);

        this.renderer.domElement.setAttribute("id", "techne-canvas");
        this.container.appendChild(this.renderer.domElement);

        this.centerCamera();
    }
    /*
     * Centers and positions the camera properly
     * @virtual
     */
    public centerCamera() { }
    /**
     * Initializes Techne
     * @returns {boolean} true if the browser supports WebGL
     */
    public init(settings: Techne.ISettings):boolean {
        settings = settings || {}

        settings.noRotate = settings.noRotate != undefined ? settings.noRotate : true;
        settings.noPan = settings.noPan != undefined ? settings.noPan : true;
        settings.noZoom = settings.noZoom != undefined ? settings.noZoom : true;
        settings.autoRotate = settings.autoRotate != undefined ? settings.autoRotate : true;
        settings.autoRotateSpeed = settings.autoRotateSpeed != undefined ? settings.autoRotateSpeed : 0.5;
        settings.showRoom = settings.showRoom != undefined ? settings.showRoom : true;
        
        if (settings.beforeInit) {
            settings.beforeInit();
        }

        var canvas = !!(<any>window).CanvasRenderingContext2D;
        var webgl = (function (): boolean {
            try {
                if ((<any>window).WebGLRenderingContext && document.createElement('canvas').getContext('experimental-webgl')) {
                    return true;
                }
            } catch (e) {
                return false;
            }
            })();

        if (!webgl) {
            this.initCanvasRenderer(settings);
        } else {
            this.initWebGlRenderer(settings);
        }

        if (settings.afterInit) {
            settings.afterInit()
        }

        return webgl
    }
    /*
     * Creates a fixed grid
     */
    public createGrid() {
        var geometry = new THREE.Geometry;
        geometry.vertices.push(new THREE.Vector3(-168, 0, 0));
        geometry.vertices.push(new THREE.Vector3(168, 0, 0));

        var nullElement = new THREE.Object3D();
        nullElement.name = "Grid";

        var material = new THREE.LineBasicMaterial({ color: 0x000000 });
        material.opacity = 0.2;

        for (var i = 0; i < 22; i++) {
            var line = new THREE.Line(geometry, material);
            line.position.y = 24;
            line.position.z = (i * 16) - 168;
            nullElement.add(line);
            line = new THREE.Line(geometry, material);
            line.position.x = (i * 16) - 168;
            line.position.y = 24;
            line.rotation.y = 90 * Math.PI / 180;
            nullElement.add(line);
        }

        this.scene.add(nullElement);
    }

    /*
     * Initializes a canvas renderer.
     * Except we don't do that.
     * Show images instead?
     */
    public initCanvasRenderer(settings: Techne.ISettings) { }

    /*
     * Initializes a camera and set default values for position and target
     */
    public initCamera(settings: Techne.ISettings) {
        var cWidth = $("#container").width()
        var cHeight = $("#container").height()
        if (cHeight < 10)
            cHeight = cWidth / 16 * 10

        //this.camera = new THREE.CombinedCamera(cWidth, cHeight, 45, 0.1, 1000, 0.1, 1000);
        //this.camera.up = new THREE.Vector3(0, -1, 0);
        //this.camera.position.x = 80;
        //this.camera.position.y = -50;
        //this.camera.position.z = -80;
        //this.camera.rotation.order = "YZX";

        var camera = new THREE.PerspectiveCamera(45, cWidth / cHeight, 0.1, 1000);
        camera.up = new THREE.Vector3(0, -1, 0);
        camera.position.x = 80;
        camera.position.y = -50;
        camera.position.z = -80;
        camera.rotation.order = "YZX";
        camera.updateProjectionMatrix();

        this.camera = camera;
    }

    /*
     * Initializes the controls and applies the settings
     * @virtual
     */
    public initControls(settings: Techne.ISettings) {

    }
    /*
     * Loads the texture and initializes the texturemapper
     * @virtual
     */
    public initTexture(settings: Techne.ISettings) {
        var img = <HTMLImageElement>document.getElementById("texture");

        this.textureElement = new Image();

        this.modelTexture = new THREE.Texture(this.textureElement);
        this.modelTexture.minFilter = THREE.NearestFilter;
        this.modelTexture.magFilter = THREE.NearestFilter;

        this.modelMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, map: this.modelTexture });
        this.modelMaterial.transparent = true;

        // TODO: This might be important, but is causes an infinite loop.
        // this.textureElement.onload = () => {
        //     this.updateTexture();
        // }

        if (img != null && img != undefined) {
            this.textureElement.src = img.src;
        }
    }

    /*
     * Applies any changes to the texture.
     * @virtual
     */
    public updateTexture() {
        this.textureElement.src = (<HTMLImageElement>document.getElementById("texture")).src;
        this.modelTexture.image = this.textureElement;
        
        this.modelMaterial.map = this.modelTexture;
        this.modelTexture.needsUpdate = true;
        this.modelMaterial.needsUpdate = true;

        //todo: update size/texture on every model
    }

    /*
     * Initializes a scenery.
     * Right now, that's just a block underneath and some lights
     */
    public initScenery(settings: Techne.ISettings) {
        var block = new THREE.CubeGeometry(16, 16, 16);
        var blockTexture = THREE.ImageUtils.loadTexture("./images/textures/stone.png");
        blockTexture.minFilter = THREE.NearestFilter;
        blockTexture.magFilter = THREE.NearestFilter;
        var blockMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, map: blockTexture });
        var blockMesh = new THREE.Mesh(block, blockMaterial);
        blockMesh.position.y = 32;
        this.scene.add(blockMesh);

        if (settings.showGrid) {
            this.createGrid();
        }

        var ambientLight = new THREE.AmbientLight(0x606060);
        this.scene.add(ambientLight);

        var directionalLight = new THREE.DirectionalLight(0x666666);
        directionalLight.position.set(10, -25.75, 20.5).normalize();
        this.scene.add(directionalLight);

        directionalLight = new THREE.DirectionalLight(0xAAAAAA);
        directionalLight.position.set(-10, -25.75, 0).normalize();
        this.scene.add(directionalLight);
    }

    /*
    * Loads a model
    * @todo make it work properly and load it from the api via the model-id the fact that it gets passed a model parameter too has to change!
    * @virtual
    */
    public loadModel(modelId: string, model: any) {
        var importer = new Techne.File.Importer.TechneImporter(this);
        var result = importer.import(model);
        //todo: set texturesize

        result.data.map((value, index, objects) => { this.scene.add(<THREE.Object3D><any>value); });
        TechneBase.textureSize.set(result.textureSize[0], result.textureSize[1]);
        this.updateTexture();
    }

    /*
     * Creates a new null
     * Used so that the viewer and editor can return different objects
     * @virtual
     */
    public createNullElement(name: string, position?: number[], rotation?: number[]): Techne.Objects.NullElement { return null; }
    /*
     * Creats a new cube
     * Used so that the viewer and editor can return different objects
     * @virtual
     */
    public createCube(name: string, size: number[], position: number[], rotation: number[], textureOffset: number[]): Techne.Objects.Cube { return null; }
}

(function () {
    var id_counter = 1;
    Object.defineProperty(Object.prototype, "__uniqueId", {
        writable: true
    });
    Object.defineProperty(Object.prototype, "uniqueId", {
        get: function () {
            if (this.__uniqueId == undefined) {
                this.__uniqueId = id_counter++;
            }
            return this.__uniqueId;
        }
    });
})();