import THREE from 'three';
import React from 'react';
import ReactDOM from 'react-dom';
import React3 from 'react-three-renderer';
import SettingsAction from '../../actions/settings_action';
import OrbitControls from '../../../lib/OrbitControls';


/* scene graph */
class SceneComponent extends React.Component {

  static displayName = 'Scene3D';

  constructor(props) {
    super(props);
    this._orbitControlsHandler = this._onControllerChange.bind(this);
    this._mouseUpListener = this._onMouseUp.bind(this);
    this._renderTrigger = function(){};
    this._onManualRenderTriggerCreated = (renderTrigger) => {
      this._renderTrigger = renderTrigger;
    };
  }

  componentWillReceiveProps(){
  }

  componentDidMount(){
    this._canvas = ReactDOM.findDOMNode(this.refs.react3);
    this._camera = this.refs.camera;
    this._orbitControls = new THREE.OrbitControls(this._camera, this._canvas);
    if(this.props.forceManualRender === true){
      this._orbitControls.addEventListener('change', this._orbitControlsHandler, false);
      this._renderTrigger();
    }else{
      this._canvas.addEventListener('mouseup', this._mouseUpListener, false);
    }
  }

  componentWillUnmount(){
    if(this.props.forceManualRender === true){
      this._orbitControls.removeEventListener('change', this._orbitControlsHandler, false);
    }else{
      this._canvas.removeEventListener('mouseup', this._mouseUpListener, false);
    }
    this._controls.dispose();
  }

  _onControllerChange(e){
    SettingsAction.updateCamera({
      position: this._camera.position,
      quaternion: this._camera.quaternion
    });
  }

  _onMouseUp(e){
    SettingsAction.updateCamera({
      position: this._camera.position,
      quaternion: this._camera.quaternion
    });
  }

  render() {
    let scene = (
      <React3
        ref='react3'
        mainCamera='camera'
        width={window.innerWidth}
        height={window.innerHeight}
        antialias
        shadowMapEnabled={true}
        clearColor={0xffffff}
        forceManualRender={this.props.forceManualRender}
        onManualRenderTriggerCreated={this._onManualRenderTriggerCreated}
      >
        <scene
          ref='scene'
        >
          <perspectiveCamera
            ref='camera'
            name='camera'
            fov={50}
            aspect={window.innerWidth / window.innerHeight}
            near={1}
            far={1000}
            position={this.props.cameraPosition}
            quaternion={this.props.cameraQuaternion}
          />

          <ambientLight
            color={new THREE.Color(0x333333)}
          />

          <directionalLight
            color={new THREE.Color(0xFFFFFF)}
            intensity={1.5}
            position={new THREE.Vector3(0, 0, 60)}
          />

          {this.props.children}

        </scene>
      </React3>
    );
    if(this.props.forceManualRender === true){
      this._renderTrigger();
    }

    return scene;
  }
}

SceneComponent.propTypes = {
  cameraPosition: React.PropTypes.instanceOf(THREE.Vector3),
  cameraQuaternion: React.PropTypes.instanceOf(THREE.Quaterion),
  forceManualRender: React.PropTypes.bool
};

export default SceneComponent;
