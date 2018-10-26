import React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import Metadata from './newProjectSteps/Metadata';
import PlanningUnits from './newProjectSteps/PlanningUnits';
import SelectFeatures from './newProjectSteps/SelectFeatures';
import SelectCostFeatures from './newProjectSteps/SelectCostFeatures';
import Options from './newProjectSteps/Options';
import CheckboxList from './CheckboxList';

class NewProjectDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            steps: ['Info', 'Planning units', 'Features', 'Costs', 'Options'],
            finished: false,
            stepIndex: 0,
            name: '',
            description: '',
            pu: '',
            allInterestFeaturesDialogOpen: false,
            copiedFeatures: []
        };
    }
    componentDidUpdate(prevProps, prevState ){
        if (prevProps.features.length !== this.props.features.length){ //coarse comparison at the moment
            this.setState({copiedFeatures: JSON.parse(JSON.stringify(this.props.features))}); //a copy of all the features
        }
    }
    handleNext = () => {
        const { stepIndex } = this.state;
        this.setState({
            stepIndex: stepIndex + 1
        });
    };
    handlePrev = () => {
        const { stepIndex } = this.state;
        if (stepIndex > 0) {
            this.setState({ stepIndex: stepIndex - 1 });
        }
    };
    createNewProject() {
        this.props.createNewProject({ name: this.state.name, description: this.state.description, planning_grid_name: this.state.pu, features:this.state.copiedFeatures.filter((item)=>{return item.selected}) });
        this.closeNewProjectDialog();
    }
    closeNewProjectDialog() {
        //reset to the beginning
        this.setState({ stepIndex: 0 });
        this.props.closeNewProjectDialog();
    }
    setName(value) {
        this.setState({ name: value });
    }
    setDescription(value) {
        this.setState({ description: value });
    }
    changePU(value) {
        this.setState({ pu: value });
    }
    updateTargetValue() {
        //to stop it calling the passed in updateTargetValue
    }
    openAllInterestFeaturesDialog(){
        this.setState({allInterestFeaturesDialogOpen: true});
    }
    closeAllInterestFeaturesDialog(){
        this.setState({allInterestFeaturesDialogOpen: false});
    }
    featureSelectionDone(features){
        this.setState({copiedFeatures: features});
        this.closeAllInterestFeaturesDialog();
    }
    render() {
        const { stepIndex } = this.state;
        const contentStyle = { margin: '0 16px' };
        const actions = [
            <div style={{width: '100%', maxWidth: '500px', margin: 'auto',textAlign:'center'}}>
                {/*dynamically create the stepper
                <Stepper activeStep={stepIndex}>
                    {this.state.steps.map((item) => {return <Step key={item}><StepLabel>{item}</StepLabel></Step>})}
                </Stepper> */}
                <div style={contentStyle}>
                    <div style={{marginTop: 12}}>
                        <RaisedButton 
                            className="projectsBtn" 
                            label="Back" 
                            disabled={stepIndex === 0} 
                            onClick={this.handlePrev} 
                            style={{height:'25px'}}
                        />
                        <RaisedButton 
                            className="projectsBtn" 
                            label={stepIndex === (this.state.steps.length-1) ? 'Finish' : 'Next'} 
                            onClick={stepIndex === (this.state.steps.length-1) ? this.createNewProject.bind(this) : this.handleNext} 
                            primary={true} 
                            style={{height:'25px'}}
                        />
                    </div>
                </div>
            </div>
        ];
        let c = <div>
                    {stepIndex === 0 ? <Metadata name={this.state.name} description={this.state.description} setName={this.setName.bind(this)} setDescription={this.setDescription.bind(this)}/> : null}
                    {stepIndex === 1 ? <PlanningUnits getPlanningUnitGrids={this.props.getPlanningUnitGrids} planning_unit_grids={this.props.planning_unit_grids} changeItem={this.changePU.bind(this)} pu={this.state.pu} openNewPlanningUnitDialog={this.props.openNewPlanningUnitDialog} /> : null}
                    {stepIndex === 2 ? <SelectFeatures 
                        features={this.state.copiedFeatures.filter((item)=>{return item.selected;})}
                        openAllInterestFeaturesDialog={this.openAllInterestFeaturesDialog.bind(this)}  
                        updateTargetValue={this.updateTargetValue}
                        simple={true}
                    /> : null}
                    {stepIndex === 3 ? <SelectCostFeatures
                        openAllCostsDialog={this.props.openAllCostsDialog}
                        selectedCosts={this.props.selectedCosts}
                    /> : null}
                    {stepIndex === 4 ? <Options/> : null}
                </div>;
        return (
            <React.Fragment>
            <Dialog 
                title={'New project - ' + this.state.steps[stepIndex]}
                overlayStyle={{display:'none'}} 
                className={'dialogGeneric'} 
                style={{position:'absolute', display: this.props.open ? 'block' : 'none', width:'400px', marginTop:'46px',marginLeft:'106px'}} 
                children={c} 
                actions={actions} 
                open={this.props.open} 
                onRequestClose={this.closeNewProjectDialog.bind(this)} 
                contentStyle={{width:'400px'}} 
                titleClassName={'dialogTitleStyle'}
            />
            <Dialog
                title={'Features' }
                overlayStyle={{display:'none'}} 
                className={'dialogGeneric'} 
                style={{position:'absolute', display: this.props.open ? 'block' : 'none', width:'400px', marginTop:'91px',marginLeft:'162px', height: '330px'}} 
                children={[
                <CheckboxList 
                    features={this.state.copiedFeatures} 
                    selectionDone={this.featureSelectionDone.bind(this)}
                    key={'allFeaturesList'}
                    />
                ]} 
                actions={
                    []
                } 
                open={this.state.allInterestFeaturesDialogOpen} 
                onRequestClose={this.closeAllInterestFeaturesDialog.bind(this)} 
                contentStyle={{width:'400px'}} 
                titleClassName={'dialogTitleStyle'}
            />
            </React.Fragment>
        );
    }
}

export default NewProjectDialog;
