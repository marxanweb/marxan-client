import React from 'react';
import Dialog from 'material-ui/Dialog';
import FontAwesome from 'react-fontawesome';

class ProcessingPADialog extends React.Component {
    render() {
        return (
            <Dialog title="Running" children={
                <div>
                    <div className="runLabel">Processing protected area boundaries</div>
                    <div id="spinner"><FontAwesome spin name='sync' className={'progressSpinner'}/></div>
                </div>
            } 
            overlayStyle={{display:'none'}} 
            open={this.props.preprocessingProtectedAreas} 
            contentStyle={{width:'380px'}} 
            titleClassName={'dialogTitleStyle'}/>
        );
    }
}

export default ProcessingPADialog;
