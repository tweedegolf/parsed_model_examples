import THREE from 'three';
import React from 'react';
import ReactTHREE from 'react-three';

let Mesh = ReactTHREE.Mesh;
let Object3D = ReactTHREE.Object3D;

class Model3D extends React.Component {

  static displayName = 'Model3D';

  constructor(props) {
    super(props);
  }


  render() {

    if(typeof this.props.parsedModel.model === 'undefined'){
      let size = 50;
      return (
        <Mesh
          geometry={new THREE.BoxGeometry(size, size, size)}
          key={THREE.Math.generateUUID()}
          material={new THREE.MeshBasicMaterial({color: 0xcc0000})}
          position={this.props.position}
          scale={this.props.scale}
        />
      );
    }

    // render model with merged geometries
    if(this.props.parsedModel.merge){
      let geometry = this.props.parsedModel.mergedGeometry;
      let material = this.props.parsedModel.material;
      return(
        <Mesh
          geometry={geometry}
          key={THREE.Math.generateUUID()}
          material={material}
          position={this.props.position}
          scale={this.props.scale}
        />
      );
    }


    // render model with separate geometries
    let children = [];
    let geometries = this.props.parsedModel.geometries;
    let materialsArray = this.props.parsedModel.materialsArray;
    let materialIndices = this.props.parsedModel.materialIndices;

    geometries.forEach((geometry, uuid) => {
      let material = materialsArray[materialIndices.get(uuid)];
      //console.log(materialIndices.get(uuid), material);
      children.push(
        <Mesh
          key={uuid}
          geometry={geometry}
          material={material}
        />
      );
    });

    return (
      <Object3D
        key={THREE.Math.generateUUID()}
        quaternion={this.props.parsedModel.quaternion}
        position={this.props.position}
        scale={this.props.scale}
      >
        {children}
      </Object3D>
    );
  }
}


Model3D.propTypes = {
  model: React.PropTypes.object,
  position: React.PropTypes.instanceOf(THREE.Vector3),
  quaternion: React.PropTypes.instanceOf(THREE.Quaternion),
  scale: React.PropTypes.number
};

export default Model3D;
