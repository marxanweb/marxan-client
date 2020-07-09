import * as React from 'react';
import Hexagon from 'react-hexagon';
import TransparencyControl from './TransparencyControl';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCog } from '@fortawesome/free-solid-svg-icons';

class LayerLegend extends React.Component {
    constructor(props){
        super(props);
        //set the initial opacity of the layer based on the layers paint property or for legends with subLayers, the first layers opacity
        let layer = (this.props.hasOwnProperty('subLayers')) ? this.props.subLayers[0] : this.props.layer;
        let opacity = 0;
        switch (layer.type) {
            case 'fill':
                opacity = layer.paint['fill-opacity'];
                break;
            case 'line':
                opacity = layer.paint['line-opacity'];
                break;
            default:
                // code
        }
        this.state = {opacity: opacity};
    }
    changeOpacity(opacity){
        //set the state
        this.setState({opacity: opacity});
        //the layer legend may in fact represent many separate layers (e.g. for features) - these are passed in as subLayers and each needs to have the opacity set
        if (this.props.hasOwnProperty('subLayers')){
            this.props.subLayers.forEach(layer => {
                this.props.changeOpacity(layer.id, opacity);
            });
        }else{
            //call the change opacity method on a single layer - this actually changes the opacity of the layer
            this.props.changeOpacity(this.props.layer.id, opacity);
        }
    }
    //renders the swatch either as a square or hexagon
    renderSwatch(key, item) {
        switch (this.props.shape) {
            case 'hexagon':
                return <div className={'hexDiv'} key={key + '_swatch'}><Hexagon key={key + '_swatch_svg'}className={'hexLegendItem'} style={{fill: item.fillColor, stroke: item.strokeColor, strokeWidth: 30}}/></div>;
            default:
                return <div key={key + '_swatch'} style={ { backgroundColor: item.fillColor, width: '14px', height: '16px', border: item.strokeColor + ' 1px solid', margin: '3px', display: 'inline-flex', verticalAlign: 'top' } }></div>;
        }
    }
    render() {
        //iterate through the items in this layers legend
        let items = this.props.items.map((item, index) => {
            //get a unique key
            let key = 'legend_' + this.props.layer.id + '_' + index;
            //get the swatch
            let swatch = this.renderSwatch(key, item, this.props.shape);
            //if the legend is showing a range in values then put in a horizontal separator between the items
            let separator = (this.props.range && index === 1) ? <div className={'separator'}>-</div> : null;
            return <div key={key} style={{display: (this.props.range) ? 'inline' : 'block'}}>
                {separator}
    			{swatch}
    			<div style={ { display: 'inline-flex', verticalAlign: 'top', marginLeft: '7px', fontSize: '12px' } } key={key + '_label'}>{item.label}</div>
    		 </div>;
        });
        //set symbology button
        let setSymbologyBtn = (this.props.hasOwnProperty('setSymbology')) ? <FontAwesomeIcon className={'setSymbologyBtn'} icon={faCog} style={{color: 'gainsboro'}} onClick={this.props.setSymbology} title={'Configure symbology'}/> : null;
        return (
            <React.Fragment>
                <div className={"tabTitle tabTitleInlineBlock"} style={{marginTop: (this.props.hasOwnProperty('topMargin')) ? this.props.topMargin : 'unset'}} key={'legend_' + this.props.layer.id}>{this.props.layer.metadata.name}</div>
                {setSymbologyBtn}
    			<TransparencyControl changeOpacity={this.changeOpacity.bind(this)} opacity={this.state.opacity}/>
                <div>{items}</div>
            </React.Fragment>
        );
    }
}

export default LayerLegend;
