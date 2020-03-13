import React from 'react';
import MarxanDialog from './MarxanDialog';
import TextField from 'material-ui/TextField';

class RegisterDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = { validForm: false, user: undefined, name: undefined, email: undefined, validEmail: true};
	}
	//
	createNewUser() {
		//check the required FIELDS
		try {
			this.validateEmail();
		}
		//any errors will not create a new user
		catch (err) {
			switch (err.message) {
				default:
					// code
			}
			return;
		}
		//create a new user
		this.props.onOk(this.state.user, this.state.password, this.state.name, this.state.email);
	}

	validateEmail() {
		var re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let valid = re.test(String(this.state.email).toLowerCase());
		this.setState({ validEmail: valid });
		if (!valid) {
			throw new Error("Invalid email address");
		}
	}

	render() {
		let c = [<div key="RegisterDialogDiv">
					<TextField floatingLabelText="Username" floatingLabelFixed={true} onChange = {(event,newValue) => this.setState({user:newValue})}/>
					<TextField floatingLabelText="Password" floatingLabelFixed={true} type="password" onChange = {(event,newValue) => this.setState({password:newValue})}/>
					<TextField floatingLabelText="Full name" floatingLabelFixed={true} onChange = {(event,newValue) => this.setState({name:newValue})}/>
					<TextField floatingLabelText="Email address" floatingLabelFixed={true} errorText={this.state.validEmail ?  '' : "Invalid email address"} onChange = {(event,newValue) => this.setState({email:newValue})}/>
				</div>];
		return (
			<MarxanDialog 
				{...this.props} 
				contentWidth={358}
				onOk={this.createNewUser.bind(this)}
				okDisabled={!(this.state.user && this.state.password && this.state.name && this.state.email) || this.props.loading} 
				showCancelButton={true}
				cancelDisabled={this.props.loading} 
				helpLink={"user.html#new-user-registration"}
				title="Register" 
				children={c} 
				onRequestClose={this.props.onCancel} 
			/>
		);
	}
}

export default RegisterDialog;
