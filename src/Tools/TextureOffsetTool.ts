module Techne.Tools {
    export class TextureOffsetTool extends ToolBase {
        private sprite: THREE.Sprite;

        constructor(controller: Controller) {
            super(controller);
            this.name = "texture";
        }

    }
}