/*global fetch*/
import React from 'react';
import ReactMapboxGl, { Source, Layer } from "react-mapbox-gl";

const MapInstance = ReactMapboxGl({ accessToken: window.MBAT_PUBLIC });
const MAPBOX_STYLE_PREFIX = 'mapbox://styles/';
const INITIAL_CENTER = [20, -2];
const INITIAL_ZOOM = [9];
const WDPA_SOURCE_NAME = "wdpa_source";
const WDPA_LAYER_NAME = "wdpa";
const WDPA_FILL_LAYER_OPACITY = 0.2;
const PLANNING_UNIT_SOURCE_NAME = "planning_units_source";
const RESULTS_LAYER_NAME = "results_layer"; //layer for either the sum of solutions or the individual solutions

class Map extends React.Component {
    constructor(props) {
        super(props);
        this.state = { wdpaAttribution: "", wdpa_tiles: [], wdpa_vector_tile_layer: "", wdpa_layer_opacity: WDPA_FILL_LAYER_OPACITY, planning_grid_tiles: [], resultsLayerPaintPropertySet: false, style: {}, fitboundsoptions: {} };
    }

    componentDidUpdate(prevProps, prevState) {
        //if the basemap changes then update it
        if (this.props.basemap !== prevProps.basemap) this.setBasemap();
        //if the wdpa version changes then update the wdpa source and wdpa layer
        if (this.state.style && this.props.marxanServer && prevProps && this.props.marxanServer.wdpa_version !== prevProps.marxanServer.wdpa_version) this.setWDPASource();
        //if the planning grid layer changes then update it
        if (this.props.tilesetid !== prevProps.tilesetid) this.setPlanningGrid();
        //if the results layer paint property changes then render it
        if (this.props.resultsLayerPaintProperty !== prevProps.resultsLayerPaintProperty){
            this.setPaintProperty(RESULTS_LAYER_NAME, this.props.resultsLayerPaintProperty);  
        } 
    }

    //sets the basemap style
    setBasemap() {
        return new Promise((resolve, reject) => {
            //invalidate the paint properties where they cannot be bound
            this.setState({resultsLayerPaintPropertySet: false});
            //get a valid map style
            this.getValidStyle(this.props.basemap).then((style) => {
                this.setState({style: style});
            });
        });
    }

    //gets the style JSON either as a valid TileJSON object or as a url to a valid TileJSON object
    getValidStyle(basemap) {
        return new Promise((resolve, reject) => {
            if (basemap.provider !== 'esri') { // the style is a url - just return the url
                resolve(MAPBOX_STYLE_PREFIX + basemap.id);
            }
            else { //the style json will be loaded dynamically from an esri endpoint and parsed to produce a valid TileJSON object
                this.getESRIStyle(basemap.id).then((styleJson) => {
                    resolve(styleJson);
                });
            }
        });
    }

    //gets a Mapbox Style Specification JSON object from the passed ESRI style endpoint
    getESRIStyle(styleUrl) {
        return new Promise((resolve, reject) => {
            fetch(styleUrl) //fetch the style json
                .then(response => {
                    return response.json()
                        .then(style => {
                            // next fetch metadata for the raw tiles
                            const TileJSON = style.sources.esri.url;
                            fetch(TileJSON)
                                .then(response => {
                                    return response.json()
                                        .then(metadata => {
                                            let tilesurl = (metadata.tiles[0].substr(0, 1) === "/") ? TileJSON + metadata.tiles[0] : TileJSON + '/' + metadata.tiles[0];
                                            style.sources.esri = {
                                                type: 'vector',
                                                scheme: 'xyz',
                                                tilejson: metadata.tilejson || '2.0.0',
                                                format: (metadata.tileInfo && metadata.tileInfo.format) || 'pbf',
                                                /* mapbox-gl-js does not respect the indexing of esri tiles because we cache to different zoom levels depending on feature density, in rural areas 404s will still be encountered. more info: https://github.com/mapbox/mapbox-gl-js/pull/1377*/
                                                // index: metadata.tileMap ? style.sources.esri.url + '/' + metadata.tileMap : null,
                                                maxzoom: 15,
                                                tiles: [
                                                    tilesurl
                                                ],
                                                description: metadata.description,
                                                name: metadata.name
                                            };
                                            resolve(style);
                                        });
                                });
                        });
                });
        });
    }

    //get a reference to the original Mapbox API - this may be called after the results from a project have been loaded
    onStyleLoad(map) {
        this.map = map;
        //if the results layer paint property has a value but the map setPaintProperty has not been called, then call it
        if (this.props.resultsLayerPaintProperty && !this.state.resultsLayerPaintPropertySet) this.setPaintProperty(RESULTS_LAYER_NAME, this.props.resultsLayerPaintProperty);
    }

