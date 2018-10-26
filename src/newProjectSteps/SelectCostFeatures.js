import React, { Component } from 'react';
import { List, ListItem, makeSelectable } from 'material-ui/List';
import IconMenu from 'material-ui/IconMenu';
import MenuItem from 'material-ui/MenuItem';
import { grey400 } from 'material-ui/styles/colors';
import IconButton from 'material-ui/IconButton';
import MoreVertIcon from 'material-ui/svg-icons/navigation/more-vert';
import PropTypes from 'prop-types';
import RaisedButton from 'material-ui/RaisedButton';
let SelectableList = makeSelectable(List);

function wrapState(ComposedComponent) {
    return class SelectableList extends Component {
        static propTypes = {
            children: PropTypes.node.isRequired,
            defaultValue: PropTypes.number.isRequired,
        };

        componentWillMount() {
            this.setState({
                selectedIndex: this.props.defaultValue,
            });
        }

        handleRequestChange = (event, index) => {
            this.setState({
                selectedIndex: index,
            });
            this.props.changeFeature(event, index);
        };

        render() {
            return (
                <ComposedComponent
                  value={this.state.selectedIndex}
                  onChange={this.handleRequestChange}
                  style={{'height':'235px','overflow':'auto'}}
                >
          {this.props.children}
        </ComposedComponent>
            );
        }
    };
}

SelectableList = wrapState(SelectableList);

class SelectCostFeatures extends React.Component {
    constructor(props) {
        super(props);
        this.state = { selectedFeature: undefined };
    }
    componentWillMount() {
        ListItem.defaultProps.disableTouchRipple = true;
        ListItem.defaultProps.disableFocusRipple = true;
    }
    changeFeature(event, feature) {
        this.setState({ selectedFeature: feature });
    }
    clickListItem(event) {
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

        const rightIconMenu = (
            <IconMenu iconButtonElement={iconButtonElement}>
            <MenuItem>Info</MenuItem>
            <MenuItem title="Not implemented">View</MenuItem>
            <MenuItem title="Not implemented">Prioritise</MenuItem>
        </IconMenu>
        );

        return (
            <React.Fragment>
                <div className={'newPUDialogPane'}>
                    <List>
                        {this.props.selectedCosts.map((item)=>{
                            return <ListItem 
                              disableFocusRipple={true}
                                primaryText={item.alias} 
                                secondaryText={item.description} 
                                key={item.id} 
                                value={item.alias}
                                rightIconButton={rightIconMenu}
                            />}
                        )
                        }
                    </List>
                    <RaisedButton 
                        label="Select" 
                        onClick={this.props.openAllCostsDialog}/>
                </div>
            </React.Fragment>
        );
    }
}

export default SelectCostFeatures;
