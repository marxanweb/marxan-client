import * as React from 'react';
import MarxanDialog from './MarxanDialog';
import TextField from 'material-ui/TextField';
import ToolbarButton from './ToolbarButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faClipboard } from '@fortawesome/free-solid-svg-icons';
import { selectText } from './genericFunctions.js';

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
                    <TextField 
                        multiLine={true} rows={2} 
                        floatingLabelFixed={true} 
                        onChange = {(event,newValue) => this.setState({"target_value":newValue})} 
                        defaultValue ={this.props.shareableLinkUrl} 
                        floatingLabelShrinkStyle={{fontSize:'16px'}} 
                        floatingLabelFocusStyle={{fontSize:'16px'}} 
                        style={{fontSize:'13px',width:'550px'}} 
                    /> 
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
