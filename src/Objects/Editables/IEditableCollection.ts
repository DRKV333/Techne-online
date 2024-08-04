module Techne.Objects {
    export interface IEditableCollection extends ICollection {
        /*
         * an observable array that holds the children
         * use this if you want to manipulate .children too
         */
        observedChildren: KnockoutObservableArray<IObject>;

        /*
         * called when a child is added or removed.
         * should be bubbling up to the editor instance
         */
        onChildChanged(child: Objects.IEditableObject, status: string, depth: number): void;
        /*
         * called when a child's property changed.
         * should be bubbling up to the editor instance
         */
        onChildPropertyChanged(child: Objects.IEditableObject, depth: number): void;

        /*
         * Removes the object from the scene or its parent
         * Used to call setSelected in Controller from html
         * NOTE: think about calling it directly so you don't need the singleton anymore (why is there none?)
         */
        removeChild(cube: Objects.IEditableObject): void;

        /*
         * Adds any element of type Objects.IObject to the scene
         */
        addChild(element: Objects.IEditableObject, parent?: Objects.EditableCollectionBase): void;

        techneClone(): IEditableCollection;

        /*
         * returns true if any of this elemen'ts children is rotated
         * This check is needed for block models.
         */
        hasRotatedChild(): boolean;
    }
}