import React from 'react';
import Dialog from 'material-ui/Dialog';
import { Line } from 'rc-progress';
import FontAwesome from 'react-fontawesome';

class RunProgressDialog extends React.Component {
    render() {
        let percent = ((this.props.runsCompleted / this.props.numReps) * 100);
        let c = (this.props.running) ? 
                <div>
                    <div className="runLabel">Number of runs completed</div>
                    <span className='runs'>0</span><Line style={{width:'200px'}} percent={percent} strokeWidth="4" strokeColor="#00BCD4" trailWidth="4"/><span className='runs'>{this.props.numReps}</span>
                    <div id="spinner"><FontAwesome spin name='sync' className={'progressSpinner'}/></div>
                </div>
                :
                <div style={{height:'50px'}}>
                    <div className="runLabel">{this.props.preprocessingFeatureAlias ? "Processing " + this.props.preprocessingFeatureAlias : "Preparing run"}</div>
                    <div id="spinner"><FontAwesome spin name='sync' className={'progressSpinner'}/></div>
                </div>;
        return (
            <Dialog title="Running" children={c} 
                overlayStyle={{display:'none'}} 
            open={this.props.running || this.props.preprocessingFeature} 
            contentStyle={{width:'380px'}} 
            titleClassName={'dialogTitleStyle'}/>
        );
    }
}

export default RunProgressDialog;
