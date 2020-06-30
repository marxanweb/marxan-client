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
    	    	{/*spinner*/}
    	    	<Sync className='spin' style={{display: (this.props.message.status === "Preprocessing") ? 'inline' : 'none', height: '16px', width: '16px', verticalAlign: 'sub', color: 'rgb(255, 64, 129)', marginRight:'6px'}} title={this.props.message.info}/>
    	    	{/*preprocessing complete*/}
    	    	<FontAwesomeIcon icon={faCheckCircle} style={{display: ((this.props.message.status === 'Finished')&&(!this.props.message.hasOwnProperty('error'))) ? 'inline' : 'none', color:'green', marginRight:'6px'}} title={'Preprocessing completed'}/>
    	    	{/*upload complete*/}
    	    	<FontAwesomeIcon icon={faArrowAltCircleRight} style={{display: (this.props.message.status === 'UploadComplete') ? 'inline' : 'none', color:'green', marginRight:'6px'}} title={'Upload complete'}/>
    	    	{/*error*/}
    	        <FontAwesomeIcon icon={faExclamationTriangle} style={{color:'red', display:(this.props.message.hasOwnProperty('error') ? 'inline' : 'none'), marginRight:'6px'}} title={this.props.message.info}/>
    	        {/*all other messages*/}
    	        <div style={{display:'inline'}} dangerouslySetInnerHTML={{__html: this.props.message.info}}/>
    	        {/*timestamp*/}
    	        <div className='timestamp' style={{display: (this.props.message.status === "Finished") ? 'inline' : 'none'}}>{this.props.message.timestamp.toLocaleString()}</div>
    	    </div>
    	);
	}
}

export default Log;