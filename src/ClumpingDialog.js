import React from 'react';
import MarxanDialog from './MarxanDialog';
import ToolbarButton from './ToolbarButton';
import MapContainer from './MapContainer.js';
import TextField from 'material-ui/TextField';

let CLUMP_COUNT = 5;

class ClumpingDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = { blmValues: [0.001, 0.01, 0.1, 1, 10], blmMin: 0.001, blmMax: 10, blmChanged: false };
	}

	//when the dialog is shown, create the project group and run the projects with different blm values
	componentDidUpdate(prevProps, prevState){
		if ((this.props.open !== prevProps.open)&&(this.props.open)) {
			//create the project group and run
			this.props.createProjectGroupAndRun(this.state.blmValues);
		}
	}
	changeBlmMin(event, newValue) {
		//get the new blmValues
		this.getBlmValues(newValue, this.state.blmMax);
		//set the new blmMin
		this.setState({ blmMin: newValue });
	}

	changeBlmMax(event, newValue) {
		//get the new blmValues
		this.getBlmValues(this.state.blmMin, newValue);
		//set the new blmMax
		this.setState({ blmMax: newValue });
	}

	//calculates the 5 blm values based on the min and max
	getBlmValues(min, max) {
		var blmValues = [];
		//get the increment
		var increment = (max - min) / (CLUMP_COUNT - 1);
		//make the array of blmValues
		for (var i = 0; i < CLUMP_COUNT; i++) {
			blmValues[i] = (i * increment) + Number(min);
		}
		this.setState({ blmValues: blmValues });
		//flag that the blmValues have changed
		this.setState({blmChanged: true});
	}

	parseBlmValue(value) {
		if (!isNaN(parseFloat(value)) && isFinite(value)) {
			return value;
		}
		else {
			return "";
		}
	}

	selectBlm(blmValue) {
		//set the blmValue for the project
		this.props.setBlmValue(blmValue);
		//close the dialog
		this.props.onOk();
	}

	rerunProjects(){
		this.props.rerunProjects(this.state.blmChanged, this.state.blmValues);
		this.setState({blmChanged: false});
	}
	onRequestClose() {
		if (!this.props.clumpingRunning) this.props.onOk();
	}

	render() {
		let mapContainers = [...Array(CLUMP_COUNT).keys()].map((clump) => {
			let paintProperty;
			switch (clump) {
				case 0:
					paintProperty = this.props.map0_paintProperty;
					break;
				case 1:
					paintProperty = this.props.map1_paintProperty;
					break;
				case 2:
					paintProperty = this.props.map2_paintProperty;
					break;
				case 3:
					paintProperty = this.props.map3_paintProperty;
					break;
				case 4:
					paintProperty = this.props.map4_paintProperty;
					break;
				default:
					// code
			}
			return <MapContainer key={clump} disabled={this.props.clumpingRunning} selectBlm={this.selectBlm.bind(this)} tileset={this.props.tileset} RESULTS_LAYER_NAME={this.props.RESULTS_LAYER_NAME} paintProperty={paintProperty} blmValue={this.parseBlmValue(this.state.blmValues[clump])} mapCentre={this.props.mapCentre} mapZoom={this.props.mapZoom}/>;
		});
		return (
			<MarxanDialog 
				{...this.props} 
				showSpinner={this.props.clumpingRunning}
				contentWidth={680}
				offsetX={80}
				offsetY={80}
				onOk={this.onRequestClose.bind(this)}
				okDisabled={this.props.clumpingRunning}
				showCancelButton={true}
				helpLink={"docs_user.html#clumping-window"}
				actions={[
					<ToolbarButton 
						label="Refresh" 
						primary={true} 
						onClick={this.rerunProjects.bind(this)} 
						disabled={this.props.clumpingRunning || (!this.state.blmChanged)}
					/>]
				}
				title = "Clumping"
				children = {
					<div key="k7">
						{mapContainers}
						<div style={{display:'inline-block', margin:'5px','verticalAlign':'top','paddingTop':'60px','textAlign':'center','fontSize':'14px',width:'200px', height:'224px'}}>
								<div>Move and zoom the main map to preview the clumping</div>
								<div style={{'paddingTop':'30px'}}>
									<span>BLM from </span>
									<TextField value={this.state.blmMin} onChange={this.changeBlmMin.bind(this)} style={{width:'36px'}} inputStyle={{'textAlign':'center', 'fontSize':'14px'}} id="blmmin" disabled={this.props.clumpingRunning}/>
									<span> to </span>
									<TextField value={this.state.blmMax} onChange={this.changeBlmMax.bind(this)} style={{width:'36px'}} inputStyle={{'textAlign':'center', 'fontSize':'14px'}} id="blmmax" disabled={this.props.clumpingRunning}/>
								</div>
						</div>
					</div>
				}
			/>
		);
	}
}

export default ClumpingDialog;