import * as React from 'react';
import UploadFolder from '../UploadFolder';
import ShapefileUpload from '../ShapefileUpload';

class UploadMarxanFiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = { name: '', description: '', zipFilename: ''};
    }
    folderSet(folder){
        
    }
    filesListed(files) { 
        var file, filenames = [];
        for (var i = 0; i < files.length; i++) {
            file = files.item(i);
            filenames.push(file.webkitRelativePath);
        }
        var log = files.length + ' files\n' + filenames.join("\n");
        this.fileCount = files.length;
        this.props.setLog(log);
    }
    fileUploadStarted(file) {

    }
    fileUploadStopped(file) {
        var log = this.state.log + "\n" + file + " uploaded";
        this.updateLog(log); 
    }
    allFilesUploaded() {
        var log = this.state.log + "\nCompleted\n";
        this.updateLog(log);
        this.props.allFilesUploaded();
    }
    setzipFilename(filename) {
        this.setState({ zipFilename: filename });
        this.setState({ log: "Uploaded\nUploading to MapBox..." });
        this.props.uploadShapefile(this.state.zipFilename, this.state.zipFilename.slice(0, -4), "Imported as " + this.state.zipFilename + " using the import wizard");
    }
    updateLog(message) {
        this.setState({ log: message });
    }
    render() {
        return (
            <React.Fragment>
                <div className={'newPUDialogPane'}>
                    <UploadFolder 
                        label="Project folder" 
                        postUrl={'https://db-server-blishten.c9users.io/marxan/webAPI2.py/postFileWithFolder'} 
                        folderSet={this.folderSet.bind(this)}
                        filesListed={this.filesListed.bind(this)}
                        fileUploadStarted={this.fileUploadStarted.bind(this)}
                        fileUploadStopped={this.fileUploadStopped.bind(this)}
                        allFilesUploaded={this.allFilesUploaded.bind(this)}
                        user={this.props.user}
                        project={this.props.project}
                    />
                    <ShapefileUpload mandatory={true} filename={this.state.zipFilename} setFilename={this.setzipFilename.bind(this)} label="Zipped shapefile" style={{'paddingTop':'10px'}}/> 
                </div>
            </React.Fragment>
        );
    }
}

export default UploadMarxanFiles;
