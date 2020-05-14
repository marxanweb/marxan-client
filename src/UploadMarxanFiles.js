import * as React from 'react';
import UploadFolder from './UploadFolder';
import ShapefileUpload from './ShapefileUpload';
import MarxanTextField from './MarxanTextField';

class UploadMarxanFiles extends React.Component { 
	constructor(props) {
		super(props);
		this.state = {planning_grid_name:'', zipFilename: ''}; 
	}
	setzipFilename(filename) { 
		this.setState({ zipFilename: filename });
		this.props.setZipFilename(filename); 
	} 
	render() {
		return (
			<React.Fragment>
				<div style={{marginTop:'14px'}}>
					<UploadFolder label="Marxan project folder" filesListed={this.props.filesListed}/> 
					<ShapefileUpload requestEndpoint={this.props.requestEndpoint} SEND_CREDENTIALS={this.props.SEND_CREDENTIALS} mandatory={true} filename={this.state.zipFilename} setFilename={this.setzipFilename.bind(this)} checkForErrors={this.props.checkForErrors} label="Planning grid zipped shapefile" style={{'paddingTop':'20px'}}/> 
					<MarxanTextField value={this.props.planning_grid_name} onChange={this.props.setPlanningGridName} floatingLabelText="Planning grid name"/>
				</div>
			</React.Fragment>
		);
	}
}

export default UploadMarxanFiles;
