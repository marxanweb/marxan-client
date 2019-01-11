import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import FlatButton from 'material-ui/FlatButton';
import Metadata from './newProjectSteps/Metadata';
import UploadMarxanFiles from './newProjectSteps/UploadMarxanFiles';

//some of the code in this component should be moved up to app.js like the POSTs but I have limited time

class ImportWizard extends React.Component {
    constructor(props) {
        super(props);
        this.state = {steps: ['Info', 'Files and planning grid'], finished: false, stepIndex: 0, name: '', description: '', pu: ''};
        this.props.setLog('', true);
    }
    handleNext = () => {
        const { stepIndex } = this.state;
        if (stepIndex === 0) {
            //create the new project 
            this.props.createImportProject({ name: this.state.name, description: this.state.description}).then(function(response){
                this.setState({stepIndex: stepIndex + 1});
            }.bind(this));
        }
    };
    handlePrev = () => {
        const { stepIndex } = this.state;
        if (stepIndex > 0) {
            this.setState({ stepIndex: stepIndex - 1 });
        }
    };
    setLog(log){
        this.props.setLog(log, true);
    }
    allFilesUploaded(){
        
    }
    closeImportWizard() {
        //reset to the beginning
        this.setState({ stepIndex: 0 });
        this.props.closeImportWizard();
    }
    setName(value) {
        this.setState({ name: value });
    }
    setDescription(value) {
        this.setState({ description: value });
    }
    render() {
        const { stepIndex } = this.state;
        const contentStyle = { margin: '0 16px' };
        const actions = [
            <div style={{width: '100%', maxWidth: 700, margin: 'auto',textAlign:'center'}}>
                <div style={contentStyle}>
                    <div style={{marginTop: 12}}>
                        <FlatButton label="Back" disabled={stepIndex === 0} onClick={this.handlePrev} />
                        <RaisedButton label={stepIndex === (this.state.steps.length-1) ? 'Finish' : 'Next'} onClick={stepIndex === (this.state.steps.length-1) ? this.closeImportWizard.bind(this) : this.handleNext} primary={true}/>
                    </div>
                </div>
            </div>
        ];
        let c = <div>
                    {stepIndex === 0 ? <Metadata name={this.state.name} description={this.state.description} setName={this.setName.bind(this)} setDescription={this.setDescription.bind(this)}/> : null}
                    {stepIndex === 1 ? <UploadMarxanFiles setLog={this.setLog.bind(this)} user={this.props.user} project={this.state.name} allFilesUploaded={this.allFilesUploaded.bind(this)}/> : null}
                </div>;
        return (
            <Dialog title={'Import - ' + this.state.steps[stepIndex]}
                overlayStyle={{display:'none'}} 
                children={c} 
                actions={actions} 
                open={this.props.open} 
                onRequestClose={this.closeImportWizard.bind(this)} 
                contentStyle={{width:'550px'}} 
                titleClassName={'dialogTitleStyle'}
            />
        );
    }
}

export default ImportWizard;
