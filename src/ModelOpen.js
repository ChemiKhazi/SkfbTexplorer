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
          <i className="fa fa-folder-open" aria-hidden="true"></i>
        </button>
        <button className='about-button' onClick={()=>this.showInfo()}>
          <i className="fa fa-question-circle" aria-hidden="true"></i>
        </button>
        <div className='info-box closed' onClick={()=>this.closeInfo()}>
          <div onClick={(e)=>this.interceptClick(e)}>
            <h1>Sketchfab Texture Explorer</h1>
            <p>
            A tool to view and modify the textures on Sketchfab models.
            </p>
            <p>
            Built by Jeiel Aranal (<a href='https://twitter.com/chemikhazi'>@chemikhazi</a>) with React.
            </p>
            <p>
            If you like this utility, <a href="https://ko-fi.com/subjectnerd">buy me a coffee</a>!
            </p>
            <button onClick={()=>this.closeInfo()}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  interceptClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.nativeEvent) {
      e.nativeEvent.stopPropagation();
    }
  }

  showInfo() {
    var box = document.querySelector('#open-skfb-model>.info-box');
    box.classList.remove('closed');
    box.classList.add('transition');
    setTimeout(()=>box.classList.remove('transition'), 1);
  }
  closeInfo() {
    var box = document.querySelector('#open-skfb-model>.info-box');
    box.classList.add('transition');
    setTimeout(() => {
      box.classList.remove('transition');
      box.classList.add('closed');
    }, 500);
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
