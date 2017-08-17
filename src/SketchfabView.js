import React, { Component } from 'react';
import Sketchfab from 'sketchfab';

class SketchfabView extends Component {

  render() {
		return (
			<iframe src="" id={this.props.id} title={this.props.id} allowFullScreen>
			</iframe>
		);
	}

  componentDidMount() {
    var iframe = document.getElementById(this.props.id);
		var version = '1.0.0';
		var client = new Sketchfab( version, iframe );
    var component = this;

    var options = {};
    var internalOptions = {
	    success: (api) => {
          if (component.props.autoStart)
            api.start();
          if (!component.props.apiCallback === false)
            api.addEventListener('viewerready', () => { component.props.apiCallback(api) });
	    },
      error: () => {
        console.log( 'Viewer error' );
        if (!component.propos.errorCallback === false)
          component.props.errorCallback();
      }
    }

    // Merge the passed option
    if (!this.props.options === false) {
      var optKeys = Object.keys(this.props.options);
      if (optKeys.includes("success")) {
        options["success"] = (api) => {
          component.props.options.success(api);
          internalOptions.success(api);
        };
      }
      else {
        options["success"] = internalOptions.success;
      }

      if (optKeys.includes("error")) {
        options["error"] = () => {
          component.props.options.error();
          internalOptions.error();
        }
      }
      else {
        options["error"] = internalOptions.error;
      }
      options = Object.assign({}, this.props.options, options);
    }
    // No option to merge, just use internalOptions
    else {
      options = internalOptions;
    }

    client.init(this.props.model, options);
  }
}

export default SketchfabView;
