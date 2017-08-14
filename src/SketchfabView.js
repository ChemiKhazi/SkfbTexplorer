import React, { Component } from 'react';
import Sketchfab from 'sketchfab';

class SketchfabView extends Component {

  render() {
		return (
			<iframe src="" id={this.props.id} title={this.props.id} allowFullScreen mozAllowFullScreen="true" webkitAllowFullScreen="true">
			</iframe>
		);
	}

  componentDidMount() {
    var iframe = document.getElementById(this.props.id);
		var version = '1.0.0';
		var client = new Sketchfab( version, iframe );
    var app = this;
    client.init( this.props.model, {
		    success: (api) => {
		        api.start();
		        api.addEventListener( 'viewerready', () => {app.props.apiCallback(api)} );
		    },
		    error: () => { console.log( 'Viewer error' ) },
		    preload: 0
		});
  }
}

export default SketchfabView;
