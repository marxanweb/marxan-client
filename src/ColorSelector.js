/*global resetNumberOfClasses*/
import React from 'react';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
import * as utilities from './utilities.js';

class ColorSelector extends React.Component {
    handleChange(event, index, value) {
        this.props.changeValue(value);
    }
    selectionRenderer() {
        let c = this.getSwatch(this.props.property, true);
        return c;
    }
    getSwatch(colorCode, disableHighlight) {
        //get the number of classes the user currently has selected
        let numClasses = this.props.brew.getNumClasses();
        //get the maximum number of colors in this scheme
        let colorSchemeLength = utilities.getMaxNumberOfClasses(this.props.brew, colorCode);
        //get the color scheme
        let colorScheme = this.props.brew.colorSchemes[colorCode];
        //get the number of colors to show as an array
        let numClassesArray = (numClasses <= colorSchemeLength) ? Array.apply(null, { length: numClasses }).map(Number.call, Number) : Array.apply(null, { length: colorSchemeLength }).map(Number.call, Number);
        let classesToShow = numClassesArray.length;
        let divWidth = 112 / classesToShow;
        let colorDivs = numClassesArray.map((item) => {
            return <div key={item} style={{backgroundColor: colorScheme[classesToShow][item], width: divWidth, height:'16px', display: 'inline-block'}}/>;
        });
        let borderColor = ((colorCode === this.props.property) && !disableHighlight) ? 'rgb(255, 64, 129)' : 'lightgray';
        colorDivs = <div style={{display:'inline-flex', marginTop:'12px', border:'1px solid ' + borderColor}}>{colorDivs}</div>;
        return colorDivs;
    }
    render() {
        let primaryText;
        let c = this.props.values.map(function(colorCode) {
            (colorCode !== 'opacity') ? primaryText = '': primaryText = "Opacity";
            if (colorCode !== 'opacity') c = this.getSwatch(colorCode, false);
            return <MenuItem value={colorCode} primaryText={primaryText} key={colorCode} children={c}/>;
        }, this);
        return (
            <SelectField selectionRenderer={this.selectionRenderer.bind(this)} menuItemStyle={{fontSize:'12px'}} labelStyle={{fontSize:'12px'}} listStyle={{fontSize:'12px'}} style={{width:'150px', margin: '0px 10px'}} autoWidth={true} floatingLabelText={this.props.floatingLabelText} floatingLabelFixed={true} children={c} onChange={this.handleChange.bind(this)} value={this.props.property}/>
        );
    }
}

export default ColorSelector;
