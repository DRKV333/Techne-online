// Copyright (c) Alexander S. Brunner.  Licensed under the Apache License, Version 2.0.  See License.txt in the project root for license information.
module Techne {
    export interface ISettings {
        noRotate?: boolean;
        noPan?: boolean;
        noZoom?: boolean;
        autoRotate?: boolean;
        autoRotateSpeed?: number;
        showRoom?: boolean;
        showGrid?: boolean;

        beforeInit?: () => void;
        afterInit?: () => void;
    }
}