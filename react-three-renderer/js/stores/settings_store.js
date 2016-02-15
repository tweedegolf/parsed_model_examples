import THREE from 'three';
import EventEmitter from 'events';
import ActionTypes from '../constants';
import AppDispatcher from '../app_dispatcher';
import Globals from '../globals';
import ParsedModel from '../../lib/parsed_model';

let CHANGE_EVENT = 'change';


class SettingsStore extends EventEmitter {

  constructor () {
    super();

    this.worldRotation = Globals.WORLD_ROTATION;
    this.cameraPosition = new THREE.Vector3(0, 300, 500);
    this.cameraQuaternion = new THREE.Quaternion();
    this.mergeGeometries = false;
    this.parsedModel = new ParsedModel();
    // add a bit delay so you can see what is happening
    setTimeout(() => {
      this.parsedModel.load('bbq.json', {scale: 0.6}).then(
        //resolve
        () =>{
          this.emitChange();
        }
      );
    }, 3000);

    AppDispatcher.register((action) => {
      this.handle(action);
    });
  }

  emitChange() {
    this.emit(CHANGE_EVENT);
  }

  addChangeListener(callback) {
    this.on(CHANGE_EVENT, callback);
  }

  removeChangeListener(callback) {
    this.removeListener(CHANGE_EVENT, callback);
  }

  getSettings() {

    let settings = {
      mergeGeometries: this.mergeGeometries,
      parsedModel: this.parsedModel,
      worldRotation: this.worldRotation,
      cameraPosition: this.cameraPosition,
      cameraQuaternion: this.cameraQuaternion
    };
    return settings;
  }

  handle(action) {
    switch(action.type) {

      case ActionTypes.UPDATE_CAMERA:
        this.cameraPosition = action.position;
        this.cameraQuaternion = action.quaternion;
        this.emitChange();
        break;

      default:
      // do nothing
    }
  }
}

export default new SettingsStore();
