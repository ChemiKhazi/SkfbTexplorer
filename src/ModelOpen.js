import React, { Component } from 'react';
import './modelopen.css';

class ModelOpen extends Component {

  render() {
    // var modelUrl = 'https://sketchfab.com/models/' + this.props.model;
    return (
      <div id="open-skfb-model">
        <div className="open-ui">
          <label htmlFor='skfbUrl'>Sketchfab URL</label>
          <input id='skfbUrl' type='url'/>
          <button onClick={()=>this.openModelUrl()}>Open</button>
        </div>
        <button className="open-button" onClick={()=>this.toggleShow()}>
          <i className="fa fa-folder-open-o" aria-hidden="true"></i>
        </button>
      </div>
    );
  }

  openModelUrl() {
    var modelUrl = document.getElementById('skfbUrl').value;
    var parts = modelUrl.split('/');
    var modelId = parts[parts.length-1];
    this.props.onOpen(modelId);
    console.log(modelId);
  }

  toggleShow(){
    var ui = document.querySelector("#open-skfb-model>.open-ui");
    if (ui.classList.contains('show'))
      ui.classList.remove('show');
    else
      ui.classList.add('show');
  }

}

export default ModelOpen;
