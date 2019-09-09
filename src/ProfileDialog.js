import React from 'react';
import MarxanDialog from './MarxanDialog';
import TextField from 'material-ui/TextField';

class ProfileDialog extends React.Component {
	constructor(props) { 
		super(props);
		this.state = { updated: false, validEmail: true };
	} 
	handleKeyPress(e) {
		if (e.nativeEvent.key === "Enter") this.updateUser();
	}
	updateState(name, value) { 
		this.setState({
			[name]: value, updated: true });
	}
	validateEmail() {
		var re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
		let email = this.state.EMAIL ? this.state.EMAIL : this.props.userData.EMAIL;
		let valid = re.test(String(email).toLowerCase());
		this.setState({ validEmail: valid });
		if (!valid) {
			throw new Error("Invalid email address");
		}
	}
	updateUser() {
		try {
			this.validateEmail();
		}
		//any errors will not create a new user
		catch (err) {
			return;
		}
		this.props.updateUser(this.state);
		this.closeProfileDialog();
	}
	closeProfileDialog() {
		this.props.onOk();
		this.setState({ updated: false, validEmail: true });
	}
	render() {
		return (
			<MarxanDialog 
				{...this.props}  
				contentWidth={330}
				offsetY={80}
				onCancel={this.closeProfileDialog.bind(this)}
				showCancelButton={true}
				onOk={this.updateUser.bind(this)}
				helpLink={"docs_user.html#profile"}
				title="Profile" 
				children={
					<div key="k15">
						<TextField floatingLabelText="Full name" floatingLabelFixed={true} onChange = {(event,newValue) => this.updateState("NAME",newValue)} defaultValue ={this.props.userData && this.props.userData.NAME} onKeyPress={this.handleKeyPress.bind(this)} floatingLabelShrinkStyle={{fontSize:'16px'}} floatingLabelFocusStyle={{fontSize:'16px'}} style={{fontSize:'13px'}} />
						<TextField floatingLabelText="Email address" floatingLabelFixed={true} errorText={this.state.validEmail ?  '' : "Invalid email address"} onChange = {(event,newValue) => this.updateState("EMAIL",newValue)} defaultValue={this.props.userData && this.props.userData.EMAIL} onKeyPress={this.handleKeyPress.bind(this)} floatingLabelShrinkStyle={{fontSize:'16px'}} floatingLabelFocusStyle={{fontSize:'16px'}} style={{fontSize:'13px'}} />
						{/*<span>
							<TextField floatingLabelText="Mapbox Access Token" floatingLabelFixed={true} type="password" errorText={this.state.mapboxAccessTokenError} onChange = {(event,newValue) => this.updateState("MAPBOXACCESSTOKEN",newValue)} defaultValue={this.props.userData && this.props.userData.MAPBOXACCESSTOKEN} onKeyPress={this.handleKeyPress.bind(this)}/>
						</span>
						<span>
							<FontAwesome name='question-circle' className="mapboxHelp" title="If you have a Mapbox account you can enter an access token here to be able to access your own tilesets. Otherwise, leave it as it is."/>
						</span>*/}
					</div>
				} 
			/>
		);
	}
}

export default ProfileDialog;
