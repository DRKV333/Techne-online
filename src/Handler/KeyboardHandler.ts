module Techne.Handler {
    export class KeyboardHandler {
        constructor(private techne: Editor) {
        }

        /*
         * Registers event listeners
         */
        public init() {
            window.addEventListener('keyup', (e) => this.onKeyUp(e), false);
        }

        private onKeyUp(event: KeyboardEvent) {
            // z
            if (event.ctrlKey && event.keyCode == 90) {
                this.techne.undo();
            }

            // y
            if (event.ctrlKey && event.keyCode == 89) {
                this.techne.redo();
            }

            // v
            if (event.ctrlKey && event.keyCode == 86) {
                this.techne.paste();
            }

            // c
            if (event.ctrlKey && event.keyCode == 67) {
                this.techne.copy();
            }

            //only execute if no input is focused
            if ($("input:focus").length == 0) {
                // del
                if (event.keyCode == 46) {
                    this.techne.removeChild(this.techne.current());
                }
            }
        }
    }
}