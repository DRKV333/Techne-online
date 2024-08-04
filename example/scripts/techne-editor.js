var __extends = this.__extends || function (d, b) {
    for (var p in b) if (b.hasOwnProperty(p)) d[p] = b[p];
    function __() { this.constructor = d; }
    __.prototype = b.prototype;
    d.prototype = new __();
};
var Techne;
(function (Techne) {
    (function (Tools) {
        var Axis = (function () {
            function Axis() {
            }
            Axis.X = {
                vector: new THREE.Vector3(1, 0, 0),
                color: 0xFF0000,
                normal: new THREE.Vector3(0, 1, 0),
                rotation: new THREE.Vector3(0, -1, 0)
            };
            Axis.Y = {
                vector: new THREE.Vector3(0, -1, 0),
                color: 0x00FF00,
                normal: new THREE.Vector3(0, 0, -1),
                rotation: new THREE.Vector3(0, 1, 1)
            };
            Axis.Z = {
                vector: new THREE.Vector3(0, 0, 1),
                color: 0x0000FF,
                normal: new THREE.Vector3(-1, 0, 0),
                rotation: new THREE.Vector3(0, 0, 0)
            };
            return Axis;
        })();
        Tools.Axis = Axis;

        var ToolBase = (function (_super) {
            __extends(ToolBase, _super);
            function ToolBase() {
                _super.call(this);
                this.isActive = false;
                this.isHover = false;
                this.renderDepth = 10;
            }
            ToolBase.prototype.objectSelected = function (object) {
                this.selectedObject = object;

                this.attachControls();
            };

            ToolBase.prototype.objectDeselected = function () {
                this.removeControls();

                this.selectedObject = null;
            };

            ToolBase.prototype.mouseEnter = function (intersection) {
                this.isHover = true;
                this.startHover(intersection);
            };

            ToolBase.prototype.mouseLeave = function () {
                this.isHover = false;
                this.endHover();
            };

            ToolBase.prototype.mouseDown = function (event) {
                if (!this.isHover) {
                    return;
                }

                this.isActive = true;
                this.lastPosition = null;
                this.start();
            };

            ToolBase.prototype.mouseUp = function (event) {
                this.isActive = false;
                this.lastPosition = null;
                this.end();
            };

            ToolBase.prototype.mouseMove = function (intersection) {
                if (!this.isActive) {
                    return;
                }

                if (!this.lastPosition) {
                    this.lastPosition = intersection.point.clone();
                }

                this.positionDelta = intersection.point.clone().sub(this.lastPosition);
                if (this.update()) {
                    this.lastPosition = intersection.point;
                }
            };

            ToolBase.prototype.intersect = function (raycaster) {
                return null;
            };

            ToolBase.prototype.attachControls = function () {
            };

            ToolBase.prototype.removeControls = function () {
            };

            ToolBase.prototype.start = function () {
            };

            ToolBase.prototype.end = function () {
            };

            ToolBase.prototype.update = function () {
            };

            ToolBase.prototype.startHover = function (intersection) {
            };

            ToolBase.prototype.endHover = function () {
            };
            return ToolBase;
        })(THREE.Object3D);
        Tools.ToolBase = ToolBase;
    })(Techne.Tools || (Techne.Tools = {}));
    var Tools = Techne.Tools;
})(Techne || (Techne = {}));
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

        var canvas = !!(window).CanvasRenderingContext2D;
        var webgl = (function () {
            try  {
                if ((window).WebGLRenderingContext && document.createElement('canvas').getContext('experimental-webgl')) {
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
        var geometry = new THREE.Geometry();
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

        var camera = new THREE.PerspectiveCamera(45, cWidth / cHeight, 0.1, 1000);
        camera.up = new THREE.Vector3(0, -1, 0);
        camera.position.x = 80;
        camera.position.y = -50;
        camera.position.z = -80;
        camera.rotation.order = "YZX";
        camera.updateProjectionMatrix();

        this.camera = camera;
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
        var blockTexture = THREE.ImageUtils.loadTexture("/images/textures/stone.png");
        blockTexture.minFilter = THREE.NearestFilter;
        blockTexture.magFilter = THREE.NearestFilter;
        var blockMaterial = new THREE.MeshBasicMaterial({ color: 0xff00ff, map: blockTexture });
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
    (function (Extender) {
        (function (Filter) {
            Filter[Filter["Integer"] = 0] = "Integer";
            Filter[Filter["Float"] = 1] = "Float";
            Filter[Filter["Alpha"] = 2] = "Alpha";
            Filter[Filter["AlphaNumerical"] = 3] = "AlphaNumerical";
            Filter[Filter["Positive"] = 4] = "Positive";
            Filter[Filter["Negative"] = 5] = "Negative";
        })(Extender.Filter || (Extender.Filter = {}));
        var Filter = Extender.Filter;
    })(Techne.Extender || (Techne.Extender = {}));
    var Extender = Techne.Extender;
})(Techne || (Techne = {}));

(ko.extenders).min = function (target, option) {
    var t = target;
    var min = option;
    target.subscribe(function (newValue) {
        if (newValue < min) {
            t(min);
        }
    });
    return target;
};

(ko.extenders).max = function (target, option) {
    var t = target;
    var min = option;
    target.subscribe(function (newValue) {
        if (newValue > min) {
            t(min);
        }
    });
    return target;
};

(ko.extenders).filter = function (target, option) {
    var t = target;
    var filter = option;
    target.subscribe(function (newValue) {
        if (newValue == null || newValue == undefined) {
            return;
        }

        if (filter == Techne.Extender.Filter.Alpha)
            newValue = newValue.replace(/[^\d]/, '');
        if (filter == Techne.Extender.Filter.AlphaNumerical)
            newValue = newValue.replace(/\s/g, '');
        if (filter == Techne.Extender.Filter.Positive)
            newValue = newValue.replace(/[^\d]/, '');
        if (filter == Techne.Extender.Filter.Negative)
            newValue = newValue.replace(/[^\d]/, '');
    });
    return target;
};

(ko.extenders).update = function (target, options) {
    var propertyChain = options.propertyChain;
    var callback = options.callback;
    var map = options.map;
    var t = target;

    target.subscribe(function (newValue) {
        t = Techne.Editor.Instance.current();

        if (t == undefined || t == null) {
            return;
        }

        if (propertyChain.length > 1) {
            for (var i = 0; i <= propertyChain.length - 2; i++) {
                t = t[propertyChain[i]];
            }
        }

        var value = newValue;
        if (map) {
            value = map(newValue);
        }

        var oldValue = t[propertyChain[propertyChain.length - 1]];

        t[propertyChain[propertyChain.length - 1]] = value;

        if (callback) {
            callback(Techne.Editor.Instance.current());
        }

        amplify.publish("PropertyChanged", { propertyChain: propertyChain, element: Techne.Editor.Instance.current(), old: oldValue, new: value });
    });
    return target;
};
var Techne;
(function (Techne) {
    (function (Handler) {
        var MouseHandler = (function () {
            function MouseHandler(techne) {
                this.techne = techne;
                this.hasMoved = false;
                this.mouse = { x: 0, y: 0 };
                this.projector = new THREE.Projector();
            }
            MouseHandler.prototype.init = function () {
                var _this = this;
                this.techne.container.addEventListener('mouseup', function (e) {
                    return _this.onDocumentMouseUp(e);
                }, false);
                this.techne.container.addEventListener('mousedown', function (e) {
                    return _this.onDocumentMouseDown(e);
                }, false);
                this.techne.container.addEventListener('mousemove', function (e) {
                    _this.onDocumentMouseMove(e);
                }, false);

                var doubleClickHandler = this.makeDoubleRightClickHandler(this.onDocumentDoubleClick);
                $(this.techne.container).on("contextmenu", function (e) {
                    return doubleClickHandler(e);
                });
                (this.techne.controls).addEventListener('change', function (e) {
                    _this.hasMoved = true;
                });

                this.width = $("#techne-canvas").width();
                this.height = $("#techne-canvas").height();
            };

            MouseHandler.prototype.onDocumentDoubleClick = function (event) {
                if (event.button == 2 && event.target == this.techne.renderer.domElement) {
                    var intersects = this.intersect(event.offsetX, event.offsetY);
                }

                if (intersects.length > 0) {
                    this.techne.controls.target = intersects[0].point;
                }
            };

            MouseHandler.prototype.onDocumentMouseDown = function (event) {
                if (this.techne.controller.selectedTool && this.techne.controller.selectedTool.isHover) {
                    this.techne.controller.selectedTool.mouseDown(event);
                    event.preventDefault();
                }
            };

            MouseHandler.prototype.onDocumentMouseMove = function (event) {
                this.mouse.x = 2 * (event.clientX / this.width) - 1;
                this.mouse.y = 1 - 2 * (event.clientY / this.height);

                if (this.techne.controller.selectedTool && this.techne.controller.selectedTool.isActive) {
                    var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 2);
                    var raycaster = this.projector.pickingRay(vector.clone(), this.techne.camera);

                    var intersection = this.techne.controller.selectedTool.intersect(raycaster);
                    this.techne.controller.selectedTool.mouseMove(intersection);
                }
            };

            MouseHandler.prototype.onDocumentMouseUp = function (event) {
                if (event.button == 0 && this.hasMoved != true && event.target == this.techne.renderer.domElement) {
                    if (this.techne.controller.selectedTool && (this.techne.controller.selectedTool.isActive || this.techne.controller.selectedTool.isHover)) {
                        this.techne.controller.selectedTool.mouseUp(event);
                    } else {
                        var intersects = this.intersect(event.offsetX, event.offsetY);

                        if (intersects.length > 0) {
                            this.techne.setSelected((intersects[0].object));
                        } else {
                            this.techne.setSelected();
                        }
                    }
                }

                this.hasMoved = false;
            };

            MouseHandler.prototype.makeDoubleRightClickHandler = function (handler) {
                var _this = this;
                var timeout = 0;
                var clicked = false;

                return function (e) {
                    if (clicked) {
                        clearTimeout(timeout);
                        clicked = false;
                        return handler.apply(_this, arguments);
                    } else {
                        clicked = true;
                        timeout = setTimeout(function () {
                            clicked = false;
                        }, 300);
                    }
                };
            };

            MouseHandler.prototype.intersect = function (mouseX, mouseY) {
                var vector = new THREE.Vector3((mouseX / this.width) * 2 - 1, -(mouseY / this.height) * 2 + 1, 0.5);
                var raycaster = this.projector.pickingRay(vector.clone(), this.techne.camera);
                var intersects = raycaster.intersectObjects(this.techne.objects(), true);
                return intersects;
            };

            MouseHandler.prototype.update = function () {
                if ((!this.lastIntersected || !this.techne.controller.selectedTool.isActive) && !this.hasMoved) {
                    var vector = new THREE.Vector3(this.mouse.x, this.mouse.y, 0.5);
                    var raycaster = this.projector.pickingRay(vector.clone(), this.techne.camera);

                    var intersects = raycaster.intersectObjects(this.techne.controller.getTools(), true);

                    if (intersects.length) {
                        if (this.lastIntersected != intersects[0].object.parent) {
                            if (this.lastIntersected) {
                                this.techne.controller.selectedTool.mouseLeave();
                            }

                            this.lastIntersected = intersects[0].object.parent;

                            this.techne.controller.selectedTool.mouseEnter(intersects[0]);
                        }
                    } else if (this.lastIntersected) {
                        this.techne.controller.selectedTool.mouseLeave();
                        this.lastIntersected = null;
                    }
                }

                if (this.techne.controller.selectedTool && (this.techne.controller.selectedTool.isActive || this.techne.controller.selectedTool.isHover)) {
                    this.techne.controls.enabled = false;
                } else {
                    this.techne.controls.enabled = true;
                }
            };
            return MouseHandler;
        })();
        Handler.MouseHandler = MouseHandler;
    })(Techne.Handler || (Techne.Handler = {}));
    var Handler = Techne.Handler;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    (function (Handler) {
        var TextureDragHandler = (function () {
            function TextureDragHandler(dragable) {
                var _this = this;
                this.dragging = false;
                dragable.interactive = true;
                dragable.mousedown = dragable.touchstart = function (e) {
                    _this.mouseDown(e);
                };
                dragable.mouseup = dragable.mouseupoutside = dragable.touchend = dragable.touchendoutside = function (e) {
                    return _this.mouseUp(e);
                };
                dragable.mousemove = dragable.touchmove = function (e) {
                    return _this.mouseMove(e);
                };
                this.element = dragable;
                this.positionDelta = new PIXI.Point();
            }
            TextureDragHandler.prototype.mouseUp = function (e) {
                this.dragging = false;
                this.data = null;
                this.lastPosition = null;
            };

            TextureDragHandler.prototype.mouseDown = function (e) {
                this.dragging = true;
                this.data = e;
                this.lastPosition = this.data.getLocalPosition(this.element.parent);
            };

            TextureDragHandler.prototype.mouseMove = function (e) {
                if (this.dragging) {
                    var pos = this.data.getLocalPosition(this.element.parent);

                    this.positionDelta.set(pos.x - this.lastPosition.x, pos.y - this.lastPosition.y);
                    this.lastPosition = pos;

                    (this.element).changeOffset(this.positionDelta);
                }
            };
            return TextureDragHandler;
        })();
        Handler.TextureDragHandler = TextureDragHandler;
    })(Techne.Handler || (Techne.Handler = {}));
    var Handler = Techne.Handler;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    (function (Handler) {
        var FileDropHandler = (function () {
            function FileDropHandler(techne) {
                this.techne = techne;
            }
            FileDropHandler.prototype.onDragEnter = function (e) {
                e.stopPropagation();
                e.preventDefault();
            };

            FileDropHandler.prototype.onDragOver = function (e) {
                e.stopPropagation();
                e.preventDefault();
            };

            FileDropHandler.prototype.onDragLeave = function (e) {
                e.stopPropagation();
                e.preventDefault();
            };

            FileDropHandler.prototype.onDrop = function (e) {
                var _this = this;
                e.stopPropagation();
                e.preventDefault();

                var readFileSize = 0;
                var files = e.dataTransfer.files;

                for (var i = 0; i < files.length; i++) {
                    var file = files[i];
                    readFileSize += file.size;

                    var imageType = /image.*/;
                    if (!file.type.match(imageType)) {
                        continue;
                    }

                    var reader = new FileReader();

                    reader.onerror = function (e) {
                        alert('Error code: ' + (e.target).error.code);
                    };

                    reader.onload = (function (aFile) {
                        var file = aFile;
                        return function (e) {
                            $("#texture").attr("src", e.target.result).attr("title", encodeURI(file.name));
                            _this.techne.updateTexture();
                        };
                    })(file);

                    reader.readAsDataURL(file);
                }
                ;
                return false;
            };
            return FileDropHandler;
        })();
        Handler.FileDropHandler = FileDropHandler;
    })(Techne.Handler || (Techne.Handler = {}));
    var Handler = Techne.Handler;
})(Techne || (Techne = {}));
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
var Techne;
(function (Techne) {
    (function (Helper) {
        var ArrowHelper = (function (_super) {
            __extends(ArrowHelper, _super);
            function ArrowHelper(origin, axis, hex) {
                _super.call(this);
                this.axis = axis;
                this.hex = hex;

                if (!hex) {
                    this.hex = axis.color;
                }

                this.position = origin;

                this.material = new THREE.MeshBasicMaterial({ color: this.hex });

                var cylinderGeometry = new THREE.CylinderGeometry(0.1, 0.1, 1);
                cylinderGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, 0.5, 0));
                this.cylinder = new THREE.Mesh(cylinderGeometry, this.material);
                this.add(this.cylinder);

                var coneGeometry = new THREE.CylinderGeometry(0, 0.5, 1, 25, 1);
                coneGeometry.applyMatrix(new THREE.Matrix4().makeTranslation(0, -0.5, 0));

                this.cone = new THREE.Mesh(coneGeometry, this.material);
                this.cone.matrixAutoUpdate = false;
                this.add(this.cone);
                this.setDirection(axis.vector);
                this.setLength(8, 2, 2);
            }
            ArrowHelper.prototype.setDirection = function (dir) {
                var axis = new THREE.Vector3();
                var radians;

                if (dir.y > 0.99999) {
                    this.quaternion.set(0, 0, 0, 1);
                } else if (dir.y < -0.99999) {
                    this.quaternion.set(1, 0, 0, 0);
                } else {
                    axis.set(dir.z, 0, -dir.x).normalize();

                    radians = Math.acos(dir.y);

                    this.quaternion.setFromAxisAngle(axis, radians);
                }
            };

            ArrowHelper.prototype.setLength = function (length, headLength, headWidth) {
                if (headLength === undefined)
                    headLength = 0.2 * length;
                if (headWidth === undefined)
                    headWidth = 0.2 * headLength;

                this.cylinder.scale.set(1, length, 1);
                this.cylinder.updateMatrix();

                this.cone.scale.set(headWidth, headLength, headWidth);
                this.cone.position.y = length;
                this.cone.updateMatrix();
            };

            ArrowHelper.prototype.setColor = function (hex) {
                this.material.color.setHex(hex);
            };

            ArrowHelper.prototype.mouseDown = function () {
                this.material.color.offsetHSL(0, 0, 0.3);
            };
            ArrowHelper.prototype.mouseUp = function () {
                this.setColor(this.hex);
            };
            ArrowHelper.prototype.startHover = function () {
                this.material.color.offsetHSL(0, 0, 0.3);
            };
            ArrowHelper.prototype.endHover = function () {
                this.setColor(this.hex);
            };
            return ArrowHelper;
        })(THREE.Object3D);
        Helper.ArrowHelper = ArrowHelper;
    })(Techne.Helper || (Techne.Helper = {}));
    var Helper = Techne.Helper;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    (function (Helper) {
        var CircularRibbtonHelper = (function (_super) {
            __extends(CircularRibbtonHelper, _super);
            function CircularRibbtonHelper(origin, axis, hex) {
                _super.call(this);
                this.axis = axis;
                this.hex = hex;

                if (!hex) {
                    this.hex = axis.color;
                }

                this.material = new THREE.MeshBasicMaterial({ color: this.hex });
                var geometry = new THREE.SphereGeometry(8, 32, 32, 0, Math.PI * 2, Math.PI / 2 - Math.PI / 48, Math.PI / 24);

                this.ribbon = new THREE.Mesh(geometry, this.material);

                this.material.opacity = 0.5;

                this.setDirection(axis.rotation.clone());
                this.add(this.ribbon);
            }
            CircularRibbtonHelper.prototype.setDirection = function (dir) {
                if (this.axis == Techne.Tools.Axis.X) {
                    dir.set(1, 0, 1);
                } else {
                    dir.x += 1;
                }

                dir = dir.multiplyScalar(Math.PI / 2);
                this.quaternion.setFromEuler(new THREE.Euler(dir.x, dir.y, dir.z, "XYZ"), true);
            };

            CircularRibbtonHelper.prototype.setColor = function (hex) {
                this.material.color.setHex(hex);
            };

            CircularRibbtonHelper.prototype.mouseDown = function () {
                this.material.color.offsetHSL(0, 0, 0.3);
            };
            CircularRibbtonHelper.prototype.mouseUp = function () {
                this.setColor(this.hex);
            };
            CircularRibbtonHelper.prototype.startHover = function () {
                this.material.opacity = 1;
            };

            CircularRibbtonHelper.prototype.endHover = function () {
                this.material.opacity = 0.5;
            };
            return CircularRibbtonHelper;
        })(THREE.Object3D);
        Helper.CircularRibbtonHelper = CircularRibbtonHelper;
    })(Techne.Helper || (Techne.Helper = {}));
    var Helper = Techne.Helper;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    (function (Objects) {
        var CollectionBase = (function (_super) {
            __extends(CollectionBase, _super);
            function CollectionBase(name, position, rotation) {
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
            CollectionBase.prototype.toggleVisibility = function (visibility) {
                this.visible = visibility || !this.visible;
                for (var index in this.children) {
                    if (!this.children.hasOwnProperty(index)) {
                        continue;
                    }

                    var child = this.children[index];
                    child.toggleVisibility(this.visible);
                }
            };
            CollectionBase.prototype.updatePosition = function () {
            };
            CollectionBase.prototype.updateSize = function () {
            };
            CollectionBase.prototype.updateRotation = function () {
            };
            CollectionBase.prototype.updateTexture = function () {
            };

            CollectionBase.prototype.hasRotatedChild = function () {
                for (var index in this.children) {
                    if (!this.children.hasOwnProperty(index)) {
                        continue;
                    }

                    var child = this.children[index];

                    if (child instanceof Objects.NullElement)
                        if ((child).hasRotatedChild())
                            return true;
                    if (child.isRotated())
                        return true;
                }
            };

            CollectionBase.prototype.isRotated = function () {
                if (this.parent && !(this.parent instanceof THREE.Scene)) {
                    if ((this.parent).isRotated()) {
                        return true;
                    }
                }

                if (!(this.rotation.x == 0 && this.rotation.y == 0 && this.rotation.z == 0)) {
                    return true;
                }

                return false;
            };

            CollectionBase.prototype.addChild = function (object) {
                if (object == this) {
                    console.warn('THREE.Object3D.add: An object can\'t be added as a child of itself.');
                    return;
                }

                this.add(object);
            };

            CollectionBase.prototype.removeChild = function (child) {
                var index = this.children.indexOf(child);

                if (index == -1)
                    return;

                this.remove(child);
            };
            return CollectionBase;
        })(THREE.Object3D);
        Objects.CollectionBase = CollectionBase;
    })(Techne.Objects || (Techne.Objects = {}));
    var Objects = Techne.Objects;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    (function (Objects) {
        var EditableCollectionBase = (function (_super) {
            __extends(EditableCollectionBase, _super);
            function EditableCollectionBase(name, position, rotation) {
                _super.call(this, name, position, rotation);
                this.selected = ko.observable(false);

                this.observedName = ko.observable();
                this.publicName = ko.computed({
                    read: function () {
                        return this.observedName();
                    },
                    write: function (newName) {
                        this.observedName(newName);
                        this.name = newName;
                    },
                    owner: this
                });

                this.publicName(name || "null element");
                this.observedChildren = ko.observableArray();
                this.selected = ko.observable(false);
            }
            EditableCollectionBase.prototype.toggleVisibility = function (visibility) {
                this.visible = visibility || !this.visible;
                for (var index in this.children) {
                    if (!this.children.hasOwnProperty(index)) {
                        continue;
                    }

                    var child = this.children[index];
                    child.toggleVisibility(this.visible);
                }
            };

            EditableCollectionBase.prototype.updatePosition = function () {
            };

            EditableCollectionBase.prototype.updateSize = function () {
            };

            EditableCollectionBase.prototype.updateRotation = function () {
            };

            EditableCollectionBase.prototype.hasRotatedChild = function () {
                for (var index in this.children) {
                    if (!this.children.hasOwnProperty(index)) {
                        continue;
                    }

                    var child = this.children[index];

                    if (child instanceof Objects.NullElement)
                        if ((child).hasRotatedChild())
                            return true;
                    if (child.isRotated())
                        return true;
                }
            };

            EditableCollectionBase.prototype.isRotated = function () {
                if (this.parent && !(this.parent instanceof THREE.Scene)) {
                    if ((this.parent).isRotated()) {
                        return true;
                    }
                }

                if (!(this.rotation.x == 0 && this.rotation.y == 0 && this.rotation.z == 0)) {
                    return true;
                }

                return false;
            };

            EditableCollectionBase.prototype.addChild = function (object) {
                if (object == this) {
                    console.warn('THREE.Object3D.add: An object can\'t be added as a child of itself.');
                    return;
                }

                this.observedChildren.push(object);
            };

            EditableCollectionBase.prototype.removeChild = function (child) {
                var index = this.children.indexOf(child);

                if (index == -1)
                    return;

                this.observedChildren.remove(child);
            };

            EditableCollectionBase.prototype.updateTexture = function () {
            };
            return EditableCollectionBase;
        })(Objects.CollectionBase);
        Objects.EditableCollectionBase = EditableCollectionBase;
    })(Techne.Objects || (Techne.Objects = {}));
    var Objects = Techne.Objects;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    (function (Objects) {
        var NullElement = (function (_super) {
            __extends(NullElement, _super);
            function NullElement(name, position, rotation) {
                _super.call(this, name, position, rotation);
            }
            NullElement.prototype.updateSize = function () {
                this.scale.x = 1;
                this.scale.y = 1;
                this.scale.z = 1;
            };

            NullElement.prototype.updateRotation = function () {
                if (TechneBase.projectType == Techne.EditMode.Block) {
                    if (this.parent && !(this.parent instanceof THREE.Scene)) {
                        if ((this.parent).isRotated()) {
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
            return NullElement;
        })(Objects.CollectionBase);
        Objects.NullElement = NullElement;
    })(Techne.Objects || (Techne.Objects = {}));
    var Objects = Techne.Objects;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    (function (Tools) {
        var MoveTool = (function (_super) {
            __extends(MoveTool, _super);
            function MoveTool() {
                _super.call(this);
                this.name = "move";
            }
            MoveTool.prototype.attachControls = function () {
                var _this = this;
                this.arrows = [
                    new Techne.Helper.ArrowHelper(new THREE.Vector3(), Techne.Tools.Axis.X),
                    new Techne.Helper.ArrowHelper(new THREE.Vector3(), Techne.Tools.Axis.Y),
                    new Techne.Helper.ArrowHelper(new THREE.Vector3(), Techne.Tools.Axis.Z)
                ];

                this.arrows.map(function (a) {
                    _this.add(a);
                });

                this.position = this.selectedObject.minecraftPosition;
            };

            MoveTool.prototype.removeControls = function () {
                var _this = this;
                this.arrows.map(function (a) {
                    _this.remove(a);
                });
            };

            MoveTool.prototype.start = function () {
                if (!this.isHover) {
                    throw new Error("Invalid state");
                }

                this.toolAxisPlane = new THREE.Plane(this.tool.axis.normal);
            };
            MoveTool.prototype.end = function () {
                if (!this.isHover) {
                    this.tool.endHover();
                    this.tool = null;
                }
            };
            MoveTool.prototype.update = function () {
                if (this.isActive) {
                    if (this.tool.axis == Techne.Tools.Axis.X) {
                        if (Math.abs(this.positionDelta.x) < 1) {
                            return false;
                        }

                        this.translateX(this.positionDelta.x);
                    } else if (this.tool.axis == Techne.Tools.Axis.Y) {
                        if (Math.abs(this.positionDelta.y) < 1) {
                            return false;
                        }

                        this.translateY(this.positionDelta.y);
                    } else if (this.tool.axis == Techne.Tools.Axis.Z) {
                        if (Math.abs(this.positionDelta.z) < 1) {
                            return false;
                        }

                        this.translateZ(this.positionDelta.z);
                    }

                    this.selectedObject.updatePosition();
                }

                return true;
            };

            MoveTool.prototype.startHover = function (intersection) {
                this.tool = intersection.object.parent;
                this.tool.startHover();
            };
            MoveTool.prototype.endHover = function () {
                if (!this.isActive) {
                    this.tool.endHover();
                    this.tool = null;
                }
            };

            MoveTool.prototype.intersect = function (raycaster) {
                return {
                    point: raycaster.ray.intersectPlane(this.toolAxisPlane),
                    object: this.tool,
                    distance: 0,
                    face: null
                };
            };
            return MoveTool;
        })(Tools.ToolBase);
        Tools.MoveTool = MoveTool;
    })(Techne.Tools || (Techne.Tools = {}));
    var Tools = Techne.Tools;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    (function (Tools) {
        var Protractor = (function (_super) {
            __extends(Protractor, _super);
            function Protractor(axis, center, start, current) {
                _super.call(this);
                this.axis = axis;
                this.center = center;
                this.start = start;
                this.current = current;

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
                this.area = new THREE.Mesh(areaGeometry, new THREE.MeshBasicMaterial({
                    color: 0xAAAAAA,
                    opacity: 0.75,
                    side: THREE.DoubleSide
                }));
                this.area.position = this.center;
                if (this.axis == Techne.Tools.Axis.X) {
                    this.area.rotateY(Math.PI / 2);
                } else if (this.axis == Techne.Tools.Axis.Y) {
                    this.area.rotateX(Math.PI / 2);
                } else if (this.axis == Techne.Tools.Axis.Z) {
                }
                this.area.rotationAutoUpdate = true;

                this.add(this.area);

                this.textCanvas = document.createElement('canvas');
                this.textCanvas.width = 150;
                this.textCanvas.height = 150;

                var context = this.textCanvas.getContext('2d');
                context.font = "24pt Arial";
                context.textAlign = "center";
                context.textBaseline = "middle";
                context.fillStyle = "white";
                context.fillRect(0, 0, 150, 150);
                context.fillStyle = "black";

                this.textTexture = new THREE.Texture(this.textCanvas);
                var textMat = new THREE.MeshBasicMaterial({ map: this.textTexture, transparent: true });
                textMat.needsUpdate = true;

                this.billboard = new THREE.Mesh(new THREE.CubeGeometry(10, 10, 0.01), textMat);
                this.add(this.billboard);
                this.billboard.position = this.current;
                this.billboard.scale.y = -1;
                this.billboard.scale.x = -1;
            }
            Protractor.prototype.updateArea = function (currentAngle) {
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

                var context = this.textCanvas.getContext('2d');
                context.clearRect(0, 0, 150, 150);
                context.fillText(THREE.Math.radToDeg(currentAngle).toFixed(2) + "°", 50, 50);

                this.textTexture.needsUpdate = true;
            };

            Protractor.prototype.setStart = function (start) {
                this.start = this.worldToLocal(start);

                this.startLine.geometry.vertices = [];
                this.startLine.geometry.vertices.push(new THREE.Vector3(this.center.x, this.center.y, this.center.z));
                this.startLine.geometry.vertices.push(new THREE.Vector3(this.start.x, this.start.y, this.start.z));
                this.startLine.geometry.uvsNeedUpdate = true;
                this.startLine.geometry.verticesNeedUpdate = true;
                this.startLine.geometry.computeFaceNormals();
            };

            Protractor.prototype.update = function (current, currentAngle) {
                this.updateArea(currentAngle);

                current = this.worldToLocal(current);

                this.current.set(current.x, current.y, current.z);

                this.currentLine.geometry.vertices = [];
                this.currentLine.geometry.vertices.push(this.center.clone());
                this.currentLine.geometry.vertices.push(this.current.clone());
                this.currentLine.geometry.uvsNeedUpdate = true;
                this.currentLine.geometry.verticesNeedUpdate = true;
                this.currentLine.geometry.computeFaceNormals();
            };
            return Protractor;
        })(THREE.Object3D);
        Tools.Protractor = Protractor;
    })(Techne.Tools || (Techne.Tools = {}));
    var Tools = Techne.Tools;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    (function (Tools) {
        var RotateTool = (function (_super) {
            __extends(RotateTool, _super);
            function RotateTool() {
                _super.call(this);
                this.ribbons = [];
                this.name = "rotate";
            }
            RotateTool.prototype.attachControls = function () {
                var _this = this;
                this.ribbons = [
                    new Techne.Helper.CircularRibbtonHelper(new THREE.Vector3(), Techne.Tools.Axis.X),
                    new Techne.Helper.CircularRibbtonHelper(new THREE.Vector3(), Techne.Tools.Axis.Y),
                    new Techne.Helper.CircularRibbtonHelper(new THREE.Vector3(), Techne.Tools.Axis.Z)
                ];

                this.ribbons.map(function (a) {
                    _this.add(a);
                });

                this.position = this.selectedObject.position;
                this.rotation = this.selectedObject.rotation.clone();
            };

            RotateTool.prototype.removeControls = function () {
                var _this = this;
                this.ribbons.map(function (a) {
                    _this.remove(a);
                });
            };

            RotateTool.prototype.start = function () {
                if (!this.isHover) {
                    throw new Error("Invalid state");
                }

                this.updateMatrix();
                this.updateMatrixWorld(true);

                this.axis = this.selectedObject.localToWorld(this.tool.axis.vector.clone()).sub(this.selectedObject.position).normalize();
                var distance;
                var pos = this.selectedObject.position.clone();

                if (this.tool.axis == Techne.Tools.Axis.X) {
                    distance = pos.x;
                } else if (this.tool.axis == Techne.Tools.Axis.Y) {
                    distance = pos.y;
                } else if (this.tool.axis == Techne.Tools.Axis.Z) {
                    distance = pos.z;
                }

                this.toolAxisPlane = new THREE.Plane(this.axis, distance);
                this.protractor = new Tools.Protractor(this.tool.axis, this.selectedObject.position.clone(), this.selectedObject.position.clone(), this.selectedObject.position.clone());
                this.protractor.rotation = this.rotation.clone();

                Techne.Editor.Instance.scene.add(this.protractor);
            };
            RotateTool.prototype.end = function () {
                if (!this.isHover) {
                    this.tool.endHover();
                    this.tool = null;
                }

                this.startingPoint = null;
		Techne.Editor.Instance.scene.remove(this.protractor);
            };
            RotateTool.prototype.update = function () {
                if (this.isActive) {
                    if (!this.startingPoint) {
                        this.startingPoint = this.lastPosition;
                        this.startingRotation = this.rotation.clone();
                        this.protractor.setStart(this.startingPoint.clone());
                        this.totalAngle = 0;
                        this.startAngle = 0;
                        this.startAngle = -this.getCurrentAngleDelta();
                        this.totalAngle = 0;
                    }

                    var angleDelta = this.getCurrentAngleDelta();

                    var rotationMatrix = new THREE.Matrix4();
                    rotationMatrix.makeRotationAxis(this.tool.axis.vector, angleDelta);
                    rotationMatrix = this.selectedObject.matrix.multiply(rotationMatrix);
                    this.selectedObject.rotation.setFromRotationMatrix(rotationMatrix, this.selectedObject.rotation.order);

                    this.rotation = this.selectedObject.rotation.clone();

                    this.protractor.update(this.currentPosition, this.totalAngle);

                    this.selectedObject.updateRotation();
                }

                return true;
            };

            RotateTool.prototype.getCurrentAngleDelta = function () {
                var result;
                if (this.tool.axis == Techne.Tools.Axis.X) {
                    result = Math.atan2(this.currentPosition.y, this.currentPosition.z);
                } else if (this.tool.axis == Techne.Tools.Axis.Y) {
                    result = Math.atan2(this.currentPosition.x, this.currentPosition.z);
                } else if (this.tool.axis == Techne.Tools.Axis.Z) {
                    result = Math.atan2(this.currentPosition.x, this.currentPosition.y);
                }

                if (result < 0) {
                    result = result;
                }

                var tmp = this.totalAngle;
                this.totalAngle = this.startAngle - result;
                console.log(this.startAngle, this.totalAngle, this.totalAngle - tmp, result);
                return this.totalAngle - tmp;
            };

            RotateTool.prototype.mouseDown = function (event) {
                _super.prototype.mouseDown.call(this, event);
            };

            RotateTool.prototype.startHover = function (intersection) {
                if (intersection && intersection.object) {
                    this.tool = intersection.object.parent;
                    this.tool.startHover();
                }
            };
            RotateTool.prototype.endHover = function () {
                if (!this.isActive) {
                    this.tool.endHover();
                    this.tool = null;
                }
            };

            RotateTool.prototype.intersect = function (raycaster) {
                this.currentPosition = raycaster.ray.intersectPlane(this.toolAxisPlane);

                return {
                    point: this.currentPosition,
                    object: this.tool,
                    distance: 0,
                    face: null
                };
            };
            return RotateTool;
        })(Tools.ToolBase);
        Tools.RotateTool = RotateTool;
    })(Techne.Tools || (Techne.Tools = {}));
    var Tools = Techne.Tools;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    (function (Tools) {
        var ResizeTool = (function (_super) {
            __extends(ResizeTool, _super);
            function ResizeTool() {
                _super.call(this);
                this.ribbons = [];
                this.name = "resize";
            }
            ResizeTool.prototype.attachControls = function () {
                var _this = this;
                this.ribbons = [
                    new Techne.Helper.CircularRibbtonHelper(new THREE.Vector3(), Techne.Tools.Axis.X),
                    new Techne.Helper.CircularRibbtonHelper(new THREE.Vector3(), Techne.Tools.Axis.Y),
                    new Techne.Helper.CircularRibbtonHelper(new THREE.Vector3(), Techne.Tools.Axis.Z)
                ];

                this.ribbons.map(function (a) {
                    _this.add(a);
                });

                this.position = this.selectedObject.position;
                this.rotation = this.selectedObject.rotation;
            };

            ResizeTool.prototype.removeControls = function () {
                var _this = this;
                this.ribbons.map(function (a) {
                    _this.remove(a);
                });
            };

            ResizeTool.prototype.start = function () {
                if (!this.isHover) {
                    throw new Error("Invalid state");
                }

                this.toolAxisPlane = new THREE.Plane(this.tool.axis.normal);
            };
            ResizeTool.prototype.end = function () {
                if (!this.isHover) {
                    this.tool.endHover();
                    this.tool = null;
                }
            };
            ResizeTool.prototype.update = function () {
                if (this.isActive) {
                    console.log(this.positionDelta);

                    if (this.tool.axis == Techne.Tools.Axis.X) {
                        this.selectedObject.rotation.x += THREE.Math.degToRad(this.positionDelta.x);
                    } else if (this.tool.axis == Techne.Tools.Axis.Y) {
                        this.selectedObject.rotation.y += THREE.Math.degToRad(this.positionDelta.y);
                    } else if (this.tool.axis == Techne.Tools.Axis.Z) {
                        this.selectedObject.rotation.z += THREE.Math.degToRad(this.positionDelta.z);
                    }

                    this.selectedObject.updateRotation();
                }

                return true;
            };
            ResizeTool.prototype.startHover = function (intersection) {
                this.tool = intersection.object.parent;
                this.tool.startHover();
            };
            ResizeTool.prototype.endHover = function () {
                if (!this.isActive) {
                    this.tool.endHover();
                    this.tool = null;
                }
            };

            ResizeTool.prototype.intersect = function (raycaster) {
                return {
                    point: raycaster.ray.intersectPlane(this.toolAxisPlane),
                    object: this.tool,
                    distance: 0,
                    face: null
                };
            };
            return ResizeTool;
        })(Tools.ToolBase);
        Tools.ResizeTool = ResizeTool;
    })(Techne.Tools || (Techne.Tools = {}));
    var Tools = Techne.Tools;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    (function (Tools) {
        var TextureOffsetTool = (function (_super) {
            __extends(TextureOffsetTool, _super);
            function TextureOffsetTool() {
                _super.call(this);
                this.name = "texture";
            }
            return TextureOffsetTool;
        })(Tools.ToolBase);
        Tools.TextureOffsetTool = TextureOffsetTool;
    })(Techne.Tools || (Techne.Tools = {}));
    var Tools = Techne.Tools;
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
                if (TechneBase.projectType == Techne.EditMode.Block && this.parent && !(this.parent instanceof THREE.Scene)) {
                    if ((this.parent).isRotated()) {
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
                var cubeGeometry = new THREE.BoxGeometry(1, 1, 1);
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

                var right = helper.getRight();
                var left = helper.getLeft();
                var bottom = helper.getBottom();
                var top = helper.getTop();
                var back = helper.getBack();
                var front = helper.getFront();

                this.geometry.faceVertexUvs[0] = [];
                this.geometry.faceVertexUvs[0].push([right[0], right[1], right[3]]);
                this.geometry.faceVertexUvs[0].push([right[1], right[2], right[3]]);

                this.geometry.faceVertexUvs[0].push([left[0], left[1], left[3]]);
                this.geometry.faceVertexUvs[0].push([left[1], left[2], left[3]]);

                this.geometry.faceVertexUvs[0].push([bottom[0], bottom[1], bottom[3]]);
                this.geometry.faceVertexUvs[0].push([bottom[1], bottom[2], bottom[3]]);

                this.geometry.faceVertexUvs[0].push([top[0], top[1], top[3]]);
                this.geometry.faceVertexUvs[0].push([top[1], top[2], top[3]]);

                this.geometry.faceVertexUvs[0].push([back[0], back[1], back[3]]);
                this.geometry.faceVertexUvs[0].push([back[1], back[2], back[3]]);

                this.geometry.faceVertexUvs[0].push([front[0], front[1], front[3]]);
                this.geometry.faceVertexUvs[0].push([front[1], front[2], front[3]]);

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
    (function (Objects) {
        var Array = (function (_super) {
            __extends(Array, _super);
            function Array(name, position, rotation) {
                var _this = this;
                _super.call(this, name, position, rotation);

                this.observedChildren.subscribe(function (changes) {
                    for (var index in changes) {
                        if (!changes.hasOwnProperty(index)) {
                            continue;
                        }

                        var data = changes[index];

                        if (data.status == "deleted") {
                            data.value.parent = null;
                        }

                        _this.element = _this.observedChildren()[0];
                        if (_this.element) {
                            _this.element.parent = _this;
                        }
                        _this.updateArray();
                    }
                }, null, 'arrayChange');

                this.count = 5;
                this.radius = 16;

                amplify.subscribe("PropertyChanged", function (event) {
                    var parent = event.element.parent;
                    while (parent) {
                        if (parent == _this) {
                            _this.updateArray();
                        }

                        parent = parent.parent;
                    }
                });
            }
            Array.prototype.updateArray = function () {
                while (this.children.length > 0) {
                    this.remove(this.children[0]);
                }

                if (this.observedChildren().length > 0) {
                    var theta = 2 * Math.PI / this.count;
                    var radius = this.radius;

                    for (var i = 0; i < this.count; i++) {
                        var parent = new THREE.Object3D();
                        var elem = this.element.clone();
                        elem.translateX(radius);
                        parent.add(elem);
                        parent.rotateY(theta * i);
                        this.add(parent);
                    }
                }
            };
            return Array;
        })(Objects.EditableCollectionBase);
        Objects.Array = Array;
    })(Techne.Objects || (Techne.Objects = {}));
    var Objects = Techne.Objects;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    (function (Objects) {
        var EditableNullElement = (function (_super) {
            __extends(EditableNullElement, _super);
            function EditableNullElement(name, position, rotation) {
                var _this = this;
                _super.call(this, name, position, rotation);

                this.observedChildren.subscribe(function (changes) {
                    for (var index in changes) {
                        if (!changes.hasOwnProperty(index)) {
                            continue;
                        }

                        var data = changes[index];

                        switch (data.status) {
                            case "deleted":
                                _this.remove(data.value);
                                break;
                            case "added":
                                _this.add(data.value);
                                break;
                        }
                    }
                }, null, 'arrayChange');
            }
            EditableNullElement.prototype.updateSize = function () {
                this.scale.x = 1;
                this.scale.y = 1;
                this.scale.z = 1;
            };

            EditableNullElement.prototype.updateRotation = function () {
                if (TechneBase.projectType == Techne.EditMode.Block) {
                    if (this.parent && !(this.parent instanceof THREE.Scene)) {
                        if ((this.parent).isRotated()) {
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
            return EditableNullElement;
        })(Objects.EditableCollectionBase);
        Objects.EditableNullElement = EditableNullElement;
    })(Techne.Objects || (Techne.Objects = {}));
    var Objects = Techne.Objects;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    (function (Objects) {
        var EditablePlane = (function (_super) {
            __extends(EditablePlane, _super);
            function EditablePlane(name, size, position, rotation, textureOffset, material, texture) {
                this.observedName = ko.observable();
                this.selected = ko.observable(false);

                this.publicName = ko.computed({
                    read: function () {
                        return this.observedName();
                    },
                    write: function (newName) {
                        this.observedName(newName);
                        this.name = newName;
                    },
                    owner: this
                });

                this.publicName(name || "new plane");
                this.name = this.publicName();

                _super.call(this, name, size, position, rotation, textureOffset, material, texture);
            }
            EditablePlane.prototype.toggleVisibility = function (visibility) {
                this.visible = visibility || !this.visible;
            };
            EditablePlane.prototype.updatePosition = function () {
                var size = this.scale;
                this.position = new THREE.Vector3((this.minecraftPosition.x + size.x / 2), (this.minecraftPosition.y + size.y / 2), (this.minecraftPosition.z + size.z / 2));
            };
            EditablePlane.prototype.updateSize = function () {
                this.geometry.uvsNeedUpdate = true;
                this.updatePosition();
            };

            EditablePlane.prototype.updateRotation = function () {
                if (TechneBase.projectType == Techne.EditMode.Block && this.parent && !(this.parent instanceof THREE.Scene)) {
                    if ((this.parent).isRotated()) {
                        this.rotation.x = 0;
                        this.rotation.y = 0;
                        this.rotation.z = 0;
                    }
                }
            };

            EditablePlane.prototype.updateTexture = function () {
            };

            EditablePlane.prototype.isRotated = function () {
                return !(this.rotation.x == 0 && this.rotation.y == 0 && this.rotation.z == 0);
            };
            return EditablePlane;
        })(Objects.Plane);
        Objects.EditablePlane = EditablePlane;
    })(Techne.Objects || (Techne.Objects = {}));
    var Objects = Techne.Objects;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    (function (Objects) {
        var EditableCube = (function (_super) {
            __extends(EditableCube, _super);
            function EditableCube(name, size, position, rotation, textureOffset, material, texture) {
                this.observedName = ko.observable();
                this.selected = ko.observable(false);

                this.publicName = ko.computed({
                    read: function () {
                        return this.observedName();
                    },
                    write: function (newName) {
                        this.observedName(newName);
                        this.name = newName;
                    },
                    owner: this
                });

                this.publicName(name || "new cube");
                this.name = this.publicName();

                _super.call(this, name, size, position, rotation, textureOffset, material, texture);
            }
            EditableCube.prototype.toggleVisibility = function (visibility) {
                this.visible = visibility || !this.visible;
            };

            EditableCube.prototype.updatePosition = function () {
                var size = this.scale;
                this.position = new THREE.Vector3((this.minecraftPosition.x + size.x / 2), (this.minecraftPosition.y + size.y / 2), (this.minecraftPosition.z + size.z / 2));
            };

            EditableCube.prototype.updateRotation = function () {
                if (TechneBase.projectType == Techne.EditMode.Block && this.parent && !(this.parent instanceof THREE.Scene)) {
                    if ((this.parent).isRotated()) {
                        this.rotation.x = 0;
                        this.rotation.y = 0;
                        this.rotation.z = 0;
                    }
                }

                this.rotation.set(this.rotation.x, this.rotation.y, this.rotation.z);
            };

            EditableCube.prototype.updateTexture = function () {
            };

            EditableCube.prototype.isRotated = function () {
                return !(this.rotation.x == 0 && this.rotation.y == 0 && this.rotation.z == 0);
            };
            return EditableCube;
        })(Objects.Cube);
        Objects.EditableCube = EditableCube;
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
    (function (File) {
        (function (Importer) {
            var BlockImporter = (function () {
                function BlockImporter(techne) {
                    this.techne = techne;
                    this.result = {
                        textureSize: [64, 32],
                        data: []
                    };
                }
                BlockImporter.prototype.import = function (data) {
                    var _this = this;
                    var nullElement = this.techne.createNullElement(data.name, [0, 0, 0], [0, 0, 0]);

                    this.addElement(nullElement);

                    data.elements.map(function (element) {
                        switch (element.type) {
                            case "cube":
                                _this.createCube(element, nullElement);
                                break;
                            case "plane":
                                _this.createCube(element, nullElement);
                                break;
                        }
                    });

                    return this.result;
                };

                BlockImporter.prototype.createCube = function (element, parent) {
                    var position = [];
                    position[0] = element.from[0] - 8;
                    position[1] = (element.from[1] - 24) * (-1);
                    position[2] = element.from[2] - 8;
                    var size = [
                        element.to[0] - position[0] - 8,
                        (element.to[1] - element.from[1]),
                        element.to[2] - position[2] - 8
                    ];

                    position[1] -= size[1];

                    var rotation = [0, 0, 0];
                    if (element.rotation) {
                        rotation = element.rotation.map(function (x) {
                            return x / 180 * Math.PI;
                        });
                    }

                    var offset = [0, 0, 0];
                    if (element.origin) {
                        offset = element.origin;
                    }

                    var nullElement = this.techne.createNullElement(element.name, position, rotation);
                    nullElement.addChild(this.techne.createCube(element.name, size, offset, [0, 0, 0], [0, 0, 0]));

                    this.addElement(nullElement, parent);
                };

                BlockImporter.prototype.addElement = function (element, parent) {
                    if (parent) {
                        parent.addChild(element);
                    } else {
                        this.result.data.push(element);
                    }
                };
                return BlockImporter;
            })();
            Importer.BlockImporter = BlockImporter;
        })(File.Importer || (File.Importer = {}));
        var Importer = File.Importer;
    })(Techne.File || (Techne.File = {}));
    var File = Techne.File;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    (function (File) {
        (function (Importer) {
            var CraftStudioImporter = (function () {
                function CraftStudioImporter(techne) {
                    this.techne = techne;
                    this.result = {
                        textureSize: [64, 32],
                        data: []
                    };
                    this.nodes = {};
                }
                CraftStudioImporter.prototype.import = function (data) {
                    this.reader = new BinaryReader(data);

                    this.reader.ReadUInt8();
                    var formatVersion = this.reader.ReadUInt16();

                    if (formatVersion !== 5) {
                        throw new Error("unsupported file-version");
                    }

                    var nextUnusedNodeID = this.reader.ReadUInt16();
                    var nodeCount = this.reader.ReadUInt16();

                    var nullElement = this.techne.createNullElement("imported Model", [0, 0, 0], [0, 0, 0]);

                    for (var i = 0; i < nodeCount; i++) {
                        this.parseNode();
                    }

                    var tmp = [];
                    for (var key in this.nodes) {
                        if (this.nodes.hasOwnProperty(key)) {
                            var value = this.nodes[key];

                            if (value.parentId !== 65535) {
                                this.nodes[value.parentId].children.push(value);
                            } else {
                                tmp.push(value);
                            }
                        }
                    }

                    this.addElement(tmp, nullElement);
                    this.result.data.push(nullElement);

                    return this.result;
                };

                CraftStudioImporter.prototype.addElement = function (elements, parent) {
                    for (var key in elements) {
                        if (elements.hasOwnProperty(key)) {
                            var value = elements[key];

                            var rotation = new THREE.Euler().setFromQuaternion(new THREE.Quaternion(value.orientation[0], value.orientation[1], value.orientation[2], value.orientation[3]), "ZYX");
                            var nullElement = this.techne.createNullElement(value.name, this.convertFromCS(value.position.map(function (val) {
                                return val * 16;
                            })), [rotation.x, rotation.y, rotation.z]);
                            nullElement.addChild(this.techne.createCube(value.name, [value.blockSizeX, value.blockSizeY, value.blockSizeZ], this.convertFromCS(value.offset), [0, 0, 0], [0, 0, 0]));
                            parent.addChild(nullElement);

                            if (value.children) {
                                this.addElement(value.children, nullElement);
                            }
                        }
                    }
                };

                CraftStudioImporter.prototype.parseNode = function () {
                    var id = this.reader.ReadUInt16();
                    var parentNodeId = this.reader.ReadUInt16();
                    var name = this.reader.ReadString();
                    var position = this.reader.ReadVector3();
                    var offset = this.reader.ReadVector3();
                    var scale = this.reader.ReadVector3();
                    var rotation = this.reader.ReadQuaternion();
                    var sizeX = this.reader.ReadUInt16();
                    var sizeY = this.reader.ReadUInt16();
                    var sizeZ = this.reader.ReadUInt16();
                    var wrapMode = this.reader.ReadUInt8();
                    var offset0 = this.reader.ReadPoint();
                    var offset1 = this.reader.ReadPoint();
                    var offset2 = this.reader.ReadPoint();
                    var offset3 = this.reader.ReadPoint();
                    var offset4 = this.reader.ReadPoint();
                    var offset5 = this.reader.ReadPoint();
                    var uvTransform0 = this.reader.ReadUInt8();
                    var uvTransform1 = this.reader.ReadUInt8();
                    var uvTransform2 = this.reader.ReadUInt8();
                    var uvTransform3 = this.reader.ReadUInt8();
                    var uvTransform4 = this.reader.ReadUInt8();
                    var uvTransform5 = this.reader.ReadUInt8();

                    console.log(position);

                    this.nodes[id] = {
                        id: id,
                        parentId: parentNodeId,
                        name: name,
                        position: position,
                        offset: offset,
                        scale: scale,
                        orientation: rotation,
                        blockSizeX: sizeX,
                        blockSizeY: sizeY,
                        blockSizeZ: sizeZ,
                        textureOffset: [offset0, offset1, offset2, offset3, offset4, offset5],
                        uvTransformFlags: [uvTransform0, uvTransform1, uvTransform2, uvTransform3, uvTransform4, uvTransform5],
                        children: []
                    };
                };

                CraftStudioImporter.prototype.convertFromCS = function (vec) {
                    vec[0] = vec[0] - 8;
                    vec[1] = (vec[1] - 12) * (-1);
                    vec[2] = vec[2] - 8;
                    return vec;
                };
                return CraftStudioImporter;
            })();
            Importer.CraftStudioImporter = CraftStudioImporter;

            var BinaryReader = (function () {
                function BinaryReader(buffer) {
                    this.view = new DataView(buffer);
                    this.cursor = 0;
                    BinaryReader.DecodeString = function (array) {
                        return String.fromCharCode.apply(null, array);
                    };
                }
                BinaryReader.prototype.ReadUInt8 = function () {
                    var val = this.view.getUint8(this.cursor);
                    this.cursor += 1;
                    return val;
                };

                BinaryReader.prototype.ReadUInt16 = function () {
                    var val = this.view.getUint16(this.cursor, true);
                    this.cursor += 2;
                    return val;
                };

                BinaryReader.prototype.ReadInt32 = function () {
                    var val = this.view.getInt32(this.cursor, true);
                    this.cursor += 4;
                    return val;
                };

                BinaryReader.prototype.ReadUInt32 = function () {
                    var val = this.view.getUint32(this.cursor, true);
                    this.cursor += 4;
                    return val;
                };

                BinaryReader.prototype.ReadFloat32 = function () {
                    var val = this.view.getFloat32(this.cursor, true);
                    this.cursor += 4;
                    return val;
                };

                BinaryReader.prototype.ReadFloat64 = function () {
                    var val = this.view.getFloat64(this.cursor, true);
                    this.cursor += 8;
                    return val;
                };

                BinaryReader.prototype.Read7BitEncodedInt = function () {
                    var returnValue = 0;
                    var bitIndex = 0;
                    while (true) {
                        if (bitIndex != 35) {
                            var num = this.ReadUInt8();
                            returnValue |= (num & 127) << bitIndex;
                            bitIndex += 7;
                        } else {
                            throw new Error("Invalid 7-bit encoded int");
                        }
                        if (!((num & 128) != 0)) {
                            break;
                        }
                    }
                    return returnValue;
                };

                BinaryReader.prototype.ReadBoolean = function () {
                    return this.ReadUInt8() != 0;
                };

                BinaryReader.prototype.ReadString = function () {
                    var length = this.Read7BitEncodedInt();
                    var val = BinaryReader.DecodeString(new Uint8Array((this.view.buffer).slice(this.cursor, this.cursor + length)));
                    this.cursor += length;
                    return val;
                    ;
                };

                BinaryReader.prototype.ReadPoint = function () {
                    return { x: this.ReadInt32(), y: this.ReadInt32() };
                };
                BinaryReader.prototype.ReadVector2 = function () {
                    return [this.ReadFloat32(), this.ReadFloat32()];
                };
                BinaryReader.prototype.ReadVector3 = function () {
                    return [this.ReadFloat32(), this.ReadFloat32(), this.ReadFloat32()];
                };
                BinaryReader.prototype.ReadIntVector3 = function () {
                    return [this.ReadInt32(), this.ReadInt32(), this.ReadInt32()];
                };

                BinaryReader.prototype.ReadQuaternion = function () {
                    var w = this.ReadFloat32();
                    return [this.ReadFloat32(), this.ReadFloat32(), this.ReadFloat32(), w];
                };

                BinaryReader.prototype.ReadBytes = function (length) {
                    var bytes = new Uint8Array((this.view.buffer).slice(this.cursor, this.cursor + length));
                    this.cursor += length;
                    return bytes;
                };
                return BinaryReader;
            })();
        })(File.Importer || (File.Importer = {}));
        var Importer = File.Importer;
    })(Techne.File || (Techne.File = {}));
    var File = Techne.File;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    (function (File) {
        (function (Exporter) {
            var TechneExporter = (function () {
                function TechneExporter() {
                }
                TechneExporter.prototype.export = function (objects) {
                    return {
                        "Techne": {
                            "@Version": "2.2",
                            "Author": "ZeuX",
                            "Name": "",
                            "PreviewImage": "",
                            "ProjectName": "",
                            "ProjectType": "",
                            "Description": "",
                            "DateCreated": "",
                            "Models": [
                                {
                                    "Model": {
                                        "GlScale": "1,1,1",
                                        "Name": "",
                                        "TextureSize": TechneBase.textureSize.x + "," + TechneBase.textureSize.y,
                                        "@texture": "texture.png",
                                        "BaseClass": "ModelBase",
                                        "Geometry": this.serializeObjects(objects)
                                    }
                                }
                            ]
                        }
                    };
                };

                TechneExporter.prototype.serializeObjects = function (objects) {
                    var _this = this;
                    var result = { "Folder": [], "Shape": [], "Piece": [], "Null": [] };

                    objects.map(function (obj) {
                        if (obj instanceof Techne.Objects.NullElement)
                            result.Null.push(_this.serializeNull(obj));
else
                            result.Shape.push(_this.serializeShape(obj));
                    });

                    return result;
                };

                TechneExporter.prototype.serializeNull = function (obj) {
                    return {
                        "@Type": "3b3bb6e5-2f8b-4bbd-8dbb-478b67762fd0",
                        "@Name": obj.name,
                        "Position": [obj.minecraftPosition.x, obj.minecraftPosition.y, obj.minecraftPosition.z].join(","),
                        "Rotation": [obj.rotation.x, obj.rotation.y, obj.rotation.z].join(","),
                        "Children": this.serializeObjects(obj.children)
                    };
                };

                TechneExporter.prototype.serializeShape = function (obj) {
                    return {
                        "Id": obj.uniqueId,
                        "@Type": "d9e621f7-957f-4b77-b1ae-20dcd0da7751",
                        "@Name": obj.name,
                        "IsDecorative": "False",
                        "IsFixed": "False",
                        "IsMirrored": "False",
                        "Position": [obj.minecraftPosition.x, obj.minecraftPosition.y, obj.minecraftPosition.z].join(","),
                        "Rotation": [obj.rotation.x, obj.rotation.y, obj.rotation.z].join(","),
                        "Size": [obj.scale.x, obj.scale.y, obj.scale.z].join(","),
                        "TextureOffset": [obj.textureOffset.x, obj.textureOffset.y].join(",")
                    };
                };
                return TechneExporter;
            })();
            Exporter.TechneExporter = TechneExporter;
        })(File.Exporter || (File.Exporter = {}));
        var Exporter = File.Exporter;
    })(Techne.File || (Techne.File = {}));
    var File = Techne.File;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    (function (File) {
        (function (Exporter) {
            var BlockExporter = (function () {
                function BlockExporter() {
                }
                BlockExporter.prototype.export = function (objects) {
                    return {
                        elements: this.createElementsArray(objects)
                    };
                };

                BlockExporter.prototype.createElementsArray = function (objects, parentOffset, parentRotation) {
                    var _this = this;
                    if (!parentOffset) {
                        parentOffset = [0, 0, 0];
                    }
                    if (!parentRotation) {
                        parentRotation = [0, 0, 0];
                    }

                    var elements = [];

                    objects.map(function (object) {
                        if (object instanceof Techne.Objects.NullElement) {
                            var propagatedOffset = [];
                            propagatedOffset[0] = parentOffset[0] + object.minecraftPosition.x;
                            propagatedOffset[1] = parentOffset[1] + object.minecraftPosition.y;
                            propagatedOffset[2] = parentOffset[2] + object.minecraftPosition.z;

                            var propagatedRotation = [];
                            propagatedRotation[0] = parentRotation[0] + object.rotation.x;
                            propagatedRotation[1] = parentRotation[1] + object.rotation.y;
                            propagatedRotation[2] = parentRotation[2] + object.rotation.z;

                            elements = elements.concat(_this.createElementsArray(object.children, propagatedOffset, propagatedRotation));
                        } else {
                            var position = _this.convertToMinecraft(object);

                            if (parentRotation[0] == 0 && parentRotation[1] == 0 && parentRotation[2] == 0) {
                                position[0] += parentOffset[0];
                                position[1] -= parentOffset[1];
                                position[2] += parentOffset[2];
                                parentOffset = [0, 0, 0];
                            }

                            var to = [
                                object.scale.x + position[0],
                                object.scale.y + position[1],
                                object.scale.z + position[2]
                            ];

                            var newElement = {
                                "type": "cube",
                                "from": position,
                                "to": to
                            };

                            if (!(parentRotation[0] == 0 && parentRotation[1] == 0 && parentRotation[2] == 0)) {
                                newElement.rotation = parentRotation;
                            }
                            if (!(parentRotation[0] == 0 && parentRotation[1] == 0 && parentRotation[2] == 0)) {
                                newElement.origin = parentOffset;
                            }

                            elements.push(newElement);
                        }
                    });

                    return elements;
                };

                BlockExporter.prototype.convertToMinecraft = function (object) {
                    return [
                        object.minecraftPosition.x + 8,
                        (object.minecraftPosition.y - 24 + object.scale.y) * (-1),
                        object.minecraftPosition.z + 8
                    ];
                };
                return BlockExporter;
            })();
            Exporter.BlockExporter = BlockExporter;
        })(File.Exporter || (File.Exporter = {}));
        var Exporter = File.Exporter;
    })(Techne.File || (Techne.File = {}));
    var File = Techne.File;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    var Controller = (function () {
        function Controller(techne) {
            var _this = this;
            this.techne = techne;
            this.name = ko.observable().extend({
                update: {
                    propertyChain: ['name'],
                    callback: function (element) {
                        element.publicName(element.name);
                    }
                },
                filter: Techne.Extender.Filter.AlphaNumerical
            });
            this.positionX = ko.observable().extend({
                min: -50,
                max: 50,
                update: {
                    propertyChain: ['minecraftPosition', 'x'],
                    callback: function (element) {
                        element.updatePosition();
                    },
                    map: parseInt
                },
                filter: Techne.Extender.Filter.Float
            });
            this.positionY = ko.observable().extend({
                min: -50,
                max: 50,
                update: {
                    propertyChain: ['minecraftPosition', 'y'],
                    callback: function (element) {
                        element.updatePosition();
                    },
                    map: parseInt
                },
                filter: Techne.Extender.Filter.Float
            });
            this.positionZ = ko.observable().extend({
                min: -50,
                max: 50,
                update: {
                    propertyChain: ['minecraftPosition', 'z'],
                    callback: function (element) {
                        element.updatePosition();
                    },
                    map: parseInt
                },
                filter: Techne.Extender.Filter.Float
            });
            this.sizeX = ko.observable().extend({
                min: 0,
                max: 50,
                update: {
                    propertyChain: ['scale', 'x'],
                    callback: function (element) {
                        element.updateSize();
                    },
                    map: parseInt
                },
                filter: Techne.Extender.Filter.Integer
            });
            this.sizeY = ko.observable().extend({
                min: 0,
                max: 50,
                update: {
                    propertyChain: ['scale', 'y'],
                    callback: function (element) {
                        element.updateSize();
                    },
                    map: parseInt
                },
                filter: Techne.Extender.Filter.Integer
            });
            this.sizeZ = ko.observable().extend({
                min: 0,
                max: 50,
                update: {
                    propertyChain: ['scale', 'z'],
                    callback: function (element) {
                        element.updateSize();
                    },
                    map: parseInt
                },
                filter: Techne.Extender.Filter.Integer
            });
            this.rotationX = ko.observable().extend({
                min: -360,
                max: 360,
                update: {
                    propertyChain: ['rotation', 'x'],
                    callback: function (element) {
                        element.updateRotation();
                    },
                    map: function (value) {
                        value = parseInt(value);
                        value = value / 180 * Math.PI;
                        return value;
                    }
                },
                filter: Techne.Extender.Filter.Float
            });
            this.rotationY = ko.observable().extend({
                min: -360,
                max: 360,
                update: {
                    propertyChain: ['rotation', 'y'],
                    callback: function (element) {
                        element.updateRotation();
                    },
                    map: function (value) {
                        value = parseInt(value);
                        value = value / 180 * Math.PI;
                        return value;
                    }
                },
                filter: Techne.Extender.Filter.Float
            });
            this.rotationZ = ko.observable().extend({
                min: -360,
                max: 360,
                update: {
                    propertyChain: ['rotation', 'z'],
                    callback: function (element) {
                        element.updateRotation();
                    },
                    map: function (value) {
                        value = parseInt(value);
                        value = value / 180 * Math.PI;
                        return value;
                    }
                },
                filter: Techne.Extender.Filter.Float
            });
            this.textureOffsetX = ko.observable().extend({
                min: 0,
                update: {
                    propertyChain: ['textureOffset', 'x'],
                    callback: function (element) {
                        element.updateSize();
                    },
                    map: parseInt
                },
                filter: Techne.Extender.Filter.Integer
            });
            this.textureOffsetY = ko.observable().extend({
                min: 0,
                update: {
                    propertyChain: ['textureOffset', 'y'],
                    callback: function (element) {
                        element.updateSize();
                    },
                    map: parseInt
                },
                filter: Techne.Extender.Filter.Integer
            });
            this.radius = ko.observable().extend({
                min: 0,
                update: {
                    propertyChain: ['radius'],
                    callback: function (element) {
                        element.updateArray();
                    },
                    map: parseInt
                },
                filter: Techne.Extender.Filter.Integer
            });
            this.count = ko.observable().extend({
                min: 0,
                update: {
                    propertyChain: ['count'],
                    callback: function (element) {
                        element.updateArray();
                    },
                    map: parseInt
                },
                filter: Techne.Extender.Filter.Integer
            });
            this.toolsList = [
                new Techne.Tools.MoveTool(),
                new Techne.Tools.TextureOffsetTool(),
                new Techne.Tools.RotateTool()
            ];

            this.tools = {};
            this.toolsList.map(function (tool) {
                _this.tools[tool.name] = tool;
            });

            this.selectedTool = this.tools["rotate"];
        }
        Controller.prototype.getTools = function () {
            return this.toolsList;
        };

        Controller.prototype.setOpacity = function (selected, opacity, elements) {
            if (!elements) {
                elements = this.techne.objects();
            }

            for (var index in elements) {
                if (!elements.hasOwnProperty(index)) {
                    continue;
                }
                var element = elements[index];

                if (element == selected) {
                    continue;
                }

                if (element instanceof Techne.Objects.CollectionBase) {
                    this.setOpacity(selected, opacity, (element).observedChildren());
                } else {
                    (element).material.opacity = opacity;
                }
            }
        };

        Controller.prototype.setValues = function (newCurrent) {
            this.selectedTool.objectSelected(newCurrent);
            this.techne.scene.add(this.selectedTool);

            newCurrent.selected(true);

            this.setOpacity(newCurrent, 0.5);

            if (!(newCurrent instanceof Techne.Objects.CollectionBase)) {
                this.textureOffsetX(newCurrent.textureOffset.x);
                this.textureOffsetY(newCurrent.textureOffset.y);
            }

            this.name(newCurrent.publicName());
            this.positionX(newCurrent.minecraftPosition.x);
            this.positionY(newCurrent.minecraftPosition.y);
            this.positionZ(newCurrent.minecraftPosition.z);

            this.sizeX(newCurrent.scale.x);
            this.sizeY(newCurrent.scale.y);
            this.sizeZ(newCurrent.scale.z);

            this.rotationX(newCurrent.rotation.x * 180 / Math.PI);
            this.rotationY(newCurrent.rotation.y * 180 / Math.PI);
            this.rotationZ(newCurrent.rotation.z * 180 / Math.PI);

            if (newCurrent instanceof Techne.Objects.Array) {
                this.count((newCurrent).count);
                this.radius((newCurrent).radius);
            }
        };

        Controller.prototype.resetValues = function () {
            this.techne.scene.remove(this.selectedTool);
            this.selectedTool.objectDeselected();

            this.name("");
            this.positionX(0);
            this.positionY(0);
            this.positionZ(0);

            this.sizeX(0);
            this.sizeY(0);
            this.sizeZ(0);

            this.rotationX(0);
            this.rotationY(0);
            this.rotationZ(0);

            this.textureOffsetX(0);
            this.textureOffsetY(0);

            this.radius(0);
            this.count(0);
        };

        Controller.prototype.setSelected = function (newCurrent) {
            if (this.techne.current()) {
                this.setOpacity(this.techne.current(), 1.0);
                this.techne.current().selected(false);

                this.techne.scene.remove(this.selectedTool);
            }

            this.techne.current(newCurrent);

            if (newCurrent) {
                this.setValues(newCurrent);
            } else {
                this.resetValues();
            }
        };
        return Controller;
    })();
    Techne.Controller = Controller;
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    var TextureMapper = (function () {
        function TextureMapper(techne) {
            this.techne = techne;
        }
        TextureMapper.prototype.init = function () {
            this.initRenderer();
            this.overlay = new TextureOverlay(this.techne);
            this.container.addChild(this.overlay);
            this.update();

            amplify.subscribe("PropertyChanged", this.overlay, function (data) {
                if (data.propertyChain[0] == "textureOffset") {
                    console.log(data.new);
                    this.update();
                }
            });
        };

        TextureMapper.prototype.initTexture = function () {
            this.texture = PIXI.Texture.fromImage(this.techne.textureElement.src, false, PIXI.scaleModes.NEAREST);
            this.textureSprite = new PIXI.Sprite(this.texture);
            this.container.addChildAt(this.textureSprite, 0);
        };

        TextureMapper.prototype.initRenderer = function () {
            this.stage = new PIXI.Stage(0xFFFFFF);

            var textureElementData = {
                Width: $("#texture").width(),
                Height: $("#texture").height()
            };

            $("#texture").hide();

            this.renderer = PIXI.autoDetectRenderer(textureElementData.Width, textureElementData.Height);
            this.container = new PIXI.DisplayObjectContainer();
            this.stage.addChild(this.container);

            $(this.renderer.view).insertAfter("#texture");
        };

        TextureMapper.prototype.animate = function () {
            requestAnimationFrame(this.animate);
            this.render();
        };

        TextureMapper.prototype.render = function () {
            this.renderer.render(this.stage);
        };

        TextureMapper.prototype.update = function () {

            var textureElementData = {
                Width: $("#texture").width(),
                Height: $("#texture").height()
            };

            var scale = textureElementData.Width / TechneBase.textureSize.x;

            this.container.scale.x = scale;
            this.container.scale.y = scale;
        };

        TextureMapper.prototype.setSelected = function (element) {
        };
        return TextureMapper;
    })();
    Techne.TextureMapper = TextureMapper;

    var CubeSide;
    (function (CubeSide) {
        CubeSide[CubeSide["Right"] = 0] = "Right";
        CubeSide[CubeSide["Left"] = 1] = "Left";
        CubeSide[CubeSide["Bottom"] = 2] = "Bottom";
        CubeSide[CubeSide["Top"] = 3] = "Top";
        CubeSide[CubeSide["Back"] = 4] = "Back";
        CubeSide[CubeSide["Front"] = 5] = "Front";
    })(CubeSide || (CubeSide = {}));

    var TextureOverlay = (function (_super) {
        __extends(TextureOverlay, _super);
        function TextureOverlay(techne) {
            var _this = this;
            _super.call(this);
            this.techne = techne;

            techne.current.subscribe(function (current) {
                return _this.changeElement(current);
            });

            this.overlays = [];
            for (var i = 0; i < 6; i++) {
                this.overlays.push(new PIXI.Graphics());
                this.addChild(this.overlays[i]);
            }

            this.dragHandler = new Techne.Handler.TextureDragHandler(this);
            this.offset = new THREE.Vector2(0, 0);
        }
        TextureOverlay.prototype.update = function () {
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
        };

        TextureOverlay.prototype.changeOffset = function (delta) {
            this.position.x += delta.x;
            this.position.y += delta.y;
            this.current.textureOffset.set(this.position.x, this.position.y);
            this.current.updateSize();
        };

        TextureOverlay.prototype.getAbsoluteSize = function (i, start, end) {
            var from = this.getAbsoluteCoordinates(i, start);
            var to = this.getAbsoluteCoordinates(i, end);

            return [
                to[0] - from[0],
                to[1] - from[1]
            ];
        };
        TextureOverlay.prototype.getAbsoluteCoordinates = function (i, i2) {
            var vertex = this.faceVertexUvs[0][i][i2];
            return [
                vertex.x * TechneBase.textureSize.x,
                (1 - vertex.y) * TechneBase.textureSize.y
            ];
        };

        TextureOverlay.prototype.changeElement = function (current) {
            if (current) {
                if (!(current instanceof Techne.Objects.EditableCollectionBase)) {
                    this.current = current;
                    this.faceVertexUvs = (current).geometry.faceVertexUvs;
                    this.update();
                }
            } else {
                this.overlays.map(function (x) {
                    return x.clear();
                });
            }
        };
        return TextureOverlay;
    })(PIXI.DisplayObjectContainer);
})(Techne || (Techne = {}));
var Techne;
(function (Techne) {
    var Editor = (function (_super) {
        __extends(Editor, _super);
        function Editor() {
            var _this = this;
            _super.call(this);
            this.controller = new Techne.Controller(this);
            this.textureMapper = new Techne.TextureMapper(this);

            this.current = ko.observable();
            this.objects = ko.observableArray([]);
            this.objects.subscribe(function (changes) {
                changes.map(function (data) {
                    switch (data.status) {
                        case "deleted":
                            _this.scene.remove(data.value);
                            break;
                        case "added":
                            _this.scene.add(data.value);
                            break;
                    }
                });
            }, null, 'arrayChange');
        }
        Editor.prototype.init = function (settings) {
            Editor.Instance = this;
            var supportsWebGl = _super.prototype.init.call(this, settings);

            if (!supportsWebGl) {
                return false;
            }

            this.initEvents(settings);
            return true;
        };

        Editor.prototype.initTexture = function (settings) {
            this.textureMapper.init();
            _super.prototype.initTexture.call(this, settings);
            this.textureMapper.initTexture();
        };

        Editor.prototype.initEvents = function (settings) {
            this.mouseHandler = new Techne.Handler.MouseHandler(this);
            this.mouseHandler.init();
        };

        Editor.prototype.initControls = function (settings) {
            this.controls = new THREE.OrbitControls(this.camera, this.container);

            this.controls.noRotate = settings.noRotate;
            this.controls.noPan = settings.noPan;
            this.controls.noZoom = settings.noZoom;
            this.controls.autoRotate = settings.autoRotate;
            this.controls.autoRotateSpeed = settings.autoRotateSpeed;
        };

        Editor.prototype.addElement = function (element, parent) {
            if (parent) {
                parent.observedChildren.push(element);
            } else {
                this.objects.push(element);
            }
        };

        Editor.prototype.updateTexture = function () {
            this.textureMapper.update();
            _super.prototype.updateTexture.call(this);
        };

        Editor.prototype.selectObject = function (cube) {
            Editor.Instance.controller.setSelected(cube);
        };

        Editor.prototype.toggleVisibility = function (cube) {
            cube.toggleVisibility();
            if (cube == this.current())
                this.controller.setSelected(null);

            return true;
        };

        Editor.prototype.removeObject = function (cube) {
            if (cube.parent instanceof THREE.Scene) {
                this.objects.remove(cube);
            } else {
                (cube.parent).removeChild(cube);
            }
        };

        Editor.prototype.setSelected = function (object) {
            if (object && object.parent && object.parent.parent instanceof Techne.Objects.Array) {
                object = (object.parent.parent).element;
            }

            this.controller.setSelected(object);
        };

        Editor.prototype.importCraftStudioBlock = function (data) {
            var _this = this;
            var importer = new Techne.File.Importer.CraftStudioImporter(this);
            var result = importer.import(data);
            result.data.map(function (value, index, objects) {
                _this.objects.push(value);
            });
            TechneBase.textureSize.set(result.textureSize[0], result.textureSize[1]);
            this.updateTexture();
        };

        Editor.prototype.importMinecraftBlock = function (json) {
            var _this = this;
            var importer = new Techne.File.Importer.BlockImporter(this);
            var result = importer.import(json);
            result.data.map(function (value, index, objects) {
                _this.objects.push(value);
            });
            TechneBase.textureSize.set(result.textureSize[0], result.textureSize[1]);
            this.updateTexture();
        };

        Editor.prototype.exportMinecraftBlock = function () {
            var exporter = new Techne.File.Exporter.BlockExporter();
            return exporter.export(this.objects());
        };

        Editor.prototype.render = function () {
            _super.prototype.render.call(this);
            this.textureMapper.render();
            this.controls.update();
            this.mouseHandler.update();
        };

        Editor.prototype.centerCamera = function () {
        };

        Editor.prototype.loadModel = function (modelId, model) {
            var _this = this;
            var importer = new Techne.File.Importer.TechneImporter(this);
            var result = importer.import(model);

            result.data.map(function (value, index, objects) {
                _this.objects.push(value);
            });
            TechneBase.textureSize.set(result.textureSize[0], result.textureSize[1]);
            this.updateTexture();
        };

        Editor.prototype.createNullElement = function (name, position, rotation) {
            return new Techne.Objects.EditableNullElement(name, position, rotation);
        };

        Editor.prototype.createCube = function (name, size, position, rotation, textureOffset) {
            return new Techne.Objects.EditableCube(name, size, position, rotation, textureOffset, this.modelMaterial, this.modelTexture);
        };
        return Editor;
    })(TechneBase);
    Techne.Editor = Editor;
})(Techne || (Techne = {}));
//# sourceMappingURL=techne-editor.js.map
