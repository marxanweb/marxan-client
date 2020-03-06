import React from 'react';
import ReactTable from "react-table";
import Sync from 'material-ui/svg-icons/notification/sync';
import { Tabs, Tab } from 'material-ui/Tabs';
const TITLE_LINK = "Click to open in the Protected Planet website";
const URL_PP = "https://www.protectedplanet.net/";

class IdentifyPopup extends React.Component {

	componentDidUpdate(prevProps, prevState) {
		//if the popup is shown, start the timer
		if (this.props.visible && !prevProps.visible) this.startTimer();
		//if the mouse has been clicked somewhere else while the popup is already open
		if ((this.props.xy.x !== prevProps.xy.x)) this.restartTimer();
	}
	renderAmount(row) {
		return <div>{(Number(row.original.amount)/1000000).toFixed(3)} Km2</div>;
	}
	renderPALink(row) {
		return <span className={"ppLink underline"}><a href={URL_PP + row.original.properties.wdpaid} target='_blank'  rel="noopener noreferrer" title={TITLE_LINK}>{row.original.properties.wdpaid}</a></span>;
	}
	mouseLeave(e) {
		this.clearTimeout();
		this.props.hideIdentifyPopup();
	}
	mouseEnter(e){
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
	clearTimeout(){
		clearTimeout(this.timer);
		this.timer = undefined;
	}
	cancelTimer(e) {
		this.timerCancelled = true;
	}
	restartTimer(e){
		this.clearTimeout();
		this.startTimer();
	}
	startTimer(e) {
		this.timerCancelled = false;
		this.mouseLeavePopup(3000);
	}
	render() {
		let left = this.props.xy.x + 25 + 'px';
		let top = this.props.xy.y - 25 + 'px';
		let puType = '';
		switch (this.props.puData && this.props.puData.status) {
			case 0:
				puType = "Normal planning unit";
				break;
			case 1:
				puType = "Included in the initial reserve system but may or may not be in the final solution";
				break;
			case 2:
				puType = "The planning unit is fixed in the reserve system ('locked in'). It starts in the initial reserve system and cannot be removed.";
				break;
			case 3:
				puType = "The planning unit is fixed outside the reserve system ('locked out'). It is not included in the initial reserve system and cannot be added.";
				break;
			default:
				// code
		}
		//get the tabs which are needed
		let puTab = (this.props.identifyPlanningUnits && this.props.identifyPlanningUnits.puData) ?
			<Tab label="Planning units" value="pu" key="pu">
				<Sync className='spin' style={{display: this.props.loading ? "inline-block" : "none", color: 'rgb(255, 64, 129)', position: 'absolute', top: '5px', right: '7px'}} key={"spinner"}/>
				<div>{puType}</div>
				<div>id:&nbsp;&nbsp;&nbsp;{this.props.identifyPlanningUnits&&this.props.identifyPlanningUnits.puData&&this.props.identifyPlanningUnits.puData.id}</div>
				<div>Cost: {this.props.identifyPlanningUnits&&this.props.identifyPlanningUnits.puData&&this.props.identifyPlanningUnits.puData.cost}</div>
				<ReactTable
					style={{display: this.props.identifyPlanningUnits && this.props.identifyPlanningUnits.features && this.props.identifyPlanningUnits.features.length ? "block" : "none"}}
					showPagination={false}
					pageSize={(this.props.loading) ? 0 : this.props.identifyPlanningUnits && this.props.identifyPlanningUnits.features && this.props.identifyPlanningUnits.features.length}
					minRows={0}
					noDataText=''
					data={this.props.identifyPlanningUnits.features}
					columns={[{
						 Header: 'Name',
						 accessor: 'alias',
						 width: 220,
						 headerStyle:{'textAlign':'left'}
					},{
						 Header: 'Amount',
						 accessor: 'amount',
						 width: 220,
						 headerStyle:{'textAlign':'left'},
						 Cell: this.renderAmount.bind(this)
					}]}
				/>
			</Tab> : null;
		let featuresTab = (this.props.identifyFeatures && this.props.identifyFeatures.length) ?
			<Tab label="Features" value="features" key="features">
				<ReactTable
					showPagination={false}
					pageSize={this.props.identifyFeatures && this.props.identifyFeatures.length}
					minRows={0}
					noDataText=''
					data={this.props.identifyFeatures}
					columns={[{
						 Header: 'Name',
						 accessor: 'alias',
						 width: 220,
						 headerStyle:{'textAlign':'left'}
					}]}
				/> 
			</Tab> : null;
		let protectedAreasTab = (this.props.identifyProtectedAreas && this.props.identifyProtectedAreas.length) ?
			<Tab label="Protected areas" value="pas" key="pas">
				<ReactTable
					showPagination={false}
					pageSize={this.props.identifyProtectedAreas && this.props.identifyProtectedAreas.length}
					minRows={0}
					noDataText=''
					data={this.props.identifyProtectedAreas}
					columns={[{
						 Header: 'Name',
						 accessor: 'properties.name',
						 width: 220,
						 headerStyle:{'textAlign':'left'}
					},{
						 Header: 'Designation',
						 accessor: 'properties.desig',
						 width: 220,
						 headerStyle:{'textAlign':'left'}
					},{
						 Header: 'IUCN Category',
						 accessor: 'properties.iucn_cat',
						 width: 100,
						 headerStyle:{'textAlign':'left'}
					},{
						 Header: 'Link',
						 width: 40,
						 Cell: this.renderPALink.bind(this)
					}]}
				/>
			</Tab> : null;
		let tabs = [puTab, featuresTab, protectedAreasTab];
		if (!puTab && !featuresTab && !protectedAreasTab) tabs = [];
		return (
			<div style={{'display': this.props.visible && tabs.length ? 'block' : 'none','left': left,'top':top}} id="popup" onMouseLeave={this.mouseLeave.bind(this)} onMouseEnter={this.mouseEnter.bind(this)}>
				<Tabs contentContainerStyle={{'margin':'20px'}} className={'identifyPopup'}>
					{tabs}
				</Tabs>
			</div>
		);
	}
}

export default IdentifyPopup;
