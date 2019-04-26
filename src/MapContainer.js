import React from 'react';
import mapboxgl from 'mapbox-gl';

class MapContainer extends React.Component {
	componentDidMount() {
		this.map = new mapboxgl.Map({
			container: this.mapContainer,
			style: 'mapbox://styles/mapbox/light-v9',
			center: this.props.mapCentre,
			zoom: this.props.mapZoom,
			attributionControl: false,
			interactive: false
		}); 
		this.map.on("load", function(evt) {
			evt.target.addLayer({
				'id': this.props.RESULTS_LAYER_NAME,
				'type': "fill",
				'source': {
					'type': "vector",
					'url': "mapbox://" + this.props.tileset.id
				},
				'source-layer': this.props.tileset.name,
				'paint': {
					'fill-color': "rgba(0, 0, 0, 0)", 
					'fill-outline-color': "rgba(0, 0, 0, 0)"
				}
			});
			this.map.setCenter(this.props.mapCentre);
			this.setMapZoom();
			// this.map.setCenter(this.props.tileset.center);
		}.bind(this));
	}

	componentDidUpdate(prevProps, prevState) {
		if (this.props.paintProperty !== prevProps.paintProperty) {
			if (this.props.paintProperty.length === 0){
				//resetting the paint property
				this.map.setPaintProperty(this.props.RESULTS_LAYER_NAME, "fill-color", "rgba(0, 0, 0, 0)");
				this.map.setPaintProperty(this.props.RESULTS_LAYER_NAME, "fill-outline-color", "rgba(0, 0, 0, 0)");
			}else{
				//the solution has been loaded and the paint properties have been calculated
				this.map.setPaintProperty(this.props.RESULTS_LAYER_NAME, "fill-color", this.props.paintProperty.fillColor);
				this.map.setPaintProperty(this.props.RESULTS_LAYER_NAME, "fill-outline-color", this.props.paintProperty.oulineColor);
				this.map.setPaintProperty(this.props.RESULTS_LAYER_NAME, "fill-opacity", 0.5);
			}
		}
		if (this.props.mapCentre !== prevProps.mapCentre){
			this.map.setCenter(this.props.mapCentre);
		}
		if (this.props.mapZoom !== prevProps.mapZoom){
			this.setMapZoom();
		}
	}

	componentWillUnmount() {
		//remove the map and free all resources
		this.map.remove();
	}
	
	setMapZoom(){
		// this.map.setZoom(this.props.mapZoom - 3);
		this.map.setZoom(this.props.mapZoom);
	}
	
	render() {
		return (
			<div style={{display:'inline-block', margin:'5px'}} onClick={(this.props.disabled) ? null : this.props.selectBlm.bind(this, this.props.blmValue)}>
				<div style={{'fontSize':'14px'}}>BLM: {this.props.blmValue}</div>
				<div ref={el => this.mapContainer = el} style={{width:'200px',height:'200px', cursor: (this.props.disabled) ? 'default' : 'pointer'}} className={'hoverMapContainer'} title={(this.props.disabled) ? '': 'Click to select this BLM value'}/>
			</div>
		);
	}
}

export default MapContainer;
