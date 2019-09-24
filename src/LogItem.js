import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import Sync from 'material-ui/svg-icons/notification/sync';

class Log extends React.Component {
	
	render() {
	    let className='';
	    //set the css class based on whether the message is the start, processing or finishing message
	    switch (this.props.message.status) {
	      case 'Started': 
	        className = 'logStart';
	        break;
	      case 'Finished': 
	        className = 'logFinish';
	        break;
	      default:
	        className = 'logMessage';
	        break;
	    }
    	return (
    	    <div className={className}>
    	    	<Sync className='spin' style={{display: (this.props.message.status === 'RunningQuery') ? 'inline' : 'none', height: '16px', width: '16px', verticalAlign: 'sub', color: 'rgb(255, 64, 129)', marginRight:'6px'}} title={'Preprocessing..'}/>
    	    	<FontAwesomeIcon icon={faCheckCircle} style={{display: ((this.props.message.status === 'Finished')&&(!this.props.message.hasOwnProperty('error'))) ? 'inline' : 'none', color:'green', marginRight:'6px'}} title={'Preprocessing completed'}/>
    	        <FontAwesomeIcon icon={faExclamationTriangle} style={{color:'red', display:(this.props.message.hasOwnProperty('error') ? 'inline' : 'none'), marginRight:'6px'}} title={this.props.message.info}/>
    	        <div style={{display: 'inline'}} dangerouslySetInnerHTML={{__html: this.props.message.info}}/>
    	    </div>
    	);
	}
}

export default Log;
