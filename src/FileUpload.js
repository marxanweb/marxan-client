import React from 'react';
/*eslint-disable no-unused-vars*/
import axios, { post } from 'axios';
/*eslint-enable no-unused-vars*/
import FontAwesome from 'react-fontawesome';
import Sync from 'material-ui/svg-icons/notification/sync'; 

//From AshikNesin https://gist.github.com/AshikNesin/e44b1950f6a24cfcd85330ffc1713513

class FileUpload extends React.Component {

	constructor(props) {
		super(props);
		this.state = { loading: false,active:false };
		this.onChange = this.onChange.bind(this);
		this.fileUpload = this.fileUpload.bind(this);
		//the destination folder on the server where the file will be uploaded
		this.destFolder = (props.hasOwnProperty('destFolder')) ? props.destFolder : '';
	}
 
	onClick(e){
		this.setState({active:true});
	}
	onChange(e) {
		if (e.target.files.length) {
			this.fileUpload(e.target.files[0]);
			//reset the file selector
			document.getElementById(this.id).value = "";
		}
	}

	fileUpload(value) {
		this.setState({ loading: true });
		const url = this.props.requestEndpoint + "uploadFileToFolder";
		const formData = new FormData();
		this.filename = value['name']; //from the open file dialog
		formData.append('value', value); 
		formData.append('filename', this.filename);
		formData.append('destFolder', this.destFolder);
		post(url, formData, {withCredentials: this.props.SEND_CREDENTIALS}).then(function(response){
			this.finishedLoading(response);
		}.bind(this));
	}

	finishedLoading(response) {
		if (!this.props.checkForErrors(response.data)){
			this.setState({ loading: false });
			this.props.setFilename(this.filename);
		}
		this.setState({active:false});
	} 
	render() {
		this.id = "upload" + this.props.parameter;
		return (
			<form >
				<div className='uploadLabel' style={{color: (this.state.active) ? 'rgb(0, 188, 212)' : 'rgba(0, 0, 0, 0.3)'}}>{this.props.label}</div> 
				<div className='uploadFileField'>
					<div className='uploadFileFieldIcon'>
						<label htmlFor={this.id}><FontAwesome name='file' title='Click to upload a file' style={{'cursor':'pointer'}}/></label>
						<input type="file" onChange={this.onChange} onClick={this.onClick.bind(this)} accept=".zip,.mxw" style={{'display':'none', 'width':'10px'}} id={this.id} />
					</div>
					<div className='uploadFileFieldLabel' style={{width:'168px'}}>{this.props.filename}</div>
				</div>
				<Sync className='spin' style={{'display': (this.state.loading ? "inline-block" : "none"), 'marginLeft':'6px',color: 'rgb(255, 64, 129)', height:"22px",width:"22px",'verticalAlign':'middle'}} key={"spinner"}/>
			</form>
		);
	}
}

export default FileUpload;
