// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne.Handler {
    export class TextureDragHandler {

        private data: PIXI.InteractionData;
        private dragging: boolean = false;
        private element: PIXI.DisplayObject;
        private lastPosition: PIXI.Point;
        private positionDelta: PIXI.Point;

        constructor(dragable: PIXI.DisplayObject) {
            dragable.interactive = true;
            dragable.mousedown = dragable.touchstart = (e) => {
                this.mouseDown(e);
            };
            dragable.mouseup = dragable.mouseupoutside = dragable.touchend = dragable.touchendoutside = (e) => this.mouseUp(e);
            dragable.mousemove = dragable.touchmove = (e) => this.mouseMove(e);
            this.element = dragable;
            this.positionDelta = new PIXI.Point();
        }

        private mouseUp(e: PIXI.InteractionData) {
            this.dragging = false;
            this.data = null;
            this.lastPosition = null;
        }

        private mouseDown(e: PIXI.InteractionData) {
            this.dragging = true;
            this.data = e;
            this.lastPosition = this.data.getLocalPosition(this.element.parent);
        }

        private mouseMove(e: PIXI.InteractionData) {
            if (this.dragging) {
                var pos = this.data.getLocalPosition(this.element.parent);

                this.positionDelta.set(pos.x - this.lastPosition.x, pos.y - this.lastPosition.y);
                this.lastPosition = pos;

                (<any>this.element).changeOffset(this.positionDelta); // don't do this...
            }
        }
    }
}