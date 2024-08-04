module Techne.Tools {
    export class Protractor extends THREE.Object3D {
        private currentLine: THREE.Line;
        private startLine: THREE.Line;
        private area: THREE.Mesh;
        private textCanvas: HTMLCanvasElement;
        private textTexture: THREE.Texture;
        private billboard: THREE.Object3D;

        constructor(private axis: Tools.IAxis, private center: THREE.Vector3, private start: THREE.Vector3, private current?: THREE.Vector3) {
            super();

            var material = new THREE.LineBasicMaterial({
                color: 0xFFFF00
            });
            this.position = center.clone();
            this.center = new THREE.Vector3();

            var geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(this.center.x, this.center.y, this.center.z));
            geometry.vertices.push(new THREE.Vector3(this.current.x, this.current.y, this.current.z));
            this.currentLine = new THREE.Line(geometry, material);
            this.add(this.currentLine);

            geometry = new THREE.Geometry();
            geometry.vertices.push(new THREE.Vector3(this.center.x, this.center.y, this.center.z));
            geometry.vertices.push(new THREE.Vector3(this.start.x, this.start.y, this.start.z));
            this.startLine = new THREE.Line(geometry, material);
            this.add(this.startLine);

            var areaGeometry = new THREE.CircleGeometry(8, 25, 0, 3);
            var areaMaterial = new THREE.MeshBasicMaterial({ color: 0xAAAAAA });
            areaMaterial.side = THREE.DoubleSide;
            areaMaterial.opacity = 0.75;

            this.area = new THREE.Mesh(
                areaGeometry,
                areaMaterial
                );
            this.area.position = this.center;
            if (this.axis == Techne.Tools.Axis.X) {
                this.area.rotateY(Math.PI / 2);
            } else if (this.axis == Techne.Tools.Axis.Y) {
                this.area.rotateX(Math.PI / 2);
            } else if (this.axis == Techne.Tools.Axis.Z) {
            }
            this.area.rotationAutoUpdate = true;
            //this.area.updateMatrix();
            //this.area.updateMatrixWorld(true);


            this.add(this.area);

            this.textCanvas = document.createElement( 'canvas' );
            this.textCanvas.width = 150;
            this.textCanvas.height = 150;

            var context = this.textCanvas.getContext( '2d' );
            context.font = "24pt Arial";
            context.textAlign = "center";
            context.textBaseline = "middle";
            context.fillStyle = "white";
            context.fillRect(0, 0, 150, 150);
            context.fillStyle = "black";

            this.textTexture = new THREE.Texture( this.textCanvas );
            var textMat = new THREE.MeshBasicMaterial( { map: this.textTexture } );
            textMat.transparent = true;
            textMat.needsUpdate = true;

            this.billboard = new THREE.Mesh(
                new THREE.CubeGeometry(10, 10, 0.01),
                textMat
            );
            this.add(this.billboard);
            this.billboard.position = this.current;
            this.billboard.scale.y = -1;
            this.billboard.scale.x = -1;
        }

        private updateArea(currentAngle: number) {
            //var facesCount = this.area.geometry.faces.length;

            //this.area.geometry.vertices.push(this.center);
            //this.area.geometry.vertices.push(last.clone());
            //this.area.geometry.vertices.push(current.clone());

            //this.area.geometry = new THREE.CircleGeometry(8, 25, 0, 2);

            var geometry;

            if (this.axis == Techne.Tools.Axis.X) {
                geometry = new THREE.CircleGeometry(8, 25, Math.PI - Math.atan2(this.start.y, this.start.z), currentAngle);
            } else if (this.axis == Techne.Tools.Axis.Y) {
                geometry = new THREE.CircleGeometry(8, 25, Math.atan2(this.start.z, this.start.x), currentAngle);
            } else if (this.axis == Techne.Tools.Axis.Z) {
                geometry = new THREE.CircleGeometry(8, 25, Math.atan2(this.start.y, this.start.x), currentAngle);
            }
             
            this.area.geometry.vertices = [];

            for (var i = 0; i < geometry.vertices.length; i++) {
                this.area.geometry.vertices.push(geometry.vertices[i]);
            } 

            this.area.geometry.verticesNeedUpdate = true;
            
            var context = this.textCanvas.getContext( '2d' );
            context.clearRect(0,0, 150, 150)
            context.fillText(THREE.Math.radToDeg(currentAngle).toFixed(2) + "°", 50, 50);

            this.textTexture.needsUpdate = true;
        }

        public setStart(start: THREE.Vector3) {
            this.start = this.worldToLocal(start);

            this.startLine.geometry.vertices = [];
            this.startLine.geometry.vertices.push(new THREE.Vector3(this.center.x, this.center.y, this.center.z));
            this.startLine.geometry.vertices.push(new THREE.Vector3(this.start.x, this.start.y, this.start.z));
            this.startLine.geometry.uvsNeedUpdate = true;
            this.startLine.geometry.verticesNeedUpdate = true;
            this.startLine.geometry.computeFaceNormals();
        }

        public update(current: THREE.Vector3, currentAngle: number) {
            this.updateArea(currentAngle);

            current = this.worldToLocal(current);

            this.current.set(current.x, current.y, current.z);

            this.currentLine.geometry.vertices = [];
            this.currentLine.geometry.vertices.push(this.center.clone());
            this.currentLine.geometry.vertices.push(this.current.clone());
            this.currentLine.geometry.uvsNeedUpdate = true;
            this.currentLine.geometry.verticesNeedUpdate = true;
            this.currentLine.geometry.computeFaceNormals();
        }
    }
}