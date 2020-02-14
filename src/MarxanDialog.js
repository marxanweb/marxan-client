import React from 'react';
import Dialog from 'material-ui/Dialog';
import ToolbarButton from './ToolbarButton';
import Sync from 'material-ui/svg-icons/notification/sync'; 
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import {faQuestionCircle} from '@fortawesome/free-regular-svg-icons';
import {faSearch} from '@fortawesome/free-solid-svg-icons';
 
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
//showSearchBox - true to show a search box

let DOCS_ROOT = "https://andrewcottam.github.io/marxan-web/documentation/";

class MarxanDialog extends React.Component {
	constructor(props){
		super(props);
		this.state = {searchText: ""};
	}
	openDocumentation(){
		window.open(DOCS_ROOT + this.props.helpLink);
	}
	searchTextChange(evt){
		this.setState({searchText: evt.target.value});
		if (this.props.searchTextChanged) this.props.searchTextChanged(evt.target.value);
	}
	clearSearch(){
		this.searchTextChange({target: {value: ''}});
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
					(this.props.showSearchBox) ? 
						<div style={{right: '70px',position: "absolute",top: "13px"}} title={"search"} key="k27">
							<input value={this.state.searchText} onChange={this.searchTextChange.bind(this)} style={{border: "1px solid rgba(0,0,0,0.1)", borderRadius: "30px", width:"90px", height: "22px",fontFamily:"Roboto, sans-serif",fontSize:"12px", fontWeight:"400",color:"rgba(0,0,0,0.7)",paddingLeft:"10px"}}/>
							<FontAwesomeIcon onClick={this.clearSearch.bind(this)} icon={faSearch} className={'appBarIcon docs'} style={{fontSize: "13px",position: "absolute",top: "1px",right: "2px", color: (this.state.searchText === "") ? "rgba(0, 0, 0, 0.6)" : "rgb(255, 64, 129)"}} title={(this.state.searchText === "") ? 'Search' : 'Clear search'}/>
						</div> : null,
					<Sync className='spin' style={{display: (this.props.loading || this.props.showSpinner) ? "inline-block" : "none", color: 'rgb(255, 64, 129)', position: 'absolute', top: '15px', right: '41px',height:"22px",width:"22px"}} key={"spinner"}/>, this.props.children,
					(this.props.helpLink) ? <FontAwesomeIcon icon={faQuestionCircle} onClick={this.openDocumentation.bind(this)} title={"Open documentation for this window"} className={'appBarIcon docs'} style={{fontSize: '18px'}} key="helpLink"/> : null
				]}
			/>
		);
	}
}

export default MarxanDialog;