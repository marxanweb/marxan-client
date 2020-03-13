import * as React from 'react';
import MarxanImportFeatureDialog from './MarxanImportFeatureDialog';
import TextField from 'material-ui/TextField';

class NewFeatureDialog extends React.Component {
	constructor(props){
		super(props);
		this.state = {name:"",description:""};
	}
	changeName(event, newValue) {
		this.setState({name:newValue});
	}
	changeDescription(event, newValue) {
		this.setState({description: newValue});
	}
	createNewFeature(){
		this.props.createNewFeature(this.state.name, this.state.description);
	}
	render() {
		let c = 
			<React.Fragment key="k12">
				<div> 
					<TextField value={this.state.name} onChange={this.changeName.bind(this)} style={{display:'block'}} floatingLabelText="Enter a name" floatingLabelFixed={true}/>
					<TextField value={this.state.description} onChange={this.changeDescription.bind(this)} style={{display:'block'}} multiLine={true} rows={2} floatingLabelText="Enter a description" floatingLabelFixed={true}/>
				</div>
			</React.Fragment>;
		return (
			<MarxanImportFeatureDialog  
				{...this.props} 
				onOk={this.createNewFeature.bind(this)}
				okDisabled={!(this.state.name!=='' && this.state.description!=='' && this.props.loading===false)}
				showCancelButton={true}
				contentWidth={420}
				title="Create new feature" 
				children={c} 
				onRequestClose={this.props.onOk} 
				helpLink={"user.html#drawing-features-on-screen"}
			/>
		);
	}
}

export default NewFeatureDialog;