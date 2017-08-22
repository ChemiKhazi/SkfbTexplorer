# Sketchfab Texture Explorer

A React app built on top of the [Sketchfab Viewer API](https://sketchfab.com/developers/viewer/) that allows users to view the textures of a model and swap them with another texture loaded from the internet or from the local file system.

![Usage Demo GIF](http://i.imgur.com/P88R18O.gif)

## Explorer Usage

The explorer can be used [on the github.io page](https://chemikhazi.github.io/SkfbTexplorer/). To load a model, press the folder button on the top left corner and enter a URL to a sketchfab model.

The textures for the model are displayed in the carousel below. Press the folder button on the left to load a different texture from the internet or your local file system.

Textures uploaded to imgur can be loaded with this tool, be sure to use the direct link when using imgur (formatted http://i.imgur.com/<filename>).

The generated URL will [automatically load your edited textures](https://chemikhazi.github.io/SkfbTexplorer/?t0=https://i.imgur.com/bYUAMY2.png) when shared with others.

If you wish to experiment with textures using the default model, here are alternate textures you can try loading:

* http://i.imgur.com/m4sgmw4.png
* http://i.imgur.com/bYUAMY2.png
* http://i.imgur.com/MoObMCP.png

## Caveats

* Only tested in Chrome
* Not working on mobile
* UI is a work in progress