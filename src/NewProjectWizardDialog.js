import * as React from 'react';
import MarxanDialog from './MarxanDialog';
import ToolbarButton from './ToolbarButton';
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import Checkbox from 'material-ui/Checkbox';

class NewProjectWizardDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = {steps: ['Country', 'Planning units', 'Habitats','Species', 'Existing PAs'],  stepIndex: 0, stepComplete: false, iso3:'', country: '', domain:'', shape:'Hexagon', areakm2: 50, worldEcosystems:false, allSpecies:false, endemicSpecies:false, endangeredSpecies:false,includeExistingPAs:false, iucn_category:'None'};
    }
    //moves to the next step of the wizard
	handleNext = () => {
		this.setState({stepIndex: this.state.stepIndex + 1});
	};
    //moves to the previous step of the wizard
	handlePrev = () => {
		this.setState({stepIndex: this.state.stepIndex - 1});
	};
	getComplete(){
	    let complete = false;
	    switch (this.state.stepIndex) {
	        case 0:
                complete = (this.state.country !=='' && this.state.domain !=='');	            
	            break;
	        case 1:
                complete = (this.state.shape !=='' && this.state.areakm2 !==0);	            
	            break;
	        default:
	            // code
	    }
	    this.setState({stepComplete: complete});
	}
	changeCountry(evt, value) {
		this.setState({iso3: this.props.countries[value].iso3, country: this.props.countries[value].name_iso31}, () => this.getComplete());
	}
	changeDomain(evt, value) {
		this.setState({domain: this.props.domains[value]}, () => this.getComplete());
	}
	changeShape(evt, value) {
		this.setState({shape: this.props.shapes[value]}, () => this.getComplete());
	}
	changeAreaKm2(evt, value) {
		this.setState({areakm2: this.props.areakm2s[value]}, () => this.getComplete());
	}
    toggleWorldEcosystems(evt, isInputChecked){
        this.setState({worldEcosystems: isInputChecked});
    }
    toggleAllSpecies(evt, isInputChecked){
        this.setState({allSpecies: isInputChecked});
    }
    toggleEndemicSpecies(evt, isInputChecked){
        this.setState({endemicSpecies: isInputChecked});
    }
    toggleEndangeredSpecies(evt, isInputChecked){
        this.setState({endangeredSpecies: isInputChecked});
    }
    toggleIncludeExistingPAs(evt, isInputChecked){
        this.setState({includeExistingPAs: isInputChecked});
    }
    changeIucnCategory(evt, value){
		this.setState({iucn_category: this.props.iucn_categories[value]});
    }
    //create a new national project
	createNewNationalProject(){
	    this.props.createNewNationalProject(this.state);
	}
    render() {
        let dropDownStyle = {width: "240px"};
        const actions = [
            <div style={{width: '100%', maxWidth: '500px', margin: 'auto',textAlign:'center'}}>
				<div style={{margin: '0 16px'}}>
					<div style={{marginTop: 12}}>
						<ToolbarButton label="Back" disabled={this.state.stepIndex === 0}  onClick={this.handlePrev} />
						<ToolbarButton label={this.state.stepIndex === (this.state.steps.length-1) ? 'Finish' : 'Next'} onClick={this.state.stepIndex === (this.state.steps.length-1) ? this.createNewNationalProject.bind(this) : this.handleNext} primary={true} disabled={!this.state.stepComplete}/>
					</div>
				</div>
			</div>
        ];
        const children =    <div className={'newNationalProjectContent'}>
                                {this.state.stepIndex === 0 ? 
                                <React.Fragment key={'_wiz01'}>
                                    <div>Choose a country and domain</div>
        							<SelectField menuItemStyle={{ fontSize: "12px" }} labelStyle={{ fontSize: "12px" }} onChange={this.changeCountry.bind(this)} value={this.state.iso3} floatingLabelText="Country" floatingLabelFixed={true}>
        								{this.props.countries.map(item => {
        									return (
        										<MenuItem style={{ fontSize: "12px" }} value={item.iso3} primaryText={item.name_iso31} key={item.iso3} />
        									);
        								})}
        							</SelectField> 
        							<br/>
        							<SelectField menuItemStyle={{ fontSize: "12px" }} labelStyle={{ fontSize: "12px" }} onChange={this.changeDomain.bind(this)} value={this.state.domain} style={dropDownStyle} floatingLabelText="Domain" floatingLabelFixed={true}>
        								{this.props.domains.map(item => {
        									return (
        										<MenuItem style={{ fontSize: "12px" }} value={item} primaryText={item} key={item} />
        									);
        								})}
        							</SelectField>
                                </React.Fragment>
                                : null}
                                {this.state.stepIndex === 1 ? 
                                <React.Fragment key={'_wiz02'}>
                                    <div>Choose the shape and size of the planning units</div>
        							<SelectField menuItemStyle={{ fontSize: "12px" }} labelStyle={{ fontSize: "12px" }} onChange={this.changeShape.bind(this)} value={this.state.shape} style={dropDownStyle} floatingLabelText="Planning unit shape" floatingLabelFixed={true}>
        								{this.props.shapes.map(item => {
        									return (
        										<MenuItem style={{ fontSize: "12px" }} value={item} primaryText={item} key={item} />
        									);
        								})}
        							</SelectField>
        							<br/>
        							<SelectField menuItemStyle={{ fontSize: "12px" }} labelStyle={{ fontSize: "12px" }} onChange={this.changeAreaKm2.bind(this)} value={this.state.areakm2} style={dropDownStyle} floatingLabelText="Area of each planning unit" floatingLabelFixed={true}>
        								{this.props.areakm2s.map(item => {
        									return (
        										<MenuItem style={{ fontSize: "12px" }} value={item} primaryText={item + " Km2"} key={item} />
        									);
        								})}
        							</SelectField>
                                </React.Fragment>
                                : null}
                                {this.state.stepIndex === 2 ? 
                                <React.Fragment key={'_wiz03'}>
                                    <div>What habitats do you want to include in your project?</div>
                                    <div className={'habitatsList'}>
                                        <Checkbox label="World Ecosystems" style={{fontSize:'12px'}} onCheck={this.toggleWorldEcosystems.bind(this)} />
                                    </div>
                                </React.Fragment>
                                : null}
                                {this.state.stepIndex === 3 ? 
                                <React.Fragment key={'_wiz04'}>
                                    <div>What species do you want to include in your project?</div>
                                    <div className={'speciesList'}>
                                        <Checkbox label={"All species that occur in " + this.state.country} style={{fontSize:'12px'}} onCheck={this.toggleAllSpecies.bind(this)} />
                                        <Checkbox label={"All species that are endemic to " + this.state.country} style={{fontSize:'12px'}} onCheck={this.toggleEndemicSpecies.bind(this)} />
                                        <Checkbox label={"All endangered species that occur in " + this.state.country} style={{fontSize:'12px'}} onCheck={this.toggleEndangeredSpecies.bind(this)} />
                                    </div>
                                </React.Fragment>
                                : null}
                                {this.state.stepIndex === 4 ? 
                                <React.Fragment key={'_wiz05'}>
                                    <div>Do you want to include existing protected areas?</div>
                                    <div className={'speciesList'}>
                                        <Checkbox label={"Include existing protected areas"} style={{fontSize:'12px'}} onCheck={this.toggleIncludeExistingPAs.bind(this)} />
            							<SelectField menuItemStyle={{ fontSize: "12px" }} labelStyle={{ fontSize: "12px" }} onChange={this.changeIucnCategory.bind(this)} value={this.state.iucn_category} style={dropDownStyle} floatingLabelText="IUCN Category" floatingLabelFixed={true} disabled={!this.state.includeExistingPAs}>
            								{this.props.iucn_categories.map((item)=> {
    											return  <MenuItem value={item} key={item} primaryText={item} style={{fontSize:'12px'}} />; 
    										})}
            							</SelectField>
            						</div>
                                </React.Fragment>
                                : null}
                            </div>;
        return (
            <MarxanDialog 
            	{...this.props} 
				title={'New national project'}
				contentWidth={600}
				showCancelButton={true}
				onCancel={this.props.closeNewProjectWizardDialog}
				onRequestClose={this.props.closeNewProjectWizardDialog} 
				helpLink={"docs_user.html#creating-new-projects"}
				actions={actions}
				children={children}
			/>
        );
    }
}

export default NewProjectWizardDialog;
