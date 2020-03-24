import * as React from 'react';
import {zoomToBounds } from './Helpers.js';

class HomeButton extends React.Component {
    zoom() {
        let tileset = this.map.getSource("planning_units_source");
        if (tileset && tileset.bounds) zoomToBounds(this.map, tileset.bounds);
    }
    onAdd(map){
        this.map = map;
        this._btn = document.createElement("button");
        this._btn.className = "mapboxgl-ctrl-icon homeIcon";
        this._btn.title = "Zoom to the extent of the project";
        this._btn.type = "button";
        this._btn["aria-label"] = "Toggle Pitch";
        this._btn.onclick = this.zoom.bind(this);
        this._container = document.createElement("div");
        this._container.className = "mapboxgl-ctrl mapboxgl-ctrl-group";
        this._container.appendChild(this._btn);
        return this._container;
	}
	onRemove(map){
        this._container.parentNode.removeChild(this._container);
        this.map = undefined;
	}
	getDefaultPosition(){
	    return 'bottom-right';
	}
}

export default HomeButton;
