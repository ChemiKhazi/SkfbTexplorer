import React, { Component } from 'react';
import './carousel.css';

class Carousel extends Component {
  render() {
    var classNames = ["carousel"];

    var contents = null;
    if (!this.props.value) {
      classNames.push("carousel-empty");
    }
    else {
      contents = this.props.value.map(
        (content, index) => (<div className="carousel-item" key={index}>{content}</div>)
      );
      contents = (
        <div className="carousel-content">
          {contents}
        </div>
      );
    }

    var controls = null;
    if (!contents === false) {
      controls = (
        <div className="carousel-controls">
          <span className="carousel-prev carousel-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 501.5 501.5"><g><path fill="#2E435A" d="M302.67 90.877l55.77 55.508L254.575 250.75 358.44 355.116l-55.77 55.506L143.56 250.75z"/></g></svg>
          </span>
          <span className="carousel-next carousel-btn">
              <svg xmlns="http://www.w3.org/2000/svg" width="50" height="50" viewBox="0 0 501.5 501.5"><g><path fill="#2E435A" d="M199.33 410.622l-55.77-55.508L247.425 250.75 143.56 146.384l55.77-55.507L358.44 250.75z"/></g></svg>
          </span>
        </div>
      );
    }

    return (
      <div className={classNames.join(' ')}>
        {contents}
        {controls}
      </div>
    );
  }
}

export default Carousel
