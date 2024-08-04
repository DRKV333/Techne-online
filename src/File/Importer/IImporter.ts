// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne.File.Importer {
    export interface IImporter<T> {
        /*
         * Passed any data you get a properly formatted instance of IImportResult back
         */
        import(data: T): IImportResult;
    }
}