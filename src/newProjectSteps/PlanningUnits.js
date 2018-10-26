import * as React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import mapboxgl from 'mapbox-gl';
import SelectFieldMapboxLayer from '../SelectFieldMapboxLayer';

class PlanningUnits extends React.Component {
    constructor(props) {
        super(props);
        this.state = { planning_unit_grids_received: false }
    } 
    componentDidMount() {
        this.props.getPlanningUnitGrids().then(function(item) {
            this.setState({ planning_unit_grids_received: true });
        }.bind(this));
        this.map = new mapboxgl.Map({
            container: this.mapContainer,
            style: 'mapbox://styles/blishten/cjg6jk8vg3tir2spd2eatu5fd', //north star + marine PAs in pacific
            center: [0, 0],
            zoom: 2
        });
    }
    openNewPlanningUnitDialog() {
        this.props.openNewPlanningUnitDialog();
    }
    render() {
        return (
            <React.Fragment>
                <div className={'newPUDialogPane'}>
                    <div ref={el => this.mapContainer = el} className="absolute top right left bottom" style={{width:'360px',height:'300px', marginTop: '71px',marginLeft: '20px'}}/>
                    <div style={{'paddingTop': '27px'}}>
                        <SelectFieldMapboxLayer 
                            menuItemStyle={{fontSize:'12px'}}
                            labelStyle={{fontSize:'12px'}} 
                            selectedValue={this.props.pu} 
                            map={this.map} 
                            mapboxUser={'blishten'} 
                            items={this.props.planning_unit_grids} 
                            changeItem={this.props.changeItem} 
                            disabled={!this.state.planning_unit_grids_received}
                            width={'270px'}
                        />
                        <RaisedButton 
                            label="New" 
                            onClick={this.openNewPlanningUnitDialog.bind(this)}
                            style={{minWidth: '66px', width: '30px',height: '23px', marginLeft: '20px',top:'407px',position:'absolute'}}
                            labelStyle={{'fontSize':'12px','paddingLeft':'11px'}}
                            title="Create a new Planning Unit Grid"
                        />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default PlanningUnits;
