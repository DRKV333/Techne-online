module Techne.File.Definitions {
	export interface ICraftStudioModel {
		formatVersion: number;
		nextUnusednodeID: number;
		nodeCount: number;
		nodes: IModelNode[];
		
		textureData: Uint8Array;
	}

	export interface IModelNode {
		id: number;
		parentId: number;
		name: string;
		position: number[];
		offset: number[];
		scale: number[];
		orientation: number[];
		blockSizeX: number;
		blockSizeY: number;
		blockSizeZ: number;
		textureOffset: ICoordinates2[];
		uvTransformFlags: number[];
		children?: IModelNode[];
	}

	export interface ICoordinates2 {
		x: number;
		y: number;
	}
}