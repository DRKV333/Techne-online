declare module THREE {
    export class OrbitControls {
        constructor(camera: THREE.Camera, container: HTMLElement);
        public noRotate         : boolean;
        public noPan            : boolean;
        public noZoom           : boolean;
        public autoRotate: boolean;
        public enabled: boolean;
        public autoRotateSpeed: number;
        public target: THREE.Vector3;

        public update(): void;
    }
}