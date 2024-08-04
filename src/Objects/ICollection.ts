module Techne.Objects {
    export interface ICollection extends IObject {
        /*
         * Gets an array of objects the exporter will use.
         */
        getChildrenForExport(): Objects.IObject[];
    }
}