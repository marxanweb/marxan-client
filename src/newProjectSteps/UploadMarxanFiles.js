import * as React from 'react';
import UploadFolder from '../UploadFolder';

class UploadMarxanFiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = { log: '' };
    }
    onChange(e) {
        if (e.target.files.length) {
            this.fileUpload(e.target.files);
        }
    }
    filesListed(files) { 
        var file, filenames = [];
        for (var i = 0; i < files.length; i++) {
            file = files.item(i);
            filenames.push(file.webkitRelativePath);
        }
        var log = files.length + ' files<br/>' + filenames.join("<br/>") + "<br/>Uploading...";
        this.fileCount = files.length;
        this.setState({ log: log });
    }
    fileUploadStarted(file) {

    }
    fileUploadStopped(file) {
        var log = this.state.log + "<br/>" + file + " uploaded";
        this.updateLog(log);
    }
    allFilesUploaded() {
        var log = this.state.log + "<br/>Completed<br/>";
        this.updateLog(log);
        this.props.allFilesUploaded();
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
                        filesListed={this.filesListed.bind(this)}
                        fileUploadStarted={this.fileUploadStarted.bind(this)}
                        fileUploadStopped={this.fileUploadStopped.bind(this)}
                        allFilesUploaded={this.allFilesUploaded.bind(this)}
                        user={this.props.user}
                        project={this.props.project}
                    />
                    <div id="log" dangerouslySetInnerHTML={{__html:this.state.log}} style={{width:'450px','overflowX':'hidden'}}></div>
                </div>
            </React.Fragment>
        );
    }
}

export default UploadMarxanFiles;
