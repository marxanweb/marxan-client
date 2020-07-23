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
import ReactTable from "react-table";
import Sync from 'material-ui/svg-icons/notification/sync';
import Swatch from './Swatch';
import { Tabs, Tab } from 'material-ui/Tabs';
import { getArea } from './Helpers.js';

const TITLE_LINK = "Click to open in the Protected Planet website";
const URL_PP = "https://www.protectedplanet.net/";
const TAB_STYLE = {fontWeight:'normal', textTransform:'none', height:'34px', fontSize:'15px'};

class IdentifyPopup extends React.Component {
	constructor(props){
		super(props);
		this.state = {selectedValue: "pu"};
	}
	componentDidUpdate(prevProps, prevState) {
		//if the popup is shown, start the timer
		if (this.props.visible && !prevProps.visible) this.startTimer();
		//if the mouse has been clicked somewhere else while the popup is already open
		if ((this.props.xy.x !== prevProps.xy.x)) this.restartTimer();
	}
	renderAmount(row) {
		return <div title={row.original.amount}>{getArea(row.original.amount, this.props.reportUnits, true)}</div>;
	}
	renderName(row) {
		return <div title={row.original.alias}>{row.original.alias}</div>;
	}
	renderFeatureName(row) {
		return <div title={row.original.alias}>{row.original.alias}</div>;
	}
	renderFeatureDescription(row) {
		return <div title={row.original.description}>{row.original.description}</div>;
	}
	renderPAName(row) {
		return <div title={row.original.properties.name}>{row.original.properties.name}</div>;
	}
	renderPADesignation(row) {
		return <div title={row.original.properties.desig}>{row.original.properties.desig}</div>;
	}
	renderPAIUCNCategory(row) {
		return <div title={row.original.properties.iucn_cat}>{row.original.properties.iucn_cat}</div>;
	}
	renderPALink(row) {
		return <span className={"ppLink underline"}><a href={URL_PP + row.original.properties.wdpaid} target='_blank'  rel="noopener noreferrer" title={TITLE_LINK}>{row.original.properties.wdpaid}</a></span>;
	}
	changeTab(value){
		this.setState({selectedValue: value});
	}
	mouseLeave(e) {
		this.clearTimeout();
		this.props.hideIdentifyPopup();
		//return to the default state
		this.setState({selectedValue: "pu"});
	}
	mouseEnter(e) {
		this.cancelTimer();
	}
	mouseLeavePopup(ms, e) {
		if (this.timer !== undefined) return;
		this.timer = setTimeout(() => {
			if (!this.timerCancelled) {
				this.mouseLeave();
			}
		}, ms);
	}
	clearTimeout() {
		clearTimeout(this.timer);
		this.timer = undefined;
	}
	cancelTimer(e) {
		this.timerCancelled = true;
	}
	restartTimer(e) {
		this.clearTimeout();
		this.startTimer();
	}
	startTimer(e) {
		this.timerCancelled = false;
		this.mouseLeavePopup(4000);
	}
	render() {
		let left = this.props.xy.x + 25 + 'px';
		let top = this.props.xy.y - 25 + 'px';
		let item = {};
		//get the status for the planning unit
		switch (this.props.identifyPlanningUnits && this.props.identifyPlanningUnits.puData && this.props.identifyPlanningUnits.puData.status) {
			case 0:
				item = CONSTANTS.PU_STATUS_DEFAULT;
				break;
			case 1:
				//Included in the initial reserve system but may or may not be in the final solution
				break;
			case 2:
				item = CONSTANTS.PU_STATUS_LOCKED_IN;
				break;
			case 3:
				item = CONSTANTS.PU_STATUS_LOCKED_OUT;
				break;
			default:
				// code
		}
		//get the planning unit shape
		let shape = (this.props.metadata && this.props.metadata.PLANNING_UNIT_NAME && this.props.metadata.PLANNING_UNIT_NAME.includes('hexagon')) ? 'hexagon' : 'square';
		//get the tabs which are needed
		let puTab = (this.props.identifyPlanningUnits && this.props.identifyPlanningUnits.puData) ?
			<Tab label="Planning units" value="pu" key="pu" buttonStyle={TAB_STYLE}>
				<Sync className='spin' style={{display: this.props.loading ? "inline-block" : "none", color: 'rgb(255, 64, 129)', position: 'absolute', top: '-49px', left: '-7px'}} key={"spinner"}/>
				<div className={'identifyPlanningUnitsHeader'}>
					<span><Swatch item={item} key={'key_' + item.label + '_identify'} shape={shape}/><span style={{paddingLeft:'5px'}}/>{item.label}</span>
					<span>Cost: {this.props.identifyPlanningUnits&&this.props.identifyPlanningUnits.puData&&this.props.identifyPlanningUnits.puData.cost}</span>
					<span>ID: {this.props.identifyPlanningUnits&&this.props.identifyPlanningUnits.puData&&this.props.identifyPlanningUnits.puData.id}</span>
				</div>
				<div style={{display: this.props.identifyPlanningUnits && this.props.identifyPlanningUnits.features && this.props.identifyPlanningUnits.features.length ? "block" : "none"}}>
					<div className={'featureList'}>{'Features in planning unit:'}</div>
					<ReactTable
						showPagination={false}
						className={'identifyPUFeaturesInfoTable'}
						pageSize={(this.props.loading) ? 0 : this.props.identifyPlanningUnits && this.props.identifyPlanningUnits.features && this.props.identifyPlanningUnits.features.length}
						minRows={0}
						noDataText=''
						data={this.props.identifyPlanningUnits.features}
						columns={[{
							 Header: 'Name',
							 accessor: 'alias',
							 width: 215,
							 headerStyle:{'textAlign':'left'},
							 Cell: this.renderName.bind(this)
						},{
							 Header: 'Amount',
							 accessor: 'amount',
							 width: 65,
							 headerStyle:{'textAlign':'left'},
							 Cell: this.renderAmount.bind(this)
						}]}
					/>
				</div>
				<div style={{display: this.props.identifyPlanningUnits && this.props.identifyPlanningUnits.features && this.props.identifyPlanningUnits.features.length === 0 ? "block" : "none"}}>
					<div className={'featureList'}>No features occur in this planning unit</div>
				</div>
			</Tab> : null;
		let featuresTab = (this.props.identifyFeatures && this.props.identifyFeatures.length) ?
			<Tab label="Features" value="features" key="features" buttonStyle={TAB_STYLE}>
				<ReactTable
					showPagination={false}
					className={'identifyFeaturesInfoTable'}					
					pageSize={this.props.identifyFeatures && this.props.identifyFeatures.length}
					minRows={0}
					noDataText=''
					data={this.props.identifyFeatures}
					columns={[{
						 Header: 'Name',
						 accessor: 'alias',
						 width: 140,
						 headerStyle:{'textAlign':'left'},
							 Cell: this.renderFeatureName.bind(this)
					},{
						 Header: 'Description',
						 accessor: 'description',
						 width: 140,
						 headerStyle:{'textAlign':'left'},
							 Cell: this.renderFeatureDescription.bind(this)
					}]}
				/> 
			</Tab> : null;
		let protectedAreasTab = (this.props.identifyProtectedAreas && this.props.identifyProtectedAreas.length) ?
			<Tab label="Protected areas" value="pas" key="pas" buttonStyle={TAB_STYLE}>
				<ReactTable
					showPagination={false}
					className={'identifyProtectedAreasInfoTable'}					
					pageSize={this.props.identifyProtectedAreas && this.props.identifyProtectedAreas.length}
					minRows={0}
					noDataText=''
					data={this.props.identifyProtectedAreas}
					columns={[{
						 Header: 'Name',
						 accessor: 'properties.name',
						 width: 134,
						 headerStyle:{'textAlign':'left'},
							 Cell: this.renderPAName.bind(this)
					},{
						 Header: 'Designation',
						 accessor: 'properties.desig',
						 width: 70,
						 headerStyle:{'textAlign':'left'},
							 Cell: this.renderPADesignation.bind(this)
					},{
						 Header: 'IUCN Category',
						 accessor: 'properties.iucn_cat',
						 width: 33,
						 headerStyle:{'textAlign':'left'},
							 Cell: this.renderPAIUCNCategory.bind(this)
					},{
						 Header: 'Link',
						 width: 43,
						 Cell: this.renderPALink.bind(this)
					}]}
				/>
			</Tab> : null;
		let tabs = [puTab, featuresTab, protectedAreasTab];
		if (!puTab && !featuresTab && !protectedAreasTab) tabs = [];
		//if the user has clicked on a pa outside the planning grid then select the pas tab
		let onlyPA = (!puTab && !featuresTab && protectedAreasTab);
		return (
			<div style={{'display': this.props.visible && tabs.length ? 'block' : 'none','left': left,'top':top}} id="popup" onMouseLeave={this.mouseLeave.bind(this)} onMouseEnter={this.mouseEnter.bind(this)}>
				<Tabs tabItemContainerStyle={{height:'34px'}} contentContainerStyle={{'margin':'20px'}} className={'identifyPopup'} value={(onlyPA) ? "pas" : this.state.selectedValue} onChange={this.changeTab.bind(this)}>
					{tabs}
				</Tabs>
			</div>
		);
	}
}

export default IdentifyPopup;
