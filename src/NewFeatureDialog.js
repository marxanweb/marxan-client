import * as React from 'react';
import MarxanDialog from './MarxanDialog';
import TextField from 'material-ui/TextField';
import ShapefileUpload from './ShapefileUpload.js'

class NewFeatureDialog extends React.Component {
    changeName(event, newValue) {
        this.props.setName(newValue);
    }
    changeDescription(event, newValue) {
        this.props.setDescription(newValue);
    }
    createNewInterestFeature(){ 
        this.props.createNewInterestFeature();
        this.props.resetNewConservationFeature();
    } 
    render() {
        let c = 
            <React.Fragment>
                <div>
                    <TextField value={this.props.name} onChange={this.changeName.bind(this)} style={{width:'500px',display:'block'}} floatingLabelText="Enter a name" floatingLabelFixed={true}/>
                    <TextField value={this.props.description} onChange={this.changeDescription.bind(this)} style={{width:'500px',display:'block'}} multiLine={true} rows={2} floatingLabelText="Enter a description" floatingLabelFixed={true}/>
                    <ShapefileUpload SEND_CREDENTIALS={this.props.SEND_CREDENTIALS} MARXAN_ENDPOINT_HTTPS={this.props.MARXAN_ENDPOINT_HTTPS} mandatory={true} name={this.props.name} description={this.props.description} filename={this.props.filename} setFilename={this.props.setFilename} label="Zipped shapefile" style={{'paddingTop':'10px'}}/>
                </div>
            </React.Fragment>;
        return (
            <MarxanDialog 
                {...this.props} 
                onOk={this.createNewInterestFeature.bind(this)}
                okDisabled={!(this.props.name!=='' && this.props.description!=='' && this.props.filename!=='')}
                okLabel={this.props.creatingNewPlanningGrid ? "Creating..." : "OK" }
                showCancelButton={true}
                contentWidth={500}
                title="New feature" 
                children={c} 
                onRequestClose={this.props.onOk} 
            />
        );
    }
}

export default NewFeatureDialog;