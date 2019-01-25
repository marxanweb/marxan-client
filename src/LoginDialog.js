import React from 'react';
import MarxanDialog from './MarxanDialog';
import TextField from 'material-ui/TextField';

class LoginDialog extends React.Component {
    handleKeyPress(e) {
        if (e.nativeEvent.key === "Enter") this.props.onOk();
    }
    render() {
        return (
            <React.Fragment>
                <MarxanDialog 
                    {...this.props} 
                    showSpinner={this.props.loggingIn}
                    showOverlay={true}
                    okDisabled={(!this.props.user || !this.props.password || this.props.loggingIn) ? true : false} 
                    okLabel={this.props.loggingIn ? "Logging in" : "Login"}
                    showCancelButton={true}
                    cancelLabel={"Register"}
                    cancelDisabled={this.props.loggingIn ? true : false} 
                    contentWidth={358}
                    offsetY={200}
                    children={[
                        <div style={{height:'124px'}} id="logindiv" key="logindiv">
                            <TextField floatingLabelText="Username" floatingLabelFixed={true} onChange = {(event, value)=>this.props.changeUserName(value)}  value={this.props.user} className='loginUserField' disabled = {this.props.loggingIn ? true : false} onKeyPress={this.handleKeyPress.bind(this)}/>
                            <span><TextField floatingLabelText="Password" floatingLabelFixed={true} type="password" onChange = {(event, value)=>this.props.changePassword(value)}  value={this.props.password} className='loginUserField' disabled = {this.props.loggingIn ? true : false} onKeyPress={this.handleKeyPress.bind(this)}/></span>
                            <span onClick={this.props.openResendPasswordDialog.bind(this)} className="forgotLink" title="Click to resend password">Forgot</span>
                        </div>
                    ]} 
                    onRequestClose={this.props.onOk} 
                    title="Login" 
                    modal={true} 
                    />
            </React.Fragment>
        );
    }
}

export default LoginDialog;
