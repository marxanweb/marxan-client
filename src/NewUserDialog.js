import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import FontAwesome from 'react-fontawesome';
import MapboxClient from 'mapbox';

class NewUserDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { validForm: false, user: undefined, name: undefined, email: undefined, mapboxaccesstoken: "sk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiY2piNm1tOGwxMG9lajMzcXBlZDR4aWVjdiJ9.Z1Jq4UAgGpXukvnUReLO1g", validEmail: true, mapboxAccessTokenError: '' };
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
                    this.setState({ mapboxAccessTokenError: "Invalid Mapbox Access Token" });
                    break;
                default: 
                    // code
            }
            if (err.message === "could not determine account from provided accessToken") {

            }
            return;
        }
        //create a new user
        this.props.createNewUser(this.state.user, this.state.password, this.state.name, this.state.email, this.state.mapboxaccesstoken);
    }

    validateEmail() {
        var re = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
        let valid = re.test(String(this.state.email).toLowerCase());
        this.setState({ validEmail: valid });
        if (!valid) {
            throw "Invalid email address";
        }
    }

    validateMapboxPublicKey() {
        //set the default state for the access token as valid
        this.setState({ mapboxAccessTokenError: '' });
        //the following line will throw an error if it is not a valid mapbox access token
        let client = new MapboxClient(this.state.mapboxaccesstoken);
        //the following line will throw an error if the token does not have the scopes to list tilesets
        client.listTilesets((err, tilesets) => {
            if (err) {
                this.setState({ mapboxAccessTokenError: "Access Token cannot list and/or upload tilesets" });
            }
        });
        //the following line will throw an error if the token does not have the scopes to upload tilesets
        client.createUpload({
            tileset: ["test", 'test'].join('.'),
            url: "irrelevant"
        }, (err, upload) => {
            if (err.message === "Not Found") { //this error occurs if the access token does not have the scope to upload tilesets
                this.setState({ mapboxAccessTokenError: "Access Token cannot list and/or upload tilesets" });
            }
        });
    }

    render() {
        const actions = [
            <RaisedButton label="Close" primary={true} onClick={this.props.closeNewUserDialog}  className="projectsBtn" disabled={this.props.creatingNewUser}/>,
            <RaisedButton label="Register" primary={true} onClick={this.createNewUser.bind(this)} className="projectsBtn" disabled = {!(this.state.user && this.state.password && this.state.name && this.state.email && this.state.mapboxaccesstoken) || this.props.creatingNewUser}/>
        ];
        let c = <div>
                    <FontAwesome spin name='sync' style={{'display': (this.props.creatingNewUser ? 'inline-block' : 'none')}} className='newUserSpinner'/>
                    <TextField floatingLabelText="Username" floatingLabelFixed={true} onChange = {(event,newValue) => this.setState({user:newValue})}/>
                    <TextField floatingLabelText="Password" floatingLabelFixed={true} type="password" onChange = {(event,newValue) => this.setState({password:newValue})}/>
                    <TextField floatingLabelText="Full name" floatingLabelFixed={true} onChange = {(event,newValue) => this.setState({name:newValue})}/>
                    <TextField floatingLabelText="Email address" floatingLabelFixed={true} errorText={this.state.validEmail ?  '' : "Invalid email address"} onChange = {(event,newValue) => this.setState({email:newValue})}/>
                    <span>
                    <TextField floatingLabelText="Mapbox Access Token" floatingLabelFixed={true} type="password" errorText={this.state.mapboxAccessTokenError} onChange = {(event,newValue) => this.setState({mapboxaccesstoken:newValue})} value="jdjdsdmV6In0.lzQobKMCqES6j7x0bpif6w"/>
                    </span><span>
                    <FontAwesome name='question-circle' className="mapboxHelp" title="If you have a Mapbox account you can enter an access token here to be able to access your own tilesets. Otherwise, leave it as it is."/>
                    </span>
                </div>;
        return (
            <Dialog 
            overlayStyle={{display:'none'}} 
            title="Register" children={c} actions={actions} open={this.props.open} onRequestClose={this.props.closeNewUserDialog} contentStyle={{width:'380px'}} titleClassName={'dialogTitleStyle'}/>
        );
    }
}

export default NewUserDialog;
