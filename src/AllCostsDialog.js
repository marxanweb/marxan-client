import React from 'react';
import { List, ListItem } from 'material-ui/List';
import RaisedButton from 'material-ui/RaisedButton';
import CheckboxField from './CheckBox';
import Dialog from 'material-ui/Dialog';


class AllCostsDialog extends React.Component {
        componentDidMount() {
            // this.props.getInterestFeatures();
        }
        clearAll() {
            this.props.clearAll();
        }
        selectAll() {
            this.props.selectAll();
        }
        unselectItem(interestFeature) {
            this.props.unselectItem(interestFeature);
        }
        selectItem(interestFeature) {
            this.props.selectItem(interestFeature);
        }
        onChange(event, isInputChecked, interestFeature) {
            isInputChecked ? this.selectItem(interestFeature) : this.unselectItem(interestFeature);
        }
        render() {
                const actions = [
                    <React.Fragment>
                        <RaisedButton 
                            label="OK" 
                            onClick={this.props.closeAllCostsDialog}
                            primary={true} 
                            className="projectsBtn"
                        />
                    </React.Fragment>
                ];
                return (
                        <Dialog title="Costs" children={            
                            <React.Fragment>
                                <div>
                                Nothing implemented yet
                                    <List defaultValue ={0}>
                                        {this.props.costs.map((item)=>{
                                            return <ListItem leftCheckbox={<CheckboxField interestFeature={item} value={item.id} checked={item.selected} onChange={this.onChange.bind(this)}/>} primaryText={item.alias} secondaryText={item.description} key={item.id} value={item.alias}/>}
                                        ,this)
                                        }
                                    </List>
                                    <RaisedButton label="Clear all" className="projectsBtn" onClick={this.clearAll.bind(this)}/>
                                    <RaisedButton label="Select all" className="projectsBtn" onClick={this.selectAll.bind(this)}/>
                                    <RaisedButton label="Delete" className="projectsBtn"/>
                                    <RaisedButton label="New" className="projectsBtn" onClick={this.props.openNewInterestFeatureDialog}/>
                                </div>
                            </React.Fragment>} actions={actions} open={this.props.open} onRequestClose={this.props.closeAllCostsDialog} contentStyle={{width:'566px'}} titleClassName={'dialogTitleStyle'}/>
        );
    }
}

export default AllCostsDialog;
