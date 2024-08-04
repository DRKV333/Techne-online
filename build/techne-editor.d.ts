declare module Techne.File.Definitions {
    interface IMinecraftFaceData {
        uv: number[];
        textureFacing: string;
        rotation?: number;
        tint?: boolean;
        overlay?: boolean;
        tintOverlay?: boolean;
        cull?: boolean;
        shade?: number;
    }
    interface IMinecraftBlockElement {
        type: string;
        from: number[];
        to: number[];
        origin?: number[];
        rotation?: number[];
        name?: string;
        faceData?: IMinecraftFaceData[];
    }
    interface IMinecraftInheritedBlockJSON {
        name: string;
        inheritFrom: string;
        translation: number[];
        rotationOrigin: number[];
        rotation: number[];
    }
    interface IMinecraftBlockJSON {
        angleVariants?: number;
        elements: IMinecraftBlockElement[];
        useAmbientOcclusion?: boolean;
        randomOffsetX?: boolean;
        randomOffsetY?: boolean;
        randomOffsetZ?: boolean;
        inventoryRender3D?: boolean;
        name?: string;
    }
}
declare module Techne.File.Definitions {
    interface ICraftStudioModel {
        formatVersion: number;
        nextUnusednodeID: number;
        nodeCount: number;
        nodes: IModelNode[];
        textureData: Uint8Array;
    }
    interface IModelNode {
        id: number;
        parentId: number;
        name: string;
        position: number[];
        offset: number[];
        scale: number[];
        orientation: number[];
        blockSizeX: number;
        blockSizeY: number;
        blockSizeZ: number;
        textureOffset: ICoordinates2[];
        uvTransformFlags: number[];
        children?: IModelNode[];
    }
    interface ICoordinates2 {
        x: number;
        y: number;
    }
}
declare module Techne.File.Exporter {
    interface IExporter<T> {
        export(objects: Objects.IObject[]): T;
    }
}
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
        clone(): IObject;
        threeClone(): THREE.Object3D;
    }
}
declare module Techne.Objects {
    interface IVisibleObject extends IObject {
        material: THREE.Material;
        uniqueId?: string;
    }
}
declare module Techne.Objects {
    interface IEditableObject extends IObject {
        selected: KnockoutObservable<boolean>;
        observedName: KnockoutObservable<string>;
        publicName: KnockoutComputed<string>;
        clone(): IEditableObject;
    }
}
declare module Techne.Objects {
    interface IVisibleEditableObject extends IEditableObject {
        uniqueId?: string;
    }
}
declare module Techne.Objects {
    interface IEditableCollection {
        observedChildren: KnockoutObservableArray<IObject>;
        onChildChanged(child: IEditableObject, status: string): void;
        removeChild(cube: IEditableObject): void;
        addChild(element: IEditableObject, parent?: EditableCollectionBase): void;
    }
}
declare module Techne.Tools {
    interface ITool extends THREE.Object3D {
        objectSelected(object: Objects.IEditableObject): void;
        objectDeselected(): void;
        mouseEnter(intersection: THREE.Intersection): void;
        mouseLeave(): void;
        mouseDown(event: MouseEvent): void;
        mouseMove(event: THREE.Intersection): void;
        mouseUp(event: MouseEvent): void;
        intersect(raycaster: THREE.Raycaster): THREE.Intersection;
        dispose(): void;
        isActive: boolean;
        isHover: boolean;
        name: string;
    }
    interface IAxis {
        vector: THREE.Vector3;
        normal: THREE.Vector3;
        color: number;
        rotation: THREE.Vector3;
    }
    class Axis {
        static X: IAxis;
        static Y: IAxis;
        static Z: IAxis;
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
declare module Techne.Models {
    interface IElementHistoryModel {
        element: Objects.IEditableObject;
        parent: Objects.IEditableCollection;
    }
}
declare module Techne.Models {
    enum HistoryAction {
        PropertyChanged = 0,
        Removed = 1,
        Added = 2,
        ParentChanged = 3,
    }
    interface IHistoryModel {
        propertyChain?: string[];
        element: Objects.IEditableObject;
        old: any;
        new: any;
        target: (value: any) => void;
        actionType: HistoryAction;
    }
}
declare module Techne.Extensions {
    class LimitedStack<T> {
        private limit;
        private stack;
        constructor(limit: number);
        public push(elem: T): void;
        public peek(): T;
        public pop(): T;
    }
}
declare module Techne.Extensions {
    class HistoryStack extends LimitedStack<Models.IHistoryModel> {
        constructor(limit: number);
        public push(elem: Models.IHistoryModel): void;
    }
}
declare module Techne {
    enum EditMode {
        Block = 0,
        Model = 1,
        View = 2,
    }
}
interface ITechne {
    scene: THREE.Scene;
    camera: THREE.Camera;
    controls: THREE.OrbitControls;
    container: HTMLDivElement;
    renderer: THREE.WebGLRenderer;
    modelTexture: THREE.Texture;
    modelMaterial: THREE.MeshLambertMaterial;
    textureElement: HTMLImageElement;
    animate(b: TechneBase): void;
    render(): void;
    initWebGlRenderer(settings: Techne.ISettings): void;
    centerCamera(): void;
    init(settings: Techne.ISettings): boolean;
    createGrid(): void;
    initCanvasRenderer(settings: Techne.ISettings): void;
    initCamera(settings: Techne.ISettings): void;
    initControls(settings: Techne.ISettings): void;
    initTexture(settings: Techne.ISettings): void;
    updateTexture(): void;
    initScenery(settings: Techne.ISettings): void;
    loadModel(modelId: string, model: any): void;
    createNullElement(name: string, position?: number[], rotation?: number[]): Techne.Objects.NullElement;
    createCube(name: string, size: number[], position: number[], rotation: number[], textureOffset: number[]): Techne.Objects.Cube;
}
declare class TechneBase implements ITechne {
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
declare module Techne.Extender {
    enum Filter {
        Integer = 0,
        Float = 1,
        Alpha = 2,
        AlphaNumerical = 3,
        Positive = 4,
        Negative = 5,
    }
    interface UpdateOptions {
        propertyChain: string[];
        callback?: (element: Objects.IObject) => void;
        map?: (value: any) => any;
    }
}
declare module Techne.Handler {
    class MouseHandler {
        private techne;
        private projector;
        private hasMoved;
        private mouse;
        private width;
        private height;
        private lastIntersected;
        constructor(techne: Editor);
        public init(): void;
        public onDocumentDoubleClick(event: JQueryEventObject): void;
        public onDocumentMouseDown(event: MouseEvent): void;
        public onDocumentMouseMove(event: MouseEvent): void;
        public onDocumentMouseUp(event: MouseEvent): void;
        public makeDoubleRightClickHandler(handler: (event: JQueryEventObject) => void): (e: JQueryEventObject) => void;
        public intersect(mouseX: number, mouseY: number): THREE.Intersection[];
        public update(): void;
    }
}
declare module Techne.Handler {
    class KeyboardHandler {
        private techne;
        constructor(techne: Editor);
        public init(): void;
        private onKeyUp(event);
    }
}
declare module Techne.Handler {
    class TextureDragHandler {
        private data;
        private dragging;
        private element;
        private lastPosition;
        private positionDelta;
        constructor(dragable: PIXI.DisplayObject);
        private mouseUp(e);
        private mouseDown(e);
        private mouseMove(e);
    }
}
declare module Techne.Handler {
    class FileDropHandler {
        private techne;
        constructor(techne: Editor);
        public init(): void;
        public onDragEnter(e: DragEvent): void;
        public onDragOver(e: DragEvent): void;
        public onDragLeave(e: DragEvent): void;
        public onDrop(e: DragEvent): boolean;
    }
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
declare module Techne.Helper {
    class ArrowHelper extends THREE.Object3D {
        public axis: Tools.IAxis;
        private hex;
        private cone;
        private cylinder;
        private material;
        constructor(origin: THREE.Vector3, axis: Tools.IAxis, hex?: number);
        public setDirection(dir: THREE.Vector3): void;
        public setLength(length: any, headLength: any, headWidth: any): void;
        public setColor(hex: number): void;
        public mouseDown(): void;
        public mouseUp(): void;
        public startHover(): void;
        public endHover(): void;
    }
}
declare module Techne.Helper {
    class CircularRibbtonHelper extends THREE.Object3D {
        public axis: Tools.IAxis;
        private hex;
        private material;
        private ribbon;
        constructor(origin: THREE.Vector3, axis: Tools.IAxis, hex?: number);
        public setDirection(dir: THREE.Vector3): void;
        public setColor(hex: number): void;
        public mouseDown(): void;
        public mouseUp(): void;
        public startHover(): void;
        public endHover(): void;
    }
}
declare module Techne.Tools {
    class ToolBase extends THREE.Object3D implements ITool {
        public controller: Controller;
        public selectedObject: Objects.IEditableObject;
        public isActive: boolean;
        public isHover: boolean;
        public lastPosition: THREE.Vector3;
        public positionDelta: THREE.Vector3;
        public name: string;
        constructor(controller: Controller);
        public objectSelected(object: Objects.IEditableObject): void;
        public objectDeselected(): void;
        public mouseEnter(intersection: THREE.Intersection): void;
        public mouseLeave(): void;
        public mouseDown(event: MouseEvent): void;
        public mouseUp(event: MouseEvent): void;
        public mouseMove(intersection: THREE.Intersection): void;
        public intersect(raycaster: THREE.Raycaster): THREE.Intersection;
        public attachControls(): void;
        public removeControls(): void;
        public start(): void;
        public end(): void;
        public update(): void;
        public startHover(intersection: THREE.Intersection): void;
        public endHover(): void;
        public dispose(): void;
    }
}
declare module Techne.Objects {
    class CollectionBase extends THREE.Object3D implements IObject {
        public minecraftPosition: THREE.Vector3;
        public textureOffset: THREE.Vector2;
        constructor(name: string, position?: number[], rotation?: number[]);
        public toggleVisibility(visibility?: boolean): void;
        public updatePosition(): void;
        public updateSize(): void;
        public updateRotation(): void;
        public updateTexture(): void;
        public hasRotatedChild(): boolean;
        public isRotated(): boolean;
        public addChild(object: any): void;
        public removeChild(child: any): void;
        public clone(): CollectionBase;
        public threeClone(): THREE.Object3D;
    }
}
declare module Techne.Objects {
    class EditableCollectionBase extends CollectionBase implements IEditableCollection, IEditableObject {
        public observedChildren: KnockoutObservableArray<IEditableObject>;
        public observedName: KnockoutObservable<string>;
        public publicName: KnockoutComputed<string>;
        public selected: KnockoutObservable<boolean>;
        public minecraftPosition: THREE.Vector3;
        public textureOffset: THREE.Vector2;
        constructor(name: string, position?: number[], rotation?: number[]);
        public createSubscriptions(): void;
        public toggleVisibility(visibility?: boolean): void;
        public updatePosition(): void;
        public updateSize(): void;
        public updateRotation(): void;
        public hasRotatedChild(): boolean;
        public isRotated(): boolean;
        public addChild(object: IEditableObject): void;
        public removeChild(child: IEditableObject): void;
        public updateTexture(): void;
        public clone(): EditableCollectionBase;
        public onChildChanged(child: IEditableObject, status: string): void;
    }
}
declare module Techne.Objects {
    class NullElement extends CollectionBase {
        public minecraftPosition: THREE.Vector3;
        public textureOffset: THREE.Vector2;
        constructor(name: string, position?: number[], rotation?: number[]);
        public updateSize(): void;
        public updateRotation(): void;
        public clone(): NullElement;
    }
}
declare module Techne.Tools {
    class MoveTool extends ToolBase {
        private arrows;
        private tool;
        private toolAxisPlane;
        constructor(controller: Controller);
        public attachControls(): void;
        public removeControls(): void;
        public start(): void;
        public end(): void;
        public update(): boolean;
        public startHover(intersection: THREE.Intersection): void;
        public endHover(): void;
        public intersect(raycaster: THREE.Raycaster): THREE.Intersection;
        public dispose(): void;
    }
}
declare module Techne.Tools {
    class Protractor extends THREE.Object3D {
        private axis;
        private center;
        private start;
        private current;
        private currentLine;
        private startLine;
        private area;
        private textCanvas;
        private textTexture;
        private billboard;
        constructor(axis: IAxis, center: THREE.Vector3, start: THREE.Vector3, current?: THREE.Vector3);
        private updateArea(currentAngle);
        public setStart(start: THREE.Vector3): void;
        public update(current: THREE.Vector3, currentAngle: number): void;
    }
}
declare module Techne.Tools {
    class RotateTool extends ToolBase {
        private ribbons;
        private tool;
        private axis;
        private toolAxisPlane;
        private startingPoint;
        private currentPosition;
        private startingRotation;
        private protractor;
        private totalAngle;
        private startAngle;
        constructor(controller: Controller);
        public attachControls(): void;
        public removeControls(): void;
        public start(): void;
        public end(): void;
        public update(): boolean;
        private getCurrentAngleDelta();
        public mouseDown(event: MouseEvent): void;
        public startHover(intersection: THREE.Intersection): void;
        public endHover(): void;
        public intersect(raycaster: THREE.Raycaster): THREE.Intersection;
        public dispose(): void;
    }
}
declare module Techne.Tools {
    class ResizeTool extends ToolBase {
        private ribbons;
        private tool;
        private toolAxisPlane;
        constructor(controller: Controller);
        public attachControls(): void;
        public removeControls(): void;
        public start(): void;
        public end(): void;
        public update(): boolean;
        public startHover(intersection: THREE.Intersection): void;
        public endHover(): void;
        public intersect(raycaster: THREE.Raycaster): THREE.Intersection;
        public dispose(): void;
    }
}
declare module Techne.Tools {
    class TextureOffsetTool extends ToolBase {
        private sprite;
        constructor(controller: Controller);
    }
}
declare module Techne.Objects {
    class Cube extends THREE.Mesh implements IVisibleObject {
        public minecraftPosition: THREE.Vector3;
        public textureOffset: THREE.Vector2;
        constructor(name: string, size: number[], position: number[], rotation: number[], textureOffset: number[], material: THREE.Material);
        public toggleVisibility(visibility?: boolean): void;
        public updatePosition(): void;
        public updateSize(): void;
        public updateRotation(): void;
        public updateTexture(): void;
        public isRotated(): void;
        public clone(): Cube;
        public threeClone(): THREE.Object3D;
    }
}
declare module Techne.Objects {
    class Array extends EditableCollectionBase {
        public count: number;
        public radius: number;
        public element: IEditableObject;
        constructor(name: string, position?: number[], rotation?: number[]);
        public createSubscriptions(): void;
        public updateArray(): void;
        public clone(): Array;
        public onChildChanged(child: IEditableObject, status: string): void;
    }
}
declare module Techne.Objects {
    class EditableNullElement extends EditableCollectionBase {
        constructor(name: string, position?: number[], rotation?: number[]);
        public createSubscriptions(): void;
        public updateSize(): void;
        public updateRotation(): void;
        public clone(): EditableNullElement;
    }
}
declare module Techne.Objects {
    class EditableCube extends Cube implements IVisibleEditableObject {
        public observedName: KnockoutObservable<string>;
        public publicName: KnockoutComputed<string>;
        public selected: KnockoutObservable<boolean>;
        constructor(name: string, size: number[], position: number[], rotation: number[], textureOffset: number[], material: THREE.Material);
        public toggleVisibility(visibility?: boolean): void;
        public updatePosition(): void;
        public updateRotation(): void;
        public updateTexture(): void;
        public isRotated(): boolean;
        public clone(): EditableCube;
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
declare module Techne.File.Importer {
    class BlockImporter implements IImporter<Definitions.IMinecraftBlockJSON> {
        private techne;
        private result;
        constructor(techne: TechneBase);
        public import(data: Definitions.IMinecraftBlockJSON): IImportResult;
        private createCube(element, parent);
        private addElement(element, parent?);
    }
}
declare module Techne.File.Importer {
    class CraftStudioImporter implements IImporter<ArrayBuffer> {
        private techne;
        private result;
        private nodes;
        private reader;
        constructor(techne: TechneBase);
        public import(data: ArrayBuffer): IImportResult;
        private addElement(elements, parent);
        private parseNode();
        private convertFromCS(vec);
    }
}
declare module Techne.File.Exporter {
    interface ITechneJson {
        Techne: any;
    }
    class TechneExporter implements IExporter<ITechneJson> {
        public export(objects: Objects.IObject[]): ITechneJson;
        private serializeObjects(objects);
        private serializeNull(obj);
        private serializeShape(obj);
    }
}
declare module Techne.File.Exporter {
    class BlockExporter implements IExporter<Definitions.IMinecraftBlockJSON> {
        public export(objects: Objects.IObject[]): Definitions.IMinecraftBlockJSON;
        private createElementsArray(objects, parentOffset?, parentRotation?);
        private convertToMinecraft(object);
    }
}
declare module Techne {
    class Controller {
        private techne;
        private tools;
        private toolsList;
        private history;
        private redoHistory;
        private pauseHistory;
        public selectedTool: Tools.ITool;
        constructor(techne: IEditor);
        public setTool(name: string): void;
        public getTools(): Tools.ITool[];
        public name: KnockoutObservable<{}>;
        public positionX: KnockoutObservable<{}>;
        public positionY: KnockoutObservable<{}>;
        public positionZ: KnockoutObservable<{}>;
        public sizeX: KnockoutObservable<{}>;
        public sizeY: KnockoutObservable<{}>;
        public sizeZ: KnockoutObservable<{}>;
        public rotationX: KnockoutObservable<{}>;
        public rotationY: KnockoutObservable<{}>;
        public rotationZ: KnockoutObservable<{}>;
        public textureOffsetX: KnockoutObservable<{}>;
        public textureOffsetY: KnockoutObservable<{}>;
        public radius: KnockoutObservable<{}>;
        public count: KnockoutObservable<{}>;
        public setOpacity(selected: Objects.IObject, opacity: number, elements?: Objects.IObject[]): void;
        private setValues(newCurrent);
        private resetValues();
        public setSelected(newCurrent: Objects.IEditableObject): void;
        public redo(): void;
        public undo(): void;
    }
}
declare module Techne {
    class TextureMapper {
        private techne;
        private stage;
        private renderer;
        private texture;
        private textureSprite;
        private container;
        private overlay;
        constructor(techne: Editor);
        public init(): void;
        public initTexture(): void;
        private initRenderer();
        public animate(): void;
        public render(): void;
        public update(): void;
        public setSelected(element: Objects.IEditableObject): void;
    }
}
declare module Techne {
    interface IEditor extends ITechne, Objects.IEditableCollection {
        controller: Controller;
        current: KnockoutObservable<Objects.IEditableObject>;
        observedChildren: KnockoutObservableArray<Objects.IEditableObject>;
        initEvents(settings: ISettings): void;
        selectObject(cube: Objects.IEditableObject): void;
        toggleVisibility(cube: Objects.IEditableObject): boolean;
        setSelected(object?: Objects.IEditableObject): void;
        importCraftStudioBlock(data: ArrayBuffer): void;
        importMinecraftBlock(json: File.Definitions.IMinecraftBlockJSON): void;
        exportMinecraftBlock(): File.Definitions.IMinecraftBlockJSON;
        changeTool(tool: string): void;
        redo(): void;
        undo(): void;
        copy(): void;
        paste(): void;
    }
    class Editor extends TechneBase implements IEditor {
        public controller: Controller;
        private textureMapper;
        private mouseHandler;
        private keyboardHandler;
        private fileDropHandler;
        public current: KnockoutObservable<Objects.IEditableObject>;
        public observedChildren: KnockoutObservableArray<Objects.IEditableObject>;
        private clipboard;
        static Instance: Editor;
        constructor();
        public init(settings: ISettings): boolean;
        public initTexture(settings: ISettings): void;
        public initEvents(settings: ISettings): void;
        public initControls(settings: ISettings): void;
        public addChild(element: Objects.IEditableObject, parent?: Objects.EditableCollectionBase): void;
        public updateTexture(): void;
        public selectObject(cube: Objects.IEditableObject): void;
        public toggleVisibility(cube: Objects.IEditableObject): boolean;
        public removeChild(cube: Objects.IEditableObject): void;
        public setSelected(object?: Objects.IEditableObject): void;
        public importCraftStudioBlock(data: ArrayBuffer): void;
        public importMinecraftBlock(json: File.Definitions.IMinecraftBlockJSON): void;
        public exportMinecraftBlock(): File.Definitions.IMinecraftBlockJSON;
        public render(): void;
        public centerCamera(): void;
        public loadModel(modelId: string, model: any): void;
        public createNullElement(name: string, position?: number[], rotation?: number[]): Objects.NullElement;
        public createCube(name: string, size: number[], position: number[], rotation: number[], textureOffset: number[]): Objects.Cube;
        public changeTool(tool: string): void;
        public redo(): void;
        public undo(): void;
        public copy(): void;
        public paste(): void;
        public onChildChanged(child: Objects.IEditableObject, status: string): void;
    }
}
