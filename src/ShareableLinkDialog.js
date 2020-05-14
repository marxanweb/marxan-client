import * as React from 'react';
import MarxanDialog from './MarxanDialog';
import MarxanTextField from './MarxanTextField';
import ToolbarButton from './ToolbarButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';

class ShareableLinkDialog extends React.PureComponent {
    copyToClipboard(evt){
        window.navigator.clipboard.writeText(this.props.shareableLinkUrl).then(function() {
            
        }, function() {
            alert("Browser not supported");
        });
	}

    render() {
        return (
            <MarxanDialog
                {...this.props}
                contentWidth={600}
                height={100}
				offsetX={80}
				offsetY={360}
                title="Shareable link"
                children={
                <React.Fragment>
                    <MarxanTextField style={{fontSize:'13px',width:'550px'}} multiLine={true} rows={2} onChange = {(event,newValue) => this.setState({"target_value":newValue})} defaultValue ={this.props.shareableLinkUrl} floatingLabelShrinkStyle={{fontSize:'16px'}} floatingLabelFocusStyle={{fontSize:'16px'}} /> 
					<ToolbarButton   
						icon={<FontAwesomeIcon icon={faClipboard}/>} 
						title="Copy"
						onClick={this.copyToClipboard.bind(this)} 
					/>
            </React.Fragment>
        }
        />
    );
}
}

export default ShareableLinkDialog;
