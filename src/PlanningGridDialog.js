import React from 'react';
import MarxanDialog from './MarxanDialog';
import MapContainer2 from './MapContainer2';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faAngleDown } from '@fortawesome/free-solid-svg-icons';
import { faAngleUp } from '@fortawesome/free-solid-svg-icons';

class PlanningGridDialog extends React.Component { 
	constructor (props){
		super(props);
		this.state = {expanded: false};
	}
	expand(){
		this.setState({expanded: !this.state.expanded});
	}
	render() {
		let areaTD = (this.props.planning_grid_metadata._area) ? <td className='metadataItemValue'>{this.props.planning_grid_metadata._area}Km<span className='superscript'>2</span></td> : <td/>;
		let country_idTD = (this.props.planning_grid_metadata.country_id) ? <td className='metadataItemValue'>{this.props.planning_grid_metadata.country_id}</td> : <td/>;
		return (
			<MarxanDialog
				{...this.props}
				onRequestClose={this.props.onCancel}
				showCancelButton={false}
				title={this.props.planning_grid_metadata.alias}
				helpLink={"docs_user.html#the-planning-grid-details-window"}
				contentWidth={768}
				children={
					<React.Fragment key="k26">
						<MapContainer2
							planning_grid_metadata={this.props.planning_grid_metadata}
							getTilesetMetadata={this.props.getTilesetMetadata}
							zoomToBounds={this.props.zoomToBounds}
							setSnackBar={this.props.setSnackBar}
						/>
						<div className="metadataPanel">
							<table>
								<tr>
									<td colspan='2' className='metadataItemTitle'>Description:</td>
								</tr>
								<tr>
									<td colspan='2' className='metadataItemValue2'>{this.props.planning_grid_metadata.description}</td>
								</tr>
								<tr>
									<td className='metadataItemTitle'>Country:</td>
									<td className='metadataItemValue'>{this.props.planning_grid_metadata.country}</td>
								</tr>
								<tr>
									<td className='metadataItemTitle'>Domain:</td>
									<td className='metadataItemValue'>{this.props.planning_grid_metadata.domain}</td>
								</tr>
								<tr>
									<td className='metadataItemTitle'>Area:</td>
									{areaTD}
								</tr>
								<tr>
									<td className='metadataItemTitle'>Author:</td>
									<td className='metadataItemValue'>{this.props.planning_grid_metadata.created_by}</td>
								</tr>
								<tr>
									<td className='metadataItemTitle'>Created:</td>
									<td className='metadataItemValue'>{this.props.planning_grid_metadata.creation_date}</td>
								</tr>
								<tr>
									<td className='metadataItemTitle'>Source:</td>
									<td className='metadataItemValue'>{this.props.planning_grid_metadata.source}</td>
								</tr>
								<tr style={{display:(this.state.expanded) ? 'table-row' : 'none'}}>
									<td className='metadataItemTitle'>aoi_id:</td>
									<td className='metadataItemValue'>{this.props.planning_grid_metadata.aoi_id}</td>
								</tr>
								<tr style={{display:(this.state.expanded) ? 'table-row' : 'none'}}>
									<td className='metadataItemTitle'>country_id:</td>
									{country_idTD}
								</tr>
								<tr style={{display:(this.state.expanded) ? 'table-row' : 'none'}}>
									<td className='metadataItemTitle'>guid:</td>
									<td className='metadataItemValue'>{this.props.planning_grid_metadata.feature_class_name}</td>
								</tr>
								<tr style={{display:(this.state.expanded) ? 'table-row' : 'none'}}>
									<td className='metadataItemTitle'>envelope:</td>
									<td className='metadataItemValue'>{this.props.planning_grid_metadata.envelope}</td>
								</tr>
							</table>
							<FontAwesomeIcon icon={(this.state.expanded) ? faAngleUp : faAngleDown} onClick={this.expand.bind(this)} title={(this.state.expanded) ? "Show less details" : "Show more details"} className={'appBarIcon'} style={{fontSize: '20px'}}/>
							<div>You may need to zoom in to see the planning grid units</div>
						</div>
					</React.Fragment>
				}
			/>
		); //return
	}
}

export default PlanningGridDialog;
