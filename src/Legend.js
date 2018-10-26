import * as React from 'react';
import * as utilities from './utilities.js';

class Legend extends React.Component {
    getSwatch(colorCode) {
        let colorDivs;
        //get the data value for the highest break in the data to see if we are viewing the sum solutions or an individual solution
        let summed = (this.props.brew.breaks[this.props.brew.breaks.length - 1] === 1) ? false : true;
        if (summed) {
            //get the number of classes the user currently has selected
            let numClasses = this.props.brew.getNumClasses();
            //get the maximum number of colors in this scheme
            let colorSchemeLength = utilities.getMaxNumberOfClasses(this.props.brew, colorCode);
            //get the color scheme
            let colorScheme = this.props.brew.colorSchemes[colorCode];
            //get the number of colors to show as an array
            let numClassesArray = (numClasses <= colorSchemeLength) ? Array.apply(null, { length: numClasses }).map(Number.call, Number) : Array.apply(null, { length: colorSchemeLength }).map(Number.call, Number);
            let classesToShow = numClassesArray.length;
            colorDivs = numClassesArray.map((item) => {
                //see if the data is a range - if the difference in the number of solutions is only 1, then it is not a range
                let range = (this.props.brew.breaks[item + 1] - this.props.brew.breaks[item] > 1) ? true : false;
                let suffix = (this.props.brew.breaks[item + 1] === 1) ? " solution" : " solutions";
                let legendLabel = (range) ? (this.props.brew.breaks[item] + 1) + ' - ' + this.props.brew.breaks[item + 1] + suffix : this.props.brew.breaks[item + 1] + suffix;
                return <div key={item}>
                        <div 
                            key={'swatch' + item} 
                            style={{backgroundColor: colorScheme[classesToShow][item], width: '12px', height:'16px', border:'1px lightgray solid', margin:'3px',display:'inline-flex',verticalAlign:'top'}}>
                        </div>
                        <div
                            style={{display:'inline-flex',verticalAlign:'top',marginLeft: '7px', fontSize:'12px'}}
                            key={'label' + item}>
                            {legendLabel}
                        </div>
                    </div>;
            });
        }else{
            colorDivs = <div>
                        <div style={{backgroundColor: 'rgba(255, 0, 136,1)', width: '12px', height:'16px', border:'1px lightgray solid', margin:'3px',display:'inline-flex',verticalAlign:'top'}}>
                        </div>
                        <div style={{display:'inline-flex',verticalAlign:'top',marginLeft: '3px', fontSize:'12px'}}>
                            Grid in solution
                        </div>
                    </div>;
        }
        colorDivs = <div>{colorDivs}</div>;
        return colorDivs;
    }
    render() {
        var children = this.props.brew && this.props.brew.series && this.getSwatch(this.props.brew.colorCode);
        var returnValue = (children) ? children : <div/>;
        return returnValue;
    }
}

export default Legend;
