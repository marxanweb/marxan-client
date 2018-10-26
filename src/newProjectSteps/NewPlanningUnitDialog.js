import * as React from 'react';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';
//constants
let domains = ['Marine', 'Terrestrial'];
let areakm2s = [10, 20, 30, 40, 50];

class NewPlanningUnitDialog extends React.Component {
        componentDidMount() {
            this.props.getCountries();
        }
        changeIso3(evt, value) {
            this.props.changeIso3(this.props.countries[value].iso3);
        }
        changeDomain(evt, value) {
            this.props.changeDomain(domains[value]);
        }
        changeAreaKm2(evt, value) {
            this.props.changeAreaKm2(areakm2s[value]);
        }
        render() {
                let dropDownStyle = { width: '240px' };
                return (
                        <Dialog 
                overlayStyle={{display:'none'}} 
                className={'dialogGeneric'} 
                style={{display: this.props.open ? 'block' : 'none', width:'400px', marginTop:'109px',marginLeft:'156px'}} 
                title="New Planning Unit Grid" 
                children={
                <React.Fragment>
                    <div>
                        <SelectField 
                            menuItemStyle={{fontSize:'12px'}}
                            labelStyle={{fontSize:'12px'}} 
                            onChange={this.changeIso3.bind(this)} 
                            value={this.props.iso3} 
                            floatingLabelText="Area of interest" 
                            floatingLabelFixed={true} 
                        >
                            {this.props.countries.map((item)=>{
                            return <MenuItem 
                            style={{fontSize:'12px'}}
                            value={item.iso3} 
                            primaryText={item.original_n} 
                            key={item.iso3}/>;
                            })}
                        </SelectField>
                        <RaisedButton 
                            label="Upload" 
                            style={{minWidth: '66px', width: '30px',height: '23px',    marginLeft: '20px',    verticalAlign: 'top',    marginTop: '40px'}}
                            labelStyle={{'fontSize':'12px','paddingLeft':'11px'}}
                            title="Load a custom area of interest from a shapefile (not currently implemented)"
                        />
                    </div>
                    <div>
                        <SelectField 
                            menuItemStyle={{fontSize:'12px'}}
                            labelStyle={{fontSize:'12px'}} 
                        onChange={this.changeDomain.bind(this)} value={this.props.domain}  style={dropDownStyle} floatingLabelText="Domain" floatingLabelFixed={true} >
                            {domains.map((item)=>{return <MenuItem style={{fontSize:'12px'}} value={item} primaryText={item} key={item}/>})}
                        </SelectField>
                    </div>
                    <div>
                        <SelectField 
                            menuItemStyle={{fontSize:'12px'}}
                            labelStyle={{fontSize:'12px'}} 
                        onChange={this.changeAreaKm2.bind(this)} value={this.props.areakm2}  style={dropDownStyle} floatingLabelText="Area of each planning unit" floatingLabelFixed={true} >
                            {areakm2s.map((item)=>{return <MenuItem style={{fontSize:'12px'}} value={item} primaryText={item + " Km2"} key={item}/>})}
                        </SelectField>
                    </div>
                </React.Fragment>
                } 
                actions={[
                    <React.Fragment>
                        <RaisedButton 
                            label="Close" 
                            onClick={this.props.closeNewPlanningUnitDialog}
                            primary={true} 
                            className="projectsBtn"
                            style={{height:'25px'}}
                        />
                        <RaisedButton  
                            label={this.props.creatingNewPlanningUnit ? "Creating..." : "Create" }
                            onClick={this.props.createNewPlanningUnitGrid}
                            primary={true} 
                            className="projectsBtn"
                            disabled={(!this.props.iso3 || !this.props.domain || !this.props.areakm2 || this.props.creatingNewPlanningUnit)}
                            style={{height:'25px'}}
                        />
                    </React.Fragment>
                ]} 
                open={this.props.open} 
                onRequestClose={this.props.closeNewPlanningUnitDialog} 
                contentStyle={{width:'400px'}} 
                titleClassName={'dialogTitleStyle'}
                />
        );
    }
}

export default NewPlanningUnitDialog;
