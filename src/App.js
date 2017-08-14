import React, { Component } from 'react';
import SketchfabView from './SketchfabView'
import './App.css';

class App extends Component {

  constructor() {
    super();

    var model_id = 'faf2095cc3a247a7a8455498642b5450';
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('model'))
        model_id = urlParams.get('model')

    this.state = {
      modelId: model_id,
      materials: null,
      textures: null,
      api: null
    };

  }

  render() {
    var app = this;
    return (
      <div className="App">
        <SketchfabView
          id="sketch-view"
          model={this.state.modelId}
          apiCallback={(api) => app.getApiCallback(api)}
          />
      </div>
    );
  }

  getApiCallback(api) {
    var app = this;
    api.getMaterialList((err, materials) => {
      if (!err === false)
      {
        console.error("Material info load error");
        console.error(err);
        return;
      }

      var textureList = app.processMaterialList(materials);
      api.getTextureList( (err, textures) => {
        if (!err === false)
        {
          console.error("Texture info load error");
          console.error(err);
          return;
        }
        textureList = app.processTextureList(textureList, textures);
        app.setState({
          materials: materials,
          textures: textureList,
          api: api
        });
      });
    });
  }

  processMaterialList(materials) {
    var textureList = {};
    materials.forEach((material, mat_idx) => {
      // Loop through the channels of the material, looking for texture use
      Object.keys(material.channels).forEach((channel) => {
        var channel_data = material.channels[channel];
        if (channel_data.enable === false || channel_data.texture === undefined)
          return;

        var check_list_keys = Object.keys(textureList);
        var texture_uid = channel_data.texture.uid;

        if (check_list_keys.includes(texture_uid) === false) {
          console.log("Creating new entry");
          textureList[texture_uid] = {
            uid: texture_uid,
            materials: [ {mat_id:mat_idx, channels:[]} ],
            is_pixel: false,
            width: 0,
            height: 0,
            source_url: null,
            thumb_url: null
          };
        }

        var mat_list = textureList[texture_uid].materials.filter((entry) => entry.mat_id === mat_idx)[0];
        if (!mat_list === false &&
          !mat_list.channels === false &&
          mat_list.channels.includes(channel) === false) {
            mat_list.channels.push(channel)
          }

        if (channel_data.texture.magFilter === 'NEAREST' ||
            channel_data.texture.minFilter === 'NEAREST') {
              textureList[texture_uid].is_pixel = true;
        }
      });
    });
    return textureList;
  }

  processTextureList(texture_list, textures) {
    var outputList = [];
    var texture_list_keys = Object.keys(texture_list);
    textures.forEach((texture) => {
      if (texture_list_keys.includes(texture.uid) === false)
        return;

      var thumb_width = 0;
      var thumb_height = 0;
      var thumb_url = "";

      var max_width = 0;
      var max_height = 0;
      var source_url = "";
      // Loop through possible images to find thumbnail and actual
      texture.images.forEach((img) => {
        // Images with no option most likely candidate for source
        if (Object.keys(img.options).length === 0) {
          // Find the highest res one
          if (img.width > max_width || img.height > max_height) {
              max_width = img.width;
              max_height = img.height;
              source_url = img.url;
          }
        }
        // Images with options, try to find one 256 and below
        else if (img.width <= 256 && img.height <= 256 && !img.url.endsWith(".gz")) {
            if (img.width > thumb_width || img.height > thumb_height) {
                thumb_width = img.width;
                thumb_height = img.height;
                thumb_url = img.url;
            }
        }
      });
      if (max_width === thumb_width && max_height === thumb_height)
        thumb_url = source_url;

      var textureData = texture_list[texture.uid]
      textureData.width = max_width;
      textureData.height = max_height;
      textureData.thumb_url = thumb_url;
      textureData.source_url = source_url;

      outputList.push(textureData);
    }); // End texture process loop
    return outputList;
  }
}

export default App;
