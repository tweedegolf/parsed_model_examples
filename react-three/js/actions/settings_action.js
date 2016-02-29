import AppDispatcher from '../app_dispatcher';
import ActionTypes from '../constants';

export default {

  updateModel(e){
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_MODEL,
      payload: {
        model: e.model
      }
    });
  },

  updateCamera(e){
    AppDispatcher.dispatch({
      type: ActionTypes.UPDATE_CAMERA,
      payload: {
        position: e.position,
        quaternion: e.quaternion
      }
    });
  }
};
