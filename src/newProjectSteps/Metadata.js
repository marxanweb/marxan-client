import * as React from 'react';
import TextField from 'material-ui/TextField';

class Metadata extends React.Component {
    constructor(props) {
        super(props); 
        this.state = {
            validName: undefined
        };
    }
    changeName(event, newValue) {
        this.props.setName(newValue);
    }
    changeDescription(event, newValue) {
        this.props.setDescription(newValue);
    }
    render() {
        return (
            <React.Fragment>
                <div className={'newPUDialogPane'}>
                    <TextField errorText={this.state.validName === false ? 'Required field' : ''} value={this.props.name} onChange={this.changeName.bind(this)} floatingLabelText="Enter a name" floatingLabelFixed={true} style={{width:'360px'}}/>
                    <TextField value={this.props.description} onChange={this.changeDescription.bind(this)} multiLine={true} rows={3} floatingLabelText="Enter a description" floatingLabelFixed={true} style={{width:'360px'}}/>
                </div>
            </React.Fragment>
        );
    }
}

export default Metadata;
