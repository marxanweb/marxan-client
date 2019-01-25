import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import FeaturesList from './FeaturesList';

class SelectFeatures extends React.Component {
    openFeaturesDialog(evt){
        this.props.openFeaturesDialog(true);
    }
    render() { 
        return (
            <React.Fragment>
                <div className={'newPUDialogPane'}>  
                    <FeaturesList 
                        features={this.props.features}  
                        openFeatureMenu={this.props.openFeatureMenu}
                        simple={this.props.simple} 
                        maxheight={'387px'}
                        updateFeature={this.props.updateFeature}
                        userRole={this.props.userRole}
                    />
                    <RaisedButton 
                        label="+/-" 
                        className="projectsBtn" 
                        onClick={this.openFeaturesDialog.bind(this)}   
                        labelStyle={{paddingLeft:'6px',fontSize:'15px'}}
                        style={{display: ((this.props.metadata&&this.props.metadata.OLDVERSION)||(this.props.userRole === "ReadOnly")) ? "none" : "block", height:'24px',marginLeft:this.props.leftmargin,width:'30px', marginTop:'5px'}}
                        title={'Add/remove features from the project'}
                    />
                </div>
            </React.Fragment>
        );
    }
} 

export default SelectFeatures;
