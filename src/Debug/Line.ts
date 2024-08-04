module Techne.Debug {
    export function DrawRay(origin: THREE.Vector3, direction: THREE.Vector3, color: number) {
        Techne.Debug.DrawLine(origin, direction.normalize().multiplyScalar(150), color);
    }

    export function DrawLine(origin: THREE.Vector3, end: THREE.Vector3, color: number) {
        var material = new THREE.LineBasicMaterial({
            color: color
        });
        var geometry = new THREE.Geometry();
        geometry.vertices.push(new THREE.Vector3(origin.x, origin.y, origin.z));
        geometry.vertices.push(new THREE.Vector3(end.x, end.y, end.z));
        var line = new THREE.Line(geometry, material);
        Editor.Instance.scene.add(line);
    }
}