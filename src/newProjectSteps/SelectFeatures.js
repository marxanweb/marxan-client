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
                        toggleFeature={this.props.toggleFeature}
                        maxheight={'387px'}
                        removeFromProject={this.props.removeFromProject}
                        updateFeature={this.props.updateFeature}
                    />
                    <RaisedButton 
                        label="+/-"
                        className="projectsBtn" 
                        onClick={this.props.openAllInterestFeaturesDialog}  
                        labelStyle={{paddingLeft:'6px',fontSize:'15px'}}
                        style={{height:'24px',marginLeft:this.props.leftmargin,width:'30px', marginTop:'5px'}}
                        title={'Add/remove features from the project'}
                    />
                </div>
            </React.Fragment>
        );
    }
}

export default SelectFeatures;
