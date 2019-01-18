import React from 'react';
import MarxanDialog from './MarxanDialog';
import RaisedButton from 'material-ui/RaisedButton';
import MapContainer from './MapContainer.js';
import FontAwesome from 'react-fontawesome';
import TextField from 'material-ui/TextField';

class ClumpingDialog extends React.Component {

  parseBlmValue(value){
    if (!isNaN(parseFloat(value)) && isFinite(value)) {
      return value; 
    }else{
      return "";
    } 
  } 
  
  selectBlm(blmValue){
      //set the blmValue for the project
      this.props.setBlmValue(blmValue);
      //close the dialog
      this.props.onOk();
  }
    
  onRequestClose(){
    if(!this.props.clumpingRunning) this.props.onOk();
  }
  
  render() {
    return ( 
      <MarxanDialog 
        {...this.props} 
        contentWidth={680}
        offsetX={80}
        offsetY={80}
        onOk={this.onRequestClose.bind(this)}
        okDisabled={this.props.clumpingRunning}
        actions={[
          <RaisedButton 
            label="Refresh" 
            primary={true} 
            className="projectsBtn" 
            style={{height:'25px'}}
            onClick={this.props.rerunProjects} 
            disabled={this.props.clumpingRunning}
          />]}
        title="Clumping" 
        children={
          <div>
            <div id="spinner"><FontAwesome spin name='sync' style={{'display': ((this.props.clumpingRunning) ? 'inline-block' : 'none')}} className={'clumpsSpinner'}/></div>
            <MapContainer disabled={this.props.clumpingRunning} selectBlm={this.selectBlm.bind(this)} tileset={this.props.tileset} RESULTS_LAYER_NAME={this.props.RESULTS_LAYER_NAME} paintProperty={this.props.map0_paintProperty} blmValue={this.parseBlmValue(this.props.blmValues[0])} mapCentre={this.props.mapCentre} mapZoom={this.props.mapZoom}/>
            <MapContainer disabled={this.props.clumpingRunning} selectBlm={this.selectBlm.bind(this)} tileset={this.props.tileset} RESULTS_LAYER_NAME={this.props.RESULTS_LAYER_NAME} paintProperty={this.props.map1_paintProperty} blmValue={this.parseBlmValue(this.props.blmValues[1])} mapCentre={this.props.mapCentre} mapZoom={this.props.mapZoom}/>
            <MapContainer disabled={this.props.clumpingRunning} selectBlm={this.selectBlm.bind(this)} tileset={this.props.tileset} RESULTS_LAYER_NAME={this.props.RESULTS_LAYER_NAME} paintProperty={this.props.map2_paintProperty} blmValue={this.parseBlmValue(this.props.blmValues[2])} mapCentre={this.props.mapCentre} mapZoom={this.props.mapZoom}/>
            <MapContainer disabled={this.props.clumpingRunning} selectBlm={this.selectBlm.bind(this)} tileset={this.props.tileset} RESULTS_LAYER_NAME={this.props.RESULTS_LAYER_NAME} paintProperty={this.props.map3_paintProperty} blmValue={this.parseBlmValue(this.props.blmValues[3])} mapCentre={this.props.mapCentre} mapZoom={this.props.mapZoom}/>
            <MapContainer disabled={this.props.clumpingRunning} selectBlm={this.selectBlm.bind(this)} tileset={this.props.tileset} RESULTS_LAYER_NAME={this.props.RESULTS_LAYER_NAME} paintProperty={this.props.map4_paintProperty} blmValue={this.parseBlmValue(this.props.blmValues[4])} mapCentre={this.props.mapCentre} mapZoom={this.props.mapZoom}/>
            <div style={{display:'inline-block', margin:'5px','verticalAlign':'top','paddingTop':'60px','textAlign':'center','fontSize':'14px',width:'200px', height:'224px'}}>
                <div>Move and zoom the main map to preview the clumping</div>
                <div style={{'paddingTop':'30px'}}>
                  <span>BLM from </span>
                  <TextField value={this.props.blmMin} onChange={this.props.changBlmMin.bind(this)} style={{width:'20px'}} inputStyle={{'textAlign':'center', 'fontSize':'14px'}} id="blmmin" disabled={this.props.clumpingRunning}/>
                  <span> to </span>
                  <TextField value={this.props.blmMax} onChange={this.props.changBlmMax.bind(this)} style={{width:'20px'}} inputStyle={{'textAlign':'center', 'fontSize':'14px'}} id="blmmax" disabled={this.props.clumpingRunning}/>
                </div>
            </div>
          </div>
        } 
      />
    );
  }
}

export default ClumpingDialog;
