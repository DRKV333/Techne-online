// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne.File.Exporter {
    export interface IExporter<T> {
        /*
         * Exports the objects
         * (helpful)
         */
        export(objects: Objects.IObject[]): T;
    }
}