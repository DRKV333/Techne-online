// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne.Extender {
    export enum Filter {
        Integer,
        Float,
        Alpha,
        AlphaNumerical,
        Positive,
        Negative
    }

    export interface UpdateOptions {
        /*
         * Property chain to update
         * eg ["property1", "second"] will assign object.property1.second a new value
         */
        propertyChain: string[];
        /*
         * a callback with the affected object as parameter
         */
        callback?: (element: Techne.Objects.IObject) => void;
        /*
         * If you want to transform the value before it's assigned
         */
        map?: (value) => any;
    }
}

(<any>ko.extenders).min = function (target, option) {
    var t = target;
    var min = option;
    target.subscribe(function (newValue) {
        if (newValue < min) {
            t(min);
        }
    });
    return target;
};

(<any>ko.extenders).max = function (target, option) {
    var t = target;
    var min = option;
    target.subscribe(function (newValue) {
        if (newValue > min) {
            t(min);
        }
    });
    return target;
};

(<any>ko.extenders).filter = function (target, option) {
    var t = target;
    var filter = option;
    target.subscribe(function (newValue) {
        if (newValue == null || newValue == undefined) {
            return;
        }

        //if (filter & Filter.Integer)
        //    newValue = newValue.toString().replace(/[^\-\d]/, '');
        //if (filter & Filter.Float)
        //    newValue = newValue.toString().replace(/[^\-\d\,\.]/, '');
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

(<any>ko.extenders).update = function (target: KnockoutObservable<any>, options: Techne.Extender.UpdateOptions): KnockoutObservable <any> {
    var propertyChain = options.propertyChain;
    var callback = options.callback;
    var map = options.map;
    var tar = <any>target;

    // subscribe to any changes made to this target
    target.subscribe(function (newValue) {
        // Get the current selected object
        var t = Techne.Editor.Instance.current();

        if (t == undefined || t == null) {
            return;
        }

        // and walk the propertychain
        if (propertyChain.length > 1) {
            for (var i = 0; i <= propertyChain.length - 2; i++) {
                t = t[propertyChain[i]];
            }
        }

        // map the value
        var value = newValue;
        if (map) {
            value = map(newValue);
        }

        var oldValue = t[propertyChain[propertyChain.length - 1]];
        // and assign it
        t[propertyChain[propertyChain.length - 1]] = value;

        if (oldValue != value) {
            var current = Techne.Editor.Instance.current();

            if (callback) {
                callback(current);
            }



            amplify.publish("PropertyChanged", { propertyChain: propertyChain, element: current, old: oldValue, new: value, target: tar, actionType: Techne.Models.HistoryAction.PropertyChanged });

            // maybe call onPropertyChanged on the element directly instead of calling checking hte parent and calling that?
            if (current.logicalParent) {
                current.logicalParent.onChildPropertyChanged(current, 1);
            }
        }

        // whoop
    });
    return target;
};