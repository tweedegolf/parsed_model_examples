import THREE from 'three';
import React from 'react';
import {ParsedModel, createMaterial} from '../../parsed_model';


class Model3D extends React.Component {

  static displayName = 'Model3D';

  constructor(props) {
    super(props);
  }


  render() {

    if(typeof this.props.parsedModel.model === 'undefined'){
      let size = 50;
      return (
        <mesh
          key={THREE.Math.generateUUID()}
          position={new THREE.Vector3(this.props.position.x, this.props.position.y, this.props.position.z)}
        >
          <boxGeometry
            width={size}
            height={size}
            depth={size}
          />
          <meshBasicMaterial
            color={0xcc0000}
          />
        </mesh>
      );
    }

    // render model with merged geometries is not supported because MultiMaterials are not yet supported in react-three-renderer
    // if(this.props.mergeGeometries === true){
    // }


    // render model with separate geometries
    let meshes = [];
    let geometries = this.props.parsedModel.geometries;
    let materialsArray = this.props.parsedModel.materialsArray;
    let materialIndices = this.props.parsedModel.materialIndices;

    geometries.forEach((geometry, uuid) => {
      // get the right material for this geometry using the material index
      let material = materialsArray[materialIndices.get(uuid)];
      // create a react-three-renderer material component
      material = createMaterial(material);

      meshes.push(
        <mesh
          key={uuid}
        >
          <geometry
            vertices={geometry.vertices}
            faces={geometry.faces}
          />
          {material}
        </mesh>
      );
    });

    return(
      <group>
        {meshes}
      </group>
    );
  }
}


Model3D.propTypes = {
  parsedModel: React.PropTypes.instanceOf(ParsedModel),
  mergeGeometries: React.PropTypes.bool,
  position: React.PropTypes.instanceOf(THREE.Vector3),
  quaternion: React.PropTypes.instanceOf(THREE.Quaternion),
  scale: React.PropTypes.number
};

export default Model3D;
