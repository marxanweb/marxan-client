import React from 'react';
import MarxanDialog from './MarxanDialog';
import TextField from 'material-ui/TextField';

class ResendPasswordDialog extends React.Component {
 
    handleKeyPress(e) {
        if (e.nativeEvent.key === "Enter") this.props.resendPassword();
    }
    render() {
        return (
            <React.Fragment>
                <MarxanDialog 
                    {...this.props} 
                    contentWidth={358}
                    showCancelButton={true}
                    okDisabled={!this.props.email || this.props.loading}
                    cancelDisabled={this.props.resending}
                    title="Resend password" 
                    children={[<div key="resendDiv">
                        <TextField floatingLabelText="email address" floatingLabelFixed={true} onChange = {(event, value)=>this.props.changeEmail(value)}  value={this.props.email} className='loginUserField' disabled = {this.props.loading} onKeyPress={this.handleKeyPress.bind(this)}/>
                </div>]}
                    onRequestClose={this.props.onCancel} 
                />
            </React.Fragment>
        );
    }
}

export default ResendPasswordDialog;
