import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import FileUpload from './FileUpload.js';

class FilesDialog extends React.Component {
    constructor(props) {
      super(props);
      this.state = { 'allFilesUploaded': true };
      this.nUploading = 0;
    }
    openParametersDialog() {
      this.props.openParametersDialog();
    } 
    closeParametersDialog() {
      this.props.closeParametersDialog();
    }
    validateUploads(validated, parameter, filename) {
      //each time we upload a file we increment the uploading files counter - when it has finished then we decrement the counter
      validated ? this.nUploading -= 1 : this.nUploading += 1;
      (this.nUploading === 0) ? this.setState({ 'allFilesUploaded': true }): this.setState({ 'allFilesUploaded': false });
      if (validated) this.props.fileUploaded(parameter, filename);
    }

    render() {
        return (
          <Dialog title="Files" 
              overlayStyle={{display:'none'}} 
              open={this.props.open}               
              className={'dialogGeneric'}
              style={{marginTop:'205px',width:'350px',marginLeft: '135px'}}
              actions={[
                <React.Fragment>
                  <RaisedButton 
                      label="OK" 
                      onClick={this.props.closeFilesDialog}
                      primary={true} 
                      className="projectsBtn"
                      style={{height:'25px'}}
                  />
              </React.Fragment>
              ]} 
              onRequestClose={this.props.closeFilesDialog} 
              contentStyle={{width:'350px'}}
              titleClassName={'dialogTitleStyle'}
              children={
                <div>
                  <div className={'uploadControls'}>
                    <FileUpload parameter="SPECNAME" mandatory={true} value={this.props.files.SPECNAME} label="Species file" fileUploaded={this.validateUploads.bind(this)} user={this.props.user} project={this.props.project}/>
                    <FileUpload parameter="PUNAME" mandatory={true} value={this.props.files.PUNAME} label="Planning unit file" fileUploaded={this.validateUploads.bind(this)} user={this.props.user} project={this.props.project}/>
                    <FileUpload parameter="PUVSPRNAME" value={this.props.files.PUVSPRNAME} label="Planning unit vs species file" fileUploaded={this.validateUploads.bind(this)} user={this.props.user} project={this.props.project}/>
                    <FileUpload parameter="BOUNDNAME" value={this.props.files.BOUNDNAME} label="Boundary length file" fileUploaded={this.validateUploads.bind(this)} user={this.props.user} project={this.props.project}/>
                    <FileUpload parameter="BLOCKDEFNAME" value={this.props.files.BLOCKDEFNAME} label="Block definitions" fileUploaded={this.validateUploads.bind(this)} user={this.props.user} project={this.props.project}/>
                  </div>
                </div>
              }/>
    );
  }
}

export default FilesDialog;
