import * as React from 'react';
import CONSTANTS from './constants';
import { getMaxNumberOfClasses } from './Helpers.js';
import TransparencyControl from './TransparencyControl';
import Hexagon from 'react-hexagon';

class MapLegend extends React.Component {
    //gets the summed solutions legend item
    getSummedSolution(layer, colorCode) {
        let items;
        //get the data value for the highest break in the data to see if we are viewing the sum solutions or an individual solution
        let summed = (this.props.brew.breaks[this.props.brew.breaks.length - 1] === 1) ? false : true;
        if (summed) {
            //get the number of classes the user currently has selected
            let numClasses = this.props.brew.getNumClasses();
            //get the maximum number of colors in this scheme
            let colorSchemeLength = getMaxNumberOfClasses(this.props.brew, colorCode);
            //get the color scheme
            let colorScheme = this.props.brew.colorSchemes[colorCode];
            //get the number of colors to show as an array
            let numClassesArray = (numClasses <= colorSchemeLength) ? Array.apply(null, {
                length: numClasses
            }).map(Number.call, Number) : Array.apply(null, {
                length: colorSchemeLength
            }).map(Number.call, Number);
            let classesToShow = numClassesArray.length;
            //get the legend items
            items = numClassesArray.map((item) => {
                //see if the data is a range - if the difference in the number of solutions is only 1, then it is not a range
                let range = (this.props.brew.breaks[item + 1] - this.props.brew.breaks[item] > 1) ? true : false;
                let suffix = (this.props.brew.breaks[item + 1] === 1) ? " solution" : " solutions";
                let legendLabel = (range) ? (this.props.brew.breaks[item] + 1) + ' - ' + this.props.brew.breaks[item + 1] + suffix : this.props.brew.breaks[item + 1] + suffix;
                return { layer: layer, fillColor: colorScheme[classesToShow][item], strokeColor: 'lightgray', label: legendLabel };
            });
            //render the items
            items = this.renderLegendItems(layer, items, this.planning_grid_shape);
        }
        else {
            items = <div>
				<div style={ { backgroundColor: 'rgba(255, 0, 136,1)', width: '12px', height: '16px', border: '1px lightgray solid', margin: '3px', display: 'inline-flex', verticalAlign: 'top' } }>
				</div>
				<div style={ { display: 'inline-flex', verticalAlign: 'top', marginLeft: '3px', fontSize: '12px' } }>
					Proposed network
				</div>
			</div>;
        }
        items = <div>
			<div>{  items }</div>
			<TransparencyControl layer={ this.props.resultsLayer } changeOpacity={this.props.changeOpacity} opacity={this.props.results_layer_opacity}/>
			</div>;
        return items;
    }

    //renders the swatch either as a square or hexagon
    renderSwatch(key, item, shape) {
        switch (shape) {
            case 'hexagon':
                return <div className={'hexDiv'} key={key + '_swatch'}><Hexagon key={key + '_swatch_svg'}className={'hexLegendItem'} style={{fill: item.fillColor, stroke: item.strokeColor, strokeWidth: 30}}/></div>;
            default:
                return <div key={key + '_swatch'} style={ { backgroundColor: item.fillColor, width: '14px', height: '16px', border: item.strokeColor + ' 1px solid', margin: '3px', display: 'inline-flex', verticalAlign: 'top' } }></div>;
        }
    }
    //renders the passed items as hexagons or squares - the items have the attributes fillColor, strokeColor and label 
    renderLegendItems(layer, items, shape, range) {
        //iterate through the legend items and render them
        return items.map((item, index) => {
            let key = 'legend_' + layer.id + '_' + index;
            let swatch = this.renderSwatch(key, item, shape);
            let separator = (range && index === 1) ? <div className={'separator'}>to</div> : null;
            return <div key={key} style={{display: (range) ? 'inline' : 'block'}}>
                {separator}
    			{swatch}
    			<div style={ { display: 'inline-flex', verticalAlign: 'top', marginLeft: '7px', fontSize: '12px' } } key={key + '_label'}>{item.label}</div>
    		 </div>;
        });
    }

