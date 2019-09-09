import * as React from "react";
import MarxanDialog from "./MarxanDialog";
import SelectField from "material-ui/SelectField";
import MenuItem from "material-ui/MenuItem";
import ToolbarButton from "./ToolbarButton";
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faArrowAltCircleUp } from '@fortawesome/free-regular-svg-icons';
let domains = ["Marine", "Terrestrial"];
let areakm2s = [10, 20, 30, 40, 50];
let shapes = ['Hexagon', 'Square'];

class NewPlanningGridDialog extends React.Component {
	constructor(props){
		super(props);
		this.state = {iso3: '', domain:'', shape:'', areakm2: undefined};
	}
	changeIso3(evt, value) {
		let iso3 = this.props.countries[value].iso3;
		if (['FJI','KIR','NZL','RUS','TUV','USA','WLF'].includes(iso3)){ //no support currently for countries that span the meridian
			this.setState({iso3: undefined});
			this.props.setSnackBar("Countries that span the meridian are currently not supported. See <a href='" + this.props.ERRORS_PAGE + "#planning-grids-cannot-be-created-for-countries-that-span-the-meridian' target='blank'>here</a>");
		}else{
			this.setState({iso3: this.props.countries[value].iso3});
		}
	}
	changeDomain(evt, value) {
		this.setState({domain: domains[value]});
	}
	changeShape(evt, value) {
		this.setState({shape: shapes[value]});
	}
	changeAreaKm2(evt, value) {
		this.setState({areakm2: areakm2s[value]});
	}
	onOk(){
		//create the new planning grid
		this.props.createNewPlanningUnitGrid(this.state.iso3, this.state.domain, this.state.areakm2, this.state.shape).then(function(response){
			//close the dialog
			this.props.onCancel();
		}.bind(this));
	}
	render() {
		let dropDownStyle = { width: "240px" };
		return (
			<MarxanDialog
				{...this.props}
				onOk={this.onOk.bind(this)}
				onRequestClose={this.props.onCancel}
				okDisabled={ !this.state.iso3 ||!this.state.domain ||!this.state.areakm2 ||this.props.loading}
				cancelLabel={"Cancel"}
				showCancelButton={true}
				helpLink={"docs_user.html#creating-new-planning-grids-using-marxan-web"}
				title="New planning grid"
				contentWidth={358}
				children={
					<React.Fragment key="k13">
						<div>
							<SelectField menuItemStyle={{ fontSize: "12px" }} labelStyle={{ fontSize: "12px" }} onChange={this.changeIso3.bind(this)} value={this.state.iso3} floatingLabelText="Area of interest" floatingLabelFixed={true}>
								{this.props.countries.map(item => {
									return (
										<MenuItem
											style={{ fontSize: "12px" }}
											value={item.iso3}
											primaryText={item.original_n}
											key={item.iso3}
										/>
									);
								})}
							</SelectField> 
							<ToolbarButton icon={<FontAwesomeIcon icon={faArrowAltCircleUp} />} title="Load a custom area of interest from a shapefile (not currently implemented)" style={{position: 'absolute', top: '83px', right: '32px'}}/>
						</div>
						<div>
							<SelectField menuItemStyle={{ fontSize: "12px" }} labelStyle={{ fontSize: "12px" }} onChange={this.changeDomain.bind(this)} value={this.state.domain} style={dropDownStyle} floatingLabelText="Domain" floatingLabelFixed={true}>
								{domains.map(item => {
									return (
										<MenuItem
											style={{ fontSize: "12px" }}
											value={item}
											primaryText={item}
											key={item}
										/>
									);
								})}
							</SelectField>
						</div>
						<div>
							<SelectField menuItemStyle={{ fontSize: "12px" }} labelStyle={{ fontSize: "12px" }} onChange={this.changeShape.bind(this)} value={this.state.shape} style={dropDownStyle} floatingLabelText="Planning unit shape" floatingLabelFixed={true}>
								{shapes.map(item => {
									return (
										<MenuItem
											style={{ fontSize: "12px" }}
											value={item}
											primaryText={item}
											key={item}
										/>
									);
								})}
							</SelectField>
						</div>
						<div>
							<SelectField menuItemStyle={{ fontSize: "12px" }} labelStyle={{ fontSize: "12px" }} onChange={this.changeAreaKm2.bind(this)} value={this.state.areakm2} style={dropDownStyle} floatingLabelText="Area of each planning unit" floatingLabelFixed={true}>
								{areakm2s.map(item => {
									return (
										<MenuItem
											style={{ fontSize: "12px" }}
											value={item}
											primaryText={item + " Km2"}
											key={item}
										/>
									);
								})}
							</SelectField>
						</div>
					</React.Fragment>
				}
			/>
		);
	}
}

export default NewPlanningGridDialog;
