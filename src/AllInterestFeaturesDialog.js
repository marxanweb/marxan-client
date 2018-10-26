import React from 'react';
import { List, ListItem } from 'material-ui/List';
import CheckboxField from './CheckBox';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import ToolbarButton from './ToolbarButton';
import ClearAll from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import SelectAll from 'material-ui/svg-icons/toggle/check-box';
import FileNew from 'material-ui/svg-icons/editor/insert-drive-file';
import Delete from 'material-ui/svg-icons/action/delete';
 
class AllInterestFeaturesDialog extends React.Component {
        clearAll() {
            if (this.props.manageOwnState) {

            }
            else {
                this.props.clearAll();
            }
        }
        selectAll() {
            if (this.props.manageOwnState) {

            }
            else {
                this.props.selectAll();
            }
        }
        unselectItem(interestFeature) {
            if (this.props.manageOwnState) {

            }
            else {
                this.props.unselectItem(interestFeature);
            }
        }
        selectItem(interestFeature) {
            if (this.props.manageOwnState) {

            }
            else {
                this.props.selectItem(interestFeature);
            }
        }
        onChange(event, isInputChecked, interestFeature) {
            isInputChecked ? this.selectItem(interestFeature) : this.unselectItem(interestFeature);
        }
        deleteInterestFeature() {
            if (this.props.manageOwnState) {

            }
            else {
                this.props.deleteInterestFeature(this.props.projectFeatures[0]);
            }
        }
        render() {
                return (
                        <Dialog 
                        overlayStyle={{display:'none'}} 
                        className={'dialogGeneric'} 
                        style={{position:'absolute',display: this.props.open ? 'block' : 'none',width:'400px', paddingTop:'0px !important',left:'70px'}} 
                        title="Features" 
                        children={            
                            <React.Fragment>
                                <div>
                                    <List defaultValue ={0} style={{height:'216px','overflowY':'auto',overflowX:'hidden'}}>
                                        {this.props.allFeatures.map((item)=>{
                                            return <ListItem leftCheckbox={<CheckboxField interestFeature={item} value={item.id} checked={item.selected} onChange={this.onChange.bind(this)}/>} primaryText={item.alias} key={item.id} value={item.alias} innerDivStyle={{lineHeight:'', padding:'4px 16px 4px 44px'}} style={{fontSize:'13px'}}/>}
                                        ,this)}
                                    </List>
                                </div>
                            </React.Fragment>
                        } 
                        actions={[
                            <ToolbarButton 
                                icon={<ClearAll style={{height:'20px',width:'20px'}}/>} 
                                title="Clear all"
                                onClick={this.clearAll.bind(this)} 
                            />,
                            <ToolbarButton 
                                icon={<SelectAll style={{height:'20px',width:'20px'}}/>} 
                                title="Select all"
                                onClick={this.selectAll.bind(this)} 
                            />,
                            <ToolbarButton 
                                icon={<FileNew style={{height:'20px',width:'20px'}}/>} 
                                title="New conservation feature"
                                onClick={this.props.openNewInterestFeatureDialog} 
                            />,
                            <ToolbarButton 
                                icon={<Delete color="red" style={{height:'20px',width:'20px'}}/>} 
                                title="Delete conservation feature"
                                onClick={this.deleteInterestFeature.bind(this)} 
                                disabled={this.props.projectFeatures.length!==1}
                            />,
                            <RaisedButton 
                                className="projectsBtn" 
                                label="OK" 
                                onClick={this.props.closeAllInterestFeaturesDialog}
                                primary={true} 
                                style={{height:'24px'}}
                            />
                        ]} 
                        open={this.props.open} 
                        onRequestClose={this.props.closeAllInterestFeaturesDialog} 
                        contentStyle={{width:'400px'}} 
                        titleClassName={'dialogTitleStyle'}
                />
            );
        }
}

export default AllInterestFeaturesDialog;
