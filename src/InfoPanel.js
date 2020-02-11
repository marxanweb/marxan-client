import React from 'react';
import 'react-table/react-table.css';
import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';
import SelectField from 'material-ui/SelectField';
import SelectFeatures from './SelectFeatures';
import MenuItem from 'material-ui/MenuItem';
import Settings from 'material-ui/svg-icons/action/settings';
import ToolbarButton from './ToolbarButton';
import Checkbox from 'material-ui/Checkbox';
import Textarea from 'react-textarea-autosize';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faLock } from '@fortawesome/free-solid-svg-icons';
import { faUnlock } from '@fortawesome/free-solid-svg-icons';
import { faEraser } from '@fortawesome/free-solid-svg-icons';
import { faShareAlt } from '@fortawesome/free-solid-svg-icons';

class InfoPanel extends React.Component {
	constructor(props) {
		super(props);
		this.state = {editingProjectName:false, editingDescription: false};
	}
	componentDidUpdate(prevProps, prevState, snapshot) {
		//if the input box for renaming the project has been made visible and it has no value, then initialise it with the project name and focus it
		if (prevState.editingProjectName === false && this.state.editingProjectName) {
			document.getElementById("projectName").value = this.props.project;
			document.getElementById("projectName").focus();
		}
		//if the input box for renaming the description has been made visible and it has no value, then initialise it with the description and focus it
		if (prevState.editingDescription === false && this.state.editingDescription) {
			document.getElementById("descriptionEdit").value = this.props.metadata.DESCRIPTION;
			document.getElementById("descriptionEdit").focus();
		}
	}

	onKeyPress(e) {
		if (e.nativeEvent.keyCode === 13 || e.nativeEvent.keyCode === 27) {
			document.getElementById(e.nativeEvent.target.id).blur(); //call the onBlur event which will call the REST service to rename the project
		}
	}

	onBlur(e) {
		if (e.nativeEvent.target.id === 'projectName') {
			this.props.renameProject(e.target.value).then(()=> {
			    this.setState({ editingProjectName: false });
			});
		}
		else {
			this.props.renameDescription(e.target.value).then(()=> {
				this.setState({ editingDescription: false });
			});
		}
	}

	startEditingProjectName() {
		if (this.props.project) { //a project may not be loaded
			this.setState({editingProjectName: true});
		}
	}
	startEditingDescription() {
		if (this.props.project) { //a project may not be loaded
			this.setState({editingDescription: true});
		}
	}
	startStopPuEditSession(evt) {
		(this.props.puEditing) ? this.stopPuEditSession(): this.startPuEditSession();
	}
	startPuEditSession() {
		this.setState({ puEditing: true });
		this.props.startPuEditSession();
	}

	stopPuEditSession() { 
		this.setState({ puEditing: false});
		this.props.stopPuEditSession();
	}
	
