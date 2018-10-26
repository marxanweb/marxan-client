import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import TextField from 'material-ui/TextField';
import ShapefileUpload from '../ShapefileUpload.js'

class NewInterestFeatureDialog extends React.Component {
    changeName(event, newValue) {
        this.props.setName(newValue);
    }
    changeDescription(event, newValue) {
        this.props.setDescription(newValue);
    }
    createNewInterestFeature(){
        this.props.createNewInterestFeature();
        this.props.closeNewInterestFeatureDialog();
        this.props.resetNewConservationFeature();
    } 
    render() {
        const actions = [
            <React.Fragment>
                <RaisedButton 
                    label="Close" 
                    onClick={this.props.closeNewInterestFeatureDialog}
                    primary={true} 
                    className="projectsBtn"
                    style={{height:'24px'}}
                />
                <RaisedButton 
                    label={this.props.creatingNewPlanningUnit ? "Creating..." : "Create" }
                    primary={true} 
                    disabled={!(this.props.name!=='' && this.props.description!=='' && this.props.filename!=='')}
                    className="projectsBtn"
                    onClick={this.createNewInterestFeature.bind(this)}
                    style={{height:'24px'}}
                />
            </React.Fragment>
        ];
        let c = 
            <React.Fragment>
                <div>
                    <TextField value={this.props.name} onChange={this.changeName.bind(this)} style={{width:'500px',display:'block'}} floatingLabelText="Enter a name" floatingLabelFixed={true}/>
                    <TextField value={this.props.description} onChange={this.changeDescription.bind(this)} style={{width:'500px',display:'block'}} multiLine={true} rows={2} floatingLabelText="Enter a description" floatingLabelFixed={true}/>
                    <ShapefileUpload mandatory={true} name={this.props.name} description={this.props.description} filename={this.props.filename} setFilename={this.props.setFilename} label="Zipped shapefile" style={{'paddingTop':'10px'}}/>
                </div>
            </React.Fragment>;
        return (
            <Dialog 
                overlayStyle={{display:'none'}} 
                title="New Conservation feature dataset" children={c} actions={actions} open={this.props.open} onRequestClose={this.props.closeNewInterestFeatureDialog} contentStyle={{width:'582px'}} titleClassName={'dialogTitleStyle'}/>
        );
    }
}

export default NewInterestFeatureDialog;
