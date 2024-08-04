// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne
{
    export class TextureMapper {
        private techne: Editor;
        private stage: PIXI.Stage;
        private renderer: PIXI.IPixiRenderer;
        private texture: PIXI.Texture;
        private textureSprite: PIXI.Sprite;
        private container: PIXI.DisplayObjectContainer;
        private overlay: TextureOverlay;

        constructor(techne: Editor) {
            this.techne = techne;
        }

        public init() {
            this.initRenderer();
            this.overlay = new TextureOverlay(this.techne);
            this.container.addChild(this.overlay);
            this.update();

            amplify.subscribe("PropertyChanged", this.overlay, function (data) {
                if (data.propertyChain[0] == "textureOffset" || data.propertyChain[0] == "scale") {
                    this.update();
                }
            });
        }

        public initTexture() {
            if (this.textureSprite && this.container.children.indexOf(this.textureSprite) >= 0) {
                this.container.removeChild(this.textureSprite);
            }
            this.texture = PIXI.Texture.fromImage(this.techne.textureElement.src, false, PIXI.scaleModes.NEAREST);
            this.textureSprite = new PIXI.Sprite(this.texture);
            this.container.addChildAt(this.textureSprite, 0);
        }

        private initRenderer() {
            // create an new instance of a pixi stage
            this.stage = new PIXI.Stage(0xFFFFFF);

            var textureElementData = {
                Width: $("#texture").width(),
                Height: $("#texture").height()
            };

            $("#texture").hide();

            // create a renderer instance.
            this.renderer = PIXI.autoDetectRenderer(textureElementData.Width, textureElementData.Height);
            this.container = new PIXI.DisplayObjectContainer();
            this.stage.addChild(this.container);

            // add the renderer view element to the DOM
            $(this.renderer.view).insertAfter("#texture");
        }

        public animate() {
            requestAnimationFrame(this.animate);
            this.render();
        }

        public render() {
            // render the stage   
            this.renderer.render(this.stage);
        }

        public update() {
            $("#texture").show();
            var textureElementData = {
                Width: $("#texture").width(),
                Height: $("#texture").height()
            };
            $("#texture").hide();
            var scale = textureElementData.Width / TechneBase.textureSize.x;

            this.container.scale.x = scale;
            this.container.scale.y = scale;
        }

        public setSelected(element: Objects.IEditableObject) {

        }
    }

    enum CubeSide {
        Right,
        Left,
        Bottom,
        Top,
        Back,
        Front
    }

    class TextureOverlay extends PIXI.DisplayObjectContainer {
        private faceVertexUvs: THREE.Vector2[][][];
        private offset: THREE.Vector2;
        private current: Objects.IVisibleEditableObject;
        private overlays: PIXI.Graphics[];
        private dragHandler: Handler.TextureDragHandler;

        constructor(private techne: Editor) {
            super();

            techne.current.subscribe((current) => this.changeElement(<Objects.IVisibleEditableObject>current));
            
            this.overlays = [];
            for (var i = 0; i < 6; i++) {
                this.overlays.push(new PIXI.Graphics);
                this.addChild(this.overlays[i]);
            }

            this.dragHandler = new Handler.TextureDragHandler(this);
            this.offset = new THREE.Vector2(0, 0);
        }

        public update() {
            if (!this.current) {
                this.overlays.map((x) => x.clear());
                return;
            }

            var faceVertexUvs = this.faceVertexUvs[0];
            var width = TechneBase.textureSize.x;
            var height = TechneBase.textureSize.y;
            this.position.set(this.current.textureOffset.x, this.current.textureOffset.y);

            var hitarea = new PIXI.Rectangle(0, 0, 0, 0);

            for (var i = 0; i < 6; i++) {
                this.overlays[i].clear();

                this.overlays[i].beginFill(0xFF0000, 0.5);
                this.overlays[i].lineStyle(0, 0xFF0000, 1);

                var rect = this.getAbsoluteCoordinates(i, 0).concat(this.getAbsoluteSize(i, 0, 2));
                rect[0] -= this.position.x;
                rect[1] -= this.position.y;

                this.overlays[i].drawRect.apply(this.overlays[i], rect);

             
                if (rect[2] > hitarea.width) {
                    hitarea.width = rect[2];
                }
                if (rect[3] > hitarea.height) {
                    hitarea.height = rect[3];
                }

                this.overlays[i].endFill();
            }

            hitarea.width = hitarea.width * 4;
            hitarea.height = hitarea.height * 2;

            this.hitArea = hitarea;
        }

        public changeOffset(delta: PIXI.Point) {
            //TODO: round position and offset!
            this.position.x += delta.x;
            this.position.y += delta.y;
            this.current.textureOffset.set(this.position.x, this.position.y);
            this.current.updateSize();
        }

        private getAbsoluteSize(i: number, start: number, end: number): number[] {
            var from = this.getAbsoluteCoordinates(i, start);
            var to = this.getAbsoluteCoordinates(i, end);

            return [
                to[0] - from[0],
                to[1] - from[1]
            ];

        }
        private getAbsoluteCoordinates(i: number, i2: number): number[]{
            var tmp = i2 >= 2 ? 1 : 0;
            i2 = i2 >= 2 ? i2 - 1 : i2;

            var vertex = this.faceVertexUvs[0][i * 2 + tmp][i2];
            return [
                vertex.x * TechneBase.textureSize.x,
                (1 - vertex.y) * TechneBase.textureSize.y
                ];
        }

        public changeElement(current: Objects.IVisibleEditableObject) {
            if (!(current instanceof Objects.EditableCollectionBase)) {
                this.current = current;
                this.faceVertexUvs = current.geometry.faceVertexUvs;
            } else {
                this.current = undefined;
            }
            this.update();
        }
    }
}