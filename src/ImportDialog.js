import React from 'react';
import 'react-table/react-table.css';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import ShapefileUpload from './ShapefileUpload';
import SelectFolder from './SelectFolder';
import TextField from 'material-ui/TextField';
import axios, { post } from 'axios';

class ImportDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {projectName:'', projectDescription:'', zipFilename: '',uploading:false };
    }
    setzipFilename(zipFilename) {
        this.setState({ zipFilename: zipFilename });
    }
    changeName(event){
        this.setState({projectName:event.target.value});
    }
    changeDescription(event){
        this.setState({projectDescription:event.target.value});
    }
    onChange(e) {
        if (e.target.files.length) {
            this.fileUpload(e.target.files);
        }
    }
    folderSelected(files) {
        var file;
        const url = "https://db-server-blishten.c9users.io/marxan/webAPI2.py/postFileWithFolder";
        for (var i = 0; i < files.length; i++) {
            file = files.item(i);
            const formData = new FormData();
            formData.append('value', file);
            formData.append('filename', file.webkitRelativePath);
            formData.append('user', this.props.user);
            const config = {
                headers: {
                    'content-type': 'multipart/form-data'
                }
            };
            post(url, formData, config).then((response) => this.finishedLoading(response));
        }
    }
    finishedLoading(response) {
        if (response.error === undefined) {
            this.setState({ loading: false });
        }
    }
    render() {
        const actions = [
            <RaisedButton label="Close" primary={true} onClick={this.props.closeImportDialog} className="projectsBtn"/>,
            <RaisedButton label="Import" primary={true} onClick={this.props.importDesktopMarxan} className="projectsBtn"/>,
        ];
        return (
            <Dialog 
                overlayStyle={{display:'none'}} 
                className={'dialog'} 
                title="Import Marxan Desktop Project" 
                children={
                <div>
                    <TextField value={this.state.projectName} onChange={this.changeName.bind(this)} style={{width:'500px',display:'block'}} floatingLabelText="Enter a name" floatingLabelFixed={true}/>
                    <TextField value={this.state.projectDescription} onChange={this.changeDescription.bind(this)} style={{width:'500px',display:'block'}} multiLine={true} rows={2} floatingLabelText="Enter a description" floatingLabelFixed={true}/>
                    <SelectFolder label="Project folder" user={this.props.user} folderSelected={this.folderSeleced.bind(this)} uploading={this.state.uploading}/>
                    <ShapefileUpload mandatory={true} filename={this.state.zipFilename} setFilename={this.setzipFilename.bind(this)} label="Zipped shapefile" style={{'paddingTop':'10px'}}/> 
                </div>
        }
        actions = { actions }
        open = { this.props.open }
        onRequestClose = { this.props.closeImportDialog }
        contentStyle = { { width: '500px' } }
         titleClassName={'dialogTitleStyle'}
        />
    );
}
}

export default ImportDialog;
