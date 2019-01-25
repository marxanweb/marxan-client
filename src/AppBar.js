import React from 'react';
import Paper from 'material-ui/Paper';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faBookOpen } from '@fortawesome/free-solid-svg-icons';
import { faFish } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleLeft } from '@fortawesome/free-solid-svg-icons'; 
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleLeft as a } from '@fortawesome/free-regular-svg-icons';
import { faArrowAltCircleRight as b} from '@fortawesome/free-regular-svg-icons';
import { faQuestionCircle} from '@fortawesome/free-regular-svg-icons';
import { faUser } from '@fortawesome/free-solid-svg-icons';
class AppBar extends React.Component {
    openFeaturesDialog(evt){
        this.props.openFeaturesDialog(false);
    }
    render() {
        return (
            <React.Fragment>
                <div className={'appBar'} style={{display: (this.props.open) ? 'block' : 'none'}}>
                    <Paper zDepth={2} className="appBarPaper">
                        <div className="appBarTitle" style={{fontSize: '24px', color: 'white'}}>
                            <FontAwesomeIcon icon={faBookOpen} className={"appBarIcon"} onClick={this.props.openProjectsDialog} title="Click to view all projects"/>
                            <FontAwesomeIcon icon={faFish} className={"appBarIcon"} onClick={this.openFeaturesDialog.bind(this)} title="Click to view all features"/>
                            <FontAwesomeIcon style={{fontSize: '20px', marginBottom:'7px'}} icon={(this.props.infoPanelOpen) ? faArrowAltCircleLeft : a} className={"appBarIcon"} onClick={this.props.toggleInfoPanel} title={(this.props.infoPanelOpen) ? "Click to hide the project window" : "Click to show the project window"}/>
                            <FontAwesomeIcon style={{fontSize: '20px', marginBottom:'7px'}} icon={(this.props.resultsPanelOpen) ? faArrowAltCircleRight : b} className={"appBarIcon"} onClick={this.props.toggleResultsPanel} title={(this.props.resultsPanelOpen) ? "Click to hide the results window" : "Click to show the results window"}/>
                            <FontAwesomeIcon icon={faUser} className={"appBarIcon"} onClick={this.props.showUserMenu} title={"Logged in as " + this.props.user}/>
                            <FontAwesomeIcon icon={faQuestionCircle} className={"appBarIcon"} onClick={this.props.showHelpMenu}/>
                        </div>
                    </Paper>
                </div>
            </React.Fragment>
        );
    }
}

export default AppBar;
