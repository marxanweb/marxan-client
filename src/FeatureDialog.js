import React from 'react';
import MarxanDialog from './MarxanDialog';
import MapContainer2 from './MapContainer2';
import { getArea } from './Helpers.js';
import FontAwesome from 'react-fontawesome';

class FeatureDialog extends React.Component { 
	constructor (props){
		super(props);
		this.state = {expanded: false};
	}
	expand(){
		this.setState({expanded: !this.state.expanded});
	}
	getProjectList(){
		this.props.getProjectList(this.props.feature_metadata, "feature");
	}
	render() {
		return (
			<MarxanDialog
				{...this.props}
				onRequestClose={this.props.onCancel}
				showCancelButton={false}
				title={this.props.feature_metadata.alias}
				helpLink={"user.html#the-feature-details-window"}
				contentWidth={768}
				children={
					<React.Fragment key="k26">
						<MapContainer2
							planning_grid_metadata={this.props.feature_metadata}
							getTilesetMetadata={this.props.getTilesetMetadata}
							setSnackBar={this.props.setSnackBar}
							color={this.props.feature_metadata.color}
							outlineColor={"rgba(0, 0, 0, 0.2)"}
						/>
						<div className="metadataPanel">
							<table>
								<tbody>
									<tr>
										<td colSpan='2' className='metadataItemTitle'>Description:</td>
									</tr>
									<tr>
										<td colSpan='2' className='metadataItemValue2'>{this.props.feature_metadata.description}</td>
									</tr>
									<tr>
										<td className='metadataItemTitle'>Area:</td>
										<td className='metadataItemValue'>{getArea(this.props.feature_metadata.area, this.props.reportUnits, true)}</td>
									</tr>
									<tr>
										<td className='metadataItemTitle'>Author:</td>
										<td className='metadataItemValue'>{this.props.feature_metadata.created_by}</td>
									</tr>
									<tr>
										<td className='metadataItemTitle'>Created:</td>
										<td className='metadataItemValue'>{this.props.feature_metadata.creation_date}</td>
									</tr>
									<tr>
										<td className='metadataItemTitle'>Source:</td>
										<td className='metadataItemValue'>{this.props.feature_metadata.source}</td>
									</tr>
									<tr style={{display:(this.state.expanded) ? 'table-row' : 'none'}}>
										<td className='metadataItemTitle'>id:</td>
										<td className='metadataItemValue'>{this.props.feature_metadata.id}</td>
									</tr>
									<tr style={{display:(this.state.expanded) ? 'table-row' : 'none'}}>
										<td className='metadataItemTitle'>guid:</td>
										<td className='metadataItemValue'>{this.props.feature_metadata.feature_class_name}</td>
									</tr>
									<tr style={{display:(this.state.expanded) ? 'table-row' : 'none'}}>
										<td className='metadataItemTitle'>tileset:</td>
										<td className='metadataItemValue'>{this.props.feature_metadata.tilesetid}</td>
									</tr>
									<tr style={{display:(this.state.expanded) ? 'table-row' : 'none'}}>
										<td className='metadataItemTitle'>tileset:</td>
										<td className='metadataItemValue'>{this.props.feature_metadata.tilesetid}</td>
									</tr>
									<tr style={{display:(this.state.expanded) ? 'table-row' : 'none'}}>
										<td className='metadataItemTitle'>Projects:</td>
										<td className='metadataItemValue'><FontAwesome name='external-link-alt' onClick={this.getProjectList.bind(this)} title='View a list of projects that this feature is used in' style={{'cursor':'pointer', 'paddingTop':'6px'}}/></td>
									</tr>
								</tbody>
							</table>
							<div onClick={this.expand.bind(this)} title={(this.state.expanded) ? "Show less details" : "Show more details"} className={'textHyperlink'}>{(this.state.expanded) ? 'less' : 'more..'}</div>
						</div>
					</React.Fragment>
				}
			/>
		); //return
	}
}

export default FeatureDialog;
