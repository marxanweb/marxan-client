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
    render() {
        let c = 
            <React.Fragment key="k12">
                <div> 
                    <TextField value={this.props.name} onChange={this.changeName.bind(this)} style={{display:'block'}} floatingLabelText="Enter a name" floatingLabelFixed={true}/>
                    <TextField value={this.props.description} onChange={this.changeDescription.bind(this)} style={{display:'block'}} multiLine={true} rows={2} floatingLabelText="Enter a description" floatingLabelFixed={true}/>
                    {(this.props.newFeatureSource === "import") ? <ShapefileUpload SEND_CREDENTIALS={this.props.SEND_CREDENTIALS} requestEndpoint={this.props.requestEndpoint} checkForErrors={this.props.checkForErrors} mandatory={true} name={this.props.name} description={this.props.description} filename={this.props.filename} setFilename={this.props.setFilename} label="Shapefile" style={{'paddingTop':'10px'}}/> : null}
                </div>
            </React.Fragment>;
        return (
            <MarxanDialog  
                {...this.props} 
                onOk={this.props.createNewFeature}
                okDisabled={!(this.props.name!=='' && this.props.description!=='' && ((this.props.filename!=='' && this.props.newFeatureSource === "import")||(this.props.filename==='' && this.props.newFeatureSource === "digitising")) && (this.props.loading===false))}
                showCancelButton={true}
                contentWidth={420}
                title="New feature" 
                children={c} 
                onRequestClose={this.props.onOk} 
            />
        );
    }
}

export default NewFeatureDialog;