import React from 'react';
import MarxanDialog from './MarxanDialog';
import FileUpload from './FileUpload.js';

class ImportCostsDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = {costs_filename:''}; 
	}
	setCostsFilename(filename) { 
		this.setState({ costs_filename: filename });
	} 
	render() {
		return (
			<MarxanDialog
			{...this.props} 
			contentWidth={390}
			offsetY={80}
			title="Import Cost surface" 
			onRequestClose={this.props.closeImportCostsDialog}
			helpLink={"user.html#import-costs-window"}
			children={            
			<React.Fragment key="k8">
				<FileUpload 
				{...this.props}
				mandatory={true} 
				filename={this.state.costs_filename} 
				setFilename={this.setCostsFilename.bind(this)} 
				label="Costs surface filename" 
				style={{'paddingTop':'15px'}}/> 			
			</React.Fragment>}/>
		);
	}
}

export default ImportCostsDialog;