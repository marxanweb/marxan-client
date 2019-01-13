import * as React from 'react';
import UploadFolder from '../UploadFolder';
import ShapefileUpload from '../ShapefileUpload';

class UploadMarxanFiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: '', description: '', zipFilename: ''};
    }
    filesListed(files){
        this.fileCount = files.length;
    }
    
    fileUploadStarted(file) {
        
    }
    
    fileUploadStopped(file) {
        this.props.setLog(file + " uploaded"); 
    }
    
    allFilesUploaded() {
        this.props.setLog("\n" + this.fileCount + " files uploaded"); 
        this.props.allFilesUploaded();
    }
    
    setzipFilename(filename) {
        this.setState({ zipFilename: filename });
        this.setState({ log: "Uploaded\nUploading to MapBox..." });
        this.props.uploadShapefile(filename, filename.slice(0, -4), "Imported as " + filename + " using the import wizard");
    }
    render() {
        return (
            <React.Fragment>
                <div className={'newPUDialogPane'}>
                    <UploadFolder 
                        label="Project folder" 
                        filesListed={this.filesListed.bind(this)}
                        postUrl={this.props.MARXAN_ENDPOINT_HTTPS + "uploadFile"} 
                        fileUploadStarted={this.fileUploadStarted.bind(this)}
                        fileUploadStopped={this.fileUploadStopped.bind(this)}
                        allFilesUploaded={this.allFilesUploaded.bind(this)}
                        user={this.props.user}
                        project={this.props.project}
                    />
                    <ShapefileUpload MARXAN_ENDPOINT_HTTPS={this.props.MARXAN_ENDPOINT_HTTPS} mandatory={true} filename={this.state.zipFilename} setFilename={this.setzipFilename.bind(this)} label="Zipped shapefile" style={{'paddingTop':'10px'}}/> 
                </div>
            </React.Fragment>
        );
    }
}

export default UploadMarxanFiles;
