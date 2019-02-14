import React from 'react';
import MarxanDialog from './MarxanDialog';
import TextField from 'material-ui/TextField';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class LoginDialog extends React.Component {
    handleKeyPress(e) {
        if (e.nativeEvent.key === "Enter") this.props.onOk(); 
    } 
    selectServer(evt, key, value){
        this.props.selectServer(this.props.marxanServers[key]);
    }
    render() {
        return (
            <React.Fragment>
                <MarxanDialog 
                    {...this.props} 
                    showSpinner={this.props.loggingIn}
                    showOverlay={true}
                    okDisabled={(!this.props.user || !this.props.password || this.props.loggingIn ||!this.props.marxanServer||(this.props.marxanServer&&this.props.marxanServer.offline)||(this.props.marxanServer&&!this.props.marxanServer.guestUserEnabled)) ? true : false} 
                    okLabel={this.props.loggingIn ? "Logging in" : (this.props.marxanServer&&!this.props.marxanServer.offline&&!this.props.marxanServer.corsEnabled&&this.props.marxanServer.guestUserEnabled) ? "Login (Read-Only)" : "Login"}
                    showCancelButton={true}
                    cancelLabel={"Register"}
                    cancelDisabled={((this.props.marxanServer===undefined) || this.props.loggingIn || (this.props.marxanServer&&this.props.marxanServer.offline) || (this.props.marxanServer&&!this.props.marxanServer.corsEnabled)) ? true : false} 
                    contentWidth={358}
                    offsetY={200}
                    children={[
                    <div key="21">
                        <SelectField 
                            floatingLabelText={'Marxan Server'} 
                            floatingLabelFixed={true} 
                            underlineShow={false}
                            menuItemStyle={{fontSize:'12px'}}
                            labelStyle={{fontSize:'12px'}} 
                            style={{width:'320px'}}
                            value={this.props.marxanServer&&this.props.marxanServer.name} 
                            onChange={this.selectServer.bind(this)}
                            children= {this.props.marxanServers.map((item)=> {
                                //if the server is offline - just put that otherwise: if CORS is enabled for this domain then it is read/write otherwise: if the guest user is enabled then put the domain and read only otherwise: put the domain and guest user disabled
                                let text = (item.offline) ? item.name + " (offline)" : (item.corsEnabled) ? item.name : (item.guestUserEnabled) ? item.name + " (Read-Only)" : item.name + " (Guest user disabled)";
                                return  <MenuItem 
                                    value={item.name} 
                                    key={item.name} 
                                    primaryText={text} 
                                    style={{fontSize:'12px'}}
                                    title={item.host + "\n" + item.description}
                                />;
                            })}
                        />
                        <div style={{height:'124px'}} id="logindiv" key="logindiv">
                            <TextField floatingLabelText="Username" floatingLabelFixed={true} onChange = {(event, value)=>this.props.changeUserName(value)} inputStyle={{fontSize:'12px'}} value={this.props.user} className='loginUserField' disabled = {(this.props.loggingIn) ? true : false} onKeyPress={this.handleKeyPress.bind(this)}/>
                            <span><TextField floatingLabelText="Password" floatingLabelFixed={true} type="password" onChange = {(event, value)=>this.props.changePassword(value)} value={this.props.password} className='loginUserField' disabled = {this.props.loggingIn ? true : false} onKeyPress={this.handleKeyPress.bind(this)}/></span>
                            <span onClick={this.props.openResendPasswordDialog.bind(this)} className="forgotLink" title="Click to resend password">Forgot</span>
                        </div>
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
