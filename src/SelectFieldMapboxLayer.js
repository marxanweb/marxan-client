import * as React from 'react';
import MenuItem from 'material-ui/MenuItem';
import SelectField from 'material-ui/SelectField';

//this is a generic component for selecting and dynamically displaying a layer from mapbox on a mapbox map
//the following are property requirements:
// map:         the mapbox map where the layer will be displayed
// mapboxUser   the mapbox user id where the tilesets are stored, e.g. blished
// items:       the items that you want to display in the select box. these must contain the following properties: 
//  alias               - a string for the text that will be shown in the select box
//  feature_class_name  - the actual value that determines which item is selected - this should be the tileset name, e.g. pupng_terrestrial_hexagons_50
//  envelope            - a well-known-text representation of the bounds of the mapbox layer, e.g. "POLYGON((60.4758290002083 29.3772500001874,60.4758290002083 38.4906960004201,74.8898619998315 38.4906960004201,74.8898619998315 29.3772500001874,60.4758290002083 29.3772500001874))" (optional)
// selectedValue the value that is selected (controlled from the controlling component)
//prerequisitives:
// request library

class SelectFieldMapboxLayer extends React.Component {
    changeItem(event, newValue) {
        //get the selected item
        let item = this.props.items[newValue];
        //zoom to the layer
        let envelope = this.getLatLngLikeFromWKT(item.envelope);
        this.props.map.fitBounds(envelope, { easing: function(num) { return 1; } });
        // this.props.map.setPitch(60);
        //add the layer to the map
        this.addLayerToMap(item.feature_class_name);
        //update the state in the owner
        this.props.changeItem(item.feature_class_name);
    }

    getLatLngLikeFromWKT(wkt) {
        var parse = require('wellknown');
        let envelope = parse(wkt).coordinates[0];
        return [
            [envelope[0][0], envelope[0][1]],
            [envelope[2][0], envelope[2][1]]
        ];
    }

    //check the layer exists
    addLayerToMap(mapboxlayername) {
        this.mapboxlayername = mapboxlayername;
        var request = require('request');
        request('https://api.mapbox.com/v4/' + this.props.mapboxUser + '.' + mapboxlayername + '.json?access_token=pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg&secure', this.parseUrlExists.bind(this));
    }

    parseUrlExists(err, res) {
        let exists = (res && res.statusCode === 200) ? true : false;
        if (exists) {
            //remove the previous planning unit layer
            let previousLayerId = this.props.map.getStyle().layers[this.props.map.getStyle().layers.length - 1].id;
            //check it is a planning unit layer
            if (previousLayerId.substr(0, 3) == "pu_") {
                this.props.map.removeLayer(this.props.map.getStyle().layers[this.props.map.getStyle().layers.length - 1].id);
            }
            //remove the source if it already exists
            if (this.props.map.getSource(this.props.mapboxUser)) {
                this.props.map.removeSource(this.props.mapboxUser);
            }
            //add the source for this layer
            this.props.map.addSource('blishten', {
                type: 'vector',
                url: "mapbox://" + this.props.mapboxUser + "." + this.mapboxlayername
            });
            //add the layer
            this.props.map.addLayer({
                'id': this.mapboxlayername,
                'type': "fill",
                'source': this.props.mapboxUser,
                'source-layer': this.mapboxlayername, 
                'paint': {
                    'fill-color': '#f08',
                    'fill-opacity': 0.4
                }
            });
        } 
        else {
            console.log("The MapBox layer does not exist");
        }
    }

    render() {
        return (
            <React.Fragment>
                <SelectField onChange={this.changeItem.bind(this)} value={this.props.selectedValue} floatingLabelText="Select the planning units" floatingLabelFixed={true} style={{marginTop:'293px', width:this.props.width}}>
                    {this.props.items.map((item)=>{
                    return <MenuItem 
                    value={item.feature_class_name} 
                    primaryText={item.alias} 
                    key={item.feature_class_name}
                    style={{fontSize:'12px'}}
                    />;
                    })}
                </SelectField>
            </React.Fragment>
        );
    }
}

export default SelectFieldMapboxLayer;
