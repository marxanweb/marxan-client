import * as React from 'react';
import UploadFolder from './UploadFolder';
import ShapefileUpload from './ShapefileUpload';
import TextField from 'material-ui/TextField';

class UploadMarxanFiles extends React.Component { 
    constructor(props) {
        super(props);
        this.state = {planning_grid_name:'', zipFilename: ''}; 
    }
    setzipFilename(filename) { 
        this.setState({ zipFilename: filename });
        this.props.setZipFilename(filename);
    } 
    render() {
        return (
            <React.Fragment>
                <div style={{padding:'10px'}}>
                    <UploadFolder label="Project folder" filesListed={this.props.filesListed}/>
                    <TextField value={this.props.planning_grid_name} onChange={this.props.setPlanningGridName} floatingLabelText="Planning grid name" floatingLabelFixed={true} />
                    <ShapefileUpload requestEndpoint={this.props.requestEndpoint} SEND_CREDENTIALS={this.props.SEND_CREDENTIALS} mandatory={true} filename={this.state.zipFilename} setFilename={this.setzipFilename.bind(this)} checkForErrors={this.props.checkForErrors} label="Shapefile" style={{'paddingTop':'10px'}}/> 
                </div>
            </React.Fragment>
        );
    }
}

export default UploadMarxanFiles;
