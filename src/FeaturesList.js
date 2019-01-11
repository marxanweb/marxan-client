import * as React from 'react';
import { List, ListItem } from 'material-ui/List';
import TargetIcon from './TargetIcon';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import { grey400 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import LinearGauge from './LinearGauge';
import Info from './Info';

class FeaturesList extends React.Component {
    constructor(props) {
        super(props);
        this.state = { openInfoDialogOpen: false, currentFeature: {} };
    }
    updateTargetValue(targetIcon) {
        this.props.updateTargetValue(targetIcon.props.interestFeature, targetIcon.newTargetValue);
    }
    preprocess(feature) {
        this.closeInfoDialog();
        this.props.preprocessFeature(feature);
    }
    openInfoDialog(feature) {
        this.setState({ currentFeature: feature, openInfoDialogOpen: true });
    }
    closeInfoDialog() {
        this.setState({ currentFeature: {}, openInfoDialogOpen: false });
    }
    toggleFeature(feature){
        this.closeInfoDialog();
        this.props.toggleFeature(feature);
    }
    removeFromProject(feature){
        this.closeInfoDialog();
        this.props.removeFromProject(feature);
    }
    render() {
        const iconButtonElement = (
            <IconButton
                touch={true}
                tooltipPosition="bottom-left" 
            >
            <MoreVertIcon color={grey400} />
            </IconButton>
        );
        return (
            <React.Fragment>
            <List style={{padding:'0px !important', maxHeight: this.props.maxheight, overflow: 'auto'}}>
                {this.props.features.map((item)=>{
                    //get the total area of the feature in the planning unit
                    let pu_area = item.pu_area;
                    //TODO: This needs to be done differently when we are using the old version of Marxan because it does not have a value for the pu_area
                    
                    //get the protected percent
                    let protected_percent = (item.protected_area === -1) ? -1 : (pu_area >= 0) ? (item.protected_area > 0) ? (item.protected_area / pu_area) * 100 : 0 : 0;
                    //this is a hack to round the protected percent as there are some bugs in Marxan that calculate the target area required wrongly
                    //TODO - sort out 
                    // protected_percent = Math.round(protected_percent);
                    let targetStatus = (pu_area === 0) ? "Does not occur in planning area" : (protected_percent === -1) ? "Unknown" : (item.protected_area >= item.target_area) ? "Target achieved" : "Target missed";
                    return (
                        <ListItem 
                            leftAvatar={this.props.simple ? 
                                <span/> 
                                :
                              <TargetIcon 
                                  style={{left: 8}} 
                                  target_value={item.target_value} 
                                  updateTargetValue={this.updateTargetValue.bind(this)} 
                                  interestFeature={item}
                                  targetStatus={targetStatus}
                                  visible={(item.pu_area!==0)}
                              /> 
                            }
                            primaryText={item.alias} 
                            secondaryText={this.props.simple ? 
                                <span />
                                :
                                <LinearGauge 
                                    scaledWidth={220}
                                    target_value={item.target_value} 
                                    protected_percent={protected_percent}
                                    visible={(item.pu_area!==0)}
                                />
                            } 
                            key={item.id} 
                            value={item.alias}
                            rightIconButton={this.props.simple ?
                                <div />
                                :
                                <IconMenu iconButtonElement={iconButtonElement} style={{right:'10px'}}>
                                    <MenuItem className={'smallMenuItem'} onClick={this.openInfoDialog.bind(this, item)}>Info</MenuItem>
                                    <MenuItem className={'smallMenuItem'} onClick={this.removeFromProject.bind(this, item)}>Remove</MenuItem>
                                    <MenuItem className={'smallMenuItem'} style={{display: (item.tilesetid) ? 'block' : 'none'}} onClick={this.toggleFeature.bind(this, item)}>{item.toggle_state}</MenuItem>
                                    <MenuItem disabled={item.preprocessed} onClick={() => this.preprocess(item)} className={'smallMenuItem'}>Pre-process</MenuItem>
                                </IconMenu>
                            }
                            innerDivStyle={{padding: (this.props.simple) ? '5px 5px 5px 5px' : '9px 5px 11px 53px' }}
                            style={{borderRadius:'3px',fontSize:'14px'}}
                        />
                    )}
                )
                }
            </List>
            <Info
                open={this.state.openInfoDialogOpen}
                feature={this.state.currentFeature}
                closeInfoDialog={this.closeInfoDialog.bind(this)}
                updateFeature={this.props.updateFeature}
            />
            </React.Fragment>
        );
    }
}

export default FeaturesList;
