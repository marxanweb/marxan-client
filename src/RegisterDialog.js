import React from 'react';
import MarxanDialog from './MarxanDialog';
import TextField from 'material-ui/TextField';
import FontAwesome from 'react-fontawesome';
import MapboxClient from 'mapbox';

class RegisterDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { validForm: false, user: undefined, name: undefined, email: undefined, mb_tk: "sk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiY2piNm1tOGwxMG9lajMzcXBlZDR4aWVjdiJ9.Z1Jq4UAgGpXukvnUReLO1g", validEmail: true, mb_tk_err: '' };
    }
    //
    createNewUser() {
        //check the required FIELDS
        try {
            this.validateEmail();
            // this.validateMapboxPublicKey(); //currently not working!!!
        }
        //any errors will not create a new user
        catch (err) {
            //mapbox access token is invalid
            switch (err.message) {
                case "could not determine account from provided accessToken":
                    this.setState({ mb_tk_err: "Invalid Mapbox Access Token" });
                    break;
                default:
                    // code
            }
            if (err.message === "could not determine account from provided accessToken") {

            }
            return;
        }
        //create a new user
        this.props.onOk(this.state.user, this.state.password, this.state.name, this.state.email, this.state.mb_tk);
    }

    //TODO: MOVE THIS TO THE GENERICFUNCTIONS.JS MODULE
    validateEmail() {
        var re = /^(([^<>()\]\\.,;:\s@"]+(\.[^<>()\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let valid = re.test(String(this.state.email).toLowerCase());
        this.setState({ validEmail: valid });
        if (!valid) {
            throw new Error("Invalid email address");
        }
    }

    validateMapboxPublicKey() {
        //set the default state for the access token as valid
        this.setState({ mb_tk_err: '' });
        //the following line will throw an error if it is not a valid mapbox access token
        let client = new MapboxClient(this.state.mb_tk);
        //the following line will throw an error if the token does not have the scopes to list tilesets
        client.listTilesets((err, tilesets) => {
            if (err) {
                this.setState({ mb_tk_err: "Access Token cannot list and/or upload tilesets" });
            }
        });
        //the following line will throw an error if the token does not have the scopes to upload tilesets
        client.createUpload({
            tileset: ["test", 'test'].join('.'), 
            url: "irrelevant"
        }, (err, upload) => {
            if (err.message === "Not Found") { //this error occurs if the access token does not have the scope to upload tilesets
                this.setState({ mb_tk_err: "Access Token cannot list and/or upload tilesets" });
            }
        });
    }

    render() {
        let c = [<div key="RegisterDialogDiv">
                    <TextField floatingLabelText="Username" floatingLabelFixed={true} onChange = {(event,newValue) => this.setState({user:newValue})}/>
                    <TextField floatingLabelText="Password" floatingLabelFixed={true} type="password" onChange = {(event,newValue) => this.setState({password:newValue})}/>
                    <TextField floatingLabelText="Full name" floatingLabelFixed={true} onChange = {(event,newValue) => this.setState({name:newValue})}/>
                    <TextField floatingLabelText="Email address" floatingLabelFixed={true} errorText={this.state.validEmail ?  '' : "Invalid email address"} onChange = {(event,newValue) => this.setState({email:newValue})}/>
                    <span>
                    <TextField floatingLabelText="Mapbox Access Token" floatingLabelFixed={true} type="password" errorText={this.state.mb_tk_err} onChange = {(event,newValue) => this.setState({mb_tk:newValue})} value="jdjdsdmV6In0.lzQobKMCqES6j7x0bpif6w"/>
                    </span><span>
                    <FontAwesome name='question-circle' className="mapboxHelp" title="If you have a Mapbox account you can enter an access token here to be able to access your own tilesets. Otherwise, leave it as it is."/>
                    </span>
                </div>]
        return (
            <MarxanDialog 
                {...this.props} 
                contentWidth={358}
                showSpinner={this.props.creatingNewUser}
                onOk={this.createNewUser.bind(this)}
                okDisabled={!(this.state.user && this.state.password && this.state.name && this.state.email && this.state.mb_tk) || this.props.creatingNewUser} 
                showCancelButton={true}
                cancelDisabled={this.props.creatingNewUser} 
                title="Register" 
                children={c} 
                onRequestClose={this.props.onCancel} 
            />
        );
    }
}

export default RegisterDialog;
