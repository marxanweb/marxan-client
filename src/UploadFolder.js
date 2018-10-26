import React from 'react';
import FontAwesome from 'react-fontawesome';
import axios, { post } from 'axios';

//uploading a folder is only supported in Chrome at the moment and there are issues with using this component
// to upload folders the webkitdirectory attribute must be present on the input element
// react uses whitelisting of attributes for nodes and the webkitdirectory attribute is currently not on the list so you have to add it manually - that is what _addDirectory does

// component requires:
// postUrl - the end point where the folder and its files will be uploaded to
// filesListed - an event that has a single parameter which is the files in the selected folder
// fileUploadStarted - an event that has a single parameter which is the name of the file that has started to upload
// fileUploadStopped - an event that has a single parameter which is the name of the file that has finished uploading

class UploadFolder extends React.Component {
    constructor(props) {
        super(props);
        this.state = { loading: false };
    }
    onChange(e) {
        this.props.filesListed(e.target.files);
        if (e.target.files.length) {
            this.uploadFiles(e.target.files);
        }
    }
    uploadFiles(files) {
        var file, filepath;
        this.setState({ loading: true });
        this.fileCount = files.length;
        for (var i = 0; i < files.length; i++) {
            file = files.item(i);
            const formData = new FormData();
            formData.append('user', this.props.user);
            formData.append('project', this.props.project);
            //the webkitRelativePath will include the folder itself so we have to remove this, e.g. Marxan default project - Copy/input/puvspr.dat -> /input/puvspr.da
            filepath = file.webkitRelativePath.split("/").slice(1).join("/")
            formData.append('filename', filepath);
            formData.append('value', file);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            };
            this.props.fileUploadStarted(file.webkitRelativePath);
            post(this.props.postUrl, formData, config).then((response) => this.finishedLoading(response));
        }
    }
    finishedLoading(response) {
        this.props.fileUploadStopped(response.data.file);
        this.fileCount = this.fileCount - 1;
        if (this.fileCount === 0) {
            this.props.allFilesUploaded();
            this.setState({ loading: false });
        }
    }
    _addDirectory(node) {
        if (node) {
            node.directory = true;
            node.webkitdirectory = true;
        }
    }
    render() {
        return (
            <div className='uploadFileFieldIcon'>
                <div style={{'width':'180px'}}>{this.props.label}</div>
                <div className='uploadFileField' style={{width:'280px'}}>
                    <div className='uploadFileFieldIcon' style={{display: 'inline-flex'}}>
                        <div style={{display: 'inline-flex'}}>
                            <label htmlFor={'folderSelector'}>
                                <FontAwesome name='folder' title='Click to upload a file' style={{'cursor':'pointer', display: 'inline-flex'}}/>
                            </label>
                        </div>
                        <input id='folderSelector' ref={node => this._addDirectory(node)} type='file' onChange={this.onChange.bind(this)} style={{'display':'none', 'width':'10px'}}/>
                    </div>
                    <div className='uploadFileFieldLabel' style={{width:'200px'}}>{this.props.foldername}</div>
                    <div style={{    width: '20px',display: 'inline-flex'}}><FontAwesome name='sync' spin style={{'display': (this.state.loading ? 'block' : 'none'), 'marginLeft':'6px'}}/></div>
                </div>
            </div>
        );
    }
}

export default UploadFolder;
