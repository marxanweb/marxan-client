import React from 'react';
import Dialog from 'material-ui/Dialog';
import ToolbarButton from './ToolbarButton';
import Sync from 'material-ui/svg-icons/notification/sync'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faQuestionCircle} from '@fortawesome/free-regular-svg-icons';
 
//properties can be:
//contentWidth - the width of the content area
//offsetX - the distance from the left edge (mutually exclusive with rightX)
//rightX - the distance from the right edge (mutually exclusive with offsetX)
//offsetY - the distance from the top
//onOk - fired when the OK button is clicked
//onCancel - fired when the Cancel button is clicked or when the dialog needs to be closed
//showCancelButton - set to true to show the cancel button
//actions - an array of components to add to the actions array in the dialog
//helpLink - a relative url to the bookmark in the user documentation that describes the particular dialog box
let DOCS_ROOT = "https://andrewcottam.github.io/marxan-web/documentation/";

class MarxanDialog extends React.Component {
	openDocumentation(){
		window.open(DOCS_ROOT + this.props.helpLink);
	}

	render() {
		//if the offsetX or rightX is set, then make this into a style
		let offsetX = (this.props.offsetX) ? {marginLeft: this.props.offsetX + 'px', width: '400px'} : (this.props.rightX) ? {right: this.props.rightX + 'px', width: '400px', left:null} : {};
		let offsetY = (this.props.offsetY) ? {marginTop: this.props.offsetY - 60 + 'px'} : {};
		let style = Object.assign(offsetX, offsetY);
		let cancelButton = (this.props.showCancelButton) ? <ToolbarButton label={(this.props.cancelLabel) ? this.props.cancelLabel : "Cancel"} primary={true} onClick={this.props.onCancel} disabled={this.props.cancelDisabled}/> : null;
		let okButton = (this.props.hideOKButton) ?  null : <ToolbarButton label={(this.props.okLabel) ? this.props.okLabel : "OK"} primary={true} onClick={this.props.onOk} disabled={this.props.okDisabled}/>;
		let contentStyle = (this.props.contentStyle) ? this.props.contentStyle : (this.props.contentWidth) ? {width: this.props.contentWidth + 'px'} : {};
		return (
			<Dialog      
				{...this.props} 
				onRequestClose={this.props.onCancel}
				overlayStyle={(this.props.showOverlay) ? {display:'block'} : {display:'none'}}
				titleClassName={'dialogTitleStyle'}
				contentStyle={contentStyle} 
				titleStyle={(this.props.titleBarIcon) ? {marginLeft: '27px'} : null}
				className={'dialogGeneric'}
				style={style} 
				actions={[
					this.props.actions,
					cancelButton, 
					okButton,
				]} 
				children={[
					(this.props.titleBarIcon) ? <FontAwesomeIcon icon={this.props.titleBarIcon} style={{position: 'absolute', top: '18px', left: '24px'}} key="k1"/> : null,
					<Sync className='spin' style={{display: (this.props.loading || this.props.showSpinner) ? "inline-block" : "none", color: 'rgb(255, 64, 129)', position: 'absolute', top: '13px', right: '45px'}} key={"spinner"}/>, this.props.children,
					(this.props.helpLink) ? <FontAwesomeIcon icon={faQuestionCircle} onClick={this.openDocumentation.bind(this)} title={"Open documentation for this window"} className={'appBarIcon docs'} style={{fontSize: '18px'}} key="helpLink"/> : null
				]}
			/>
		);
	}
}

export default MarxanDialog;