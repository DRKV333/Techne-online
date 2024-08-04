module Techne.File.Importer {
	export class CraftStudioImporter implements IImporter<ArrayBuffer> {
		private result: IImportResult = {
            textureSize: [64, 32],
            data: []
        };
        private nodes: { [index:number]: File.Definitions.IModelNode } = {}

        private reader: BinaryReader;

        constructor(private techne: TechneBase) {
        }

		public import(data: ArrayBuffer): IImportResult {
			this.reader = new BinaryReader(data);

			this.reader.ReadUInt8();
			var formatVersion = this.reader.ReadUInt16();

			if (formatVersion !== 5) {
				throw new Error("unsupported file-version");
			}

			var nextUnusedNodeID = this.reader.ReadUInt16();
			var nodeCount = this.reader.ReadUInt16();

			var nullElement = this.techne.createNullElement("imported Model", [0, 0, 0], [0, 0, 0]);
            //this.addElement(nullElement);

            for (var i = 0; i < nodeCount; i++) {
            	this.parseNode();
            }

            var tmp: File.Definitions.IModelNode[] = [];
            for (var key in this.nodes) {
    			if (this.nodes.hasOwnProperty(key)) {
        			var value = this.nodes[key];

        			if (value.parentId !== 65535) {
        				this.nodes[value.parentId].children.push(value);
        			} else {
        				tmp.push(value);
        			}
    			}
			}            

      this.addElement(tmp, nullElement);
      this.result.data.push(nullElement);

      return this.result;
		}

    /*
     * adds an element to either the passed parent object or if that's null to the top level result instance
     */
    private addElement(elements: File.Definitions.IModelNode[], parent: Objects.NullElement) {
      for (var key in elements) {
          if (elements.hasOwnProperty(key)) {
              var value = elements[key];

              var rotation = new THREE.Euler().setFromQuaternion(new THREE.Quaternion(value.orientation[0], value.orientation[1], value.orientation[2], value.orientation[3]), "ZYX")
              var nullElement = this.techne.createNullElement(value.name, this.convertFromCS(value.position.map((val) => val*16)), [rotation.x, rotation.y, rotation.z]);
                nullElement.addChild(this.techne.createCube(value.name, [value.blockSizeX, value.blockSizeY, value.blockSizeZ], this.convertFromCS(value.offset), [0, 0, 0], [0, 0, 0]));
                parent.addChild(nullElement);

                if (value.children) {
                  this.addElement(value.children, nullElement);
                }
        }
      }
    }

		private parseNode() {
			var id = this.reader.ReadUInt16();
			var parentNodeId = this.reader.ReadUInt16();
			var name = this.reader.ReadString();
			var position = this.reader.ReadVector3();
			var offset = this.reader.ReadVector3();
			var scale = this.reader.ReadVector3();
			var rotation = this.reader.ReadQuaternion();
			var sizeX = this.reader.ReadUInt16();
			var sizeY = this.reader.ReadUInt16();
			var sizeZ = this.reader.ReadUInt16();
			var wrapMode = this.reader.ReadUInt8();
			var offset0 = this.reader.ReadPoint();
			var offset1 = this.reader.ReadPoint();
			var offset2 = this.reader.ReadPoint();
			var offset3 = this.reader.ReadPoint();
			var offset4 = this.reader.ReadPoint();
			var offset5 = this.reader.ReadPoint();
			var uvTransform0 = this.reader.ReadUInt8();
			var uvTransform1 = this.reader.ReadUInt8();
			var uvTransform2 = this.reader.ReadUInt8();
			var uvTransform3 = this.reader.ReadUInt8();
			var uvTransform4 = this.reader.ReadUInt8();
			var uvTransform5 = this.reader.ReadUInt8();

			console.log(position);

			this.nodes[id] = {
				id: id,
				parentId: parentNodeId,
				name: name,
				position: position,
				offset: offset,
				scale: scale,
				orientation: rotation,
				blockSizeX: sizeX,
				blockSizeY: sizeY,
				blockSizeZ: sizeZ,
				textureOffset: [offset0, offset1, offset2, offset3, offset4, offset5],
				uvTransformFlags: [uvTransform0, uvTransform1, uvTransform2, uvTransform3, uvTransform4, uvTransform5 ],
				children: []
			}
		}

		private convertFromCS(vec: number[]) {
			vec[0] = vec[0] - 8;
            vec[1] = (vec[1] - 12) * (-1);
            vec[2] = vec[2] - 8;
            return vec;
        }
	}

// CoffeeScript taken from
// https://gist.github.com/elisee/5580599	
	class BinaryReader {
		private view: DataView;
		private cursor: number;
		public static DecodeString: (array) => string;
 
  		constructor (buffer) {
    		this.view = new DataView(buffer)
    		this.cursor = 0
    		BinaryReader.DecodeString = (array) => String.fromCharCode.apply(null, array);
    		//if (window.TextDecoder) {
    			//var textDecoder = new TextDecoder()
    			//BinaryReader.DecodeString = (array) => { return textDecoder.decode(array); };
  			//} else {
	    		//BinaryReader.DecodeString = (array) => String.fromCharCode.apply(null, array);
			//}
		}
	  
  		public ReadUInt8() {
    		var val = this.view.getUint8(this.cursor)
    		this.cursor += 1
    		return val;
		}
	  
  		ReadUInt16() {
    		var val = this.view.getUint16(this.cursor, true)
    		this.cursor += 2
	 		return val;
		}
  
  		ReadInt32() {
    		var val = this.view.getInt32(this.cursor, true)
    		this.cursor += 4
 			return val;
		}
  
  		ReadUInt32() {
    		var val = this.view.getUint32(this.cursor, true)
    		this.cursor += 4
 			return val;
		}
  
  		ReadFloat32() {
    		var val = this.view.getFloat32(this.cursor, true)
    		this.cursor += 4
 			return val;
		}
  
  		ReadFloat64() {
    		var val = this.view.getFloat64(this.cursor, true)
    		this.cursor += 8
 			return val;
		}
  
  		Read7BitEncodedInt() {
    		var returnValue = 0
    		var bitIndex = 0
    		while (true) {
    			if (bitIndex != 35) {
        			var num = this.ReadUInt8();
        			returnValue |= (num & 127) << bitIndex;
        			bitIndex += 7;
    			} else {
        			throw new Error("Invalid 7-bit encoded int");
    			}
    			if (!((num & 128) != 0)) {
      				break;
    			}
			}
    		return returnValue;
  		}

  		public ReadBoolean() { 
  			return this.ReadUInt8() != 0;
  		}
  
		public ReadString() {
    		var length = this.Read7BitEncodedInt();
    		var val = BinaryReader.DecodeString(new Uint8Array((<any>this.view.buffer).slice(this.cursor, this.cursor + length)));
    		this.cursor += length;
    		return val;;
		}
  
  		ReadPoint() { return { x: this.ReadInt32(), y: this.ReadInt32() }; }
  		ReadVector2() { return [this.ReadFloat32(), this.ReadFloat32()]; }
  		ReadVector3() { return [this.ReadFloat32(), this.ReadFloat32(), this.ReadFloat32()]; }
  		ReadIntVector3() { return [this.ReadInt32(), this.ReadInt32(), this.ReadInt32()]; }
	  
  		ReadQuaternion() {
    		var w = this.ReadFloat32();
    		return [this.ReadFloat32(), this.ReadFloat32(), this.ReadFloat32(), w]
    	}
  
  		ReadBytes(length) {
    		var bytes = new Uint8Array((<any>this.view.buffer).slice(this.cursor, this.cursor + length));
    		this.cursor += length;
    		return bytes;
    	}
	}
}