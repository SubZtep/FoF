#!/usr/bin/env bash

files=(
  node_modules/aframe/dist/aframe-v1.1.0.js*
  # node_modules/aframe-extras/src/loaders/animation-mixer.js
  node_modules/aframe-sprite-component/dist/aframe-sprite-component.js
  node_modules/aframe-animation-timeline-component/dist/aframe-animation-timeline-component.js
  dist/aframe-warpspeed-texture.1.0.1.umd.js
)

> dist/vendors.pug

for f in ${files[@]}; do
  if [[ "$f" == "node_modules"* ]]; then
    cp $f dist
  fi
  if [[ "$f" != *"map" ]]; then
    printf "script(src=\"$(basename $f)\")\n" >> dist/vendors.pug
  fi
done
