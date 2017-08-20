import React, { Component } from 'react';
import SketchfabView from './SketchfabView';
import Carousel from './Carousel';
import TextureSlot from './TextureSlot';
import TextureSwap from './TextureSwap';
import ModelOpen from './ModelOpen';
import './App.css';

class App extends Component {

  constructor() {
    super();
    this.defaultModel = 'a7cb34de4c044092b094d73953ab5acb';

    var model_id = this.defaultModel;
    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('model'))
      model_id = urlParams.get('model')

    this.state = {
      modelId: model_id,
      materials: null,
      textures: null,
      api: null,
      focusIndex: -1
    };

  }

  render() {
    var textureSlots = null;
    var self = this;
    if (!this.state.textures === false) {
      textureSlots = this.state.textures.map((tex, i) => (
        <TextureSlot
          value={tex}
          onOpen={()=>self.viewTexture(i)}
          onSwap={()=>self.swapTextureUI(i)}
          />
      ));
    }

    var swapTexture = null;
    if (this.state.focusIndex > -1 && this.state.focusIndex < this.state.textures.length)
      swapTexture = this.state.textures[this.state.focusIndex];

    return (
      <div className="App">
        <SketchfabView
          id="sketch-view"
          model={this.state.modelId}
          autoStart={true}
          apiCallback={(api) => self.getApiCallback(api)}
          />
        <Carousel value={textureSlots}/>
        <TextureSwap
          edit={swapTexture}
          onClose={() => self.setState({focusIndex: -1})}
          onSwap={(url) => self.swapTextureOperation(url)}
          onReset={() => self.resetTexture()}
          />
        <ModelOpen
          model={this.state.modelId}
          onOpen={(url) => self.openModelUrl(url)}
          />
      </div>
    );
  }

  openModelUrl(url) {
    if (this.state.modelId === url)
      return;

    var urlParams = new URLSearchParams(window.location.search);
    if (urlParams.has('model'))
      urlParams.delete('model');
    urlParams.append('model', url);

    window.location.search = urlParams.toString();
  }

  viewTexture(textureIndex) {
    console.log("open", textureIndex);
    window.open(this.state.textures[textureIndex].source_url)
  }

  swapTextureUI(textureIndex) {
    console.log("swap", textureIndex);
    this.setState({
      focusIndex: textureIndex
    })
  }

  swapTextureOperation(textureUrl) {
    this.swapTextureOpIndex(textureUrl, this.state.focusIndex);
  }

  swapTextureOpIndex(textureUrl, index){
    if (index < 0 || index >= this.state.textures.length)
      return;

    var self = this;
    var targetTexture = this.state.textures[index];
    this.swapTextureCommand(textureUrl, targetTexture, () => {
      var updateTextures = self.state.textures;
      updateTextures[index].replaceUrl = textureUrl;
      self.setState({
        textures: updateTextures,
        focusIndex: -1
      });
      self.rebuildUrlHistory();
    });
  }

  swapTextureCommand(textureUrl, targetTexture, callback=null) {
    var targetUid = targetTexture.uid;
    this.state.api.updateTexture(textureUrl, targetUid, (err, textureUid) => {
      if (!err === false)
        return;
      if (!callback === false)
        callback();
    });
  }

  resetTexture() {
    var index = this.state.focusIndex;
    var targetTexture = this.state.textures[index];
    if (!targetTexture.replaceUrl)
      return;

    var targetUid = targetTexture.uid;
    var self = this;

    this.state.api.updateTexture(targetTexture.source_url, targetUid, (err, textureUid) => {
      if (!err === false)
        return;
      var updateTextures = self.state.textures;
      delete updateTextures[index]['replaceUrl'];
      self.setState({
        textures: updateTextures,
        focusIndex: -1
      });
      this.rebuildUrlHistory();
    });
    this.setState({focusIndex: -1});
  }

  rebuildUrlHistory() {
    var urlParams = new URLSearchParams(window.location.search);
    if (this.state.modelId !== this.defaultModel) {
      if (urlParams.has('model'))
        urlParams.set('model', this.state.modelId);
      else
        urlParams.append('model', this.state.modelId);
    }
    this.state.textures.forEach((texture, idx) => {
      var texParam = 't' + idx;
      if (!texture.replaceUrl || texture.replaceUrl.startsWith('data')) {
        urlParams.delete(texParam);
        return;
      }
      if (urlParams.has(texParam))
        urlParams.set(texParam, texture.replaceUrl);
      else
        urlParams.append(texParam, texture.replaceUrl);
    });
    window.history.pushState({}, '', '?' + urlParams.toString());
    console.log(urlParams.toString());
  }

  getApiCallback(api) {
    var app = this;
    // Request materials
    api.getMaterialList((err, materials) => {
      if (!err === false)
      {
        console.error("Material info load error");
        console.error(err);
        return;
      }
      // Process the materials to get the texture uids
      var textureList = app.processMaterialList(materials);
      // Request textures
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
          texActual: textures,
          api: api
        });
        // Process replaced textures to swap them
        textureList.forEach((texture) => {
          if (!texture.replaceUrl)
            return;
          app.swapTextureCommand(texture.replaceUrl, texture);
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
          textureList[texture_uid] = {
            uid: texture_uid,
            materials: [ {mat_id:mat_idx, channels:[]} ],
            is_pixel: false,
            width: 0,
            height: 0,
            source_url: null,
            thumb_url: null,
            name: null
          };
        }

        var mat_list = textureList[texture_uid].materials.filter((entry) => entry.mat_id === mat_idx)[0];
        if (!mat_list === false && !mat_list.channels === false &&
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
    var urlParams = new URLSearchParams(window.location.search);

    var outputList = [];
    var texture_list_keys = Object.keys(texture_list);
    textures.forEach((texture) => {
      if (texture_list_keys.includes(texture.uid) === false)
        return;

      var thumb_width = 0;
      var thumb_height = 0;
      var thumb_url = "";

      var max_size = 0;
      var max_width = 0;
      var max_height = 0;
      var source_url = "";
      if (texture.images.length == 1) {
        var texImg = texture.images[0];
        max_width = texImg.width;
        max_height = texImg.height;
        source_url = texImg.url;
        thumb_url = texImg.url;
      }
      else {
        // Loop through possible images to find thumbnail and actual
        texture.images.forEach((img) => {
          // Find the highest file size as the source url
          if (img.size > max_size) {
            max_size = img.size;
            max_width = img.width;
            max_height = img.height;
            source_url = img.url;
          }
          // Images with options, try to find one 256 and below
          if (img.width <= 256 && img.height <= 256 && !img.url.endsWith(".gz")) {
            if (img.width > thumb_width || img.height > thumb_height) {
              thumb_width = img.width;
              thumb_height = img.height;
              thumb_url = img.url;
            }
          }
        });
        if (max_width === thumb_width && max_height === thumb_height)
          thumb_url = source_url;
      }

      var textureData = texture_list[texture.uid]
      textureData.width = max_width;
      textureData.height = max_height;
      textureData.thumb_url = thumb_url;
      textureData.source_url = source_url;
      textureData.name = texture.name;

      var texIndex = outputList.length;
      var paramName = "t" + texIndex;
      if (urlParams.has(paramName)) {
        textureData.replaceUrl = urlParams.get(paramName);
      }
      outputList.push(textureData);
    }); // End texture process loop
    return outputList;
  }
}

export default App;
