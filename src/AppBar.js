import React from 'react';
import Paper from 'material-ui/Paper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { faFish } from '@fortawesome/free-solid-svg-icons';
import { faThLarge } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleLeft as a } from '@fortawesome/free-regular-svg-icons';
import { faArrowAltCircleRight as b } from '@fortawesome/free-regular-svg-icons';
import { faQuestionCircle } from '@fortawesome/free-regular-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
import { faUsers } from '@fortawesome/free-solid-svg-icons';
class AppBar extends React.Component {
  openFeaturesDialog(evt) {
    this.props.openFeaturesDialog(false);
  }
  render() {
    return (
      <React.Fragment>
        <div className={ 'appBar' } style={ { display: (this.props.open) ? 'block' : 'none' } }>
          <Paper zDepth={ 2 } className="appBarPaper">
            <div className="appBarTitle" style={ { fontSize: '24px', color: 'white' } }>
              <FontAwesomeIcon icon={ faBookOpen } className={ "appBarIcon" } onClick={ this.props.openProjectsDialog } title="Projects" />
              <FontAwesomeIcon icon={ faFish } className={ "appBarIcon" } onClick={ this.openFeaturesDialog.bind(this) } title="Features" />
              <FontAwesomeIcon icon={ faThLarge } className={ "appBarIcon" } onClick={ this.props.openPlanningGridsDialog.bind(this) } title="Planning grids" />
              <FontAwesomeIcon style={ { fontSize: '20px', marginBottom: '7px' } } icon={ (this.props.infoPanelOpen) ? faArrowAltCircleLeft : a } className={ "appBarIcon" } onClick={ this.props.toggleInfoPanel } title={ (this.props.infoPanelOpen) ? "Hide the project window" : "Show the project window" }
              />
              <FontAwesomeIcon style={ { fontSize: '20px', marginBottom: '7px' } } icon={ (this.props.resultsPanelOpen) ? faArrowAltCircleRight : b } className={ "appBarIcon" } onClick={ this.props.toggleResultsPanel } title={ (this.props.resultsPanelOpen) ? "Hide the results window" : "Show the results window" }
              />
              <FontAwesomeIcon icon={ faUser } className={ "appBarIcon" } onClick={ this.props.showUserMenu } title={ "User: " + this.props.user + " (" + this.props.userRole + ")" } />
              <FontAwesomeIcon style={ { display: (this.props.userRole === 'Admin') ? 'inline-block' : 'none' } } icon={ faUsers } className={ "appBarIcon" } onClick={ this.props.openUsersDialog } title={ "Users" }
              />
              <FontAwesomeIcon icon={ faQuestionCircle } className={ "appBarIcon" } onClick={ this.props.showHelpMenu } title={ "Help and support" } />
            </div>
          </Paper>
        </div>
      </React.Fragment>
      );
  }
}

export default AppBar;
