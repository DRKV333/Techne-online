// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne.Objects {
    export interface IEditableObject extends IObject {
        /*
         * true if the cube is currently selected
         */
        selected: KnockoutObservable<boolean>;
        
        /*
         * Observed version of the name property
         */
        observedName: KnockoutObservable<string>;
        /*
         * idk why I'm using this too...
         */
        publicName: KnockoutComputed<string>;

        logicalParent: IEditableCollection;

        techneClone(): IEditableObject;

        /*
         * Toggles this elements's visibility
         */
        toggleVisibility(visibility?: boolean): void;
    }
}