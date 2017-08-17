import React, { Component } from 'react';
import './carousel.css';

class Carousel extends Component {

  constructor() {
    super();
    this.state = {
      touchObject: null,
      dragging: false,
      scrollContent: null
    };
  }

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
    }

    contents = (
      <div className="carousel-scroller">
        <div className="carousel-content">
          {contents}
        </div>
      </div>
    );

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
      <div className={classNames.join(' ')}
        {...this.getTouchEvents()}
        {...this.getMouseEvents()}
        onClick={this.handleClick}
        >
        {contents}
        {controls}
      </div>
    );
  } // End render

  componentDidMount() {
    var content = document.querySelector(".carousel > .carousel-scroller > .carousel-content");
    console.log("content " + content);
    this.setState({
      scrollContent: content
    });
  }

  getMouseEvents() {
    var self = this;

    return {
      onMouseDown(e) {
        var touchObject = {
          originX: 0,
          originY: 0,
          startX: e.clientX,
          startY: e.clientY,
        };

        if (!self.state.touchObject === false) {
          touchObject.originX = self.state.touchObject.originX;
          touchObject.originY = self.state.touchObject.originY;
        }

        self.setState({
          dragging: true,
          touchObject: touchObject
        });
        self.handleClick(e);
      },
      onMouseMove(e) {
        if (!self.state.dragging) {
          return;
        }
        var updateTouch = self.state.touchObject;
        var xDelta = (e.clientX - updateTouch.startX);
        var targetPosX = updateTouch.originX + xDelta;
        self.state.scrollContent.style.transform = "translate({x}px, 0)".replace("{x}", targetPosX);
        self.setState({touchObject: updateTouch})
      },
      onMouseUp(e) {
        if (!self.state.dragging) {
          return;
        }
        var updateTouch = self.state.touchObject;
        var xDelta = (e.clientX - updateTouch.startX);
        var targetPosX = updateTouch.originX + xDelta;
        updateTouch.originX = targetPosX;
        self.setState({
          dragging: false,
          touchObject: updateTouch
        });
      },
      onMouseLeave(e) {
        if (!self.state.dragging) {
          return;
        }
        self.setState({
          dragging: false,
        });
      },
    };
  }

  getTouchEvents() {
    var self = this;
    return {
      onTouchStart(e) {
        var touchObject = {
          startX: e.touches[0].pageX,
          startY: e.touches[0].pageY
        };

        self.setState({
          dragging: true,
          touchObject: touchObject
        });
        self.handleClick(e);
      },
      onTouchMove(e) {

      },
      onTouchEnd(e) {
      },
      onTouchCancel(e) {
      },
    };
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.nativeEvent) {
      e.nativeEvent.stopPropagation();
    }
  }
}

export default Carousel
