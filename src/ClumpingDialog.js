import React from 'react';
import MarxanDialog from './MarxanDialog';
import ToolbarButton from './ToolbarButton';
import MapContainer from './MapContainer.js';
import TextField from 'material-ui/TextField';

let CLUMP_COUNT = 5;
let INITIAL_PAINT_PROPERTIES = { map0_paintProperty: [], map1_paintProperty: [], map2_paintProperty: [], map3_paintProperty: [], map4_paintProperty: [] };

class ClumpingDialog extends React.Component {
	constructor(props) {
		super(props);
		this.state = { blmValues: [0.001, 0.01, 0.1, 1, 10], blmMin: 0.001, blmMax: 10, blmChanged: false, INITIAL_PAINT_PROPERTIES };
	}

	//when the dialog is shown, create the project group and run the projects with different blm values
	componentDidUpdate(prevProps, prevState) {
		if ((this.props.open !== prevProps.open) && (this.props.open)) {
			//create the project group and run
			this.createProjectGroupAndRun();
		}
		if ((this.props.open !== prevProps.open) && (!this.props.open)) {
			//reset the paint properties 
			this.resetPaintProperties();
			//delete the projects
			this.deleteProjects();
		}
	}

	//creates a group of 5 projects with UUIDs in the _clumping folder
	createProjectGroupAndRun() {
		//clear any exists projects
		if (this.projects) this.deleteProjects();
		this.props._get("createProjectGroup?user=" + this.props.owner + "&project=" + this.props.project + "&copies=5&blmValues=" + this.state.blmValues.join(",")).then((response) => {
			//set the local variable for the projects
			this.projects = response.data;
			//run the projects
			this.runProjects(response.data);
		}).catch((error) => {
			//do something
		});
	}

	//deletes the projects from the _clumping folder
	deleteProjects() {
		if (this.projects) {
			var projectNames = this.projects.map((item) => {
				return item.projectName;
			});
			//clear the local variable
			this.projects = undefined;
			this.props._get("deleteProjects?projectNames=" + projectNames.join(",")).then((response) => {
				//do something
			}).catch((error) => {
				//do something
			});
		}
	}

	runProjects(projects) {
		//reset the counter
		this.projectsRun = 0;
		//set the intitial state
		this.props.setClumpingRunning(true);
		//run the projects
		projects.forEach((project) => {
			this.props.startMarxanJob("_clumping", project.projectName, false).then((response) => {
				//run completed - get a single solution
				this.loadOtherSolution(response.user, response.project, 1);
				//increment the project counter
				this.projectsRun = this.projectsRun + 1;
				//set the state
				if (this.projectsRun === 5) this.props.setClumpingRunning(false);
			}).catch((error) => {
				//do something
			});
		});
	}

	//load the solution 
	loadOtherSolution(user, project, solution) {
		this.props.getSolution(user, project, solution).then((response) => {
			var paintProperties = this.props.getPaintProperties(response.solution, false, false);
			//get the project that matches the project name from the this.projects property - this was set when the projectGroup was created
			if (this.projects) {
				var _projects = this.projects.filter((item) => { return item.projectName === project });
				//get which clump it is
				var clump = _projects[0].clump;
				switch (clump) {
					case 0:
						this.setState({ map0_paintProperty: paintProperties });
						break;
					case 1:
						this.setState({ map1_paintProperty: paintProperties });
						break;
					case 2:
						this.setState({ map2_paintProperty: paintProperties });
						break;
					case 3:
						this.setState({ map3_paintProperty: paintProperties });
						break;
					case 4:
						this.setState({ map4_paintProperty: paintProperties });
						break;
					default:
						break;
				}
			}
		});
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
			blmValues[i] = ((i * increment) + Number(min)).toFixed(3);
		}
		this.setState({ blmValues: blmValues });
		//flag that the blmValues have changed
		this.setState({ blmChanged: true });
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

	resetPaintProperties() {
		//reset the paint properties
		this.setState(INITIAL_PAINT_PROPERTIES);
	}

	rerunProjects(blmChanged, blmValues) {
		//reset the paint properties in the clumping dialog
		this.resetPaintProperties();
		//if the blmValues have changed then recreate the project group and run
		if (blmChanged) {
			this.createProjectGroupAndRun();
		}
		else {
			//rerun the projects
			this.runProjects(this.projects);
		}
		//reset the flag
		this.setState({ blmChanged: false });
	}

	onRequestClose() {
		if (!this.props.clumpingRunning) this.props.onOk();
	}

	render() {
		let mapContainers = [...Array(CLUMP_COUNT).keys()].map((clump) => {
			let paintProperty;
			switch (clump) {
				case 0:
					paintProperty = this.state.map0_paintProperty;
					break;
				case 1:
					paintProperty = this.state.map1_paintProperty;
					break;
				case 2:
					paintProperty = this.state.map2_paintProperty;
					break;
				case 3:
					paintProperty = this.state.map3_paintProperty;
					break;
				case 4:
					paintProperty = this.state.map4_paintProperty;
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