    //gets an individual legend item from the layer - the subItems can be passed in as an array of fillColor, strokeColor and label objects
    //if range if true then the subItems are shown as a range
    getLayerLegend(layer, subItems, swatchShape = 'usePlanningGridShape', range = false) {
        //get the shape to render in the legend - if we want to use the shape of the planning grid then get it
        let shape = (swatchShape === 'usePlanningGridShape') ? this.planning_grid_shape : swatchShape;
        let children = [];
        switch (layer.metadata.type) {
            case CONSTANTS.LAYER_TYPE_SUMMED_SOLUTIONS: //get the summed solutions legend
                children = (this.props.brew && this.props.brew.breaks && this.props.brew.colorCode) ? this.getSummedSolution(layer, this.props.brew.colorCode) : <div/>;
                break;
            default:
                children = this.renderLegendItems(layer, subItems, shape, range);
        }
        return (
            <React.Fragment>
                <div className={ "tabTitle" } key={'legend_' + layer.id}>{layer.metadata.name}</div>
                {children}
            </React.Fragment>
        );
    }
    
    render() {
        //get the planning grid shape
        this.planning_grid_shape = (this.props.metadata && this.props.metadata.PLANNING_UNIT_NAME && this.props.metadata.PLANNING_UNIT_NAME.includes('hexagon')) ? 'hexagon' : 'square';
        //get the legend items for non-feature layers
        let nonFeatureLegendItems = this.props.visibleLayers.map((layer) => {
            //create the legend for non-feature layers
            if (layer.metadata.type!==CONSTANTS.LAYER_TYPE_FEATURE_LAYER){
                switch (layer.metadata.type) {
                    case CONSTANTS.LAYER_TYPE_SUMMED_SOLUTIONS: //get the summed solutions legend
                        let subItems = (this.props.brew && this.props.brew.breaks && this.props.brew.colorCode) ? this.getSummedSolution(layer, this.props.brew.colorCode) : null;
                        return this.getLayerLegend(layer, subItems);
                    case CONSTANTS.LAYER_TYPE_PLANNING_UNITS:
                        return null;
                    case CONSTANTS.LAYER_TYPE_PLANNING_UNITS_COST:
                        let minColor = layer.paint['fill-color'][3]; //min paint color
                        let maxColor = layer.paint['fill-color'][layer.paint['fill-color'].length-2]; //max paint color
                        //if the min and max costs are the same only create a single legend item
                        if (layer.metadata.min === layer.metadata.max){
                            return this.getLayerLegend(layer, [{fillColor: minColor, strokeColor:'lightgray', label: layer.metadata.min}]);
                        }else{
                            return this.getLayerLegend(layer, [{fillColor: minColor, strokeColor:'lightgray', label: layer.metadata.min}, {fillColor: maxColor, strokeColor:'lightgray', label: layer.metadata.max}], this.planning_grid_shape, true);
                        }
                    case CONSTANTS.LAYER_TYPE_PLANNING_UNITS_STATUS:
                        return this.getLayerLegend(layer, [{fillColor:'none', strokeColor:'lightgray', label: 'Normal planning unit'}, {fillColor:'none', strokeColor:'blue', label: 'Locked in'},{fillColor:'none', strokeColor:'red', label: 'Locked out'}]);
                    case CONSTANTS.LAYER_TYPE_PROTECTED_AREAS:
                        return this.getLayerLegend(layer, [{fillColor:'rgba(63,127,191)', strokeColor:'lightgray', label: 'Marine'},{fillColor:'rgba(99,148,69)', strokeColor:'lightgray', label: 'Terrestrial'}], 'square');
                    default:
                        return null;
                }
            }else{
                return null;
            }
        });
        //get any feature legend items - these are combined into a single legend - first populate the legend items for each feature
        let featureLayers = this.props.visibleLayers.filter(layer => (layer.metadata.type===CONSTANTS.LAYER_TYPE_FEATURE_LAYER));
        let items = featureLayers.map((layer) => {
            return {fillColor: layer.paint['fill-color'], strokeColor:'lightgray', label: layer.metadata.name};
        });
        //now create the legend for features
        let featureLegendItems = (items.length > 0) ? this.getLayerLegend({metadata:{name:'Features'}}, items, "square") : null;
        //get any feature planning unit legend items - these are combined into a single legend - first populate the legend items for each feature planning unit
        let featurePUIDLayers = this.props.visibleLayers.filter(layer => (layer.metadata.type===CONSTANTS.LAYER_TYPE_FEATURE_PLANNING_UNIT_LAYER));
        items = featurePUIDLayers.map((layer) => {
            return {fillColor: 'none', strokeColor: layer.metadata.lineColor, label: layer.metadata.name};
        });
        //now create the legend for feature planning grids
        let featurePUIDLegendItems = (items.length > 0) ? this.getLayerLegend({metadata:{name:'Planning units for features'}}, items) : null;
        return (
            <React.Fragment>
                {nonFeatureLegendItems}
                {featureLegendItems}
                {featurePUIDLegendItems}
    	    </React.Fragment>
        );
    }
}

export default MapLegend;