	changeIucnCategory(event,key,payload){
		this.props.changeIucnCategory(this.props.iucn_categories[key]);
	}
	toggleProjectPrivacy(evt, isInputChecked){
		let checkedString = (isInputChecked) ? "True" : "False";
		this.props.toggleProjectPrivacy(checkedString);
	}
	toggleCosts(event, isInputChecked){
		this.props.toggleCosts(isInputChecked);
	}
	stopProcess(){
		this.props.stopProcess(this.props.pid);
	}
	render() {
		return (
			<React.Fragment>  
				<div className={'infoPanel'} style={{display: this.props.open ? 'block' : 'none'}}>
					<Paper zDepth={2} className="InfoPanelPaper"> 
						<Paper zDepth={2} className="titleBar">
							{(this.props.userRole === "ReadOnly") ? <span className={'projectNameEditBox'} title={this.props.project + " (Read-only)"}><FontAwesomeIcon style={{color: 'white', height: '16px', marginTop:'4px',marginBottom: '2px', marginRight: '5px'}} icon={faLock}/>{this.props.project}</span> : <span onClick={this.startEditingProjectName.bind(this)} className={'projectNameEditBox'} title="Click to rename the project">{this.props.project}</span>}
							{(this.props.userRole === "ReadOnly") ? null : <input id="projectName" style={{position:'absolute', 'display': (this.state.editingProjectName) ? 'block' : 'none',left:'39px',top:'32px',width:'365px', border:'1px lightgray solid'}} className={'projectNameEditBox'} onKeyPress={this.onKeyPress.bind(this)} onBlur={this.onBlur.bind(this)}/>}
						</Paper>
						<Tabs contentContainerStyle={{'margin':'20px'}} className={'tabs'} value={this.props.activeTab}>
							<Tab label="Project" onActive={this.props.project_tab_active} value="project" disabled={(this.props.puEditing) ? true : false}>
								<div>
									<div className={'tabTitle'}>Description</div>
									{(this.props.userRole === "ReadOnly") ? null : <Textarea minRows='5' id="descriptionEdit" style={{'display': (this.state.editingDescription) ? 'block' : 'none'}} className={'descriptionEditBox'} onKeyPress={this.onKeyPress.bind(this)} onBlur={this.onBlur.bind(this)}/>}
									{(this.props.userRole === "ReadOnly") ? <div className={'description'} title={this.props.metadata.DESCRIPTION} dangerouslySetInnerHTML={{__html: this.props.metadata.DESCRIPTION}}/> : <div className={'description'} onClick={this.startEditingDescription.bind(this)} style={{'display': (!this.state.editingDescription) ? 'block' : 'none'}} title="Click to edit" dangerouslySetInnerHTML={{__html: this.props.metadata.DESCRIPTION}}/>}
									<div className={'tabTitle tabTitleTopMargin'}>Created</div>
									<div className={'createDate'}>{this.props.metadata.CREATEDATE}</div>
									<div className={'tabTitle tabTitleTopMargin'}>{(this.props.metadata.OLDVERSION) ? "Imported project" : ""}</div>
									<div style={{position:'absolute', top:'413px', display: (this.props.userRole === "ReadOnly") ? 'none' : 'block'}}>
										<Checkbox
											label="Private"
											style={{fontSize:'12px'}}
											checked={this.props.metadata.PRIVATE}
											onCheck={this.toggleProjectPrivacy.bind(this)}
										/>
									</div>
								</div>
							</Tab>
							<Tab label="Features" onActive={this.props.features_tab_active} value="features" disabled={(this.props.puEditing) ? true : false}>
								<SelectFeatures
									features={this.props.features}
									openFeatureMenu={this.props.openFeatureMenu}
									openFeaturesDialog={this.props.openFeaturesDialog} 
									metadata={this.props.metadata}
									updateFeature={this.props.updateFeature}
									leftmargin={'10px'}
									simple={false}
									showTargetButton={true}
									openTargetDialog={this.props.openTargetDialog}
									userRole={this.props.userRole}
									toggleFeatureLayer={this.props.toggleFeatureLayer}
									toggleFeaturePUIDLayer={this.props.toggleFeaturePUIDLayer}
									useFeatureColors={this.props.useFeatureColors}
									smallLinearGauge={this.props.smallLinearGauge}
								/>
							</Tab>
							<Tab label="Planning units" onActive={this.props.pu_tab_active} value="planning_units">
								<div>
									<div className={'tabTitle'}>Planning grid</div>
									<div className={'description'}>{this.props.metadata.pu_alias}</div>
									<div className={'tabTitle tabTitleTopMargin'}>Protected areas</div>
									<SelectField 
										floatingLabelText={'Include'} 
										floatingLabelFixed={true} 
										underlineShow={false}
										disabled={(this.props.preprocessing)||(this.props.userRole === "ReadOnly")}
										menuItemStyle={{fontSize:'12px'}} 
										labelStyle={{fontSize:'12px'}} 
										style={{marginTop:'-15px',width:'140px'}}
										value={this.props.metadata.IUCN_CATEGORY} 
										onChange={this.changeIucnCategory.bind(this)}
										children= {this.props.iucn_categories.map((item)=> {
											return  <MenuItem 
												value={item} 
												key={item} 
												primaryText={item}
												style={{fontSize:'12px'}}
												/>; 
										})}
									/> 
									<div style={{display: (this.props.userRole === "ReadOnly") ? 'none' : 'block'}}>
										<div className={'tabTitle'}>Statuses</div>
										<FontAwesomeIcon icon={(this.props.puEditing) ? faUnlock : faLock} onClick={this.startStopPuEditSession.bind(this)} title={(this.props.puEditing) ? "Save" : "Click to edit"} style={{cursor:'pointer', marginRight: '10px', color: 'rgba(255, 64, 129, 0.7)'}}/>
										<div className={'description'} style={{display: 'inline-block'}}>{(this.props.puEditing) ? "Click on the map to change the status" : "Click to edit"}</div>
										<div style={{display: (this.props.puEditing) ? "block" : "none"}}>
											<div className={"statusRow"}><div className={"statusSwatch"} style={{ border: '1px rgba(63, 63, 191, 1) solid'}}></div><div className={"puStatus"}>Locked in the reserve system</div></div>
											<div className={"statusRow"}><div className={"statusSwatch"} style={{ border: '1px rgba(191, 63, 63, 1) solid'}}></div><div className={"puStatus"}>Locked out of the reserve system</div></div>
											<ToolbarButton  
												icon={<FontAwesomeIcon icon={faEraser} />} 
												title="Clear all manual edits"
												onClick={this.props.clearManualEdits.bind(this)} 
											/>
										</div>
									</div>
									<div className={'tabTitle'}>Costs</div>
									<Checkbox
										label="Show costs"
										style={{fontSize:'12px'}}
										checked={this.props.showCosts}
										onCheck={this.toggleCosts.bind(this)}
									/>
								</div>  
							</Tab>
						</Tabs>     
						<Paper className={'lowerToolbar'}>
								<ToolbarButton   
									icon={<FontAwesomeIcon icon={faShareAlt}/>} 
									title={"Get a shareable link to this project"}
									onClick={this.props.getShareableLink} 
									show={(this.props.marxanServer.type ==='remote')}
								/>
								<ToolbarButton   
									icon={<Settings style={{height:'20px',width:'20px'}}/>} 
									title="Run Settings"
									onClick={this.props.showRunSettingsDialog} 
								/>
								<div className='toolbarSpacer'/>
								<ToolbarButton 
									label="Stop" 
									title="Click to stop the current run"  
									show={this.props.userRole !== "ReadOnly"}
									style={{marginLeft: '194px'}}
									onClick={this.stopProcess.bind(this)} 
									disabled={this.props.pid===0}  
									secondary={true} 
								/>  
								<ToolbarButton 
									label="Run" 
									title="Click to run this project"  
									show={this.props.userRole !== "ReadOnly"}
									onClick={this.props.runMarxan} 
									disabled={this.props.preprocessing || (this.props.features.length === 0) || this.props.puEditing}  
									secondary={true} 
								/>  
						</Paper>
					</Paper>
				</div>
			</React.Fragment>
		);
	}
}

export default InfoPanel;
