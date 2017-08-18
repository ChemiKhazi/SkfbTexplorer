import React, { Component } from 'react';
import './carousel.css';

class Carousel extends Component {

  constructor() {
    super();
    this.state = {
      scrollContent: null,
      scrollMin: 0,
      scrollMax: 0
    };

    this.isUpdating = false;
    this.touchObject = {
      dragging: false,
      originX: 0,
      originY: 0,
      startX: 0,
      startY: 0,
    }
  }

  render() {
    var classNames = ["carousel"];

    var contents = null;
    var controls = null;

    if (!this.props.value) {
      classNames.push("carousel-empty");
    }
    else {
      contents = this.props.value.map(
        (content, index) => (<div className="carousel-item" key={index}>{content}</div>)
      );

      contents = (
        <div className="carousel-scroller">
          <div className="carousel-content">
            {contents}
          </div>
        </div>
      );

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

    document.addEventListener('mouseUp', this.handleInputUp);

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

  shouldComponentUpdate() {
    if (this.isUpdating) {
      this.isUpdating = false;
      return false;
    }
    return true;
  }

  componentDidUpdate() {
    var scrollArea = document.querySelector(".carousel > .carousel-scroller");
    var content = document.querySelector(".carousel > .carousel-scroller > .carousel-content");
    var scrollStyle = window.getComputedStyle(scrollArea, null);
    var contentStyle = window.getComputedStyle(content, null);
    var scrollWidth = parseFloat(scrollStyle['width'].replace('px', ''));
    var contentWidth = parseFloat(contentStyle['width'].replace('px',''));
    var scrollMin = (scrollWidth - contentWidth);
    var scrollMax = 0;
    if (contentWidth < scrollWidth) {
      scrollMin = (scrollWidth / 2) - (contentWidth / 2);
      scrollMax = (scrollWidth - contentWidth) / 2;
    }

    content.style.transform = "translate({x}px, 0)".replace("{x}", scrollMax);
    this.touchObject.originX = scrollMax;

    this.isUpdating = true;
    this.setState({
      scrollContent: content,
      scrollMin: scrollMin,
      scrollMax: scrollMax
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
          dragging: true
        };

        if (!self.touchObject === false) {
          touchObject.originX = self.touchObject.originX;
          touchObject.originY = self.touchObject.originY;
        }

        self.touchObject = Object.assign(self.touchObject, touchObject);
        self.handleClick(e);
      },
      onMouseMove(e) {
        if (!self.touchObject.dragging) {
          return;
        }
        var updateTouch = self.touchObject;
        var xDelta = (e.clientX - updateTouch.startX);
        var targetPosX = updateTouch.originX + xDelta;
        var scrollContent = self.state.scrollContent;
        scrollContent.style.transform = "translate({x}px, 0)".replace("{x}", targetPosX);
        self.touchObject = Object.assign(self.touchObject, updateTouch);
      },
      onMouseUp(e) { self.resetDrag(e); },
      onMouseLeave(e) { },
    };
  }

  getTouchEvents() {
    var self = this;
    return {
      onTouchStart(e) {
        var touchObject = {
          startX: e.touches[0].pageX,
          startY: e.touches[0].pageY,
          dragging: true
        };

        self.touchObject = Object.assign(self.touchObject, touchObject);
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

  resetDrag(e) {
    if (!this.touchObject.dragging) {
      return;
    }
    var updateTouch = this.touchObject;
    var xDelta = (e.clientX - updateTouch.startX);
    var targetPosX = updateTouch.originX + xDelta;
    targetPosX = this.snapContent(targetPosX);
    updateTouch.originX = targetPosX;
    updateTouch.dragging = false;
    this.touchObject = Object.assign(this.touchObject, updateTouch);
  }

  snapContent(targetPosX) {
    targetPosX = Math.max(targetPosX, this.state.scrollMin);
    targetPosX = Math.min(targetPosX, this.state.scrollMax);
    var scrollContent = this.state.scrollContent;
    scrollContent.style.transform = "translate({x}px, 0)".replace("{x}", targetPosX);
    return targetPosX;
  }

  handleClick(e) {
    e.preventDefault();
    e.stopPropagation();

    if (e.nativeEvent) {
      e.nativeEvent.stopPropagation();
    }
  }

  handleInputUp(e) {
    if (this.state.dragging === false)
      return;
    this.resetDrag(e);
  }
}

export default Carousel
