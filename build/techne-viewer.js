var Techne;
(function (Techne) {
    (function (EditMode) {
        EditMode[EditMode["Block"] = 0] = "Block";
        EditMode[EditMode["Model"] = 1] = "Model";
        EditMode[EditMode["View"] = 2] = "View";
    })(Techne.EditMode || (Techne.EditMode = {}));
    var EditMode = Techne.EditMode;
})(Techne || (Techne = {}));

var TechneBase = (function () {
    function TechneBase() {
    }
    TechneBase.prototype.animate = function (b) {
        var that = b;
        requestAnimationFrame(function () {
            that.animate(that);
        });
        this.render();
    };

    TechneBase.prototype.render = function () {
        this.renderer.render(this.scene, this.camera);
    };

    TechneBase.prototype.initWebGlRenderer = function (settings) {
        this.renderer = new THREE.WebGLRenderer({ antialias: true, preserveDrawingBuffer: true, alpha: true });

        this.container = document.createElement('div');
        this.container.setAttribute("id", "container");
        $("#Techne").append(this.container);
        this.scene = new THREE.Scene();

        this.initCamera(settings);
        this.initControls(settings);
        this.initTexture(settings);
        this.initScenery(settings);

        var cWidth = $("#container").width();
        var cHeight = $("#container").height();
        if (cHeight < 10)
            cHeight = cWidth / 16 * 10;

        this.renderer.setSize(cWidth, cHeight);

        this.renderer.domElement.setAttribute("id", "techne-canvas");
        this.container.appendChild(this.renderer.domElement);

        this.centerCamera();
    };
    TechneBase.prototype.centerCamera = function () {
    };

    TechneBase.prototype.init = function (settings) {
        settings = settings || {};

        settings.noRotate = settings.noRotate != undefined ? settings.noRotate : true;
        settings.noPan = settings.noPan != undefined ? settings.noPan : true;
        settings.noZoom = settings.noZoom != undefined ? settings.noZoom : true;
        settings.autoRotate = settings.autoRotate != undefined ? settings.autoRotate : true;
        settings.autoRotateSpeed = settings.autoRotateSpeed != undefined ? settings.autoRotateSpeed : 0.5;
        settings.showRoom = settings.showRoom != undefined ? settings.showRoom : true;

        if (settings.beforeInit) {
            settings.beforeInit();
        }

        var canvas = !!window.CanvasRenderingContext2D;
        var webgl = (function () {
            try  {
                if (window.WebGLRenderingContext && document.createElement('canvas').getContext('experimental-webgl')) {
                    return true;
                }
            } catch (e) {
                return false;
            }
        })();

        if (!webgl) {
            this.initCanvasRenderer(settings);
        } else {
            this.initWebGlRenderer(settings);
        }

        if (settings.afterInit) {
            settings.afterInit();
        }

        return webgl;
    };

    TechneBase.prototype.createGrid = function () {
        var geometry = new THREE.Geometry;
        geometry.vertices.push(new THREE.Vector3(-168, 0, 0));
        geometry.vertices.push(new THREE.Vector3(168, 0, 0));

        var nullElement = new THREE.Object3D();
        nullElement.name = "Grid";

        var material = new THREE.LineBasicMaterial({ color: 0x000000, opacity: 0.2 });
        for (var i = 0; i < 22; i++) {
            var line = new THREE.Line(geometry, material);
            line.position.y = 24;
            line.position.z = (i * 16) - 168;
            nullElement.add(line);
            line = new THREE.Line(geometry, material);
            line.position.x = (i * 16) - 168;
            line.position.y = 24;
            line.rotation.y = 90 * Math.PI / 180;
            nullElement.add(line);
        }

        this.scene.add(nullElement);
    };

    TechneBase.prototype.initCanvasRenderer = function (settings) {
    };

    TechneBase.prototype.initCamera = function (settings) {
        var cWidth = $("#container").width();
        var cHeight = $("#container").height();
        if (cHeight < 10)
            cHeight = cWidth / 16 * 10;

        this.camera = new THREE.CombinedCamera(cWidth, cHeight, 45, 1, 10000, -2000, 10000);
        this.camera.up = new THREE.Vector3(0, -1, 0);
        this.camera.position.x = 80;
        this.camera.position.y = -50;
        this.camera.position.z = -80;
        this.camera.rotation.order = "YZX";
    };

    TechneBase.prototype.initControls = function (settings) {
    };

    TechneBase.prototype.initTexture = function (settings) {
        var _this = this;
        var img = document.getElementById("texture");

        this.textureElement = new Image();

        this.modelTexture = new THREE.Texture(this.textureElement);
        this.modelTexture.minFilter = THREE.NearestFilter;
        this.modelTexture.magFilter = THREE.NearestFilter;

        this.modelMaterial = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, map: this.modelTexture, transparent: true });

        this.textureElement.onload = function () {
            _this.updateTexture();
        };

        if (img != null && img != undefined)
            this.textureElement.src = img.src;
    };

    TechneBase.prototype.updateTexture = function () {
        this.modelTexture.image = document.getElementById("texture");
        this.modelMaterial.map = this.modelTexture;
        this.modelTexture.needsUpdate = true;
        this.modelMaterial.needsUpdate = true;
    };
    TechneBase.prototype.initScenery = function (settings) {
        var block = new THREE.CubeGeometry(16, 16, 16);
        var blockTexture = THREE.ImageUtils.loadTexture("/Images/Textures/stone.png");
        blockTexture.minFilter = THREE.NearestFilter;
        blockTexture.magFilter = THREE.NearestFilter;
        var blockMaterial = new THREE.MeshBasicMaterial({ color: 0xffffff, map: blockTexture });
        var blockMesh = new THREE.Mesh(block, blockMaterial);
        blockMesh.position.y = 32;
        this.scene.add(blockMesh);

        if (settings.showGrid) {
            this.createGrid();
        }

        var ambientLight = new THREE.AmbientLight(0x606060);
        this.scene.add(ambientLight);

        var directionalLight = new THREE.DirectionalLight(0x666666);
        directionalLight.position.set(10, -25.75, 20.5).normalize();
        this.scene.add(directionalLight);

        directionalLight = new THREE.DirectionalLight(0xAAAAAA);
        directionalLight.position.set(-10, -25.75, 0).normalize();
        this.scene.add(directionalLight);
    };

    TechneBase.prototype.loadModel = function (modelId, model) {
        var _this = this;
        var importer = new Techne.File.Importer.TechneImporter(this);
        var result = importer.import(model);

        result.data.map(function (value, index, objects) {
            _this.scene.add(value);
        });
        TechneBase.textureSize.set(result.textureSize[0], result.textureSize[1]);
        this.updateTexture();
    };

    TechneBase.prototype.createNullElement = function (name, position, rotation) {
        return null;
    };
    TechneBase.prototype.createCube = function (name, size, position, rotation, textureOffset) {
        return null;
    };
    TechneBase.textureSize = new THREE.Vector2(64, 32);
    return TechneBase;
})();

