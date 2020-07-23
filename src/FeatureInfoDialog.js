/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from 'react';
import CONSTANTS from './constants';
import MarxanDialog from './MarxanDialog';
import ReactTable from "react-table";
import {getArea, isNumber, isValidTargetValue} from './Helpers.js'; 

class FeatureInfoDialog extends React.Component {
	onKeyPress(key, e) {
		if (e.nativeEvent.keyCode === 13 || e.nativeEvent.keyCode === 27) {
			//update the feature
			this.updateFeatureValue(key,e);
			//closes this window
			this.props.onOk();
		}
	}
	getHTML(value, title = ''){
		return <div title={(title !== '') ? title : value}>{value}</div>;
	}
	//adds Kms to the area values and rounds to 1 decimal place 
	getAreaHTML(props){
		//set the font color to red if the area protected is less than the target area
		let color = (this.props.feature.protected_area < this.props.feature.target_area) && (props.row.key === 'Area protected') ? "red" : "rgba(0, 0, 0, 0.6)";
		//rounded to 6 sf in the hint
		let html = <div title={getArea(props.row.value, this.props.reportUnits, false, 6)} style={{color:color}}>{getArea(props.row.value, this.props.reportUnits, true)}</div>;
		return html;   
	}
	renderKeyCell(props){
		return this.getHTML(props.row.key, props.original.hint);
	}
	//called when the user moves away from an editable property, e.g. target percent or spf
	updateFeatureValue(key, evt){
		var value = evt.currentTarget.innerHTML;
		if (((key === "target_value") && (isValidTargetValue(value))) || ((key === "spf") && (isNumber(value)))) {
			var obj = {};
			obj[key] = value;
			this.props.updateFeature(this.props.feature, obj);      
		}else{
			alert("Invalid value");
		}
	}
	renderValueCell(props){
		let html;
		switch (props.row.key) {
			case 'ID':
			case 'Alias':
			case 'Feature class name':
				html = this.getHTML(props.row.value, props.original.hint);
				break;
			case 'Description':
				html = this.getHTML(props.row.value);
				break;
			case 'Creation date': 
				html = this.getHTML(props.row.value);
				break;
			case 'Mapbox ID':
				html = ((props.row.value === "")||(props.row.value === null)) ? this.getHTML("Not available", "The feature was not uploaded to Mapbox") : this.getHTML(props.row.value, "The feature was uploaded to Mapbox with this identifier");
				break;
			case 'Total area':
				html = (props.row.value === -1) ? this.getHTML("Not calculated", "Total areas are not available for imported projects") : this.getAreaHTML(props, props.original.hint);
				break;
			case 'Target percent':
				html = (this.props.userRole === "ReadOnly") ? <div>{props.row.value}</div> : <div contentEditable suppressContentEditableWarning title="Click to edit" onBlur={this.updateFeatureValue.bind(this, "target_value")} onKeyPress={this.onKeyPress.bind(this, "target_value")}>{props.row.value}</div>;
				break;
			case 'Species Penalty Factor':
				html = (this.props.userRole === "ReadOnly") ? <div>{props.row.value}</div> : <div contentEditable suppressContentEditableWarning title="Click to edit" onBlur={this.updateFeatureValue.bind(this, "spf")} onKeyPress={this.onKeyPress.bind(this, "spf")}>{props.row.value}</div>;
				break;
			case 'Preprocessed':
				html = (props.row.value) ? this.getHTML("Yes", "The feature has been intersected with the planning units") : this.getHTML("No", "The feature has not yet been intersected with the planning units");
				break;
			case 'Planning grid area':
				html = (props.row.value === -1) ? this.getHTML("Not calculated", "Calculated during pre-processing") : this.getAreaHTML(props);
				break;
			case 'Planning unit count':
				html = (props.row.value === -1) ? this.getHTML("Not calculated", "Calculated during pre-processing") : this.getHTML(props.row.value);
				break;
			case 'Target area':
				html = (props.row.value === -1) ? this.getHTML("Not calculated", "Calculated during a Marxan run") : this.getAreaHTML(props);
				break;
			case 'Area protected':
				html = (props.row.value === -1) ? this.getHTML("Not calculated", "Calculated during a Marxan run") : this.getAreaHTML(props);
				break;
			default:
				break;
		}
		return html;
	} 
		render(){
			if (this.props.feature){
				let data =[];
				//iterate through the feature properties and set the data to bind to the table - if it is a feature from the old version of marxan then showForOld must be true for that property to be shown
				CONSTANTS.FEATURE_PROPERTIES.forEach((item)=>{
					if ((!this.props.feature.old_version && item.showForNew) || (this.props.feature.old_version && item.showForOld)){
						data.push({key: item.key, value: this.props.feature[item.name], hint: item.hint});
					}
				}, this);
				return (
					<MarxanDialog title="Properties" 
						{...this.props}  
						contentWidth={380}
						helpLink={"user.html#feature-properties-window"}
						offsetX={135}
						offsetY={250}
						children={
							<ReactTable 
								showPagination={false} 
								className={(this.props.feature.old_version) ? 'infoTableOldVersion' : 'infoTable'}
								minRows={0}
								pageSize={data.length}
								data={data}
								noDataText=''
								columns={[{
									 Header: 'Key', 
									 accessor: 'key',
									 width:150,
									 headerStyle:{'textAlign':'left'},
									 Cell: props => this.renderKeyCell(props)
								},{
									 Header: 'Value',
									 accessor: 'value',
									 width:185,
									 headerStyle:{'textAlign':'left'},
									 Cell: props => this.renderValueCell(props)
								}
								]}
							 key="k9"
							/>
						}
					/>);
			}else{
				return null;
		}
	}
}

export default FeatureInfoDialog;
