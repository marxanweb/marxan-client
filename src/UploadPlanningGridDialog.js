import * as React from 'react';
import TextField from 'material-ui/TextField';
import MarxanDialog from "./MarxanDialog";
import ShapefileUpload from './ShapefileUpload';

class UploadPlanningGridDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {planning_grid_name:'', zipFilename: ''}; 
	}
	changeName(event, newValue) {
		this.setState({planning_grid_name: newValue});
	}
	setzipFilename(filename) { 
		this.setState({ zipFilename: filename }); 
	} 
	onOk(){
		this.props.onOk(this.state.zipFilename, this.state.planning_grid_name, 'Imported using the import planning grid dialog').then(function(response){
			//any additional processing
		}).catch(function(ex) {
			//error uploading the shapefile
	  });
	}
	render() {
		return (
			<MarxanDialog 
				{...this.props} 
				title={'Import planning grid'}
				contentWidth={304}
				children={
					<React.Fragment key="22">
						<TextField value={this.state.planning_grid_name} onChange={this.changeName.bind(this)} floatingLabelText="Name" floatingLabelFixed={true} />
						<ShapefileUpload 
							requestEndpoint={this.props.requestEndpoint} 
							SEND_CREDENTIALS={this.props.SEND_CREDENTIALS} 
							mandatory={true} 
							filename={this.state.zipFilename} 
							setFilename={this.setzipFilename.bind(this)} 
							checkForErrors={this.props.checkForErrors} 
							label="Zipped shapefile" 
						/> 
					</React.Fragment>
				} 
				showCancelButton={true}
				onOk={this.onOk.bind(this)}
				okDisabled={this.props.loading}
				onRequestClose={this.props.onCancel.bind(this)} 
			/>
		);
	}
}

export default UploadPlanningGridDialog;
