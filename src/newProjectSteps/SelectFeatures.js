import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FeaturesList from '../FeaturesList';

class SelectFeatures extends React.Component {
    render() { 
        return (
            <React.Fragment>
                <div className={'newPUDialogPane'}> 
                    <FeaturesList 
                        features={this.props.features} 
                        updateTargetValue={this.props.updateTargetValue} 
                        preprocessFeature={this.props.preprocessFeature}
                        simple={this.props.simple}
                    />
                    <RaisedButton 
                        className="projectsBtn" 
                        label="Select" 
                        onClick={this.props.openAllInterestFeaturesDialog}  
                        style={{height:'24px',marginTop:'15px'}}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default SelectFeatures;
