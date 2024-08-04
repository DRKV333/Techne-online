// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne.Handler {
    export class FileDropHandler {

        constructor(private techne: Editor) {

        }

        /*
         * Registers event listeners
         */
        public init() {
            this.techne.container.addEventListener('dragenter', (e) => this.onDragEnter(e), false);
            this.techne.container.addEventListener('dragover', (e) => this.onDragOver(e), false);
            this.techne.container.addEventListener('dragleave', (e) => { this.onDragLeave(e) }, false);
            this.techne.container.addEventListener('drop', (e) => { this.onDrop(e) }, false);
        }

        /*
         * Callback for onDragEnter
         */
        public onDragEnter(e: DragEvent) {
            e.stopPropagation();
            e.preventDefault();
        }

        /*
         * Callback for onDragOver
         */
        public onDragOver(e: DragEvent) {
            e.stopPropagation();
            e.preventDefault();
        }
        
        /*
         * Callback for onDragLeave
         */
        public onDragLeave(e: DragEvent) {
            e.stopPropagation();
            e.preventDefault();
        }

        /*
         * Callback for onDrop
         * Goes through all the dropped files and uses the first image file as texture
         * Note: I should restrict that to png only
         */
        public onDrop(e: DragEvent) {
            e.stopPropagation();
            e.preventDefault();

            var readFileSize = 0;
            var files = e.dataTransfer.files;

            // Loop through list of files user dropped.
            for (var i = 0; i < files.length; i++) {
                var file = files[i];
                readFileSize += file.size;

                // Only process image files.
                var imageType = /image.*/;
                if (!file.type.match(imageType)) {
                    continue;
                }

                var reader = new FileReader();

                reader.onerror = (e) => {
                    // todo: implement better error handling
                    alert('Error code: ' + (<any>e.target).error.code);
                }

                // Create a closure to capture the file information.
                reader.onload = ((aFile) => {
                    var file = aFile;
                    return (e) => {
                        $("#texture").attr("src", e.target.result).attr("title", encodeURI(file.name));
                        this.techne.updateTexture();
                    };
                })(file);

                reader.readAsDataURL(file);
            };
            return false;
        }
    }
}