import React from 'react';
import { List, ListItem } from 'material-ui/List';
import Checkbox from 'material-ui/Checkbox';
import RaisedButton from 'material-ui/RaisedButton';
import ToolbarButton from './ToolbarButton';
import ClearAll from 'material-ui/svg-icons/toggle/check-box-outline-blank';
import SelectAll from 'material-ui/svg-icons/toggle/check-box';

class CheckboxList extends React.Component {
    constructor(props) {
        super(props);
            let localFeatures = this.props.features.map((item) => {
                return Object.assign({ selected: item.selected }, item);
            });
            this.state = { localFeatures: localFeatures };
    } 
    
    onCheck(feature, event, isInputChecked) {
        let localFeatures = this.state.localFeatures;
        let localFeature = localFeatures.find((item)=> {
            return item.alias === feature.alias;
        });
        localFeature.selected = isInputChecked;
        this.setState({localFeatures: localFeatures});
    }

    multiSelect(selected){
        let localFeatures = this.state.localFeatures;
        localFeatures.map((item)=> {
            item.selected = selected;
        });
        this.setState({localFeatures: localFeatures});
    }
     
    selectAll() {
        this.multiSelect(true);
    }
    
    clearAll() {
        this.multiSelect(false);
    }
    
    selectionDone(){
        this.props.selectionDone(this.state.localFeatures);
    }
    render() {
        let children = this.state.localFeatures.map((item) => {
                return <ListItem
                    leftCheckbox={<Checkbox checked={item.selected} onCheck={this.onCheck.bind(this, item)} style={{top:'0px !important'}}/>
            }
            primaryText = { item.alias } 
            key={item.alias}
            innerDivStyle={{lineHeight:'', padding:'4px 16px 4px 44px'}} 
            style={{fontSize:'13px'}}
            >
            </ ListItem > ;
        });

    return (
        <div>
                <List 
                    children = {children}
                    style={{height:'216px','overflowY':'auto',overflowX:'hidden'}}
                    >
                    </List>
                <div
                    style={{position: 'absolute', bottom: '9px', right: '10px'}}
                    >
                    <ToolbarButton 
                        icon={<ClearAll style={{height:'20px',width:'20px'}}/>} 
                        title="Clear all"
                        onClick={this.clearAll.bind(this)} 
                    />
                    <ToolbarButton 
                        icon={<SelectAll style={{height:'20px',width:'20px'}}/>} 
                        title="Select all"
                        onClick={this.selectAll.bind(this)} 
                    />
                    <RaisedButton 
                        className="projectsBtn" 
                        label="OK" 
                        onClick={this.selectionDone.bind(this)}
                        primary={true} 
                        style={{height:'24px'}}
                    />
                    </div>
                </div>
    );
}
}

export default CheckboxList;
