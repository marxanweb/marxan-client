import * as React from 'react';
import MarxanTextField from './MarxanTextField';
import MarxanDialog from "./MarxanDialog";
import FileUpload from './FileUpload';

class ImportPlanningGridDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {planning_grid_name:'', zipFilename: '', description:""}; 
	}
	changeName(event, newValue) {
		this.setState({planning_grid_name: newValue});
	}
	changeDescription(event, newValue) {
		this.setState({ description: newValue });
	}
	setzipFilename(filename) { 
		this.setState({ zipFilename: filename }); 
	} 
	onOk(){
		let _description = (this.state.description === "") ? 'Imported using the import planning grid dialog' : this.state.description;
		this.props.onOk(this.state.zipFilename, this.state.planning_grid_name, _description).then(function(response){
			//reset the state
			this.setState({planning_grid_name:'', zipFilename: '', description:""});
		}).catch(function(ex) {
			//error uploading the shapefile
	  });
	}
	render() {
		return (
			<MarxanDialog 
				{...this.props} 
				title={'Import planning grid'}
				contentWidth={390}
				children={
					<React.Fragment key="22">
						<FileUpload 
							requestEndpoint={this.props.requestEndpoint} 
							SEND_CREDENTIALS={this.props.SEND_CREDENTIALS} 
							mandatory={true} 
							filename={this.state.zipFilename} 
							setFilename={this.setzipFilename.bind(this)} 
							checkForErrors={this.props.checkForErrors} 
							label="Shapefile" 
						/> 
						<MarxanTextField style={{width:'310px'}} value={this.state.planning_grid_name} onChange={this.changeName.bind(this)} floatingLabelText="Name"/>
						<MarxanTextField style={{width:'310px'}} value={this.state.description} onChange={this.changeDescription.bind(this)} multiLine={true} rows={2} floatingLabelText="Enter a description"/>
					</React.Fragment>
				} 
				showCancelButton={true}
				onOk={this.onOk.bind(this)}
				okDisabled={this.props.loading || this.state.planning_grid_name==='' || this.state.zipFilename==='' || this.state.description===""}
				onRequestClose={this.props.onCancel.bind(this)} 
				helpLink={"user.html#importing-existing-planning-grids"}
			/>
		);
	}
}

export default ImportPlanningGridDialog;
