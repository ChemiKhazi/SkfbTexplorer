String.prototype.format = String.prototype.f = function() {
    var s = this,
        i = arguments.length;

    while (i--) {
        s = s.replace(new RegExp('\\{' + i + '\\}', 'gm'), arguments[i]);
    }
    return s;
};

var iframe = document.getElementById( 'api-frame' );
var version = '1.0.0';
var urlid = 'faf2095cc3a247a7a8455498642b5450';

var urlParams = new URLSearchParams(window.location.search);
if (urlParams.has('model'))
    urlid = urlParams.get('model')

var client = new Sketchfab( version, iframe );

client.init( urlid, {
    success: function onSuccess( api ){
        api.start();
        api.addEventListener( 'viewerready', function() {handle_viewer_ready(api)});
    },
    error: function onError() {
        console.log( 'Viewer error' );
    },
    preload: 0
} );

function handle_viewer_ready(api){
    api.getMaterialList( function( err, materials ) {
        // Filter the material list  for ones with textures
        texture_list = {}
        materials.forEach(function(material){
            //material.name
            Object.keys(material.channels).forEach(function(channel)
            {
                channel_data = material.channels[channel]
                if (channel_data.enable == false || channel_data.texture == undefined)
                    return
                check_list_keys = Object.keys(texture_list)
                texture_uid = channel_data.texture.uid
                if (check_list_keys.includes(texture_uid) == false)
                    texture_list[texture_uid] = {mat_channels:[]}

                texture_mat_list = texture_list[texture_uid].mat_channels
                if (texture_mat_list.includes(channel) == false)
                    texture_mat_list.push(channel)
            })
        })
        
        console.log(texture_list)

        function full_img_callback(full_url) {
          return function() {
            console.log(full_url);
            window.open(full_url)
          };
        }

        // Retrieve the textures to match against material list
        texture_slots = document.getElementById("texture-images")
        api.getTextureList( function( err, textures ) {
            texture_list_keys = Object.keys(texture_list)
            textures.forEach(function(texture){
                if (texture_list_keys.includes(texture.uid) == false)
                    return

                thumb_width = 0
                thumb_height = 0
                thumb_url = ""
                base_images = []
                texture.images.forEach(function(img) {
                    if (Object.keys(img.options).length == 0)
                        base_images.push(img)
                    if (img.width <= 256 && img.height <= 256 && !img.url.endsWith(".gz")){
                        if (img.width > thumb_width || img.height > thumb_height){
                            thumb_width = img.width
                            thumb_height = img.height
                            thumb_url = img.url
                        }   
                    }
                })
                // base_images = texture.images.filter(function(image){
                //     return Object.keys(image.options).length == 0
                // })
                max_width = 0
                max_height = 0
                max_index = 0
                base_images.forEach(function(img, index){
                    if (img.width > max_width || img.height > max_height)
                    {
                        max_width = img.width
                        max_height = img.height
                        max_index = index
                    }
                })
                
                slot_div = document.createElement("li")
                slot_div.classList.add("texture-slot", "js_slide")

                info_list = document.createElement("ul")
                info_list.classList.add("texture-info")
                
                list_item = document.createElement("li")
                list_item.appendChild(document.createTextNode(texture.name))
                info_list.appendChild(list_item)

                list_item = document.createElement("li")
                list_item.appendChild(document.createTextNode("{0} x {1}".f(max_width, max_height)))
                info_list.appendChild(list_item)

                slot_div.appendChild(info_list)

                img_frame = document.createElement("div")
                img_frame.classList.add("img-frame")

                img_element = document.createElement("img")
                img_element.src = thumb_url

                img_frame.appendChild(img_element)
                slot_div.appendChild(img_frame)

                mat_frame = document.createElement("div")
                mat_frame.classList.add("material-info")

                full_scr = document.createElement("i")
                full_scr.classList.add("icon-fullscreen")
                
                full_img_url = base_images[max_index].url
                full_scr.addEventListener("click", full_img_callback(full_img_url))

                mat_frame.appendChild(full_scr)
                // mat_ul = document.createElement("ul")
                // texture_list[texture.uid].mat_channels.forEach(function(mat_name){
                //     mat_li = document.createElement("li")
                //     mat_li.appendChild(document.createTextNode(mat_name))
                //     mat_ul.appendChild(mat_li)
                // });
                // mat_frame.appendChild(mat_ul)

                slot_div.appendChild(mat_frame)

                texture_slots.appendChild(slot_div)
            })
            
            var carousel = document.querySelector('#texture_carousel');
            carousel_ctrl = lory(carousel, {
                enableMouseEvents: true
            });
            carousel_ctrl.reset()
        });
    } );
}