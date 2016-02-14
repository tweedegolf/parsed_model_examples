import THREE from 'three';
import ColladaLoader from '../lib/ColladaLoader';


export default class ParsedModel{

  constructor(model, settings){
    this._colladaLoader = new THREE.ColladaLoader();
    this._objectLoader = new THREE.ObjectLoader();
    this._parseSettings(settings || {});
    if(typeof model !== 'undefined'){
      this._parse(model);
    }
  }

  _parseSettings(settings){
    this.quaternion = settings.quaternion || new THREE.Quaternion();
    this.scale = settings.scale || new THREE.Vector3(1, 1, 1);
    if(typeof this.scale === 'number'){
      let s = this.scale;
      this.scale = new THREE.Vector3(s, s, s);
    }
  }

  _parse(model){
    this.model = model;
    this.name = model.name;
    this.geometries = new Map();
    this.materialIndices = new Map();
    this.materialsArray = [];
    this.merge = true;

    // adjust the rotation of the model according to the rotation of the world
    this.model.quaternion.copy(this.quaternion);
    this.model.scale.copy(this.scale);
    this.model.updateMatrix();

    let index = 0;
    this.model.traverse((child) => {
      if(child instanceof THREE.Mesh){
        // create an array of the use materials
        let uuid = child.material.uuid;
        this.materialIndices.set(uuid, index++);
        this.materialsArray.push(child.material);
        this.geometries.set(uuid, child.geometry);
      }
    });
    //console.log('number of geometries merged', index);

    // create multimaterial
    this.material = new THREE.MeshFaceMaterial(this.materialsArray);

    let merged = new THREE.Geometry();
    // merge the geometry and apply the matrix of the new position
    this.geometries.forEach((g, uuid) => {
      merged.merge(g, this.model.matrix, this.materialIndices.get(uuid));
    });

    this.mergedGeometry = new THREE.BufferGeometry().fromGeometry(merged);
  }

  load(url, settings){
    if(typeof settings !== 'undefined'){
      this._parseSettings(settings);
    }
    if(typeof url !== 'string'){
      url = 'none';
    }
    url = url || 'none';
    let p;
    let type = url.substring(url.lastIndexOf('.') + 1).toLowerCase();

    switch(type){
      case 'dae':
      case 'collada':
        p = this.loadCollada(url);
        break;
      case 'json':
        p = this.loadJSON(url);
        break;
      default:
        p = new Promise((resolve, reject) => {
          reject('wrong data provided');
        });
    }
    return p;
  }

  loadCollada(url, settings){
    if(typeof settings !== 'undefined'){
      this._parseSettings(settings);
    }

    return new Promise((resolve, reject) => {
      this._colladaLoader.load(
        url,
        // success callback
        (data) => {
          this._parse(data.scene);
          resolve();
        },
        // progress callback
        () => {},
        // error callback
        (error) => {
          reject(error);
        }
      );
    });
  }

  loadJSON(url, settings){
    if(typeof settings !== 'undefined'){
      this._parseSettings(settings);
    }

    return new Promise((resolve, reject) => {
      this._objectLoader.load(
        url,
        // success callback
        (data) => {
          this._parse(data);
          resolve();
        },
        // progress callback
        () => {},
        // error callback
        (error) => {
          reject(error);
        }
      );
    });
  }
}
