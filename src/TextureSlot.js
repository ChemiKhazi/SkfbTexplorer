import React, { Component } from 'react';
import './textureslot.css';

class TextureSlot extends Component {
  render() {
    var texture = this.props.value;
    var imgStyle = null;
    if (texture.is_pixel)
      imgStyle = "tex-is-pixel";
    var imgUrl = texture.thumb_url;
    if (!texture.replaceUrl === false)
      imgUrl = texture.replaceUrl;

    return (
      <div className="texture-slot">
        <div className="texture-info">
          <div className="texture-name">{texture.name}</div>
          <div className="texture-sizes">{texture.width} x {texture.height}</div>
        </div>
        <div className="texture-display">
          <img src={imgUrl} alt={texture.name} className={imgStyle} />
          <div className="texture-controls">
            <button className="tex-zoom" onClick={() => this.props.onOpen()}>
              <i className="fa fa-search" aria-hidden="true"></i>
            </button>
            <button className="tex-update" onClick={() => this.props.onSwap()}>
              <i className="fa fa-folder-open-o" aria-hidden="true"></i>
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default TextureSlot;
