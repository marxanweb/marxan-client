import * as React from 'react';
import MarxanDialog from './MarxanDialog';
import TextField from 'material-ui/TextField';
import ShapefileUpload from './ShapefileUpload.js';
import ToolbarButton from './ToolbarButton';
import {RadioButton, RadioButtonGroup} from 'material-ui/RadioButton';

class NewFeatureDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = { steps: ['shapefile', 'single_or_multiple', 'metadata'], stepIndex: 0 };
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
	changeName(event, newValue) {
		this.props.setName(newValue);
	}
	changeDescription(event, newValue) {
		this.props.setDescription(newValue);
	}
	importFeatures(){
		this.props.importFeatures();
		this.props.onOk();
	}
	render() {
		const { stepIndex } = this.state;
		const contentStyle = { margin: '0 16px' };
		const actions = [
			<div style={{width: '100%', maxWidth: '500px', margin: 'auto',textAlign:'center'}}>
				<div style={contentStyle}>
					<div style={{marginTop: 12}}>
						<ToolbarButton label="Back" disabled={stepIndex === 0} onClick={this.handlePrev} />
						<ToolbarButton label={stepIndex === (this.state.steps.length-1) ? 'Finish' : 'Next'} onClick={stepIndex === (this.state.steps.length-1) ? this.importFeatures.bind(this) : this.handleNext} primary={true}/>
					</div>
				</div>
			</div>
		];
		let children =
			<div key="k12" style={{height:'120px',maxHeight:'120px'}}>
				{stepIndex === 0 ? 
					<ShapefileUpload SEND_CREDENTIALS={this.props.SEND_CREDENTIALS} requestEndpoint={this.props.requestEndpoint} checkForErrors={this.props.checkForErrors} mandatory={true} name={this.props.name} description={this.props.description} filename={this.props.filename} setFilename={this.props.setFilename} label="Shapefile" style={{'paddingTop':'10px'}}/> 
				: null}
				{stepIndex === 1 ? 
				    <RadioButtonGroup name="createFeatureType" defaultSelected="single" style={{margin:'10px'}}>
				      <RadioButton value="single" label="Create single feature" style={{padding:'10px'}}/>
				      <RadioButton value="multiple" label="Split into multiple features" style={{padding:'10px'}}/>
				    </RadioButtonGroup>
				: null}
				{(stepIndex === 2) ? 
				<div> 
					<TextField value={this.props.name} onChange={this.changeName.bind(this)} style={{display:'block'}} floatingLabelText="Enter a name" floatingLabelFixed={true}/>
					<TextField value={this.props.description} onChange={this.changeDescription.bind(this)} style={{display:'block'}} multiLine={true} rows={2} floatingLabelText="Enter a description" floatingLabelFixed={true}/>
				</div>
				: null}
			</div>;
		return (
			<MarxanDialog  
				{...this.props} 
				onOk={this.props.onOk}
				okLabel={"Cancel"}
				contentWidth={420}
				title= {(this.props.newFeatureSource === "import") ? "Import features" : "Create feature"}
				children={children} 
				actions={(this.props.newFeatureSource === "import") ? actions : null}  
				onRequestClose={this.props.onOk} 
				helpLink={(this.props.newFeatureSource === "import") ? "docs_user.html#importing-existing-features" : "docs_user.html#create-new-features"}
			/>
		);
	}
}

export default NewFeatureDialog;
