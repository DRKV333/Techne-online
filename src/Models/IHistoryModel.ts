module Techne.Models {
    export enum HistoryAction {
        PropertyChanged,
        Removed,
        Added,
        ParentChanged
    }

    export interface IHistoryModel {
        propertyChain?: string[];
        element: Techne.Objects.IEditableObject;
        old;
        new;
        target: (value) => void;
        actionType: HistoryAction
    }        
}