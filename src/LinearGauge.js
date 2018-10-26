import * as React from 'react';

class LinearGauge extends React.Component {
    constructor(props) {
        super(props);
        //alwaysShowPercent - set to false then if the percent protected is smaller than 30 pixels it will not be shown
        //showUnprotectedPercent - set to false to not show the unprotected percent
        //targetAsLine - shows the target as a line - otherwise it is a grey rectangle
        this.state = { alwaysShowPercent: false, showUnprotectedPercent: false,targetAsLine:false };
    } 
    render() {
        let protectedWidth = 0; 
        let protectedHidden = true; 
        //the scaledWidth is the desired width of the LinearGauge
        let scaleFactor = this.props.scaledWidth / 100;
        //the number of pixels from the left hand side to offset the target line
        let targetPxOffset = (this.props.target_value * scaleFactor);
        //the number of pixels from the left hand side to the protected line
        protectedWidth = (this.props.protected_percent === -1) ? 0 : (this.props.protected_percent * scaleFactor);
        //get whether or not the % protected should be visible or hidden
        protectedHidden = (protectedWidth < 26 && !(this.state.alwaysShowPercent));
        //get the width of the target shortfall
        let targetShortfallWidth = (this.props.protected_percent >= this.props.target_value) ? 0 : (targetPxOffset - protectedWidth);
        //get the width of the rest of the bar
        let unprotectedWidth = (100 * scaleFactor) - protectedWidth - targetShortfallWidth;
        return (
            <div className={'linearGauge'} style={{opacity: (this.props.protected_percent === -1) ? '0.3' : 1}}>
                <div title={Math.round(this.props.protected_percent) + '% protected'} className={'percentBar protectedPercentBar'} style={{width: protectedWidth + 'px'}}>{protectedHidden ? <span>&nbsp;</span> : Math.round(this.props.protected_percent) + '%'}</div>
                <div title={'Target of ' + this.props.target_value + '%'} className={'percentBar targetShortfall'} style={{width: targetShortfallWidth + 'px'}}></div>
                <div className={'percentBar totalShortFall'} style={{width: unprotectedWidth + 'px'}}></div>
            </div>
        );
    }
}

export default LinearGauge;
