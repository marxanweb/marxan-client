import React from 'react';
import MarxanDialog from './MarxanDialog';
import Checkbox from 'material-ui/Checkbox';
import SelectField from 'material-ui/SelectField';
import MenuItem from 'material-ui/MenuItem';

class OptionsDialog extends React.Component {
    constructor(props){
        super(props);
        this.state = {saveEnabled: false};
        this.options = {}; 
    }
    setOption(key, value){
        this.setState({saveEnabled: true});
        this.options[key] = value;
    }
    updateOptions(){
        this.props.saveOptions(this.options);
        this.props.onOk();
    }
    changeBasemap(event, key, payload){
        var basemap = this.props.basemaps[key];
        this.props.changeBasemap(basemap);    
        this.setOption("BASEMAP", basemap.name);
    }
    
    render() {
        return (
            <MarxanDialog 
                {...this.props} 
                contentWidth={370}
                offsetY={80}
                showCancelButton={true}
                onOk={this.updateOptions.bind(this)}
                title="Settings" 
                children={
                    <div key="k14">
                        <SelectField 
                            floatingLabelText={'Mapbox basemap style'} 
                            floatingLabelFixed={true} 
                            underlineShow={false}
                            menuItemStyle={{fontSize:'12px'}}
                            labelStyle={{fontSize:'12px'}} 
                            style={{width:'260px'}}
                            value={this.props.basemap} 
                            onChange={this.changeBasemap.bind(this)}
                            children= {this.props.basemaps.map((item)=> {
                                return  <MenuItem 
                                    value={item.name} 
                                    key={item.name} 
                                    primaryText={item.name}
                                    style={{fontSize:'12px'}}
                                    title={item.description}
                                />;
                            })}
                        />
                        <Checkbox label="Show planning unit popup" defaultChecked={this.props.userData.SHOWPOPUP} onCheck={(e, isInputChecked)=>this.setOption("SHOWPOPUP",isInputChecked)} style={{fontSize:'13px'}}/>
                    </div>
                } 
            />
        );
    }
}

export default OptionsDialog;
