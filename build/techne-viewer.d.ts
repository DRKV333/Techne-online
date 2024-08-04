declare module Techne.File.Importer {
    interface IImporter<T> {
        import(data: T): IImportResult;
    }
}
declare module Techne.File.Importer {
    interface IImportResult {
        textureSize: number[];
        data: Objects.IObject[];
    }
}
declare module Techne.Objects {
    interface IObject extends THREE.Object3D {
        toggleVisibility(visibility?: boolean): void;
        updatePosition(): void;
        updateSize(): void;
        updateRotation(): void;
        updateTexture(): void;
        isRotated(): void;
        textureOffset: THREE.Vector2;
        minecraftPosition: THREE.Vector3;
    }
}
declare module Techne.Objects {
    interface IVisibleObject extends IObject {
        material: THREE.Material;
        uniqueId?: string;
    }
}
declare module Techne {
    interface ISettings {
        noRotate?: boolean;
        noPan?: boolean;
        noZoom?: boolean;
        autoRotate?: boolean;
        autoRotateSpeed?: number;
        showRoom?: boolean;
        showGrid?: boolean;
        beforeInit?: () => void;
        afterInit?: () => void;
    }
}
declare module Techne.Objects {
    interface IEditableObject extends IObject {
        selected: KnockoutObservable<boolean>;
        observedChildren: KnockoutObservableArray<IObject>;
        observedName: KnockoutObservable<string>;
        publicName: KnockoutComputed<string>;
    }
}
declare module Techne.Objects {
    interface IVisibleEditableObject extends IEditableObject {
        uniqueId?: string;
    }
}
declare module Techne {
    enum EditMode {
        Block = 0,
        Model = 1,
        View = 2,
    }
}
declare class TechneBase {
    public scene: THREE.Scene;
    public camera: THREE.Camera;
    public controls: THREE.OrbitControls;
    public container: HTMLDivElement;
    public renderer: THREE.WebGLRenderer;
    public modelTexture: THREE.Texture;
    public modelMaterial: THREE.MeshLambertMaterial;
    public textureElement: HTMLImageElement;
    static projectType: Techne.EditMode;
    static textureSize: THREE.Vector2;
    public animate(b: TechneBase): void;
    public render(): void;
    public initWebGlRenderer(settings: Techne.ISettings): void;
    public centerCamera(): void;
    public init(settings: Techne.ISettings): boolean;
    public createGrid(): void;
    public initCanvasRenderer(settings: Techne.ISettings): void;
    public initCamera(settings: Techne.ISettings): void;
    public initControls(settings: Techne.ISettings): void;
    public initTexture(settings: Techne.ISettings): void;
    public updateTexture(): void;
    public initScenery(settings: Techne.ISettings): void;
    public loadModel(modelId: string, model: any): void;
    public createNullElement(name: string, position?: number[], rotation?: number[]): Techne.Objects.NullElement;
    public createCube(name: string, size: number[], position: number[], rotation: number[], textureOffset: number[]): Techne.Objects.Cube;
}
declare module Techne.Helper {
    class TextureHelper {
        private cube;
        private textureOffset;
        private useOffset;
        constructor(cube: Objects.Cube, textureOffset: THREE.Vector2);
        private Width(count);
        private Height(count);
        private mirror<T>(points);
        private rotate<T>(array, count);
        private getRealLeft();
        private getRealRight();
        public getLeft(): THREE.Vector2[];
        public getRight(): THREE.Vector2[];
        public getFront(): THREE.Vector2[];
        public getBack(): THREE.Vector2[];
        public getTop(): THREE.Vector2[];
        public getBottom(): THREE.Vector2[];
    }
}
declare module Techne.Objects {
    class NullElement extends THREE.Object3D implements IObject {
        public minecraftPosition: THREE.Vector3;
        public textureOffset: THREE.Vector2;
        constructor(name: string, position?: number[], rotation?: number[]);
        public toggleVisibility(visibility?: boolean): void;
        public updatePosition(): void;
        public updateSize(): void;
        public updateRotation(): void;
        public hasRotatedChild(): boolean;
        public isRotated(): boolean;
        public addChild(object: any): void;
        public removeChild(child: any): void;
        public updateTexture(): void;
    }
}
declare module Techne.Objects {
    class Plane extends THREE.Mesh implements IVisibleObject {
        public observedChildren: KnockoutObservableArray<IObject>;
        public observedName: KnockoutObservable<string>;
        public publicName: KnockoutComputed<string>;
        public selected: KnockoutObservable<boolean>;
        public minecraftPosition: THREE.Vector3;
        public textureOffset: THREE.Vector2;
        constructor(name: string, size: number[], position: number[], rotation: THREE.Vector3, textureOffset: THREE.Vector2, material: THREE.Material, texture: THREE.Texture);
        public toggleVisibility(visibility?: boolean): void;
        public updatePosition(): void;
        public updateSize(): void;
        public updateRotation(): void;
        public updateTexture(): void;
        public isRotated(): boolean;
    }
}
declare module Techne.Objects {
    class Cube extends THREE.Mesh implements IVisibleObject {
        public minecraftPosition: THREE.Vector3;
        public textureOffset: THREE.Vector2;
        constructor(name: string, size: number[], position: number[], rotation: number[], textureOffset: number[], material: THREE.Material, texture: THREE.Texture);
        public toggleVisibility(visibility?: boolean): void;
        public updatePosition(): void;
        public updateSize(): void;
        public updateRotation(): void;
        public updateTexture(): void;
        public isRotated(): void;
    }
}
declare module Techne.File.Importer {
    class TechneImporter implements IImporter<any> {
        private techne;
        private result;
        private parent;
        constructor(techne: TechneBase);
        public import(json: any): IImportResult;
        private addElement(element, parent?);
        private ParseShape(shape, parent?);
        private parseFolder(folder, parent?);
    }
}
declare module Techne {
    class Viewer extends TechneBase {
        constructor();
        public initControls(settings: ISettings): void;
        public render(): void;
        public createNullElement(name: string, position?: number[], rotation?: number[]): Objects.NullElement;
        public createCube(name: string, size: number[], position: number[], rotation: number[], textureOffset: number[]): Objects.Cube;
    }
}
