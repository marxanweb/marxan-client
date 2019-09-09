import React from 'react';
import MarxanDialog from './MarxanDialog';
import MapContainer2 from './MapContainer2';

class FeatureDialog extends React.Component { 
	render() {
		return (
			<MarxanDialog
				{...this.props}
				onRequestClose={this.props.onCancel}
				showCancelButton={false}
				title={this.props.feature_metadata.alias}
				contentWidth={400}
				children={
					<React.Fragment key="k26">
						<MapContainer2
							planning_grid_metadata={this.props.feature_metadata}
							getTilesetMetadata={this.props.getTilesetMetadata}
							zoomToBounds={this.props.zoomToBounds}
							setSnackBar={this.props.setSnackBar}
						/>
					</React.Fragment>
				}
			/>
		); //return
	}
}

export default FeatureDialog;
