import React from 'react';
import MarxanDialog from './MarxanDialog';
import ToolbarButton from './ToolbarButton';
import Metadata from './Metadata';
import UploadMarxanFiles from './UploadMarxanFiles';

//some of the code in this component should be moved up to app.js like the POSTs but I have limited time

class ImportDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { steps: ['Files and planning grid','Info' ], loading: false, stepIndex: 0, name: '', description: '', zipFilename: '', files:[] };
    }
    handleNext = () => {
        const { stepIndex } = this.state;
        if (stepIndex === 1) {
            this.setState({loading: true});
            //create the new project 
            this.props.importProject(this.state.name, this.state.description, this.state.zipFilename, this.state.files).then(function(response){
                //close the import wizard
                this.onOk();
            }.bind(this), function(error) {
                this.setState({loading: false});
                this.props.setLog("\nImport stopped");
            }.bind(this));
            return;
        }
        this.setState({ stepIndex: stepIndex + 1 });
    };
    handlePrev = () => {
        const { stepIndex } = this.state;
        if (stepIndex > 0) {
            this.setState({ stepIndex: stepIndex - 1 });
        }
    };
    filesListed(files){
        this.setState({files: files});
    }
    setZipFilename(filename){
        this.setState({zipFilename: filename});
    }
    setName(value) {
        this.setState({ name: value });
    }
    setDescription(value) {
        this.setState({ description: value });
    }
    onOk(){
        //return the wizard back to zero
        this.setState({loading: false, stepIndex: 0 });
        this.props.onOk();
    }
    render() {
        const { stepIndex } = this.state; 
        const contentStyle = { margin: '0 16px' };
        const actions = [
            <div style={{width: '100%', maxWidth: 700, margin: 'auto',textAlign:'center'}}>
                <div style={contentStyle}>
                    <div style={{marginTop: 12}}>
                        <ToolbarButton label="Back" disabled={stepIndex === 0} onClick={this.handlePrev} />
                        <ToolbarButton label={stepIndex === (this.state.steps.length-1) ? 'Finish' : 'Next'} onClick={this.handleNext.bind(this)} primary={true} disabled={this.state.loading} />
                    </div>
                </div>
            </div>
        ];
        let c = <React.Fragment key="k4">
                    <div>
                        {stepIndex === 0 ? <UploadMarxanFiles 
                            filesListed={this.filesListed.bind(this)}
                            setZipFilename={this.setZipFilename.bind(this)}
                            httpsEndpoint={this.props.httpsEndpoint} 
                            SEND_CREDENTIALS={this.props.SEND_CREDENTIALS}
                            checkForErrors={this.props.checkForErrors} 
                        /> : null}
                        {stepIndex === 1 ? <Metadata name={this.state.name} description={this.state.description} setName={this.setName.bind(this)} setDescription={this.setDescription.bind(this)}/> : null}
                    </div>
                </React.Fragment>;
        return (
            <MarxanDialog 
                {...this.props} 
                showSpinner={this.state.loading}
                title={'Import - ' + this.state.steps[stepIndex]}
                contentWidth={420}
                children={c} 
                okLabel={"Cancel"}
                actions={actions} 
                onOk={this.onOk.bind(this)}
                onRequestClose={this.onOk.bind(this)} 
            />
        );
    }
}

export default ImportDialog;
