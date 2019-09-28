import * as React from 'react';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faExclamationTriangle } from '@fortawesome/free-solid-svg-icons';
import { faCheckCircle } from '@fortawesome/free-solid-svg-icons';
import { faArrowAltCircleRight } from '@fortawesome/free-solid-svg-icons';
import Sync from 'material-ui/svg-icons/notification/sync';

class Log extends React.Component {
	
	render() {
    	return (
    	    <div className={this.props.className}>
    	    	<Sync className='spin' style={{display: ((this.props.message.status === 'RunningQuery')||(this.props.message.status === 'Downloading')) ? 'inline' : 'none', height: '16px', width: '16px', verticalAlign: 'sub', color: 'rgb(255, 64, 129)', marginRight:'6px'}} title={'Preprocessing..'}/>
    	    	<FontAwesomeIcon icon={faCheckCircle} style={{display: ((this.props.message.status === 'Finished')&&(!this.props.message.hasOwnProperty('error'))) ? 'inline' : 'none', color:'green', marginRight:'6px'}} title={'Preprocessing completed'}/>
    	    	<FontAwesomeIcon icon={faArrowAltCircleRight} style={{display: (this.props.message.status === 'UploadComplete') ? 'inline' : 'none', color:'green', marginRight:'6px'}} title={'Upload complete'}/>
    	        <FontAwesomeIcon icon={faExclamationTriangle} style={{color:'red', display:(this.props.message.hasOwnProperty('error') ? 'inline' : 'none'), marginRight:'6px'}} title={this.props.message.info}/>
    	        <div style={{display: 'inline'}} dangerouslySetInnerHTML={{__html: this.props.message.info}}/>
    	    </div>
    	);
	}
}

export default Log;
