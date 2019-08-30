import * as React from 'react';
import mapboxgl from 'mapbox-gl';
//TODO: Combine this with MapContainer.js as they do similar things
class MapContainer2 extends React.Component {
	componentDidMount() {
		this.map = new mapboxgl.Map({
			container: this.mapContainer,
			style: 'mapbox://styles/blishten/cjg6jk8vg3tir2spd2eatu5fd', //north star + marine PAs in pacific
			center: [0, 0],
			zoom: 2,
            attributionControl: false,
		});
        this.map.on("load", (evt) => {
            evt.target.addLayer({
                'id': 'planning_grid',
                'type': "fill",
                'source': {
                    'type': "vector",
                    'url': "mapbox://blishten." + this.props.planning_grid_metadata.feature_class_name
                },
                'source-layer': this.props.planning_grid_metadata.feature_class_name,
                'paint': {
                    'fill-color': "rgba(255, 0, 0, 0.4)", 
                    'fill-outline-color': "rgba(255, 0, 0, 0.5)"
                }
            });
        });
        this.props.getTilesetMetadata("blishten." + this.props.planning_grid_metadata.feature_class_name).then((tileset)=>{
            if (tileset.bounds != null) this.props.zoomToBounds(this.map, tileset.bounds);
        });
	}
	
    componentWillUnmount() {
        //remove the map and free all resources
        if (this.map) this.map.remove();
    }
    
	render() {
		return (
			<React.Fragment>
				<div className={'mapContainer2'}>
					<div>
						<div ref={el => this.mapContainer = el} className="absolute top right left bottom" style={{width:'352px',height:'300px', marginTop: '71px',marginLeft: '24px'}}/>
					</div>
				</div>
			</React.Fragment>
		);
	}
}

export default MapContainer2;
