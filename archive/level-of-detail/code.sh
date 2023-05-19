#!/bin/bash

wget https://sbcode.net/stylesheets/style.css
wget https://sbcode.net/build/three.module.js
wget https://sbcode.net/jsm/controls/OrbitControls.js
wget https://sbcode.net/extra_html/utils/es-module-shims.js
wget https://sbcode.net/jsm/libs/stats.module.js

wget https://sbcode.net/dat.gui # then add extension .js
wget https://sbcode.net/dat.gui.module.js.map
# Then!  Grab the src from the actual dat.gui repo: dataarts/dat.gui

wget https://sbcode.net/jsm/loaders/GLTFLoader.js
wget https://sbcode.net/jsm/libs/tween.module.min.js

# MODELS
cd ../extra_html/models

wget https://sbcode.net/extra_html/models/saplingTree_high.glb
wget https://sbcode.net/extra_html/models/birchTreeWithLeaves_high.glb
wget https://sbcode.net/extra_html/models/tree1WithLeaves_high.glb

wget https://sbcode.net/extra_html/models/saplingTree_medium.glb
wget https://sbcode.net/extra_html/models/birchTreeWithLeaves_medium.glb
wget https://sbcode.net/extra_html/models/tree1WithLeaves_medium.glb

wget https://sbcode.net/extra_html/models/saplingTree_low.glb
wget https://sbcode.net/extra_html/models/birchTreeWithLeaves_low.glb
wget https://sbcode.net/extra_html/models/tree1WithLeaves_low.glb

#wget https://sbcode.net/extra_html/trackballcontrols.html
