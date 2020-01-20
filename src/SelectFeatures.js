import React from 'react';
import ToolbarButton from './ToolbarButton';
import FeaturesList from './FeaturesList';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import { faCrosshairs } from '@fortawesome/free-solid-svg-icons';

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
						toggleFeatureLayer={this.props.toggleFeatureLayer}
						toggleFeaturePUIDLayer={this.props.toggleFeaturePUIDLayer}
						useFeatureColors={this.props.useFeatureColors}
					/>
					<ToolbarButton onClick={this.props.openTargetDialog} show={(this.props.userRole!=="ReadOnly")&&(this.props.showTargetButton)}  icon={ <FontAwesomeIcon icon={ faCrosshairs }/>} style={{marginLeft:this.props.leftmargin,width:'30px', marginTop:'5px'}} title={'Set a target for all features'}/>
					<ToolbarButton label="+/-" onClick={this.openFeaturesDialog.bind(this)} show={!((this.props.metadata && this.props.metadata.OLDVERSION)||(this.props.userRole === "ReadOnly"))} style={{marginLeft:this.props.leftmargin,width:'30px', marginTop:'5px'}} title={'Add/remove features from the project'}/>
				</div>
			</React.Fragment>
		);
	}
} 

export default SelectFeatures;
