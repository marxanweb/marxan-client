import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import NewUserDialog from './NewUserDialog.js';
import ResendPassword from './ResendPassword.js';
import Sync from 'material-ui/svg-icons/notification/sync';

class Login extends React.Component { 
    constructor(props) {
        super(props);
        this.state = { newUserDialogOpen: false, resendPasswordDialogOpen: false };
    }

    handleKeyPress(e) {
        if (e.nativeEvent.key === "Enter") this.props.validateUser();
    }
    registerNewUser() { 
        this.setState({ newUserDialogOpen: true });
    }
    closeNewUserDialog() {
        this.setState({ newUserDialogOpen: false });
    }
    forgotClick() {
        this.props.resendPassword();
    }
    closeResendPasswordDialog() {
        this.setState({ resendPasswordDialogOpen: false });
    }
    openResendPasswordDialog() {
        this.setState({ resendPasswordDialogOpen: true });
    }
    changeEmail(value) {
        this.setState({ resendEmail: value });
    }
    render() {
        return (
            <React.Fragment>
                <Dialog 
                    actions={[
                        <RaisedButton 
                            onClick={this.registerNewUser.bind(this)} 
                            label= "Register" 
                            className="projectsBtn" 
                            primary={true} 
                            disabled={this.props.loggingIn ? true : false} 
                            style={{height:'25px'}} 
                        />,
                        <RaisedButton 
                            onClick={this.props.validateUser} 
                            label= {this.props.loggingIn ? "Logging in" : "Login"} 
                            disabled = {(!this.props.user || !this.props.password || this.props.loggingIn) ? true : false} 
                            primary={true} 
                            className="projectsBtn" 
                            type="submit" 
                            style={{height:'25px'}} 
                        />
                    ]} 
                    title="Login" 
                    modal={true} 
                    children={
                        <div style={{height:'124px'}}>
                            <Sync className='spin loginSpinner' style={{display: this.props.loggingIn ? 'block' : 'none'}}/>
                            <TextField floatingLabelText="Username" floatingLabelFixed={true} onChange = {(event, value)=>this.props.changeUserName(value)}  value={this.props.user} className='loginUserField' disabled = {this.props.loggingIn ? true : false} onKeyPress={this.handleKeyPress.bind(this)}/>
                            <span><TextField floatingLabelText="Password" floatingLabelFixed={true} type="password" onChange = {(event, value)=>this.props.changePassword(value)}  value={this.props.password} className='loginUserField' disabled = {this.props.loggingIn ? true : false} onKeyPress={this.handleKeyPress.bind(this)}/></span>
                            <span onClick={this.openResendPasswordDialog.bind(this)} className="forgotLink" title="Click to resend password">Forgot</span>
                        </div>
                    } 
                    open={this.props.open} 
                    contentStyle={{width:'358px'}} 
                    titleClassName={'dialogTitleStyle'}
                    />
                <NewUserDialog 
                    open={this.state.newUserDialogOpen} 
                    closeNewUserDialog={this.closeNewUserDialog.bind(this)} 
                    createNewUser={this.props.createNewUser} 
                    creatingNewUser={this.props.creatingNewUser}/>
                <ResendPassword 
                    open={this.state.resendPasswordDialogOpen} 
                    closeResendPasswordDialog={this.closeResendPasswordDialog.bind(this)} 
                    changeEmail={this.changeEmail.bind(this)} 
                    email={this.state.resendEmail} 
                    resendPassword={this.props.resendPassword} 
                    resending={this.props.resending}/>
            </React.Fragment>
        );
    }
}

export default Login;
