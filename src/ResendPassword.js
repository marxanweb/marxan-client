import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FontAwesome from 'react-fontawesome';

class ResendPassword extends React.Component {

    handleKeyPress(e) {
        if (e.nativeEvent.key === "Enter") this.props.resendPassword();
    }
    render() {
        const actions = [
            <RaisedButton label="Close" primary={true} onClick={this.props.closeResendPasswordDialog} disabled={this.props.resending} className="projectsBtn"/>,
            <RaisedButton onClick={this.props.resendPassword} label= {"Resend"} disabled = {!this.props.email || this.props.resending} primary={true} className="projectsBtn" type="submit"/>
        ];
        let c = <div>
                    <div>
                        <FontAwesome spin name='sync' style={{'display': (this.props.resending ? 'inline-block' : 'none')}} className='resendSpinner'/>
                        <TextField floatingLabelText="email address" floatingLabelFixed={true} onChange = {(event, value)=>this.props.changeEmail(value)}  value={this.props.email} className='loginUserField' disabled = {this.props.resending} onKeyPress={this.handleKeyPress.bind(this)}/>
                    </div>
                </div>;
        return (
            <React.Fragment>
                <Dialog 
                overlayStyle={{display:'none'}} 
                actions={actions} title="Resend email" modal={true} children={c}  onRequestClose={this.props.closeNewUserDialog} open={this.props.open} contentStyle={{width:'308px'}} titleClassName={'dialogTitleStyle'}/>
            </React.Fragment>
        );
    }
}

export default ResendPassword;
