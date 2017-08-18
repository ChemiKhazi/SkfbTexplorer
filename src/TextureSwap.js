import React, { Component } from 'react';
import './textureswap.css';

class TextureSwap extends Component {

  constructor() {
    super();
    this.state = {
      dropTarget: null,
      fileTarget: null,
      textureUrl: null
    }
  }

  render() {
    var classNames = ['sketchfab-tex-swap'];
    var info = null;
    var imgSrc = null;
    var imgClass = null;
    var resetBtn = null;
    if (!this.props.edit) {
      classNames.push('ui-closed');
    }
    else {
      info = (
        <div className='swap-texture-info'>
          <ul>
            <li>{this.props.edit.name}</li>
            <li>{this.props.edit.width}x{this.props.edit.height}</li>
          </ul>
        </div>
      );

      imgSrc = this.props.edit.thumb_url;
      if (this.props.edit.is_pixel)
        imgClass = 'is-pixel';

      if (!this.props.edit.replaceUrl === false) {
        imgSrc = this.props.edit.replaceUrl;
        resetBtn = (<button onClick={() => this.handleReset()}>Reset Texture</button>);
      }
    }

    return (
      <div className={classNames.join(' ')}>
        <div className='swap-ui'>
          {info}
          {/*<div className='swap-url'>
            <label>URL <input id='swapImageUrl' type='url' /></label>
            <button onClick={() => this.handleSwapURL()}>Swap by URL</button>
          </div>*/}
          <div className='swap-file'>
            <div id='swapDropZone' className='drag-out'>
              <img alt='Drop Swap Texture Here' className={imgClass} src={imgSrc} />
            </div>
            <label>File <input id='swapImageFile' type='file' /></label>
            <button onClick={() => this.handleSwapFile()}>Swap Texture</button>
          </div>
          {resetBtn}
          <button onClick={() => this.handleCloseButton()}>Close</button>
        </div>
      </div>
    );
  }

  handleSwapURL() {}

  handleSwapFile() {
    if (!this.state.textureUrl)
      return;
    this.resetInputs();
    this.props.onSwap(this.state.textureUrl);
  }

  handleReset() {
    if (!this.props.onReset)
      return;
    this.resetInputs();
    this.props.onReset();
  }

  handleCloseButton() {
    this.resetInputs();
    this.setState({textureUrl: null});
    this.props.onClose();
  }

  resetInputs() {
    document.getElementById('swapImageFile').value = null;
    var preview = document.querySelector('#swapDropZone>img');
    preview.src = null;
  }

  componentDidMount() {
    var self = this;
    var dropTarget = document.getElementById('swapDropZone');
    dropTarget.addEventListener('dragover', (e) => {
      self.stopEventProp(e);
      self.state.dropTarget.classList.remove('drag-out');
      self.state.dropTarget.classList.add('drag-enter');
    })
    dropTarget.addEventListener('dragleave', (e) => {
      self.stopEventProp(e);
      self.state.dropTarget.classList.remove('drag-enter');
      self.state.dropTarget.classList.add('drag-out');
    })
    dropTarget.addEventListener('drop', (e) => {
      self.stopEventProp(e);
      self.state.dropTarget.classList.remove('drag-enter');
      self.state.dropTarget.classList.add('drag-out');
      var dt = e.dataTransfer;
      var files = dt.files;
      self.handleFilesUpdate(files);
      self.state.fileTarget.files = files;
    });

    var fileTarget = document.getElementById('swapImageFile');
    fileTarget.addEventListener('change', (e) => {
      self.handleFilesUpdate(self.state.fileTarget.files);
    });

    this.setState({
      dropTarget: dropTarget,
      fileTarget: fileTarget
    });
  }

  handleFilesUpdate(files) {
    if (files.length < 1) {
      var preview = document.querySelector('#swapDropZone>img');
      preview.src = null;
      return;
    }

    for (var i = 0; i < files.length; i++) {
      var file = files[i];
      var imageType = /^image\//;
      if (!imageType.test(file.type))
        continue;
      var reader = new FileReader();
      reader.onload = (e) => {
        var preview = document.querySelector('#swapDropZone>img');
        preview.src = e.target.result;
        this.setState({
          textureUrl: e.target.result
        });
      };
      reader.readAsDataURL(file);
      break;
    }
  }

  stopEventProp(e) {
    e.stopPropagation();
    e.preventDefault();
  }
}

export default TextureSwap;
