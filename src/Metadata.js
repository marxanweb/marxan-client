import * as React from 'react';
import MarxanTextField from './MarxanTextField';

class Metadata extends React.Component {
	constructor(props) {
		super(props); 
		this.state = {
			validName: undefined
		};
	}
	changeName(event, newValue) {
		this.props.setName(newValue);
	}
	changeDescription(event, newValue) {
		this.props.setDescription(newValue);
	}
	render() {
		return (
			<React.Fragment>
				<div style={{marginBottom:this.props.paddingBottom}}> 
					<MarxanTextField errorText={this.state.validName === false ? 'Required field' : ''} value={this.props.name} onChange={this.changeName.bind(this)} floatingLabelText="Enter a name for the project"/>
					<MarxanTextField value={this.props.description} onChange={this.changeDescription.bind(this)} multiLine={true} rows={3} floatingLabelText="Enter a description for the project"/>
				</div>
			</React.Fragment>
		);
	}
}

export default Metadata;
