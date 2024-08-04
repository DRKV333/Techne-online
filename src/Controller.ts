// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne {
    export class Controller {
        private tools: { [type: string]: Tools.ITool };
        private toolsList: Tools.ITool[];
        private history: Extensions.HistoryStack;
        private redoHistory: Extensions.LimitedStack<Models.IHistoryModel>;
        private pauseHistory: boolean = false;
        public selectedTool: Tools.ITool;

        constructor(private techne: IEditor) {
            this.toolsList = [
                new Tools.MoveTool(this),
                new Tools.TextureOffsetTool(this),
                new Tools.RotateTool(this)
            ];

            this.tools = {};
            this.toolsList.map((tool) => {
                this.tools[tool.name] = tool;
            });

            this.selectedTool = this.tools["rotate"];

            this.history = new Extensions.HistoryStack(12);
            this.redoHistory = new Extensions.LimitedStack<Models.IHistoryModel>(12);

            amplify.subscribe("PropertyChanged", this, (data: Models.IHistoryModel) => {
                this.addToHistory(data);
            });

            //todo: dont subscribe but use onChildChanged!
            //will automatically filter any changes to things that are not in the scene
            //like cloned elements.
            //same goes for propertychanged
            amplify.subscribe("ObjectRemoved", this, (data: Models.IElementHistoryModel) => {
                this.addToHistory({
                        element: null,
                        new: null,
                        actionType: Models.HistoryAction.Removed,
                        old: null,
                        target: (() => {
                            var objectRemoved = true;

                            return (element) => {
                                if (objectRemoved) {
                                    console.log("0adding", data.element, "to", data.parent, objectRemoved);
                                    data.parent.addChild(data.element);
                                } else {
                                    console.log("0removing", data.element, "to", data.parent, objectRemoved);
                                    data.parent.removeChild(data.element);
                                }

                                objectRemoved = !objectRemoved;
                            }
                         })()
                    });
            });
            
            amplify.subscribe("ObjectAdded", this, (data: Models.IElementHistoryModel) => {
                this.addToHistory({
                        element: null,
                        new: null,
                        old: null,
                        actionType: Models.HistoryAction.Added,
                        target: (() => {
                            var objectRemoved = false;

                            return (element) => {
                                if (objectRemoved) {
                                    console.log("1adding", data.element, "to", data.parent, objectRemoved);
                                    data.parent.addChild(data.element);
                                } else {
                                    console.log("1removing", data.element, "from", data.parent, objectRemoved);
                                    data.parent.removeChild(data.element);
                                }

                                objectRemoved = !objectRemoved;
                            }
                         })()
                    });
            });
        }

        public setTool(name: string) {
            if (this.selectedTool) {
                this.selectedTool.dispose();
                this.techne.scene.remove(this.selectedTool);
            }

            this.selectedTool = this.tools[name];

            if (this.techne.current() && this.selectedTool) {
                this.selectedTool.objectSelected(this.techne.current());
                this.techne.scene.add(this.selectedTool);
            }
        }

        public getTools(): Tools.ITool[] {
            return this.toolsList;
        }

        public name = ko.observable().extend({
            update: {
                propertyChain: ['name'],
                callback: function (element: Objects.IEditableObject) {
                    element.publicName(element.name)
                    }
            },
            filter: Techne.Extender.Filter.AlphaNumerical
        });

        public positionX = ko.observable().extend({
            min: -50,
            max: 50,
            update: {
                propertyChain: ['minecraftPosition', 'x'],
                callback: function (element: Objects.IEditableObject) {
                    element.updatePosition();
                },
                map: parseInt,
            },
            filter: Techne.Extender.Filter.Float
        });
        public positionY = ko.observable().extend({
            min: -50,
            max: 50,
            update: {
                propertyChain: ['minecraftPosition', 'y'],
                callback: function (element: Objects.IEditableObject) {
                    element.updatePosition();
                },
                map: parseInt,
            },
            filter: Techne.Extender.Filter.Float
        });

        public positionZ = ko.observable().extend({
            min: -50,
            max: 50,
            update: {
                propertyChain: ['minecraftPosition', 'z'],
                callback: function (element: Objects.IEditableObject) {
                    element.updatePosition();
                },
                map: parseInt,
            },
            filter: Techne.Extender.Filter.Float
        });

        public sizeX = ko.observable().extend({
            min: 0,
            max: 50,
            update: {
                propertyChain: ['scale', 'x'],
                callback: function (element: Objects.IEditableObject) {
                    element.updateSize();
                },
                map: parseInt,
            },
            filter: Techne.Extender.Filter.Integer
        });

        public sizeY = ko.observable().extend({
            min: 0,
            max: 50,
            update: {
                propertyChain: ['scale', 'y'],
                callback: function (element: Objects.IEditableObject) {
                    element.updateSize();
                },
                map: parseInt,
            },
            filter: Techne.Extender.Filter.Integer
        });

        public sizeZ = ko.observable().extend({
            min: 0,
            max: 50,
            update: {
                propertyChain: ['scale', 'z'],
                callback: function (element: Objects.IEditableObject) {
                    element.updateSize();
                },
                map: parseInt,
            },
            filter: Techne.Extender.Filter.Integer
        });


        public rotationX = ko.observable().extend({
            min: -360,
            max: 360,
            update: {
                propertyChain: ['rotation', 'x'],
                callback: function (element: Objects.IEditableObject) {
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

        public rotationY = ko.observable().extend({
            min: -360,
            max: 360,
            update: {
                propertyChain: ['rotation', 'y'],
                callback: function (element: Objects.IEditableObject) {
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

        public rotationZ = ko.observable().extend({
            min: -360,
            max: 360,
            update: {
                propertyChain: ['rotation', 'z'],
                callback: function (element: Objects.IEditableObject) {
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

        public textureOffsetX = ko.observable().extend({
            min: 0,
            update: {
                propertyChain: ['textureOffset', 'x'],
                callback: function (element: Objects.IEditableObject) {
                    element.updateSize()
                },
                map: parseInt
            },
            filter: Techne.Extender.Filter.Integer
        });

        public textureOffsetY = ko.observable().extend({
            min: 0,
            update: {
                propertyChain: ['textureOffset', 'y'],
                callback: function (element: Objects.IEditableObject) {
                    element.updateSize()
                },
                map: parseInt
            },
            filter: Techne.Extender.Filter.Integer
        });

        public radius = ko.observable().extend({
            min: 0,
            update: {
                propertyChain: ['radius'],
                callback: function (element: Objects.Array) {
                    element.updateArray()
                },
                map: parseInt
            },
            filter: Techne.Extender.Filter.Integer
        });
        public count = ko.observable().extend({
            min: 0,
            update: {
                propertyChain: ['count'],
                callback: function (element: Objects.Array) {
                    element.updateArray()
                },
                map: parseInt
            },
            filter: Techne.Extender.Filter.Integer
        });

        /*
         * sets the opacity of every element except the one equal selected and its children
         */
        public setOpacity(selected: Objects.IObject, opacity: number, elements?: Objects.IObject[]) {
            if (!elements) {
                elements = this.techne.observedChildren()
                }

            for (var index in elements) {
                if (!elements.hasOwnProperty(index)) {
                    continue;
                }
                var element = elements[index];

                if (element == selected) {
                    continue
                 }

                if (element instanceof Objects.CollectionBase) {
                    this.setOpacity(selected, opacity, <Objects.IEditableObject[]><any>(<Objects.EditableCollectionBase>element).observedChildren())
                } else {
                    (<Objects.IVisibleObject><any>element).material.opacity = opacity;
                }
            }
        }

        private setValues(newCurrent: Objects.IEditableObject) {
            console.log("pausing history");
            var oldState = this.pauseHistory;
            this.pauseHistory = true;

            this.selectedTool.objectSelected(newCurrent);
            this.techne.scene.add(this.selectedTool);

            newCurrent.selected(true);

            this.setOpacity(newCurrent, 0.5);

            if (!(newCurrent instanceof Techne.Objects.CollectionBase)) {
                this.textureOffsetX((<Objects.IVisibleEditableObject>newCurrent).textureOffset.x);
                this.textureOffsetY((<Objects.IVisibleEditableObject>newCurrent).textureOffset.y);
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
                this.count((<Objects.Array>newCurrent).count);
                this.radius((<Objects.Array>newCurrent).radius);
            }

            this.pauseHistory = oldState;
            console.log("end pause", oldState);
            
        }

        private resetValues() {
            console.log("pausing history");
            var oldState = this.pauseHistory;
            this.pauseHistory = true;

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

            this.pauseHistory = oldState;

            console.log("end pause", oldState);
        }

        private addToHistory(data: Models.IHistoryModel): void {
            if (!this.pauseHistory) {
                this.history.push(data);

                this.redoHistory.clear();
            }
        }

        /*
         * Sets a new selected object
         */
        public setSelected(newCurrent: Objects.IEditableObject) {
            if (this.techne.current()) {
                this.setOpacity(this.techne.current(), 1.0);
                this.techne.current().selected(false);

                this.techne.scene.remove(this.selectedTool);
            }

            this.techne.current(newCurrent)

            if (newCurrent) {
                this.setValues(newCurrent);
            } else {
                this.resetValues();
            }
        }

        public redo(index?: number) {
            index = index ? index : 0;

            console.log("pausing history");
            var oldState = this.pauseHistory;
            this.pauseHistory = true;

            for (var i = 0; i <= index; i++) {
                var event = this.redoHistory.pop();

                if (event == undefined) {
                    return;
                }

                this.history.push(event);

                var current = this.techne.current();
                if (current != event.element) {
                    this.techne.setSelected(event.element);
                }

                event.target(event.new);
            }

            this.pauseHistory = oldState;

            console.log("end pause", oldState);
        }

        public undo(index?: number) {
            index = index ? index : 0;

            console.log("pausing history");
            var oldState = this.pauseHistory;
            this.pauseHistory = true;

            for (var i = 0; i <= index; i++) {
                var event = this.history.pop();

                if (event == undefined) {
                    return;
                }

                this.redoHistory.push(event);

                var current = this.techne.current();
                if (current != event.element) {
                    this.techne.setSelected(event.element);
                }

                event.target(event.old);
            }

            this.pauseHistory = oldState;

            console.log("end pause", oldState);
        }
    }
}