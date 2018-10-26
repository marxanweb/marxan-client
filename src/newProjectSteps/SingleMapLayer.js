import * as React from 'react';
import mapboxgl from 'mapbox-gl';

class SingleMapLayer extends React.Component {
    componentDidMount() {
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/blishten/cjg6jk8vg3tir2spd2eatu5fd', //north star + marine PAs in pacific
            center: [-174, -13],
            zoom: 2,

        });
        this.map.on("load", this.mapLoaded.bind(this));
    }
    mapLoaded(e) {
        this.addLayerToMap("macbio_deep_water_bioregions");
    }
    addLayerToMap(mapboxlayername) {
        //add the source for this layer
        this.map.addSource('blishten', {
            type: 'vector',
            url: "mapbox://blishten." + mapboxlayername
        });
        var r = Math.random() * 256,
            g = Math.random() * 256,
            b = Math.random() * 256,
            hsl = "rgba(" + r + "," + g + "," + b + ",0.4)";
        this.map.addLayer({
            'id': mapboxlayername,
            'type': "fill",
            'source': 'blishten',
            'source-layer': "macbio_deep_water_bioregions",
            'paint': {
                "fill-color": [
                    "match", [
                        "get",
                        "Draft_name"
                    ],
                    "Torres Rise",
                    hsl,
                    "East Reao Atoll",
                    "hsl(120, 82%, 52%)",
                    "#000000"
                ],
                'fill-opacity': 0.4
            }
        });
    }
    render() {
        return (
            <React.Fragment>
                <div className={'newPUDialogPane'}>
                    <div ref={el => this.mapContainer = el} className="absolute top right left bottom" style={{width:'500px',height:'300px', marginTop: '71px',marginLeft: '104px'}}/>
                </div>
            </React.Fragment>
        );
    }
}

export default SingleMapLayer;
