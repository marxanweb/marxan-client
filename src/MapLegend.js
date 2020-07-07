import * as React from 'react';
import CONSTANTS from './constants';
import { getMaxNumberOfClasses } from './Helpers.js';
import TransparencyControl from './TransparencyControl';
import Hexagon from 'react-hexagon';

class MapLegend extends React.Component {

    //renders the swatch
    renderSwatch(key, item, shape) {
        switch (shape) {
            case 'hexagon':
                return <div className={'hexDiv'}><Hexagon className={'hexLegendItem'} style={{fill: item.color, stroke:'lightgray', strokeWidth: 30}}/></div>;
            default:
                return <div key={key + '_swatch'} style={ { backgroundColor: item.color, width: '12px', height: '16px', border: '1px lightgray solid', margin: '3px', display: 'inline-flex', verticalAlign: 'top' } }></div>;
        }
    }
    //renders the passed items as hexagons - the items have the attributes color and label
    renderLegendItems(layer, items, swatchShape = 'usePlanningGridShape') {
        let shape = '';
        //get the shape to render in the legend - if we want to use the shape of the planning grid then get it
        if (swatchShape === 'usePlanningGridShape') {
            shape = (this.props.metadata && this.props.metadata.PLANNING_UNIT_NAME && this.props.metadata.PLANNING_UNIT_NAME.includes('hexagon')) ? 'hexagon' : 'square';
        }
        else { //
            shape = swatchShape;
        }
        //iterate through the legend items and render them
        return items.map((item, index) => {
            let key = 'legend_' + layer.id + '_' + index;
            let swatch = this.renderSwatch(key, item, shape);
            return <div key={key}>
    			{swatch}
    			<div style={ { display: 'inline-flex', verticalAlign: 'top', marginLeft: '7px', fontSize: '12px' } } key={key + '_label'}>{item.label}</div>
    		 </div>;
        });
    }
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
                return { layer: layer, color: colorScheme[classesToShow][item], label: legendLabel };
            });
            //render the items
            items = this.renderLegendItems(layer, items);
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

    //gets an individual legend item from the layer
    getLayerLegend(layer) {
        let children = [];
        switch (layer.metadata.type) {
            case CONSTANTS.LAYER_TYPE_SUMMED_SOLUTIONS:
                children = (this.props.brew && this.props.brew.breaks && this.props.brew.colorCode) ? this.getSummedSolution(layer, this.props.brew.colorCode) : <div/>;
                break;
            case CONSTANTS.LAYER_TYPE_RESULTS_LAYER:
                break;
            case CONSTANTS.LAYER_TYPE_PLANNING_UNITS:
                children = this.getPlanningUnit(layer);
                break;
            case CONSTANTS.LAYER_TYPE_PLANNING_UNITS_COST:
                break;
            case CONSTANTS.LAYER_TYPE_PLANNING_UNITS_STATUS:
                break;
            case CONSTANTS.LAYER_TYPE_PROTECTED_AREAS:
                children =
                    <div>
                        <div>
                			<div key={'marine'} style={ { backgroundColor: 'rgba(63,127,191)', width: '12px', height: '16px', border: '1px lightgray solid', margin: '3px', display: 'inline-flex', verticalAlign: 'top' } }></div>
                			<div style={ { display: 'inline-flex', verticalAlign: 'top', marginLeft: '7px', fontSize: '12px' } } key={ 'label_marine'}>Marine</div>
                		</div>
            			<div>
            				<div key={'terrestrial'} style={ { backgroundColor: 'rgba(99,148,69)', width: '12px', height: '16px', border: '1px lightgray solid', margin: '3px', display: 'inline-flex', verticalAlign: 'top' } }></div>
            				<div style={ { display: 'inline-flex', verticalAlign: 'top', marginLeft: '7px', fontSize: '12px' } } key={ 'label_terrestrial'}>Terrestrial</div>
            			</div>
            		</div>;
                break;
            case CONSTANTS.LAYER_TYPE_FEATURE_LAYER:
                break;
            case CONSTANTS.LAYER_TYPE_FEATURE_PLANNING_UNIT_LAYER:
                break;
            default:
        }
        return (
            <React.Fragment>
                <div className={ "tabTitle" } key={'legend_' + layer.id}>{layer.metadata.name}</div>
                {children}
            </React.Fragment>
        );
    }
    render() {
        //get the legend items
        let items = this.props.visibleLayers.map((layer) => {
            return this.getLayerLegend(layer);
        });
        return (
            <React.Fragment>
                {items}
    	    </React.Fragment>
        );
    }
}

export default MapLegend;
