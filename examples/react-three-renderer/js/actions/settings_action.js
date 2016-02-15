import AppDispatcher from '../app_dispatcher';
import ActionTypes from '../constants';

export default {

  updateModel(e){
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_MODEL,
      model: e.model
    });
  },

  updateCamera(e){
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_CAMERA,
      position: e.position,
      quaternion: e.quaternion
    });
  }
};