    setWDPASource() {
        //get the year for the wdpa version
        let yr = this.props.marxanServer.wdpa_version.substr(-4); //get the year from the wdpa_version
        //get the short version of the wdpa_version, e.g. August 2019 to aug_2019
        let version = this.props.marxanServer.wdpa_version.toLowerCase().substr(0, 3) + "_" + yr;
        //get the name of the vector tile layer
        let wdpa_vector_tile_layer = "wdpa_" + version + "_polygons";
        //set the attribution
        let attribution = "IUCN and UNEP-WCMC (" + yr + "), The World Database on Protected Areas (WDPA) " + this.props.marxanServer.wdpa_version + ", Cambridge, UK: UNEP-WCMC. Available at: <a href='http://www.protectedplanet.net'>www.protectedplanet.net</a>";
        //set the wdpa_tiles 
        let wdpa_tiles = [window.WDPA.tilesUrl + "layer=marxan:" + wdpa_vector_tile_layer + "&tilematrixset=EPSG:900913&Service=WMTS&Request=GetTile&Version=1.0.0&Format=application/x-protobuf;type=mapbox-vector&TileMatrix=EPSG:900913:{z}&TileCol={x}&TileRow={y}"];
        this.setState({ wdpaAttribution: attribution, wdpa_tiles: wdpa_tiles, wdpa_vector_tile_layer: wdpa_vector_tile_layer });
    }

    //called when a new project is loaded and the tilesetid has been changed
    setPlanningGrid() {
        //get the tileset metadata
        this.props.getMetadata(this.props.tilesetid).then((tileset) => {
            //set the state
            this.setState({ tileset: tileset });
            //zoom to the layers extent
            if (tileset.bounds != null) this.zoomToBounds( tileset.bounds);
            //call the loaded method
            this.props.planningGridLoaded();
        }).catch((error) => {
            this.props.setSnackBar(error);
        });
    }

    //zooms the map to the passed bounds
    zoomToBounds(bounds) {
        let minLng = (bounds[0] < -180) ? -180 : bounds[0];
        let minLat = (bounds[1] < -90) ? -90 : bounds[1];
        let maxLng = (bounds[2] > 180) ? 180 : bounds[2];
        let maxLat = (bounds[3] > 90) ? 90 : bounds[3];
        this.setState({bounds: [minLng, minLat, maxLng, maxLat], fitboundsoptions: { padding: { top: 10, bottom: 10, left: 10, right: 10 }, easing: (num) => { return 1; } }});
    }

    //sets the layers paint property by iterating through all of the individual paint properties, e.g. fillColor, fill-outline-color etc. - this is required because the mapbox react component doesnt detect changes to the paint property beyond the first depth
    setPaintProperty(layer, paintProperty) {
        for (var key in paintProperty) {
            let property = "";
            switch (key) {
                case 'fillColor':
                    property = "fill-color";
                    break;
                case 'oulineColor':
                    property = "fill-outline-color";
                    break;
                default:
                    // code
            }
            //the style may not have loaded and set the original map API property - so check first
            if (this.map) {
                this.map.setPaintProperty(layer, property, paintProperty[key]);
                this.setState({ resultsLayerPaintPropertySet: true });
            }
        }
    }

    render() {
        let wdpa_source = (this.state.wdpa_vector_tile_layer) ? <Source id={WDPA_SOURCE_NAME} tileJsonSource={{type: "vector", attribution: this.state.wdpaAttribution, tiles: this.state.wdpa_tiles}} /> : null;
        let wdpa_layer = (this.state.wdpa_vector_tile_layer) ?
            <Layer 
                id={WDPA_LAYER_NAME} 
                sourceId={WDPA_SOURCE_NAME} 
                type="fill" 
                sourceLayer={this.state.wdpa_vector_tile_layer} 
                layout={{visibility: (this.state.wdpa_vector_tile_layer) ? "visible" : "none"}}
                paint={{
                    "fill-color": {
                      "type": "categorical",
                      "property": "marine",
                      "stops": [
                        ["0", "rgb(99,148,69)"],
                        ["1", "rgb(63,127,191)"],
                        ["2", "rgb(63,127,191)"]
                      ]
                    },
                    "fill-outline-color": {
                      "type": "categorical",
                      "property": "marine",
                      "stops": [
                        ["0", "rgb(99,148,69)"],
                        ["1", "rgb(63,127,191)"],
                        ["2", "rgb(63,127,191)"]
                      ]
                    },
                    "fill-opacity": this.state.wdpa_layer_opacity
                  }}
            /> : null;
        let planning_grid_source = (this.state.tileset) ? <Source id={PLANNING_UNIT_SOURCE_NAME} tileJsonSource={{type: "vector", url: "mapbox://" + this.state.tileset.id}} /> : null;
        let results_layer = (this.state.tileset) ? <Layer id={RESULTS_LAYER_NAME} sourceId={PLANNING_UNIT_SOURCE_NAME} type="fill" sourceLayer={this.state.tileset.name} layout={{visibility: (this.state.resultsLayerPaintPropertySet) ? 'visible' : 'none'}}/> : null;
        return (
            // eslint-disable-next-line
            <MapInstance className="absolute top right left bottom" style={this.state.style} center={INITIAL_CENTER} zoom={INITIAL_ZOOM} containerStyle={{height: "100vh",width: "100vw"}} onStyleLoad={this.onStyleLoad.bind(this)} fitBounds={this.state.bounds} fitBoundsOptions={this.state.fitboundsoptions}>
                {wdpa_source}{wdpa_layer}
                {planning_grid_source}
                    {results_layer}
            </MapInstance>
        );
    }
}

export default Map;
