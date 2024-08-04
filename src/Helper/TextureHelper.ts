// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne.Helper {
    class Rect {
        private topLeft: number[];
        private topRight: number[];
        private bottomRight: number[];
        private bottomLeft: number[];


        constructor(left: number, top: number, width: number, height: number) {
            this.topLeft = [left, top]
            this.topRight = [left + width, top]
            this.bottomRight = [left + width, top + height]
            this.bottomLeft = [left, top + height]
            }

        public toFace() {
            return [
                new THREE.Vector2(this.topLeft[0], this.topLeft[1]),
                new THREE.Vector2(this.topRight[0], this.topRight[1]),
                new THREE.Vector2(this.bottomRight[0], this.bottomRight[1]),
                new THREE.Vector2(this.bottomLeft[0], this.bottomLeft[1])
            ]
        }

        public ToRelativeFace() {
            return [
                new THREE.Vector2(this.topRight[0] / TechneBase.textureSize.x, 1 - this.topRight[1] / TechneBase.textureSize.y),
                new THREE.Vector2(this.topLeft[0] / TechneBase.textureSize.x, 1 - this.topLeft[1] / TechneBase.textureSize.y),
                new THREE.Vector2(this.bottomLeft[0] / TechneBase.textureSize.x, 1 - this.bottomLeft[1] / TechneBase.textureSize.y),
                new THREE.Vector2(this.bottomRight[0] / TechneBase.textureSize.x, 1 - this.bottomRight[1] / TechneBase.textureSize.y)
            ];
        }
    }

    export class TextureHelper {
        private cube: Techne.Objects.Cube;
        private textureOffset: THREE.Vector2;
        private useOffset: boolean;

        constructor(cube: Techne.Objects.Cube, textureOffset: THREE.Vector2) {
            this.cube = cube
            this.textureOffset = textureOffset
            this.useOffset = true
        }

        private Width(count: number) {
            var width = this.cube.scale.x;
            var height = this.cube.scale.z;
            var length = this.cube.scale.y;

            var result = 0.0;

            if (this.useOffset) {
                result = this.textureOffset.x;
            }

            result += count > 0 ? height : 0;
            result += count > 1 ? width : 0;
            result += count > 2 ? height : 0;
            result += count > 3 ? width : 0;
            return result;
        }

        private Height(count: number) {
            var width = this.cube.scale.x;
            var height = this.cube.scale.z;
            var length = this.cube.scale.y;
            var result = 0.0;

            if (this.useOffset) {
                result = this.textureOffset.y;
            }

            result += count > 0 ? height : 0;
            result += count > 1 ? length : 0;

            return result;
        }

        /* totally unneeded */
        private mirror<T>(points: T[]): T[] {
            var i = 1;

            while (i < points.length) {
                var next = i + 1;
                if (next >= points.length)
                    next = 0;

                var tmp = points[i];
                points[i] = points[next];

                points[next] = tmp;

                i = i + 2;
            }
            return points;
        }

        private rotate<T>(array: T[], count: number): T[] {
            if (count == 0) {
                return array;
            }

            for (var i = 0; i < count; i++) {
                array.push(array.shift())
            }
            return array;
        }

        private getRealLeft(): THREE.Vector2[] {
            var points = this.rotate(new Rect(this.Width(0), this.Height(1), this.cube.scale.z, this.cube.scale.y).ToRelativeFace(), 3);
            return points;
        }

        private getRealRight(): THREE.Vector2[] {
            var points = this.rotate(new Rect(this.Width(2), this.Height(1), this.cube.scale.z, this.cube.scale.y).ToRelativeFace(), 3)
            return points;
        }

        public getLeft(): THREE.Vector2[] {
            return this.getRealLeft();
        }
        public getRight() {
            return this.getRealRight();
        }

        public getFront(): THREE.Vector2[] {
            var points = this.rotate(new Rect(this.Width(1), this.Height(1), this.cube.scale.x, this.cube.scale.y).ToRelativeFace(), 3)
            return points;
        }
        public getBack(): THREE.Vector2[] {
            var points = this.rotate(new Rect(this.Width(3), this.Height(1), this.cube.scale.x, this.cube.scale.y).ToRelativeFace(), 3)

        return points;
        }
        public getTop(): THREE.Vector2[] {
            var points = this.rotate(new Rect(this.Width(1), this.Height(0), this.cube.scale.x, this.cube.scale.z).ToRelativeFace(), 1)

        return points;
        }
        public getBottom(): THREE.Vector2[] {
            var points = this.rotate(new Rect(this.Width(2), this.Height(0), this.cube.scale.x, this.cube.scale.z).ToRelativeFace(), 1)

        return points;
        }
    }
}