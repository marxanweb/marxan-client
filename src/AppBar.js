import React from 'react';
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faBookOpen} from '@fortawesome/free-solid-svg-icons';
import {faStar} from '@fortawesome/free-solid-svg-icons';
import {faWrench} from '@fortawesome/free-solid-svg-icons';
import {faThLarge} from '@fortawesome/free-solid-svg-icons';
import {faArrowAltCircleLeft} from '@fortawesome/free-solid-svg-icons';
import {faArrowAltCircleRight} from '@fortawesome/free-solid-svg-icons'; 
import {faArrowAltCircleLeft as a} from '@fortawesome/free-regular-svg-icons';
import {faArrowAltCircleRight as b} from '@fortawesome/free-regular-svg-icons';
import {faQuestionCircle} from '@fortawesome/free-solid-svg-icons';
import {Toolbar, ToolbarGroup} from 'material-ui/Toolbar';

class AppBar extends React.Component {
	constructor (props){
		super(props);
		this.state = {adminMenuOpen: false};
	}
	//opens the features dialog without the ability to add/remove features (i.e. different from the dialog that is opened from a project)
  openFeaturesDialog(evt) {
    this.props.openFeaturesDialog(false);
 }
  render() {
    return (
      <React.Fragment>
        <Toolbar style={{display: (this.props.open) ? 'block' : 'none', backgroundColor: 'rgb(0, 188, 212)', height: '62px', padding: '2px 10px 0px 10px'}} className={'appBar'}>
          <div>
            <div className={'marxanServer'} title={'Click to open the Server Details window'} onClick={this.props.openServerDetailsDialog}>{this.props.marxanServer}</div>
            <div className={'username'} title={'Click to open the User menu'} onClick={this.props.showUserMenu}>{this.props.user}</div>
          </div>
        	<ToolbarGroup>
            <FontAwesomeIcon icon={faBookOpen} onClick={this.props.openProjectsDialog} title="Projects" className={'appBarIcon'} style={{fontSize: '20px'}}/>
            <FontAwesomeIcon icon={faStar} onClick={this.openFeaturesDialog.bind(this)} title="Features" className={'appBarIcon'} style={{fontSize: '20px'}}/>
            <FontAwesomeIcon icon={faThLarge} onClick={this.props.openPlanningGridsDialog.bind(this)} title="Planning grids" className={'appBarIcon'} style={{fontSize: '20px'}}/>
            <span style={{width:'16px'}}/>
            <FontAwesomeIcon style={{fontSize: '20px'}} icon={(this.props.infoPanelOpen) ? faArrowAltCircleLeft : a} onClick={this.props.toggleInfoPanel} title={(this.props.infoPanelOpen) ? "Hide the project window" : "Show the project window"} className={'appBarIcon'}/>
            <FontAwesomeIcon style={{fontSize: '20px'}} icon={(this.props.resultsPanelOpen) ? faArrowAltCircleRight : b} onClick={this.props.toggleResultsPanel} title={(this.props.resultsPanelOpen) ? "Hide the results window" : "Show the results window"} className={'appBarIcon'} />
            <span style={{width:'16px'}}/>
            <FontAwesomeIcon icon={faWrench} onClick={this.props.showToolsMenu} title={"Tools and analysis"} className={'appBarIcon'} style={{fontSize: '19px'}}/>
            <FontAwesomeIcon icon={faQuestionCircle} onClick={this.props.showHelpMenu} title={"Help and support"} className={'appBarIcon'} style={{fontSize: '19px'}}/>
          </ToolbarGroup>
        </Toolbar>
      </React.Fragment>
      );
 }
}

export default AppBar;