(function () {
    var id_counter = 1;
    Object.defineProperty(Object.prototype, "__uniqueId", {
        writable: true
    });
    Object.defineProperty(Object.prototype, "uniqueId", {
        get: function () {
            if (this.__uniqueId == undefined) {
                this.__uniqueId = id_counter++;
            }
            return this.__uniqueId;
        }
    });
})();
var Techne;
(function (Techne) {
    (function (Helper) {
        var Rect = (function () {
            function Rect(left, top, width, height) {
                this.topLeft = [left, top];
                this.topRight = [left + width, top];
                this.bottomRight = [left + width, top + height];
                this.bottomLeft = [left, top + height];
            }
            Rect.prototype.toFace = function () {
                return [
                    new THREE.Vector2(this.topLeft[0], this.topLeft[1]),
                    new THREE.Vector2(this.topRight[0], this.topRight[1]),
                    new THREE.Vector2(this.bottomRight[0], this.bottomRight[1]),
                    new THREE.Vector2(this.bottomLeft[0], this.bottomLeft[1])
                ];
            };

            Rect.prototype.ToRelativeFace = function () {
                return [
                    new THREE.Vector2(this.topRight[0] / TechneBase.textureSize.x, 1 - this.topRight[1] / TechneBase.textureSize.y),
                    new THREE.Vector2(this.topLeft[0] / TechneBase.textureSize.x, 1 - this.topLeft[1] / TechneBase.textureSize.y),
                    new THREE.Vector2(this.bottomLeft[0] / TechneBase.textureSize.x, 1 - this.bottomLeft[1] / TechneBase.textureSize.y),
                    new THREE.Vector2(this.bottomRight[0] / TechneBase.textureSize.x, 1 - this.bottomRight[1] / TechneBase.textureSize.y)
                ];
            };
            return Rect;
        })();

        var TextureHelper = (function () {
            function TextureHelper(cube, textureOffset) {
                this.cube = cube;
                this.textureOffset = textureOffset;
                this.useOffset = true;
            }
            TextureHelper.prototype.Width = function (count) {
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
            };

            TextureHelper.prototype.Height = function (count) {
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
            };

            TextureHelper.prototype.mirror = function (points) {
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
            };

            TextureHelper.prototype.rotate = function (array, count) {
                if (count == 0) {
                    return array;
                }

                for (var i = 0; i < count; i++) {
                    array.push(array.shift());
                }
                return array;
            };

            TextureHelper.prototype.getRealLeft = function () {
                var points = this.rotate(new Rect(this.Width(0), this.Height(1), this.cube.scale.z, this.cube.scale.y).ToRelativeFace(), 3);
                return points;
            };

            TextureHelper.prototype.getRealRight = function () {
                var points = this.rotate(new Rect(this.Width(2), this.Height(1), this.cube.scale.z, this.cube.scale.y).ToRelativeFace(), 3);
                return points;
            };

            TextureHelper.prototype.getLeft = function () {
                return this.getRealLeft();
            };
            TextureHelper.prototype.getRight = function () {
                return this.getRealRight();
            };

            TextureHelper.prototype.getFront = function () {
                var points = this.rotate(new Rect(this.Width(1), this.Height(1), this.cube.scale.x, this.cube.scale.y).ToRelativeFace(), 3);
                return points;
            };
            TextureHelper.prototype.getBack = function () {
                var points = this.rotate(new Rect(this.Width(3), this.Height(1), this.cube.scale.x, this.cube.scale.y).ToRelativeFace(), 3);

                return points;
            };
            TextureHelper.prototype.getTop = function () {
                var points = this.rotate(new Rect(this.Width(1), this.Height(0), this.cube.scale.x, this.cube.scale.z).ToRelativeFace(), 1);

                return points;
            };
            TextureHelper.prototype.getBottom = function () {
                var points = this.rotate(new Rect(this.Width(2), this.Height(0), this.cube.scale.x, this.cube.scale.z).ToRelativeFace(), 1);

                return points;
            };
            return TextureHelper;
        })();
        Helper.TextureHelper = TextureHelper;
    })(Techne.Helper || (Techne.Helper = {}));
    var Helper = Techne.Helper;
})(Techne || (Techne = {}));
var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Techne;
(function (Techne) {
    (function (Objects) {
        var NullElement = (function (_super) {
            __extends(NullElement, _super);
            function NullElement(name, position, rotation) {
                _super.call(this);

                if (!position) {
                    position = [0, 0, 0];
                }
                if (!rotation) {
                    rotation = [0, 0, 0];
                }

                this.minecraftPosition = new THREE.Vector3(position[0], position[1], position[2]);
                this.position = this.minecraftPosition;

                this.rotation.set(rotation[0], rotation[1], rotation[2], "YZX");
                this.rotation.order = "YZX";
                this.rotation.reorder("YZX");
                this.updateRotation();
            }
            NullElement.prototype.toggleVisibility = function (visibility) {
                this.visible = visibility || !this.visible;
                for (var index in this.children) {
                    if (!this.children.hasOwnProperty(index)) {
                        continue;
                    }

                    var child = this.children[index];
                    child.toggleVisibility(this.visible);
                }
            };
            NullElement.prototype.updatePosition = function () {
            };
            NullElement.prototype.updateSize = function () {
                this.scale.x = 1;
                this.scale.y = 1;
                this.scale.z = 1;
            };

            NullElement.prototype.updateRotation = function () {
                if (TechneBase.projectType == 0 /* Block */) {
                    if (this.parent && !(this.parent instanceof THREE.Scene)) {
                        if (this.parent.isRotated()) {
                            this.rotation.x = 0;
                            this.rotation.y = 0;
                            this.rotation.z = 0;
                        }

                        if (this.hasRotatedChild()) {
                            this.rotation.x = 0;
                            this.rotation.y = 0;
                            this.rotation.z = 0;
                        }
                    }
                }
            };

            NullElement.prototype.hasRotatedChild = function () {
                for (var index in this.children) {
                    if (!this.children.hasOwnProperty(index)) {
                        continue;
                    }

                    var child = this.children[index];

                    if (child instanceof NullElement)
                        if (child.hasRotatedChild())
                            return true;
                    if (child.isRotated())
                        return true;
                }
            };

            NullElement.prototype.isRotated = function () {
                if (this.parent && !(this.parent instanceof THREE.Scene)) {
                    if (this.parent.isRotated()) {
                        return true;
                    }
                }

                if (!(this.rotation.x == 0 && this.rotation.y == 0 && this.rotation.z == 0)) {
                    return true;
                }

                return false;
            };

            NullElement.prototype.addChild = function (object) {
                if (object == this) {
                    console.warn('THREE.Object3D.add: An object can\'t be added as a child of itself.');
                    return;
                }

                this.add(object);
            };

            NullElement.prototype.removeChild = function (child) {
                var index = this.children.indexOf(child);

                if (index == -1)
                    return;

                this.remove(child);
            };

            NullElement.prototype.updateTexture = function () {
            };
            return NullElement;
        })(THREE.Object3D);
        Objects.NullElement = NullElement;
    })(Techne.Objects || (Techne.Objects = {}));
    var Objects = Techne.Objects;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    (function (Objects) {
        var Plane = (function (_super) {
            __extends(Plane, _super);
            function Plane(name, size, position, rotation, textureOffset, material, texture) {
                this.publicName(name || "new plane");
                this.name = this.publicName();
                this.minecraftPosition = new THREE.Vector3(position[0], position[1], position[2]);
                this.textureOffset = new THREE.Vector2(textureOffset[0], textureOffset[1]);
                rotation = new THREE.Vector3((rotation[0]), (rotation[1]), (rotation[2]));

                material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, map: texture, transparent: true });
                material.side = THREE.DoubleSide;
                var planeGeometry = new THREE.PlaneGeometry(1, 1);
                _super.call(this, planeGeometry, material);

                this.castShadow = this.receiveShadow = true;
                this.rotation.x = rotation.x;
                this.rotation.y = rotation.y;
                this.rotation.z = rotation.z;
                this.rotation.order = 'YZX';

                this.position = new THREE.Vector3((position[0] + size[0] / 2), (position[1] + size[1] / 2), (position[2] + size[2] / 2));

                var i = 0;
                var width = size[i++];

                if (width == 0)
                    width = size[i++];

                var height = size[i++];

                this.scale.x = width;
                this.scale.y = height;

                this.updateSize();
            }
            Plane.prototype.toggleVisibility = function (visibility) {
                this.visible = visibility || !this.visible;
            };
            Plane.prototype.updatePosition = function () {
                var size = this.scale;
                this.position = new THREE.Vector3((this.minecraftPosition.x + size.x / 2), (this.minecraftPosition.y + size.y / 2), (this.minecraftPosition.z + size.z / 2));
            };
            Plane.prototype.updateSize = function () {
                this.geometry.uvsNeedUpdate = true;
                this.updatePosition();
            };

            Plane.prototype.updateRotation = function () {
                if (TechneBase.projectType == 0 /* Block */ && this.parent && !(this.parent instanceof THREE.Scene)) {
                    if (this.parent.isRotated()) {
                        this.rotation.x = 0;
                        this.rotation.y = 0;
                        this.rotation.z = 0;
                    }
                }
            };

            Plane.prototype.updateTexture = function () {
            };

            Plane.prototype.isRotated = function () {
                return !(this.rotation.x == 0 && this.rotation.y == 0 && this.rotation.z == 0);
            };
            return Plane;
        })(THREE.Mesh);
        Objects.Plane = Plane;
    })(Techne.Objects || (Techne.Objects = {}));
    var Objects = Techne.Objects;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    (function (Objects) {
        var Cube = (function (_super) {
            __extends(Cube, _super);
            function Cube(name, size, position, rotation, textureOffset, material, texture) {
                this.minecraftPosition = new THREE.Vector3(position[0], position[1], position[2]);
                this.textureOffset = new THREE.Vector2(textureOffset[0], textureOffset[1]);

                material = new THREE.MeshLambertMaterial({ color: 0xFFFFFF, map: texture, transparent: true });
                material.side = THREE.DoubleSide;
                var cubeGeometry = new THREE.CubeGeometry(1, 1, 1);
                _super.call(this, cubeGeometry, material);

                this.castShadow = this.receiveShadow = true;
                this.rotation.set(rotation[0], rotation[1], rotation[2], "YZX");
                this.rotation.order = "YZX";
                this.rotation.reorder("YZX");
                this.updateRotation();

                this.position = new THREE.Vector3((position[0] + size[0] / 2), (position[1] + size[1] / 2), (position[2] + size[2] / 2));
                this.scale.set(size[0], size[1], size[2]);

                this.updateSize();
            }
            Cube.prototype.toggleVisibility = function (visibility) {
                this.visible = visibility || !this.visible;
            };

            Cube.prototype.updatePosition = function () {
            };

            Cube.prototype.updateSize = function () {
                var helper = new Techne.Helper.TextureHelper(this, this.textureOffset);

                this.geometry.faceVertexUvs[0] = [];
                this.geometry.faceVertexUvs[0].push(helper.getRight());
                this.geometry.faceVertexUvs[0].push(helper.getLeft());
                this.geometry.faceVertexUvs[0].push(helper.getBottom());
                this.geometry.faceVertexUvs[0].push(helper.getTop());
                this.geometry.faceVertexUvs[0].push(helper.getBack());
                this.geometry.faceVertexUvs[0].push(helper.getFront());

                this.geometry.uvsNeedUpdate = true;
                this.geometry.computeFaceNormals();

                if (this.scale.x == 0)
                    this.scale.x = 0.0001;
                if (this.scale.y == 0)
                    this.scale.y = 0.0001;
                if (this.scale.z == 0)
                    this.scale.z = 0.0001;

                this.updatePosition();
            };

            Cube.prototype.updateRotation = function () {
            };

            Cube.prototype.updateTexture = function () {
            };

            Cube.prototype.isRotated = function () {
            };
            return Cube;
        })(THREE.Mesh);
        Objects.Cube = Cube;
    })(Techne.Objects || (Techne.Objects = {}));
    var Objects = Techne.Objects;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    (function (File) {
        (function (Importer) {
            var TechneImporter = (function () {
                function TechneImporter(techne) {
                    this.techne = techne;
                    this.result = {
                        textureSize: [64, 32],
                        data: []
                    };
                }
                TechneImporter.prototype.import = function (json) {
                    if (json && json.Techne) {
                        for (var index in json.Techne.Models) {
                            if (!json.Techne.Models.hasOwnProperty(index)) {
                                continue;
                            }
                            var model = json.Techne.Models[index];

                            if (model.Model.TextureSize) {
                                this.result.textureSize = model.Model.TextureSize.split(",").map(function (x) {
                                    return parseInt(x);
                                });
                                TechneBase.textureSize.set(this.result.textureSize[0], this.result.textureSize[1]);
                            }

                            this.parseFolder(model.Model.Geometry);
                        }

                        return this.result;
                    }
                };

                TechneImporter.prototype.addElement = function (element, parent) {
                    if (parent) {
                        parent.addChild(element);
                    } else {
                        this.result.data.push(element);
                    }
                };

                TechneImporter.prototype.ParseShape = function (shape, parent) {
                    var size = shape.Size.split(",").map(function (x) {
                        return parseInt(x);
                    });
                    var position = shape.Position.split(",").map(function (x) {
                        return parseFloat(x);
                    });
                    var rotation = shape.Rotation.split(",").map(function (x) {
                        return parseFloat(x);
                    });
                    var textureOffset = shape.TextureOffset.split(",").map(function (x) {
                        return parseInt(x);
                    });
                    var name = shape["@name"];

                    if (shape.Offset) {
                        var offset = shape.Offset.split(",").map(function (x) {
                            return parseInt(x);
                        });

                        rotation = rotation.map(function (x) {
                            return x / 180 * Math.PI;
                        });

                        var nullElement = this.techne.createNullElement("null element", position, rotation);
                        nullElement.addChild(this.techne.createCube(name, size, offset, [0, 0, 0], textureOffset));

                        this.addElement(nullElement, parent);
                    } else {
                        var cube = this.techne.createCube(name, size, position, rotation, textureOffset);
                        this.addElement(cube, parent);
                    }
                };

                TechneImporter.prototype.parseFolder = function (folder, parent) {
                    if (folder.Shape) {
                        if (!(folder.Shape instanceof Array)) {
                            this.ParseShape(folder.Shape, parent);
                        } else {
                            for (var index = 0; index < folder.Shape.length; index++) {
                                this.ParseShape(folder.Shape[index], parent);
                            }
                        }
                    }
                    if (folder.Folder) {
                        for (var index = 0; index < folder.Folder.length; index++) {
                            var f = folder.Folder[index];

                            var nullElement = this.techne.createNullElement(f["@Name"]);
                            this.addElement(nullElement, parent);
                            this.parseFolder(f, nullElement);
                        }
                    }
                    if (folder.Null) {
                        for (var index = 0; index < folder.Null.length; index++) {
                            var f = folder.Null[index];

                            var position = f.Position.split(",").map(function (x) {
                                return parseFloat(x);
                            });
                            var rotation = f.Rotation.split(",").map(function (x) {
                                return parseFloat(x);
                            });
                            var name = f["@name"];

                            var nullElement = this.techne.createNullElement(f["@Name"], position, rotation);
                            this.addElement(nullElement, parent);

                            if (f.Children) {
                                this.parseFolder(f.Children, nullElement);
                            }
                        }
                    }

                    if (folder.Piece) {
                        for (var index = 0; index < folder.Piece.length; index++) {
                            var f = folder.Folder[index];

                            var nullElement = this.techne.createNullElement(f["@Name"]);
                            this.addElement(nullElement, parent);

                            if (f.Children) {
                                this.parseFolder(f.Children, nullElement);
                            }
                        }
                    }
                };
                return TechneImporter;
            })();
            Importer.TechneImporter = TechneImporter;
        })(File.Importer || (File.Importer = {}));
        var Importer = File.Importer;
    })(Techne.File || (Techne.File = {}));
    var File = Techne.File;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    var Viewer = (function (_super) {
        __extends(Viewer, _super);
        function Viewer() {
            _super.call(this);
            TechneBase.projectType = 2 /* View */;
        }
        Viewer.prototype.loadData = function (modelId) {
        };

        Viewer.prototype.centerCamera = function () {
        };

        Viewer.prototype.initControls = function (settings) {
            this.controls = new THREE.OrbitControls(this.camera, this.container);

            this.controls.noRotate = false;
            this.controls.noPan = false;
            this.controls.noZoom = false;
            this.controls.autoRotate = true;
            this.controls.autoRotateSpeed = 0.5;
        };

        Viewer.prototype.render = function () {
            this.controls.update();
            _super.prototype.render.call(this);
        };

        Viewer.prototype.createNullElement = function (name, position, rotation) {
            return new Techne.Objects.NullElement(name, position, rotation);
        };
        Viewer.prototype.createCube = function (name, size, position, rotation, textureOffset) {
            return new Techne.Objects.Cube(name, size, position, rotation, textureOffset, this.modelMaterial, this.modelTexture);
        };
        return Viewer;
    })(TechneBase);
    Techne.Viewer = Viewer;
})(Techne || (Techne = {}));
