import React, { Component } from 'react';

class TextureSlot extends Component {
  render() {
    var texture = this.props.value;
    var imgStyle = null;
    if (texture.is_pixel)
      imgStyle = "tex-is-pixel";

    return (
      <div className="texture-slot">
        <div className="texture-info">
          <div className="texture-name">{texture.name}</div>
          <div className="texture-sizes">{texture.width} x {texture.height}</div>
        </div>
        <div className="texture-display">
          <img src={texture.thumb_url} alt={texture.name} className={imgStyle} />
        </div>
      </div>
    );
  }
}

export default TextureSlot;
