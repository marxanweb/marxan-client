/*global fetch*/
import React from 'react';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import 'mapbox-gl/dist/mapbox-gl.css';
import mapboxgl from 'mapbox-gl';
import MapboxClient from 'mapbox';
import jsonp from 'jsonp-promise';
import InfoPanel from './InfoPanel.js';
import Popup from './Popup.js';
import Login from './login.js';
import Snackbar from 'material-ui/Snackbar';
import classyBrew from 'classybrew';
/*eslint-disable no-unused-vars*/
import axios, { post } from 'axios';
/*eslint-enable no-unused-vars*/
import * as utilities from './utilities.js';
import NewProjectDialog from './NewProjectDialog.js';
import NewPlanningUnitDialog from './newProjectSteps/NewPlanningUnitDialog';
import NewInterestFeatureDialog from './newProjectSteps/NewInterestFeatureDialog';
import AllInterestFeaturesDialog from './AllInterestFeaturesDialog';
import AllCostsDialog from './AllCostsDialog';
import RunSettingsDialog from './RunSettingsDialog';
import FilesDialog from './FilesDialog';
import ResultsPane from './ResultsPane';
import ClassificationDialog from './ClassificationDialog';
import ClumpingDialog from './ClumpingDialog';
import ImportWizard from './ImportWizard';
import FlatButton from 'material-ui/FlatButton';
import { white } from 'material-ui/styles/colors';
import ArrowBack from 'material-ui/svg-icons/navigation/arrow-back';

//GLOBAL VARIABLE IN MAPBOX CLIENT
mapboxgl.accessToken = 'pk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiMEZrNzFqRSJ9.0QBRA2HxTb8YHErUFRMPZg'; //this is my public access token for using in the Mapbox GL client - TODO change this to the logged in users public access token

//CONSTANTS
//THE MARXAN_ENDPOINT_HTTPS MUST ALSO BE CHANGED IN THE FILEUPLOAD.JS FILE 
// let MARXAN_ENDPOINT_HTTPS = "https://db-server-blishten.c9users.io/marxan/webAPI2.py/";
let MARXAN_REMOTE_SERVERS = ["db-server-blishten.c9users.io:8081/marxan-server/"];
let MARXAN_LOCAL_SERVER = "localhost:8081/marxan-server/";
let MARXAN_ENDPOINT_HTTPS = "https://" + MARXAN_REMOTE_SERVERS[0];
let MARXAN_ENDPOINT_WSS = "wss://" + MARXAN_REMOTE_SERVERS[0];
let TIMEOUT = 0; //disable timeout setting
let DISABLE_LOGIN = false; //to not show the login form, set loggedIn to true
let MAPBOX_USER = "blishten";
let PLANNING_UNIT_LAYER_NAME = "planning_units_layer";
let PLANNING_UNIT_LAYER_OPACITY = 0.2;
let PLANNING_UNIT_EDIT_LAYER_NAME = "planning_units_layer_edit";
let PLANNING_UNIT_EDIT_LAYER_LINE_WIDTH = 1.5;
let RESULTS_LAYER_NAME = "results_layer";
let RESULTS_LAYER_FILL_OPACITY_ACTIVE = 0.5;
let RESULTS_LAYER_FILL_OPACITY_INACTIVE = 0.1;
let WDPA_LAYER_NAME = "wdpa";
let WDPA_LAYER_OPACITY = 0.9;
let CLUMP_COUNT = 5;
var ws;

Array.prototype.diff = function(a) {
  return this.filter(function(i) {
    return a.indexOf(i) === -1;
  });
};

class App extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      user: DISABLE_LOGIN ? 'andrew' : '',
      password: DISABLE_LOGIN ? 'asd' : '',
      project: DISABLE_LOGIN ? 'Tonga marine' : '',
      loggedIn: false,
      userData: {},
      loggingIn: false,
      metadata: {},
      renderer: {},
      editingProjectName: false,
      editingDescription: false,
      runParams: [],
      files: {},
      running: false,
      runnable: false,
      active_pu: undefined,
      dataAvailable: false,
      outputsTabString: 'No data',
      popup_point: { x: 0, y: 0 },
      snackbarOpen: false,
      snackbarMessage: '',
      tilesets: [],
      filesDialogOpen: false,
      updatingRunParameters: false,
      optionsDialogOpen: false,
      newProjectDialogOpen: false, //set to true to debug immediately
      NewPlanningUnitDialogOpen: false, //set to true to debug immediately
      NewInterestFeatureDialogOpen: false,
      AllInterestFeaturesDialogOpen: false,
      AllCostsDialogOpen: false,
      settingsDialogOpen: false,
      classificationDialogOpen: false,
      importDialogOpen: false,
      clumpingDialogOpen: false,
      resultsPaneOpen: true,
      preprocessingFeature: false,
      preprocessingProtectedAreas: false,
      featureDatasetName: '',
      featureDatasetDescription: '',
      featureDatasetFilename: '',
      creatingNewPlanningUnit: false,
      creatingPuvsprFile: false, //true when the puvspr.dat file is being created on the server
      savingOptions: false,
      dataBreaks: [],
      allFeatures: [], //all of the interest features in the metadata_interest_features table
      projectFeatures: [], //the features for the currently loaded project
      costs: [],
      selectedCosts: [],
      iso3: '',
      domain: '',
      areakm2: undefined,
      countries: [],
      planning_units: [],
      planning_unit_grids: [],
      activeTab: "project",
      activeResultsTab: "legend",
      streamingLog:"Log not available until run completed.\n",
      activeServer: MARXAN_REMOTE_SERVERS[0],
      map0_paintProperty: [],
      map1_paintProperty: [],
      map2_paintProperty: [],
      map3_paintProperty: [],
      map4_paintProperty: [],
      blmValues: [0,0.25,0.5,0.75,1],
      blmMin: 0,
      blmMax: 1, 
      clumpingRunning: false,
      pid: 0
    };
    this.planning_unit_statuses = [1, 2, 3];
  }

  componentDidMount() {
    this.map = new mapboxgl.Map({
      container: this.mapContainer,
      // style: 'mapbox://styles/' + MAPBOX_USER + '/cj6q75jcd39gq2rqm1d7yv5rc', //north star
      style: 'mapbox://styles/' + MAPBOX_USER + '/cjg6jk8vg3tir2spd2eatu5fd', //north star + marine PAs in pacific
      // center: [0.043476868184143314, 0.0460817578557311],
      center: [0, 0],
      zoom: 2
    });
    this.map.on("load", this.mapLoaded.bind(this));
    //set a reference to this App in the map object 
    this.map.App = this;
    //instantiate the classybrew to get the color ramps for the renderers
    this.setState({ brew: new classyBrew() });
    //if disabling the login, then programatically log in
    if (DISABLE_LOGIN) this.validateUser();
  }

  componentDidUpdate(prevProps, prevState) {
    //if any files have been uploaded then check to see if we have all of the mandatory file inputs - if so, set the state to being runnable
    if (this.state.files !== prevState.files) {
      (this.state.files.SPECNAME !== '' && this.state.files.PUNAME !== '') ? this.setState({ runnable: true }): this.setState({ runnable: false });
    }
  }

  mapLoaded(e) {
    // this.map.addControl(new mapboxgl.FullscreenControl(), 'bottom-right'); // currently full screen hides the info panel and setting position:absolute and z-index: 10000000000 doesnt work properly
    this.map.addControl(new mapboxgl.ScaleControl());
    this.map.addControl(new mapboxgl.NavigationControl(), 'bottom-right');
    this.map.on("mousemove", this.mouseMove.bind(this));
    this.map.on("moveend", function(evt){
      this.setState({mapCentre:this.map.getCenter(), mapZoom:this.map.getZoom()});
    }.bind(this));
  }

  closeSnackbar() {
    this.setState({ snackbarOpen: false });
  }

  //checks the reponse for errors
  checkForErrors(response) {
    let networkError = this.responseIsTimeoutOrEmpty(response);
    let serverError = this.isServerError(response);
    return networkError || serverError;
  }

  //checks the response from a REST call for timeout errors or empty responses
  responseIsTimeoutOrEmpty(response) {
    if (!response) {
      let msg = "No response received from server";
      this.setState({ snackbarOpen: true, snackbarMessage: msg, loggingIn: false });
      return true;
    }
    else {
      return false;
    }
  }

  //checks to see if the rest server raised an error and if it did then show in the snackbar
  isServerError(response) {
    //errors may come from the marxan server or from the rest server which have slightly different json responses
    if ((response.error) || (response.hasOwnProperty('metadata') && response.metadata.hasOwnProperty('error') && response.metadata.error != null)) {
      var err = (response.error) ? (response.error) : response.metadata.error;
      this.setState({ snackbarOpen: true, snackbarMessage: err });
      return true;
    }
    else {
      //some server responses are warnings and will not stop the function from running as normal
      if (response.warning) this.setState({ snackbarOpen: true, snackbarMessage: response.warning });
      return false;
    }
  }

  startLogging(){
    //switches the results pane to the log tab
    this.log_tab_active();
    //reset the state
    this.setState({streamingLog: ""});
  }
  
  //utiliy method for getting all puids from normalised data, e.g. from [["VI", [7, 8, 9]], ["IV", [0, 1, 2, 3, 4]], ["V", [5, 6]]]
  getPuidsFromNormalisedData(normalisedData) {
    let puids = [];
    normalisedData.map(function(item) {
      puids = puids.concat(item[1]);
    });
    return puids;
  }

  changeUserName(user) {
    this.setState({ user: user });
  }

  changePassword(password) {
    this.setState({ password: password });
  }

  validateUser() {
    this.setState({ loggingIn: true });
    //get a list of existing users 
    jsonp(MARXAN_ENDPOINT_HTTPS + "validateUser?user=" + this.state.user + "&password=" + this.state.password, { timeout: 10000 }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        //user validated - log them in
        this.login();
      }
      else {
        this.setState({ loggingIn: false });
      }
    }.bind(this));
  }

  //the user is validated so login
  login() {
    //get the users data
    this.getUserInfo();
  }

  //log out and reset some state 
  logout() {
    this.setState({ loggedIn: false, user: '', password: '', project: '' });
  }

  resendPassword() {
    this.setState({ resending: true });
    jsonp(MARXAN_ENDPOINT_HTTPS + "resendPassword?user=" + this.state.user, { timeout: TIMEOUT }).promise.then(function(response) {
      this.setState({ resending: false });
      if (!this.checkForErrors(response)) {
        this.setState({ snackbarOpen: true, snackbarMessage: "Password resent" });
      }
    }.bind(this));
  }

  //gets all the information for the user that is logging in
  getUserInfo() {
    jsonp(MARXAN_ENDPOINT_HTTPS + "getUser?user=" + this.state.user, { timeout: TIMEOUT }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        this.setState({ project: response.userData.LASTPROJECT, userData: response.userData });
        //get the users tilesets from mapbox
        this.getTilesets();
      }
    }.bind(this));
  }

  appendToFormData(formData, obj) {
    //iterate through the object and add each key/value pair to the formData to post to the server
    for (var key in obj) {
      //only add non-prototype objects
      if (obj.hasOwnProperty(key)) {
        formData.append(key, obj[key]);
      }
    }
    return formData;
  }

  //removes the keys from the object
  removeKeys(obj, keys) {
    keys.map(function(key) {
      delete obj[key];
      return null;
    });
    return obj;
  }

  //updates all parameter in the user.dat file then updates the state (in userData)
  updateUser(parameters) {
    //ui feedback
    this.setState({ savingOptions: true });
    //remove the keys that are not part of the users information
    parameters = this.removeKeys(parameters, ["updated", "validEmail"]);
    //initialise the form data
    let formData = new FormData();
    //add the current user
    formData.append("user", this.state.user);
    //append all the key/value pairs
    this.appendToFormData(formData, parameters);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    //post to the server
    post(MARXAN_ENDPOINT_HTTPS + "updateUserParameters", formData, config).then((response) => {
      if (!this.checkForErrors(response.data)) {
        //if succesfull write the state back to the userData key
        this.setState({ userData: this.newUserData, savingOptions: false, optionsDialogOpen: false });
      }
    });
    //update the state
    this.newUserData = Object.assign(this.state.userData, parameters);
  }

  //opens the options parameters dialog whos open state is controlled
  openOptionsDialog() {
    this.setState({ optionsDialogOpen: true });
  }
  //closes the options parameters dialog whos open state is controlled
  closeOptionsDialog() {
    this.setState({ optionsDialogOpen: false });
  }

  //saveOptions - the options are in the users data so we use the updateUser REST call to update them
  saveOptions(options) {
    this.updateUser(options);
  }
  //opens the filess dialog whos open state is controlled
  openFilesDialog() {
    this.setState({ filesDialogOpen: true });
  }
  //closes the run parameters dialog whos open state is controlled
  closeFilesDialog() {
    this.setState({ filesDialogOpen: false });
  }

  //updates the project parameters for the current project back to the server (i.e. the input.dat file)
  updateProjectParams(parameters) {
    //initialise the form data
    let formData = new FormData();
    //add the current user
    formData.append("user", this.state.user);
    //add the current project
    formData.append("project", this.state.project);
    //append all the key/value pairs
    this.appendToFormData(formData, parameters);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    //post to the server
    return post(MARXAN_ENDPOINT_HTTPS + "updateProjectParameters", formData, config);
  }

  //updates a single parameter in the input.dat file directly
  updateProjectParameter(parameter, value) {
    let obj = {};
    obj[parameter] = value;
    return this.updateProjectParams(obj);
  }

  //updates the run parameters for the current project
  updateRunParams(array) {
    //ui feedback
    this.setState({ updatingRunParameters: true });
    //convert the parameters array into an object
    let parameters = {};
    array.map((obj) => { parameters[obj.key] = obj.value; return null; });
    //update
    this.updateProjectParams(parameters).then(function(response){
      //ui feedback
      this.setState({ updatingRunParameters: false });
      if (!this.checkForErrors(response.data)) {
        //if succesfull write the state back 
        this.setState({ runParams: this.runParams, filesDialogOpen: false});
      }
    }.bind(this));
    //save the local state to be able to update the state on callback
    this.runParams = array;
  }

  //gets the planning unit grids
  getPlanningUnitGrids() {
    return jsonp(MARXAN_ENDPOINT_HTTPS + "getPlanningUnitGrids", { timeout: TIMEOUT }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        this.setState({ planning_unit_grids: response.planning_unit_grids });
      }
      else {
        //ui feedback
        this.setState({ loadingProjects: false });
      }
    }.bind(this));
  }

  //gets all of the tilesets from mapbox using the access token for the currently logged on user - this access token must have the TILESETS:LIST scope
  getTilesets() {
    //get the tilesets for the user
    let client = new MapboxClient(this.state.userData.MAPBOXACCESSTOKEN);
    client.listTilesets(function(err, tilesets) {
      //check if there are no timeout errors or empty responses
      if (!this.responseIsTimeoutOrEmpty(tilesets)) {
        //sort alphabetically by name
        tilesets.sort(function(a, b) {
          if (a.name < b.name)
            return -1;
          if (a.name > b.name)
            return 1;
          return 0;
        });
        //set the state
        this.setState({ tilesets: tilesets });
        //now the tilesets are loaded from mapbox we can get the users last project and load it - this is only relevant if the user is not currently logged in - if they are logged in they are simply refreshing the list of tilesets
        if (!this.state.loggedIn) this.loadProject(this.state.userData.LASTPROJECT);
      }
      else {
        this.setState({ tilesets: [] });
      }
    }.bind(this));
  }

  //loads a project
  loadProject(project) {
    this.setState({ loadingProject: true });
    //reset the results from any previous projects
    this.resetResults();
    jsonp(MARXAN_ENDPOINT_HTTPS + "getProject?user=" + this.state.user + "&project=" + project, { timeout: TIMEOUT }).promise.then(function(response) {
      this.setState({ loadingProject: false, loggingIn: false });
      if (!this.checkForErrors(response)) {
        //set the state for the app based on the data that is returned from the server
        this.setState({ loggedIn: true, project: response.project, runParams: response.runParameters, files: Object.assign(response.files), metadata: response.metadata, renderer: response.renderer, planning_units: response.planning_units });
        //set a local variable for the feature preprocessing - this is because we dont need to track state with these variables as they are not bound to anything
        this.feature_preprocessing = response.feature_preprocessing;
        //set a local variable for the protected area intersections - this is because we dont need to track state with these variables as they are not bound to anything
        this.protected_area_intersections = response.protected_area_intersections;
        //set a local variable for the selected iucn category
        this.previousIucnCategory = response.metadata.IUCN_CATEGORY;
        //initialise all the interest features with the interest features for this project
        this.initialiseInterestFeatures(response.metadata.OLDVERSION, response.features, response.allFeatures);
        //if there is a PLANNING_UNIT_NAME passed then programmatically change the select box to this map 
        if (response.metadata.PLANNING_UNIT_NAME) this.changeTileset(MAPBOX_USER + "." + response.metadata.PLANNING_UNIT_NAME);
        //poll the server to see if results are available for this project - if there are these will be loaded
        this.getResults(this.state.user, project);
      }
    }.bind(this));
  }

  //called when the mapbox planning unit layer has changed
  changeTileset(tilesetid) {
    this.getMetadata(tilesetid).then(function(response) {
      this.spatialLayerChanged(response, true);
    }.bind(this));
  }

  //gets all of the metadata for the tileset
  getMetadata(tilesetId) {
    return fetch("https://api.mapbox.com/v4/" + tilesetId + ".json?secure&access_token=" + this.state.userData.MAPBOXACCESSTOKEN)
      .then(response => response.json())
      .then(function(response) {
        return response;
      })
      .catch(function(error) {
        return error;
      });
  }

  //matches and returns an item in an object array with the passed id - this assumes the first item in the object is the id identifier
  getArrayItem(arr, id) {
    let tmpArr = arr.filter(function(item) { return item[0] === id });
    let returnValue = (tmpArr.length > 0) ? tmpArr[0] : undefined;
    return returnValue;
  }

  //initialises the interest features based on the current project
  initialiseInterestFeatures(oldVersion, projectFeatures, allFeatures) {
    var allInterestFeatures = [];
    if (oldVersion === 'True') {
      //if the database is from an old version of marxan then the interest features can only come from the list of features in the current project
      allInterestFeatures = projectFeatures;
    }
    else {
      //if the database is from marxan web then the interest features will come from the marxan postgis database metadata_interest_features table
      allInterestFeatures = allFeatures;
    }
    //get a list of the ids for the features that are in this project
    var ids = projectFeatures.map(function(item) {
      return item.id;
    });
    //iterate through allInterestFeatures to add the required attributes to be used in the app and to populate them based on the current project features
    var outFeatures = allInterestFeatures.map(function(item) {
      //see if the feature is in the current project
      var projectFeature = (ids.indexOf(item.id) > -1) ? projectFeatures[ids.indexOf(item.id)] : null;
      //get the preprocessing for that feature from the feature_preprocessing.dat file
      let preprocessing = this.getArrayItem(this.feature_preprocessing, item.id);
      //add the required attributes to the features - these will be populated in the function calls preprocessFeature (pu_area, pu_count) and pollResults (protected_area, target_area)
      this.addFeatureAttributes(item);
      //if the interest feature is in the current project then populate the data from that feature
      if (projectFeature) {
        item['selected'] = true;
        item['preprocessed'] = preprocessing ? true : false;
        item['pu_area'] = preprocessing ? preprocessing[1] : -1;
        item['pu_count'] = preprocessing ? preprocessing[2] : -1;
        item['spf'] = projectFeature['spf'];
        item['target_value'] = projectFeature['target_value'];
      }
      return item;
    }, this);
    this.setState({ allFeatures: outFeatures, projectFeatures: outFeatures.filter(function(item) { return item.selected }) });
  }

  //adds the required attributes for the features to work in the marxan web app - these are the default values
  addFeatureAttributes(item){
      // the -1 flag indicates that the values are unknown
      item['selected'] = false;
      item['preprocessed'] = false;
      item['pu_area'] = -1;
      item['pu_count'] = -1;
      item['spf'] = 40;
      item['target_value'] = 17;
      item['target_area'] = -1;
      item['protected_area'] = -1;
  }

  //resets various variables and state in between users
  resetResults() {
    this.runMarxanResponse = {};
    this.setState({ solutions: [], dataAvailable: false, outputsTabString: 'No data' });
  }

  //called after a file has been uploaded
  fileUploaded(parameter, filename) {
    let newFiles = Object.assign({}, this.state.files); //creating copy of object
    newFiles[parameter] = filename; //updating value
    this.setState({ files: newFiles });
  }

  //create a new user on the server
  createNewUser(user, password, name, email, mapboxaccesstoken) {
    this.setState({ creatingNewUser: true });
    let formData = new FormData();
    formData.append('user', user);
    formData.append('password', password);
    formData.append('fullname', name);
    formData.append('email', email);
    formData.append('mapboxaccesstoken', mapboxaccesstoken);
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    post(MARXAN_ENDPOINT_HTTPS + "createUser", formData, config).then((response) => {
      this.setState({ creatingNewUser: false });
      if (!this.checkForErrors(response.data)) {
        this.setState({ snackbarOpen: true, snackbarMessage: response.data.info + ". Close and login" });
      }
      else {
        this.setState({ snackbarOpen: true, snackbarMessage: response.data.error });
      }
    });
  }

  //REST call to create a new project from the wizard
  createNewProject(project) {
    this.setState({ loadingProjects: true });
    let formData = new FormData();
    formData.append('user', this.state.user);
    formData.append('project', project.name);
    formData.append('description', project.description);
    formData.append('planning_grid_name', project.planning_grid_name);
    var interest_features = [];
    var target_values = [];
    var spf_values = [];
    project.features.map((item) => {
      interest_features.push(item.id);
      target_values.push(17);
      spf_values.push(40);
    });
    //prepare the data that will populate the spec.dat file
    formData.append('interest_features', interest_features.join(","));
    formData.append('target_values', target_values.join(","));
    formData.append('spf_values', spf_values.join(","));
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    post(MARXAN_ENDPOINT_HTTPS + "createProject", formData, config).then((response) => {
      this.setState({ loadingProjects: false });
      if (!this.checkForErrors(response.data)) {
        this.setState({ snackbarOpen: true, snackbarMessage: response.data.info });
        this.loadProject(response.data.name);
      }
      else {
        this.setState({ snackbarOpen: true, snackbarMessage: response.data.error });
      }
    });
  }

  //REST call to delete a specific project
  deleteProject(name) {
    this.setState({ loadingProjects: true });
    jsonp(MARXAN_ENDPOINT_HTTPS + "deleteProject?user=" + this.state.user + "&project=" + name, { timeout: TIMEOUT }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        //refresh the projects list
        this.getProjects();
        //ui feedback
        this.setState({ snackbarOpen: true, snackbarMessage: response.info });
        //see if the user deleted the current project
        if (response.project === this.state.project) {
          //ui feedback
          this.setState({ snackbarOpen: true, snackbarMessage: "Current project deleted - loading first available" });
          //load the next available project
          this.state.projects.some((project) => {
            if (project.name !== this.state.project) this.loadProject(project.name);
            return project.name !== this.state.project;
          }, this);
        }
      }
      else {
        //ui feedback
        this.setState({ loadingProjects: false });
      }
    }.bind(this));
  }

  cloneProject(name) {
    this.setState({ loadingProjects: true });
    jsonp(MARXAN_ENDPOINT_HTTPS + "cloneProject?user=" + this.state.user + "&project=" + name, { timeout: TIMEOUT }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        //refresh the projects list
        this.getProjects();
        //ui feedback
        this.setState({ snackbarOpen: true, snackbarMessage: response.info });
      }
      else {
        //ui feedback
        this.setState({ loadingProjects: false });
      }
    }.bind(this));
  }

  startEditingProjectName() {
    this.setState({ editingProjectName: true });
  }

  startEditingDescription() {
    this.setState({ editingDescription: true });
  }
  //REST call to rename a specific project on the server
  renameProject(newName) {
    this.setState({ editingProjectName: false });
    if (newName !== '' && newName !== this.state.project) {
      jsonp(MARXAN_ENDPOINT_HTTPS + "renameProject?user=" + this.state.user + "&project=" + this.state.project + "&newName=" + newName, { timeout: TIMEOUT }).promise.then(function(response) {
        if (!this.checkForErrors(response)) {
          this.setState({ project: newName, snackbarOpen: true, snackbarMessage: response.info });
        }
      }.bind(this));
    }
  }

  renameDescription(newDesc) {
    this.setState({ editingDescription: false });
    this.updateProjectParameter("DESCRIPTION", newDesc).then(function(response) {
        if (!this.checkForErrors(response)) {
          this.setState({ metadata: Object.assign(this.state.metadata, { DESCRIPTION: newDesc })});
        }
      }.bind(this));
    }

  getProjects() {
    this.setState({ loadingProjects: true });
    jsonp(MARXAN_ENDPOINT_HTTPS + "getProjects?user=" + this.state.user, { timeout: TIMEOUT }).promise.then(function(response) {
      this.setState({ loadingProjects: false });
      if (!this.checkForErrors(response)) {
        this.setState({ projects: response.projects });
      }
      else {
        this.setState({ projects: undefined });
      }
    }.bind(this));
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////CODE TO PREPROCESS AND RUN MARXAN
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //run a marxan job on the server
  runMarxan(e) {
    //start the logging
    this.startLogging();
    //sets the state to running
    this.setState({running: true});
    //reset all of the protected and target areas for all features
    this.resetProtectedAreas();
    //update the spec.dat file with any that have been added or removed or changed target or spf
    this.updateSpecFile().then(function(value) {
      //when the species file has been updated, update the planning unit file 
      this.updatePuFile();
      //when the planning unit file has been updated, update the PuVSpr file - this does all the preprocessing
      this.updatePuvsprFile().then(function(value) {
        //start the marxan job
        this.startMarxanJob(this.state.user, this.state.project).then(function(response){
          //run completed - get the results
          this.getResults(response.user, response.project);
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }

  stopMarxan() {
    jsonp(MARXAN_ENDPOINT_HTTPS + "stopMarxan?pid=" + this.state.pid, { timeout: 10000 }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        this.setState({ running: false, pid: 0});
      }
    }.bind(this));
  }

  resetProtectedAreas() {
    //reset all of the results for allFeatures to set their protected_area and target_area to -1
    this.state.allFeatures.map(function(feature) {
      feature.protected_area = -1;
      feature.target_area = -1;
    });
  }

  //updates the species file with any target values that have changed
  updateSpecFile() {
    let formData = new FormData();
    formData.append('user', this.state.user);
    formData.append('project', this.state.project);
    var interest_features = [];
    var target_values = [];
    var spf_values = [];
    this.state.projectFeatures.map((item) => {
      interest_features.push(item.id);
      target_values.push(item.target_value);
      spf_values.push(40);
    });
    //prepare the data that will populate the spec.dat file
    formData.append('interest_features', interest_features.join(","));
    formData.append('target_values', target_values.join(","));
    formData.append('spf_values', spf_values.join(","));
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    return post(MARXAN_ENDPOINT_HTTPS + "updateSpecFile", formData, config).then((response) => {
      //check if there are no timeout errors or empty responses
      this.checkForErrors(response.data);
    });
  }

  //updates the planning unit file with any changes - not implemented yet
  updatePuFile() {

  }

  updatePuvsprFile() {
    //preprocess the features to create the puvspr.dat file on the server - this is done on demand when the project is run because the user may add/remove Conservation features willy nilly
    let promise = this.preprocessAllFeatures();
    return promise;
  }

  //preprocess a single feature
  async preprocessSingleFeature(feature){
    this.startLogging();
    this.preprocessFeature(feature);
  }
  
  //preprocess synchronously, i.e. one after another
  async preprocessAllFeatures() {
    var feature;
    //iterate through the features and preprocess the ones that need preprocessing
    for (var i = 0; i < this.state.projectFeatures.length; ++i) {
      feature = this.state.projectFeatures[i];
      if (!feature.preprocessed){
        await this.preprocessFeature(feature);
      }else{
        //
      }
    }
  }

  //preprocesses a feature using websockets - i.e. intersects it with the planning units grid and writes the intersection results into the puvspr.dat file ready for a marxan run - this will have no server timeout as its running using websockets
  preprocessFeature(feature) {
    return new Promise(function(resolve, reject) {
      //switches the results pane to the log tab
      this.log_tab_active();
      this.setState({preprocessingFeature: true});
      ws = new WebSocket(MARXAN_ENDPOINT_WSS + "preprocessFeature?user=" + this.state.user + "&project=" + this.state.project + "&planning_grid_name=" + this.state.metadata.PLANNING_UNIT_NAME + "&feature_class_name=" + feature.feature_class_name + "&alias=" + feature.alias + "&id=" + feature.id);
      ws.onmessage = function (evt) {
        //TODO This code is duplicated in other websocket onmessage functions - sort out
        let response = JSON.parse(evt.data);
        switch (response.status) {
          case 'Started': 
            this.setState({streamingLog: this.state.streamingLog + response.info + "\n"});
            break;
          case 'Running': 
            this.setState({streamingLog: this.state.streamingLog + response.info + " (elapsed time: " + response.elapsedtime + ")\n"});
            break;
          case 'Finished': 
            //reset the preprocessing state
            this.setState({preprocessingFeature: false, streamingLog: this.state.streamingLog + response.info + " (Total time: " + response.elapsedtime + ")\n\n" });
            //update the feature that has been preprocessed
            this.updateFeature(feature, "preprocessed", true, true);
            this.updateFeature(feature, "pu_count", Number(response.pu_count), true);
            this.updateFeature(feature, "pu_area", Number(response.pu_area), true);
            resolve(evt.data);
            break;
        }
      }.bind(this);
    }.bind(this));
  }

  //calls the marxan executeable and runs it getting the output streamed through websockets
  startMarxanJob(user, project, showLog = true) {
    var logMessage = "";
    return new Promise(function(resolve, reject) {
      //update the ui to reflect the fact that a job is running
      this.setState({active_pu: undefined, outputsTabString: 'Running...' });
      //make the request to get the marxan data
      ws = new WebSocket(MARXAN_ENDPOINT_WSS + "runMarxan?user=" + user + "&project=" + project);
      ws.onmessage = function(evt){
        let response = JSON.parse(evt.data);
        switch (response.status) {
          case 'pid': 
            this.setState({pid: response.pid});
            break;
          case 'Started': 
            logMessage = this.state.streamingLog + response.info + "\n\n";
            break;
          case 'Running': 
            logMessage = this.state.streamingLog + response.info.replace(/(\n\n  Init)/gm,"\n  Init").replace(/(\n\n  ThermalAnnealing)/gm,"\n  ThermalAnnealing").replace(/(\n\n  Iterative)/gm,"\n  Iterative").replace(/(\n\n  Best)/gm,"\n  Best");
            break;
          case 'Finished': 
            logMessage = this.state.streamingLog + "\n" + response.info + " (Total time: " + response.elapsedtime + ")\n";
            resolve(response);
            break;
        }
        if (showLog) this.setState({streamingLog: logMessage});
      }.bind(this);
    }.bind(this));
  }

  //called every time there is a message from the running marxan websocket
  marxanJobMessageReceived (evt) {
  }

  //gets the results for a project
  getResults(user, project){
    //make the request to get the results
    jsonp(MARXAN_ENDPOINT_HTTPS + "getResults?user=" + user + "&project=" + project, { timeout: TIMEOUT }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
          this.runCompleted(response);
      }
    }.bind(this));
  }
  
  //run completed
  runCompleted(response) {
    var solutions;
    //get the response and store it in this component
    this.runMarxanResponse = response;
    //if we have some data to map then set the state to reflect this
    if (this.runMarxanResponse.ssoln && this.runMarxanResponse.ssoln.length > 0) {
      this.setState({ dataAvailable: true , snackbarOpen: true, snackbarMessage: response.info});
      //render the sum solution map
      this.renderSolution(this.runMarxanResponse.ssoln, true);
      //create the array of solutions to pass to the InfoPanels table
      solutions = response.summary;
      //the array data are in the format "Run_Number","Score","Cost","Planning_Units" - so create an array of objects to pass to the outputs table
      solutions = solutions.map(function(item) {
        return { "Run_Number": item[0], "Score": Number(item[1]).toFixed(1), "Cost": Number(item[2]).toFixed(1), "Planning_Units": item[3], "Missing_Values": item[12] };
      });
      //add in the row for the summed solutions
      solutions.splice(0, 0, { 'Run_Number': 'Sum', 'Score': '', 'Cost': '', 'Planning_Units': '', 'Missing_Values': '' });
      //update the amount of each target that is protected in the current run from the output_mvbest.txt file
      this.updateProtectedAmount(this.runMarxanResponse.mvbest);
    }else{
      this.setState({ dataAvailable: false });
      solutions = [];
      // this.setState({ brew: {} });
    }
    //TODO There are bugs in Marxan which dont write the output_log.dat file correctly that need to be fixed - for now the log comes from this file or is streamed back from the server on a Marxan run (streaming is not supported on Windows)
    this.setState({ running: false, outputsTabString: '', solutions: solutions });
    //set the features tab as active
    this.features_tab_active();
  }

  //gets the protected area information in m2 from the marxan run and populates the interest features with the values
  updateProtectedAmount(mvData) {
    //iterate through the features and set the protected amount
    this.state.projectFeatures.map((feature) => {
      //get the matching item in the mvbest data
      let mvbestItemIndex = mvData.findIndex(function(item) { return item[0] === feature.id; });
      if (mvbestItemIndex>-1){ //the mvbest file may not contain the data for the feature if the project has not been run since the feature was added
        //get the missing values item for the specific feature
        let mvItem = mvData[mvbestItemIndex];
        this.updateFeature(feature, "target_area", mvItem[2], true);
        this.updateFeature(feature, "protected_area", mvItem[3], true);
      }
    }, this);
  }

  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////END OF CODE TO PREPROCESS AND RUN MARXAN
  /////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //pads a number with zeros to a specific size, e.g. pad(9,5) => 00009
  pad(num, size) {
    var s = num + "";
    while (s.length < size) s = "0" + s;
    return s;
  }

  //load a specific solution for the current project
  loadSolution(solution) {
    if (solution === "Sum") {
      this.updateProtectedAmount(this.runMarxanResponse.mvbest);
      //load the sum of solutions which will already be loaded
      this.renderSolution(this.runMarxanResponse.ssoln, true);
    }
    else {
      this.getSolution(this.state.user, this.state.project, solution).then(function(response){
          this.updateProtectedAmount(response.mv);
          this.renderSolution(response.solution, false);
      }.bind(this));
    }
  }

  //load a solution from another project - used in the clumping dialog - when the solution is loaded the paint properties are set on the individual maps through state changes
  loadOtherSolution(user, project, solution) {
    this.getSolution(user, project, solution).then(function(response){
      var paintProperties = this.getPaintProperties(response.solution, false, false);
      //get the project that matches the project name from the this.projects property - this was set when the projectGroup was created
      var _projects = this.projects.filter(function(item){return item.projectName == project});
      //get which clump it is
      var clump = _projects[0].clump;
      switch (clump) {
        case 0:
          this.setState({map0_paintProperty: paintProperties});
          break;
        case 1:
          this.setState({map1_paintProperty: paintProperties});
          break;
        case 2:
          this.setState({map2_paintProperty: paintProperties});
          break;
        case 3:
          this.setState({map3_paintProperty: paintProperties});
          break;
        case 4:
          this.setState({map4_paintProperty: paintProperties});
          break;
      }
    }.bind(this));
  }
  
  //gets a solution and returns a promise
  getSolution(user, project, solution){
    return new Promise(function(resolve, reject) {
      //request the data for the specific solution
      jsonp(MARXAN_ENDPOINT_HTTPS + "getSolution?user=" + user + "&project=" + project + "&solution=" + solution, { timeout: TIMEOUT }).promise.then(function(response) {
        if (!this.checkForErrors(response)) {
          resolve(response);
        }
      }.bind(this));
    }.bind(this));
  }
  
  //gets the total number of planning units in the ssoln and outputs the statistics of the distribution to state, e.g. 2 PUs with a value of 1, 3 with a value of 2 etc.
  getssolncount(data) {
    let total = 0;
    let summaryStats = [];
    data.map(function(item) {
      summaryStats.push({ number: item[0], count: item[1].length });
      total += item[1].length;
      return null;
    });
    this.setState({ summaryStats: summaryStats });
    return total;
  }
  //gets a sample of the data to be able to do a classification, e.g. natural breaks, jenks etc.
  getssolnSample(data, sampleSize) {
    let sample = [],
      num = 0;
    let ssolnLength = this.getssolncount(data);
    data.map(function(item) {
      //use the ceiling function to force outliers to be in the classification, i.e. those planning units that were only selected in 1 solution
      num = Math.ceil((item[1].length / ssolnLength) * sampleSize);
      sample.push(Array(num, ).fill(item[0]));
      return null;
    });
    return [].concat.apply([], sample);
  }

  //get all data from the ssoln arrays
  getSsolnData(data) {
    let arrays = data.map((item) => {
      return item[1];
    });
    return [].concat.apply([], arrays);
  }
  //gets the classification and colorbrewer object for doing the rendering
  classifyData(data, numClasses, colorCode, classification) {
    //get a sample of the data to make the renderer classification
    let sample = this.getssolnSample(data, 1000); //samples dont work
    // let sample = this.getSsolnData(data); //get all the ssoln data
    //set the data 
    this.state.brew.setSeries(sample);
    //set the color code - see the color theory section on Joshua Tanners page here https://github.com/tannerjt/classybrew - for all the available colour codes
    this.state.brew.setColorCode(colorCode);
    //get the maximum number of colors in this scheme
    let colorSchemeLength = utilities.getMaxNumberOfClasses(this.state.brew, colorCode);
    //check the color scheme supports the passed number of classes
    if (numClasses > colorSchemeLength) {
      //set the numClasses to the max for the color scheme
      numClasses = colorSchemeLength;
      //reset the renderer
      this.setState({ renderer: Object.assign(this.state.renderer, { NUMCLASSES: numClasses }) });
    }
    //set the number of classes
    this.state.brew.setNumClasses(numClasses);
    //if the colorCode is opacity then I will add it manually to the classbrew colorSchemes
    if (colorCode === 'opacity') {
      let newBrewColorScheme = Array(Number(this.state.renderer.NUMCLASSES)).fill("rgba(255,0,136,").map(function(item, index) { return item + ((1 / this) * (index + 1)) + ")"; }, this.state.renderer.NUMCLASSES);
      this.state.brew.colorSchemes.opacity = {
        [this.state.renderer.NUMCLASSES]: newBrewColorScheme
      };
    }
    //set the classification method - one of equal_interval, quantile, std_deviation, jenks (default)
    this.state.brew.classify(classification);
    this.setState({ dataBreaks: this.state.brew.getBreaks() });
  }

  //called when the renderer state has been updated - renders the solution and saves the renderer back to the server
  rendererStateUpdated(parameter, value) {
    this.renderSolution(this.runMarxanResponse.ssoln, true);
    this.updateProjectParameter(parameter, value);
  }
  //change the renderer, e.g. jenks, natural_breaks etc.
  changeRenderer(renderer) {
    this.setState({ renderer: Object.assign(this.state.renderer, { CLASSIFICATION: renderer }) }, function() {
      this.rendererStateUpdated("CLASSIFICATION", renderer);
    });
  }
  //change the number of classes of the renderer
  changeNumClasses(numClasses) {
    this.setState({ renderer: Object.assign(this.state.renderer, { NUMCLASSES: numClasses }) }, function() {
      this.rendererStateUpdated("NUMCLASSES", numClasses);
    });
  }
  //change the color code of the renderer
  changeColorCode(colorCode) {
    //set the maximum number of classes that can be selected in the other select boxes
    if (this.state.renderer.NUMCLASSES > this.state.brew.getNumClasses()) {
      this.setState({ renderer: Object.assign(this.state.renderer, { NUMCLASSES: this.state.brew.getNumClasses() }) });
    }
    this.setState({ renderer: Object.assign(this.state.renderer, { COLORCODE: colorCode }) }, function() {
      this.rendererStateUpdated("COLORCODE", colorCode);
    });
  }
  //change how many of the top classes only to show
  changeShowTopClasses(numClasses) {
    this.setState({ renderer: Object.assign(this.state.renderer, { TOPCLASSES: numClasses }) }, function() {
      this.rendererStateUpdated("TOPCLASSES", numClasses);
    });
  }
  //renders the solution - data is the REST response and sum is a flag to indicate if the data is the summed solution (true) or an individual solution (false)
  renderSolution(data, sum) {
    if (!data) return;
    var paintProperties = this.getPaintProperties(data, sum, true);
    //set the render paint property
    this.map.setPaintProperty(RESULTS_LAYER_NAME, "fill-color", paintProperties.fillColor);
    this.map.setPaintProperty(RESULTS_LAYER_NAME, "fill-outline-color", paintProperties.oulineColor);
    this.map.setPaintProperty(RESULTS_LAYER_NAME, "fill-opacity", RESULTS_LAYER_FILL_OPACITY_ACTIVE);
  }

  //gets the various paint properties for the planning unit layer - if setRenderer is true then it will also update the renderer in the Legend panel
  getPaintProperties(data, sum, setRenderer){
    //build an expression to get the matching puids with different numbers of 'numbers' in the marxan results
    var fill_color_expression = ["match", ["get", "puid"]];
    var fill_outline_color_expression = ["match", ["get", "puid"]];
    if (this.state.dataAvailable) {
      var color, visibleValue, value;
      //create the renderer using Joshua Tanners excellent library classybrew - available here https://github.com/tannerjt/classybrew
      if (setRenderer) this.classifyData(data, Number(this.state.renderer.NUMCLASSES), this.state.renderer.COLORCODE, this.state.renderer.CLASSIFICATION);
      //if only the top n classes will be rendered then get the visible value at the boundary
      if (this.state.renderer.TOPCLASSES < this.state.renderer.NUMCLASSES) {
        let breaks = this.state.brew.getBreaks();
        visibleValue = breaks[this.state.renderer.NUMCLASSES - this.state.renderer.TOPCLASSES + 1];
      }
      else {
        visibleValue = 0;
      }
      // the rest service sends the data grouped by the 'number', e.g. [1,[23,34,36,43,98]],[2,[16,19]]
      data.forEach(function(row, index) {
        if (sum) { //multi value rendering
          value = row[0];
          //for each row add the puids and the color to the expression, e.g. [35,36,37],"rgba(255, 0, 136,0.1)"
          color = this.state.brew.getColorInRange(value);
          //add the color to the expression - transparent if the value is less than the visible value
          if (value >= visibleValue) {
            fill_color_expression.push(row[1], color);
            fill_outline_color_expression.push(row[1], "rgba(150, 150, 150, 0.6)"); //gray outline
          }
          else {
            fill_color_expression.push(row[1], "rgba(0, 0, 0, 0)");
            fill_outline_color_expression.push(row[1], "rgba(0, 0, 0, 0)");
          }
        }
        else { //single value rendering
          fill_color_expression.push(row[1], "rgba(255, 0, 136,1)");
          fill_outline_color_expression.push(row[1], "rgba(150, 150, 150, 0.6)"); //gray outline
        }
      }, this);
      // Last value is the default, used where there is no data
      fill_color_expression.push("rgba(0,0,0,0)");
      fill_outline_color_expression.push("rgba(0,0,0,0)");
    }else{
      fill_color_expression = "rgba(0, 0, 0, 0)";
      fill_outline_color_expression = "rgba(0, 0, 0, 0)";
    }
    return {fillColor: fill_color_expression, oulineColor: fill_outline_color_expression};
  }
  
  
  //renders the planning units edit layer according to the type of layer and pu status 
  renderPuEditLayer() {
    let expression;
    if (this.state.planning_units.length > 0) {
      //build an expression to get the matching puids with different statuses in the planning units data
      expression = ["match", ["get", "puid"]];
      // the rest service sends the data grouped by the status, e.g. [1,[23,34,36,43,98]],[2,[16,19]]
      this.state.planning_units.forEach(function(row, index) {
        var color;
        //get the status
        switch (row[0]) {
          case 1: //The PU will be included in the initial reserve system but may or may not be in the final solution.
            color = "rgba(63, 191, 63, 1)";
            break;
          case 2: //The PU is fixed in the reserve system (“locked in”). It starts in the initial reserve system and cannot be removed.
            color = "rgba(63, 63, 191, 1)";
            break;
          case 3: //The PU is fixed outside the reserve system (“locked out”). It is not included in the initial reserve system and cannot be added.
            color = "rgba(191, 63, 63, 1)";
            break;
        }
        //add the color to the expression 
        expression.push(row[1], color);
      });
      // Last value is the default, used where there is no data - i.e. for all the planning units with a status of 0
      expression.push("rgba(150, 150, 150, 0)");
    }
    else {
      //there are no statuses apart from the default 0 status so have a single renderer
      expression = "rgba(150, 150, 150, 0)";
    }
    //set the render paint property
    this.map.setPaintProperty(PLANNING_UNIT_EDIT_LAYER_NAME, "line-color", expression);
    this.map.setPaintProperty(PLANNING_UNIT_EDIT_LAYER_NAME, "line-width", PLANNING_UNIT_EDIT_LAYER_LINE_WIDTH);
  }

  mouseMove(e) {
    //error check
    if (!this.state.userData.SHOWPOPUP) return;
    //get the features under the mouse
    var features = this.map.queryRenderedFeatures(e.point, { layers: [RESULTS_LAYER_NAME] });
    //see if there are any planning unit features under the mouse
    if (features.length) {
      //set the location for the popup
      if (!this.state.active_pu || (this.state.active_pu && this.state.active_pu.puid !== features[0].properties.puid)) this.setState({ popup_point: e.point });
      //get the properties from the vector tile
      let vector_tile_properties = features[0].properties;
      //get the properties from the marxan results - these will include the number of solutions that that planning unit is found in
      let marxan_results = this.runMarxanResponse && this.runMarxanResponse.ssoln ? this.runMarxanResponse.ssoln.filter(item => item[1].indexOf(vector_tile_properties.puid) > -1)[0] : {};
      if (marxan_results) {
        //convert the marxan results from an array to an object
        let marxan_results_dict = { "puid": vector_tile_properties.puid, "Number": marxan_results[0] };
        //combine the 2 sets of properties
        let active_pu = Object.assign(marxan_results_dict, vector_tile_properties);
        //set the state to re-render the popup
        this.setState({ active_pu: active_pu });
      }
      else {
        this.hidePopup();
      }
    }
    else {
      this.hidePopup();
    }
  }

  hidePopup() {
    this.setState({ active_pu: undefined });
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///MAP LAYERS ADDING/REMOVING AND INTERACTION
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  spatialLayerChanged(tileset, zoomToBounds) {
    //remove the existing results layer and planning unit layer
    this.removeSpatialLayers();
    //add a new results layer and planning unit layer
    this.addSpatialLayers(tileset);
    //zoom to the layers extent
    this.zoomToBounds(tileset.bounds);
    //set the state
    this.setState({ tileset: tileset });
    //filter the wdpa vector tiles as the map doesn't respond to state changes
    this.filterWdpaByIucnCategory(this.state.metadata.IUCN_CATEGORY);
  }

  removeSpatialLayers() {
    let layers = this.map.getStyle().layers;
    //get the dynamically added layers
    let dynamicLayers = layers.filter((item) => {
      return !(item.source === 'composite' || item.id === 'background');
    });
    //remove them from the map
    dynamicLayers.map(function(item) {
      this.map.removeLayer(item.id);
      this.map.removeSource(item.source);
    }, this);
  }
  //adds the results, planning unit, planning unit edit and wdpa layers to the map
  addSpatialLayers(tileset) {
    //add the results layer
    this.map.addLayer({
      'id': RESULTS_LAYER_NAME,
      'type': "fill",
      'source': {
        'type': "vector",
        'url': "mapbox://" + tileset.id
      },
      'source-layer': tileset.name,
      'paint': {
        'fill-color': "rgba(0, 0, 0, 0)",
        'fill-outline-color': "rgba(0, 0, 0, 0)"
      }
    }, 'bathymetry-10000');
    //add the planning unit layer
    this.map.addLayer({
      'id': PLANNING_UNIT_LAYER_NAME,
      'type': "fill",
      'source': {
        'type': "vector",
        'url': "mapbox://" + tileset.id
      },
      "layout": {
        "visibility": "none"
      },
      'source-layer': tileset.name,
      'paint': {
        'fill-color': "rgba(0, 0, 0, 0)",
        'fill-outline-color': "rgba(150, 150, 150, " + PLANNING_UNIT_LAYER_OPACITY + ")"
      }
    }, 'bathymetry-10000');

    //add the planning units manual edit layer
    this.map.addLayer({
      'id': PLANNING_UNIT_EDIT_LAYER_NAME,
      'type': "line",
      'source': {
        'type': "vector",
        'url': "mapbox://" + tileset.id
      },
      "layout": {
        "visibility": "none"
      },
      'source-layer': tileset.name,
      'paint': {
        'line-color': "rgba(150, 150, 150, 0)",
        'line-width': PLANNING_UNIT_EDIT_LAYER_LINE_WIDTH
      }
    }, 'bathymetry-10000');
    this.map.addLayer({
      "id": WDPA_LAYER_NAME,
      "type": "fill",
      "source": {
        "attribution": "IUCN and UNEP-WCMC (2017), The World Database on Protected Areas (WDPA) August 2017, Cambridge, UK: UNEP-WCMC. Available at: <a href='http://www.protectedplanet.net'>www.protectedplanet.net</a>",
        "type": "vector",
        "tilejson": "2.2.0",
        "maxzoom": 12,
        "tiles": ["https://storage.googleapis.com/geeimageserver.appspot.com/vectorTiles/wdpa/tilesets/{z}/{x}/{y}.pbf"]
      },
      "source-layer": "wdpa",
      "layout": {
        "visibility": "visible"
      },
      "filter": ["==", "WDPAID", -1],
      "paint": {
        "fill-color": {
          "type": "categorical",
          "property": "MARINE",
          "stops": [
            ["0", "rgba(99,148,69, " + WDPA_LAYER_OPACITY + ")"],
            ["1", "rgba(63,127,191, " + WDPA_LAYER_OPACITY + ")"],
            ["2", "rgba(63,127,191, " + WDPA_LAYER_OPACITY + ")"]
          ]
        },
        "fill-outline-color": {
          "type": "categorical",
          "property": "MARINE",
          "stops": [
            ["0", "rgba(99,148,69," + WDPA_LAYER_OPACITY + ")"],
            ["1", "rgba(63,127,191, " + WDPA_LAYER_OPACITY + ")"],
            ["2", "rgba(63,127,191, " + WDPA_LAYER_OPACITY + ")"]
          ]
        }
      }
    });
  }

  //fired when the projects tab is selected
  project_tab_active() {
    this.setState({ activeTab: "project" });
    this.pu_tab_inactive();
  }

  //fired when the features tab is selected
  features_tab_active() {
    if (this.state.activeTab !== "features"){
      this.setState({ activeTab: "features" });
      if (this.state.dataAvailable) {
        //render the sum solution map
        this.renderSolution(this.runMarxanResponse.ssoln, true);
      }
      //hide the planning unit layers
      this.pu_tab_inactive();
    }
  }

  //fired when the planning unit tab is selected
  pu_tab_active() {
    this.setState({ activeTab: "planning_units" });
    //show the planning units layer 
    this.showLayer(PLANNING_UNIT_LAYER_NAME);
    //change the opacity on the results layer to make it more transparent
    this.map.setPaintProperty(RESULTS_LAYER_NAME, "fill-opacity", RESULTS_LAYER_FILL_OPACITY_INACTIVE);
    //change the opacity on all of the composite source layers to make them more transparent
    // this.setOpacityBySource("composite", 0.5);
    //show the planning units edit layer 
    this.showLayer(PLANNING_UNIT_EDIT_LAYER_NAME);
    //render the planning_units_layer_edit layer
    this.renderPuEditLayer(PLANNING_UNIT_EDIT_LAYER_NAME);
  }

  //fired whenever another tab is selected
  pu_tab_inactive() {
    //change the opacity on the results layer to make it more opaque
    this.map.setPaintProperty(RESULTS_LAYER_NAME, "fill-opacity", RESULTS_LAYER_FILL_OPACITY_ACTIVE);
    //change the opacity on all of the composite source layers to restore the opacity
    // this.setOpacityBySource("composite", 1);
    //hide the planning units layer 
    this.hideLayer(PLANNING_UNIT_LAYER_NAME);
    //hide the planning units edit layer 
    this.hideLayer(PLANNING_UNIT_EDIT_LAYER_NAME);
  }

  //fired when the legend tab is selected
  legend_tab_active() {
    this.setState({activeResultsTab: "legend" });
  }

  //fired when the solutions tab is selected
  solutions_tab_active() {
    this.setState({activeResultsTab: "solutions" });
  }

  //fired when the log tab is selected
  log_tab_active() {
    this.setState({activeResultsTab: "log" });
  }

  showLayer(id) {
    this.map.setLayoutProperty(id, 'visibility', 'visible');
  }
  hideLayer(id) {
    this.map.setLayoutProperty(id, 'visibility', 'none');
  }

  //iterates through all the map layers and sets the opacity for all those layers with the source matching the passed source
  setOpacityBySource(source, opacity) {
    this.map.getStyle().layers.map((layer) => {
      if (layer.source === source) {
        switch (layer.type) {
          case 'fill':
            let opacity2 = (layer.id.substr(0,9) === 'hillshade') ? 0 : opacity;
            this.map.setPaintProperty(layer.id, "fill-opacity", opacity2);
            break;
          case 'line':
            this.map.setPaintProperty(layer.id, "line-opacity", opacity);
            break;
          case 'symbol':
            this.map.setPaintProperty(layer.id, "text-opacity", opacity);
            //also icon-opacity
            this.map.setPaintProperty(layer.id, "icon-opacity", opacity);
            break;
          default:
            // code
        }
      }else{
        if (layer.id === 'background') this.map.setLayoutProperty(layer.id, 'visibility', 'none');
      }
    }, this);
  }

  startPuEditSession() {
    //set the cursor to a crosshair
    this.map.getCanvas().style.cursor = "crosshair";
    //add the left mouse click event to the planning unit layer
    this.map.on("click", PLANNING_UNIT_LAYER_NAME, this.moveStatusUp);
    //add the mouse right click event to the planning unit layer 
    this.map.on("contextmenu", PLANNING_UNIT_LAYER_NAME, this.resetStatus);
  }

  stopPuEditSession() {
    //reset the cursor
    this.map.getCanvas().style.cursor = "pointer";
    //remove the mouse left click event
    this.map.off("click", PLANNING_UNIT_LAYER_NAME, this.moveStatusUp);
    //remove the mouse right click event
    this.map.off("contextmenu", PLANNING_UNIT_LAYER_NAME, this.resetStatus);
    //update the pu.dat file
    this.updatePuDatFile();
  }

  //sends a list of puids that should be excluded from the run to upddate the pu.dat file
  updatePuDatFile() {
    //initialise the form data
    let formData = new FormData();
    //add the current user
    formData.append("user", this.state.user);
    //add the current project
    formData.append("project", this.state.project);
    //add the planning unit manual exceptions
    if (this.state.planning_units.length > 0) {
      this.state.planning_units.map((item) => {
        //get the name of the status parameter
        let param_name = "status" + item[0];
        //add the planning units
        formData.append(param_name, item[1]);
      });
    }
    const config = {
      headers: {
        'content-type': 'multipart/form-data'
      }
    };
    //post to the server
    post(MARXAN_ENDPOINT_HTTPS + "updatePUFile", formData, config).then((response) => {
      if (!this.checkForErrors(response.data)) {
        // this.setState({ snackbarOpen: true, snackbarMessage: response.data.info });
      }
    });
  }

  //fired when the user left clicks on a planning unit to move its status up
  moveStatusUp(e) {
    this.App.changeStatus(e, "up");
  }

  //fired when the user left clicks on a planning unit to reset its status 
  resetStatus(e) {
    this.App.changeStatus(e, "reset");
  }

  changeStatus(e, direction) {
    //get the feature that the user has clicked 
    var features = this.map.queryRenderedFeatures(e.point, { layers: [PLANNING_UNIT_LAYER_NAME] });
    //get the featureid
    if (features.length > 0) {
      //get the puid
      let puid = features[0].properties.puid;
      //get its current status 
      let status = this.getStatusLevel(puid);
      //get the next status level
      let next_status = this.getNextStatusLevel(status, direction);
      //copy the current planning unit statuses 
      let statuses = this.state.planning_units;
      //if the planning unit is not at level 0 (in which case it will not be in the planning_units state) - then remove it from the puids array for that status
      if (status !== 0) this.removePuidFromArray(statuses, status, puid);
      //add it to the new status array
      if (next_status !== 0) this.addPuidToArray(statuses, next_status, puid);
      //set the state
      this.setState({ planning_units: statuses });
      //re-render the planning unit edit layer
      this.renderPuEditLayer();
    }
  }

  getStatusLevel(puid) {
    //iterate through the planning unit statuses to see which status the clicked planning unit belongs to, i.e. 1,2 or 3
    let status_level = 0; //default level as the getPlanningUnits REST call only returns the planning units with non-default values
    this.planning_unit_statuses.map((item) => {
      let planning_units = this.getPlanningUnitsByStatus(item);
      if (planning_units.indexOf(puid) > -1) {
        status_level = item;
      }
    }, this);
    return status_level;
  }

  //gets the array index position for the passed status in the planning_units state
  getStatusPosition(status) {
    let position = -1;
    this.state.planning_units.map((item, index) => {
      if (item[0] === status) position = index;
    });
    return position;
  }

  //returns the planning units with a particular status, e.g. 1,2,3 
  getPlanningUnitsByStatus(status) {
    //get the position of the status items in the this.state.planning_units
    let position = this.getStatusPosition(status);
    //get the array of planning units
    let returnValue = (position > -1) ? this.state.planning_units[position][1] : [];
    return returnValue;
  }
  //returns the next status level for a planning unit depending on the direction
  getNextStatusLevel(status, direction) {
    let nextStatus;
    switch (status) {
      case 0:
        nextStatus = (direction === "up") ? 3 : 0;
        break;
      case 1:
        nextStatus = (direction === "up") ? 0 : 0;
        break;
      case 2:
        nextStatus = (direction === "up") ? 1 : 0;
        break;
      case 3:
        nextStatus = (direction === "up") ? 2 : 0;
        break;
    }
    return nextStatus;
  }

  //removes in individual puid value from an array of puid statuses 
  removePuidFromArray(statuses, status, puid) {
    return this.removePuidsFromArray(statuses, status, [puid]);
  }

  addPuidToArray(statuses, status, puid) {
    return this.appPuidsToPlanningUnits(statuses, status, [puid]);
  }

  //adds all the passed puids to the planning_units state
  appPuidsToPlanningUnits(statuses, status, puids) {
    //get the position of the status items in the this.state.planning_units, i.e. the index
    let position = this.getStatusPosition(status);
    if (position === -1) {
      //create a new status and empty puid array
      statuses.push([status, []]);
      position = statuses.length - 1;
    }
    //add the puids to the puid array ensuring that they are unique
    statuses[position][1] = Array.from(new Set(statuses[position][1].concat(puids)));
    return statuses;
  }

  //removes all the passed puids from the planning_units state
  removePuidsFromArray(statuses, status, puids) {
    //get the position of the status items in the this.state.planning_units
    let position = this.getStatusPosition(status);
    if (position > -1) {
      let puid_array = statuses[position][1];
      let new_array = puid_array.filter(function(item) {
        return puids.indexOf(item) < 0;
      });
      statuses[position][1] = new_array;
      //if there are no more items in the puid array then remove it
      if (new_array.length === 0) statuses.splice(position, 1);
    }
    return statuses;
  }

  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ///END OF MAP LAYERS ADDING/REMOVING AND INTERACTION
  ///////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  zoomToBounds(bounds) {
    let minLng = (bounds[0] < -180) ? -180 : bounds[0];
    let minLat = (bounds[1] < -90) ? -90 : bounds[1];
    let maxLng = (bounds[2] > 180) ? 180 : bounds[2];
    let maxLat = (bounds[3] > 90) ? 90 : bounds[3];
    this.map.fitBounds([minLng, minLat, maxLng, maxLat], { padding: { top: 10, bottom: 10, left: 10, right: 10 }, easing: function(num) { return 1; } });
  }

  //ROUTINES FOR CREATING A NEW PROJECT

  openNewProjectDialog() {
    this.setState({ newProjectDialogOpen: true });
  }
  closeNewProjectDialog() {
    this.setState({ newProjectDialogOpen: false });
  }

  openNewPlanningUnitDialog() {
    this.setState({ NewPlanningUnitDialogOpen: true });
  }
  closeNewPlanningUnitDialog() {
    this.setState({ NewPlanningUnitDialogOpen: false });
  }
  createNewPlanningUnitGrid() {
    this.setState({ creatingNewPlanningUnit: true });
    jsonp(MARXAN_ENDPOINT_HTTPS + "createPlanningUnitGrid?iso3=" + this.state.iso3 + "&domain=" + this.state.domain + "&areakm2=" + this.state.areakm2, { timeout: 0 }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        //feedback
        this.setState({ snackbarOpen: true, snackbarMessage: "Planning grid: '" + response.planning_unit_grid.split(",")[1].replace(/"/gm, '').replace(")", "") + "' created" }); //response is (pu_cok_terrestrial_hexagons_10,"Cook Islands Terrestrial 10Km2 hexagon grid")
        //upload this data to mapbox for visualisation
        this.uploadToMapBox(response.planning_unit_grid.split(",")[0].replace(/"/gm, '').replace("(", ""), "hexagons");
        //update the planning unit items
        this.getPlanningUnitGrids();
      }
      else {
        //do something
      }
      //reset the state
      this.setState({ creatingNewPlanningUnit: false });
      //close the NewPlanningUnitDialog
      this.closeNewPlanningUnitDialog();
    }.bind(this));
  }

  changeIso3(value) {
    this.setState({ iso3: value });
  }
  changeDomain(value) {
    this.setState({ domain: value });
  }
  changeAreaKm2(value) {
    this.setState({ areakm2: value });
  }
  getCountries() {
    jsonp(MARXAN_ENDPOINT_HTTPS + "getCountries", { timeout: 10000 }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        //valid response
        this.setState({ countries: response.records });
      }
      else {
        this.setState({ loggingIn: false });
      }
    }.bind(this));
  }

  //uploads the names feature class to mapbox on the server
  uploadToMapBox(feature_class_name, mapbox_layer_name) {
    jsonp(MARXAN_ENDPOINT_HTTPS + "uploadTilesetToMapBox?feature_class_name=" + feature_class_name + "&mapbox_layer_name=" + mapbox_layer_name, { timeout: 300000 }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        this.setState({ snackbarOpen: true, snackbarMessage: "Uploading to MapBox with the id: " + response.uploadid });
        this.timer = setInterval(() => this.pollMapboxForUploadComplete(response.uploadid), 5000);
      }
      else {
        //server error
      }
    }.bind(this));
  }

  pollMapboxForUploadComplete(uploadid) {
    var request = require('request');
    request("https://api.mapbox.com/uploads/v1/" + MAPBOX_USER + "/" + uploadid + "?access_token=sk.eyJ1IjoiYmxpc2h0ZW4iLCJhIjoiY2piNm1tOGwxMG9lajMzcXBlZDR4aWVjdiJ9.Z1Jq4UAgGpXukvnUReLO1g", this.pollMapboxForUploadCompleteResponse.bind(this));
  }

  pollMapboxForUploadCompleteResponse(error, response, body) {
    if (JSON.parse(body).complete) {
      clearInterval(this.timer);
      this.timer = null;
      this.setState({ snackbarOpen: true, snackbarMessage: "Uploaded to MapBox" });
    }
  }

  getInterestFeature(id) {
    //load the interest feature from the marxan web database
    jsonp(MARXAN_ENDPOINT_HTTPS + "getFeature?oid=" + id + "&format=json", { timeout: 10000 }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        //add the required attributes to use it in Marxan Web
        this.addFeatureAttributes(response.data[0]);
        //update the allFeatures array
        var featuresCopy = this.state.allFeatures;
        featuresCopy.push(response.data[0]);
        this.setState({allFeatures: featuresCopy});
      }
      else {}
    }.bind(this));
  }

  openNewInterestFeatureDialog() {
    this.setState({ NewInterestFeatureDialogOpen: true });
  }
  closeNewInterestFeatureDialog() {
    this.setState({ NewInterestFeatureDialogOpen: false });
  }
  openAllInterestFeaturesDialog() {
    this.setState({ AllInterestFeaturesDialogOpen: true });
  }
  closeAllInterestFeaturesDialog() {
    // this.updateSpecFile().then(function(response) {
    this.setState({ AllInterestFeaturesDialogOpen: false });
    // }.bind(this));
  }
  openAllCostsDialog() {
    this.setState({ AllCostsDialogOpen: true });
  }
  closeAllCostsDialog() {
    this.setState({ AllCostsDialogOpen: false });
  }
  setNewFeatureDatasetName(name) {
    this.setState({ featureDatasetName: name });
  }
  setNewFeatureDatasetDescription(description) {
    this.setState({ featureDatasetDescription: description });
  }
  setNewFeatureDatasetFilename(filename) {
    this.setState({ featureDatasetFilename: filename });
  }
  resetNewConservationFeature() {
    this.setState({ featureDatasetName: '', featureDatasetDescription: '', featureDatasetFilename: '' });
  }
  createNewInterestFeature() {
    //the zipped shapefile has been uploaded to the MARXAN folder and the metadata are in the featureDatasetName, featureDatasetDescription and featureDatasetFilename state variables - 
    jsonp(MARXAN_ENDPOINT_HTTPS + "importFeature?filename=" + this.state.featureDatasetFilename + "&name=" + this.state.featureDatasetName + "&description=" + this.state.featureDatasetDescription, { timeout: TIMEOUT }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        if (response.id){
          this.getInterestFeature(response.id);
          this.setState({ snackbarOpen: true, snackbarMessage: response.info });
        }
      }
      else {
        //server error
      }
    }.bind(this));
  }

  deleteInterestFeature(feature) {
    jsonp(MARXAN_ENDPOINT_HTTPS + "deleteInterestFeature?interest_feature_name=" + feature.feature_class_name, { timeout: TIMEOUT }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        this.setState({ snackbarOpen: true, snackbarMessage: "Conservation feature deleted" });
        this.getInterestFeatures();
      }
      else {
        this.setState({ snackbarOpen: true, snackbarMessage: "Conservation feature not deleted" });
      }
    }.bind(this));
  }

  //used by the import wizard to import a users zipped shapefile as the planning units
  importZippedShapefileAsPu(zipname, alias, description) {
    //the zipped shapefile has been uploaded to the MARXAN folder - it will be imported to PostGIS and a record will be entered in the metadata_planning_units table
    jsonp(MARXAN_ENDPOINT_HTTPS + "importShapefile?filename=" + zipname + "&name=" + alias + "&description=" + description + "&dissolve=false&type=planning_unit", { timeout: TIMEOUT }).promise.then(function(response) {
      if (!this.checkForErrors(response)) {
        this.setState({ snackbarOpen: true, snackbarMessage: response.info });
        var zipName = response.file.slice(0, -4);
        this.uploadToMapBox(zipName, zipName);
      }
      else {
        //server error
      }
    }.bind(this));
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// MANAGING INTEREST FEATURES SECTION
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  //update feature value by finding the object and setting the value for the key - set override to true to overwrite an existing key value
  //this synchronises the states: allFeatures and projectFeatures as you cant detect state changes in object properties, i.e. componentDidUpdate is not called when you updated selected, preprocessed etc.
  updateFeature(feature, key, value, override) {
    // console.log("Update feature '" + feature.feature_class_name + "' with " + key + "=" + value);
    let featuresCopy = this.state.allFeatures;
    //get the position of the feature 
    var index = featuresCopy.findIndex(function(element) { return element.id === feature.id; });
    var updatedFeature = featuresCopy[index];
    //update the value if either the property doesn't exist (i.e. new value) or it does and override is set to true
    if (updatedFeature && !(updatedFeature.hasOwnProperty(key) && !override)) updatedFeature[key] = value;
    //update allFeatures and projectFeatures with the new value
    this.setState({ allFeatures: featuresCopy, projectFeatures: featuresCopy.filter(function(item) { return item.selected }) });
  }

  //selects a single Conservation feature
  selectItem(feature) {
    this.updateFeature(feature, "selected", true, true); //select the Conservation feature
    this.updateFeature(feature, "target_value", 17, false); //set a default target value if one is not already set
  }

  //unselects a single Conservation feature
  unselectItem(feature) {
    this.updateFeature(feature, "selected", false, true); //unselect the Conservation feature
    this.updateFeature(feature, "preprocessed", false, true); //change the preprocessing to false
    this.setAsUnprocessed(feature);
  }

  //selects all the Conservation features
  selectAll() {
    var features = this.state.allFeatures;
    features.map((feature) => {
      if (!feature.hasOwnProperty("target_value")) {
        //set the target value if it is not already set
        feature['target_value'] = 17;
      }
      //select the feature
      this.selectItem(feature);
    });
  }

  //clears all the Conservation features
  clearAll() {
    var features = this.state.allFeatures;
    features.map((feature) => {
      //unselect the item
      this.unselectItem(feature);
    });
  }

  //unprocessed features need to have their feature data reset
  setAsUnprocessed(feature){
    this.updateFeature(feature, "protected_area", -1, true); 
    this.updateFeature(feature, "pu_area", -1, true); 
    this.updateFeature(feature, "pu_count", -1, true); 
    this.updateFeature(feature, "target_area", -1, true); 
  }
  
  //sets the target value of an feature
  updateTargetValue(feature, newTargetValue) {
    this.updateFeature(feature, "target_value", newTargetValue, true);
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// END OF MANAGING INTEREST FEATURES SECTION
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  showRunSettingsDialog() {
    this.setState({ settingsDialogOpen: true });
  }
  closeRunSettingsDialog() {
    this.setState({ settingsDialogOpen: false });
  }

  openClassificationDialog() {
    this.setState({ classificationDialogOpen: true });
  }
  closeClassificationDialog() {
    this.setState({ classificationDialogOpen: false });
  }

  openImportWizard() {
    this.setState({ importDialogOpen: true });
  }
  closeImportWizard() {
    this.setState({ importDialogOpen: false });
  }

  uploadPlanningUnitFromShapefile() {

  }
  hideResults() {
    this.setState({ resultsPaneOpen: false });
  }
  showResults() {
    this.setState({ resultsPaneOpen: true });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// PROTECTED AREAS LAYERS STUFF
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  changeIucnCategory(iucnCategory) {
    //update the state
    let _metadata = this.state.metadata;
    _metadata.IUCN_CATEGORY = iucnCategory;
    this.setState({ metadata: _metadata });
    //update the input.dat file
    this.updateProjectParameter("IUCN_CATEGORY", iucnCategory);
    //filter the wdpa vector tiles
    this.filterWdpaByIucnCategory(iucnCategory);
    //render the wdpa intersections on the grid
    this.renderPAGridIntersections(iucnCategory);
  }

  filterWdpaByIucnCategory(iucnCategory) {
    let iucnCategories = this.getIndividualIucnCategories(iucnCategory);
    this.map.setFilter(WDPA_LAYER_NAME, ['all', ['in', 'IUCN_CAT'].concat(iucnCategories), ['==', 'PARENT_ISO', this.state.metadata.PLANNING_UNIT_NAME.substr(3, 3).toUpperCase()]]);
  }

  getIndividualIucnCategories(iucnCategory) {
    let retValue = [];
    switch (iucnCategory) {
      case 'None':
        retValue = [''];
        break;
      case 'IUCN I-II':
        retValue = ['Ia', 'Ib', 'II'];
        break;
      case 'IUCN I-IV':
        retValue = ['Ia', 'Ib', 'II', 'III', 'IV'];
        break;
      case 'IUCN I-V':
        retValue = ['Ia', 'Ib', 'II', 'III', 'IV', 'V'];
        break;
      case 'IUCN I-VI':
        retValue = ['Ia', 'Ib', 'II', 'III', 'IV', 'V', 'VI'];
        break;
      default:
    }
    return retValue;
  }

  //gets the puids for those protected areas that intersect the planning grid in the passed iucn category
  getPuidsFromIucnCategory(iucnCategory) {
    let intersections_by_category = this.getIntersections(iucnCategory);
    //get all the puids in this iucn category 
    let puids = this.getPuidsFromNormalisedData(intersections_by_category);
    return puids;
  }

  //called when the iucn category changes - gets the puids that need to be added/removed, adds/removes them and updates the PuEdit layer
  async renderPAGridIntersections(iucnCategory) {
    await this.preprocessProtectedAreas(iucnCategory).then(function(intersections) {
      //get all the puids of the intersecting protected areas in this iucn category 
      let puids = this.getPuidsFromIucnCategory(iucnCategory);
      //get all the puids of the intersecting protected areas in the previously selected iucn category 
      let previousPuids = this.getPuidsFromIucnCategory(this.previousIucnCategory);
      //set the previously selected iucn category
      this.previousIucnCategory = iucnCategory;
      //copy the current planning units state
      let statuses = this.state.planning_units;
      //get the new puids that need to be added
      let newPuids = this.getNewPuids(previousPuids, puids);
      if (newPuids.length === 0) {
        //get the puids that need to be removed
        let oldPuids = this.getNewPuids(puids, previousPuids);
        this.removePuidsFromArray(statuses, 2, oldPuids);
      }
      else {
        //add all the new protected area intersections into the planning units as status 2
        this.appPuidsToPlanningUnits(statuses, 2, newPuids);
      }
      //update the state
      this.setState({ planning_units: statuses });
      //re-render the layer
      this.renderPuEditLayer();
      //update the pu.dat file
      this.updatePuDatFile();
    }.bind(this));
  }

  getNewPuids(previousPuids, puids) {
    return puids.diff(previousPuids);
  }

  preprocessProtectedAreas(iucnCategory) {
    //have the intersections already been calculated
    if (this.protected_area_intersections.length>0) {
      return Promise.resolve(this.protected_area_intersections);
    }
    else {
      //do the intersection on the server
      return new Promise(function(resolve, reject) {
        //start the logging
        this.startLogging();
        //set state to prevent users changing the IUCN category drop down while processing is happening        
        this.setState({preprocessingProtectedAreas: true });
        ws = new WebSocket(MARXAN_ENDPOINT_WSS + "preprocessProtectedAreas?user=" + this.state.user + "&project=" + this.state.project + "&planning_grid_name=" + this.state.metadata.PLANNING_UNIT_NAME);
        ws.onmessage = function (evt) {
          let response = JSON.parse(evt.data);
          switch (response.status) {
            case 'Started': 
              this.setState({streamingLog: this.state.streamingLog + response.info + "\n"});
              break;
            case 'Running':
              this.setState({streamingLog: this.state.streamingLog + response.info + " (elapsed time: " + response.elapsedtime + ")\n"});
              break;
            case 'Finishing': 
              this.setState({streamingLog: this.state.streamingLog + response.info + " (Total time: " + response.elapsedtime + ")\n"});
              break;
            case 'Finished': 
              //set the local variable
              this.protected_area_intersections = response.info;
              //return the state to normal
              this.setState({preprocessingProtectedAreas: false });
              //return a value to the then() call
              resolve(response.info);
              break;
          }
        }.bind(this); //onmessage
      }.bind(this)); //return
    }
  }

  getIntersections(iucnCategory) {
    //get the individual iucn categories
    let iucn_categories = this.getIndividualIucnCategories(iucnCategory);
    //get the planning units that intersect the protected areas with the passed iucn category
    return this.protected_area_intersections.filter((item) => { return (iucn_categories.indexOf(item[0]) > -1); });
  }

  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// BOUNDARY LENGTH MODIFIER AND CLUMPING
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  async preprocessBoundaryLengths(iucnCategory) {
    if (this.state.files.BOUNDNAME){ //if the bounds.dat file already exists
      return Promise.resolve();
    }else{
      //calculate the boundary lengths on the server
      return new Promise(function(resolve, reject) {
        //start the logging
        this.startLogging();
        ws = new WebSocket(MARXAN_ENDPOINT_WSS + "preprocessPlanningUnits?user=" + this.state.user + "&project=" + this.state.project);
        ws.onmessage = function (evt) {
          let response = JSON.parse(evt.data);
          switch (response.status) {
            case 'Started': 
              this.setState({streamingLog: this.state.streamingLog + response.info + "\n"});
              break;
            case 'Running':
              this.setState({streamingLog: this.state.streamingLog + response.info + " (elapsed time: " + response.elapsedtime + ")\n"});
              break;
            case 'Finishing': 
              this.setState({streamingLog: this.state.streamingLog + response.info + " (Total time: " + response.elapsedtime + ")\n"});
              break;
            case 'Finished': 
              //update the state
              var currentFiles = this.state.files;
              currentFiles.BOUNDNAME = "bounds.dat";
              this.setState({files: currentFiles});
              //return a value to the then() call
              resolve(response.info);
              break;
          }
        }.bind(this); //onmessage
      }.bind(this)); //return
    }
  }

  showClumpingDialog(){
    //when the boundary lengths have been calculated
    this.preprocessBoundaryLengths().then(function(intersections) {
      //update the spec.dat file with any that have been added or removed or changed target or spf
      this.updateSpecFile().then(function(value) {
        //when the species file has been updated, update the planning unit file 
        this.updatePuFile();
        //when the planning unit file has been updated, update the PuVSpr file - this does all the preprocessing
        this.updatePuvsprFile().then(function(value) {
          //show the clumping dialog
          this.setState({ clumpingDialogOpen: true, clumpingRunning: true });
          //create the project group and run
          this.createProjectGroupAndRun();
        }.bind(this));
      }.bind(this));
    }.bind(this));
  }

  hideClumpingDialog(){
    //delete the project group
    this.deleteProjects();
    //reset the paint properties in the clumping dialog
    this.resetPaintProperties();
    //return state to normal
    this.setState({ clumpingDialogOpen: false });
  }

  //creates a group of 5 projects with UUIDs in the _clumping folder
  createProjectGroupAndRun(){
    //clear any exists projects
    if (this.projects) this.deleteProjects();
    return new Promise(function(resolve, reject) {
      jsonp(MARXAN_ENDPOINT_HTTPS + "createProjectGroup?user=" + this.state.user + "&project=" + this.state.project + "&copies=5&blmValues=" + this.state.blmValues.join(","), { timeout: TIMEOUT }).promise.then(function(response) {
        if (!this.checkForErrors(response)) {
          //set the local variable for the projects
          this.projects = response.data;
          //run the projects
          this.runProjects(response.data);
        }
        else {
          //ui feedback
        }
      }.bind(this));
    }.bind(this));
  }
  
  //deletes the projects from the _clumping folder
  deleteProjects(){
    var projectNames = this.projects.map(function(item){
      return item.projectName;
    });
    //clear the local variable
    this.projects = undefined;
    return new Promise(function(resolve, reject) {
       jsonp(MARXAN_ENDPOINT_HTTPS + "deleteProjects?projectNames=" + projectNames.join(","), { timeout: TIMEOUT }).promise.then(function(response) {
        if (!this.checkForErrors(response)) {
          resolve();
        }
        else {
          //ui feedback
        }
      }.bind(this));
    }.bind(this));
  }
  
  runProjects(projects){
    //reset the counter
    this.projectsRun = 0;
    //set the intitial state
    this.setState({clumpingRunning: true});
    //run the projects
    projects.map(function(project){
      this.startMarxanJob("_clumping", project.projectName, false).then(function(response){
        //run completed - get a single solution
        this.loadOtherSolution(response.user, response.project, 1);
        //increment the project counter
        this.projectsRun = this.projectsRun + 1;
        //set the state
        if (this.projectsRun ===5) this.setState({clumpingRunning: false});
      }.bind(this));
    }.bind(this));
  }
  
  rerunProjects(){
    //reset the paint properties in the clumping dialog
    this.resetPaintProperties();
    //if the blmValues have changed then recreate the project group and run
    if (this.blmChanged){
      this.createProjectGroupAndRun();
    }else{
      //rerun the projects
      this.runProjects(this.projects);
    }
    //reset the flag
    this.blmChanged = false;
  }
  
  resetPaintProperties(){
    //reset the paint properties
    this.setState({map0_paintProperty:[],map1_paintProperty:[],map2_paintProperty:[],map3_paintProperty:[],map4_paintProperty:[]});
  }

  changBlmMin(event, newValue){
    //get the new blmValues
    this.getBlmValues(newValue, this.state.blmMax);
    //set the new blmMin
    this.setState({blmMin:newValue});
  }
  
  changBlmMax(event, newValue){
    //get the new blmValues
    this.getBlmValues(this.state.blmMin, newValue);
    //set the new blmMax
    this.setState({blmMax:newValue});
  }

  getBlmValues(min, max){
    var blmValues = [];
    //get the increment
    var increment = (max - min) / (CLUMP_COUNT - 1);
    //make the array of blmValues
    for (var i = 0; i < CLUMP_COUNT; i++){
        blmValues[i] = (i * increment) + Number(min);
    }    
    this.setState({blmValues: blmValues});
    //flag that the blmValues have changed
    this.blmChanged = true;
  }
  
  setBlmValue(blmValue){
    var newRunParams = [], value;
    //iterate through the run parameters and update the value for the blm
    this.state.runParams.map(function(item){
      value = (item.key === 'BLM') ? String(blmValue) : item.value;
      newRunParams.push({key: item.key, value: value});
    });
    //update this run parameters
    this.updateRunParams(newRunParams);
  }
  
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////
  ////////////////////////// MANAGING SERVERS
  ////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////////

  setActiveServer(value){
    this.setState({activeServer: value});
  }

  render() {
    return (
      <MuiThemeProvider>
        <React.Fragment>
          <div ref={el => this.mapContainer = el} className="absolute top right left bottom" />
          <InfoPanel
            user={this.state.user}
            userData={this.state.userData}
            loggedIn={this.state.loggedIn}
            activeTab={this.state.activeTab}
            getProjects={this.getProjects.bind(this)}
            projects={this.state.projects}
            project={this.state.project}
            metadata={this.state.metadata}
            logout={this.logout.bind(this)}
            runMarxan={this.runMarxan.bind(this)} 
            stopMarxan={this.stopMarxan.bind(this)}
            pid={this.state.pid}
            running={this.state.running} 
            runnable={this.state.runnable}
            deleteProject={this.deleteProject.bind(this)}
            loadProject={this.loadProject.bind(this)}
            cloneProject={this.cloneProject.bind(this)}
            renameProject={this.renameProject.bind(this)}
            renameDescription={this.renameDescription.bind(this)}
            startEditingProjectName={this.startEditingProjectName.bind(this)}
            startEditingDescription={this.startEditingDescription.bind(this)}
            editingProjectName={this.state.editingProjectName}
            editingDescription={this.state.editingDescription}
            loadingProjects={this.state.loadingProjects}
            loadingProject={this.state.loadingProject}
            saveOptions={this.saveOptions.bind(this)}
            savingOptions={this.state.savingOptions}
            optionsDialogOpen={this.state.optionsDialogOpen}
            openOptionsDialog={this.openOptionsDialog.bind(this)}
            closeOptionsDialog={this.closeOptionsDialog.bind(this)}
            hidePopup={this.hidePopup.bind(this)}
            updateUser={this.updateUser.bind(this)}
            openNewProjectDialog={this.openNewProjectDialog.bind(this)}
            features={this.state.projectFeatures}
            updateTargetValue={this.updateTargetValue.bind(this)}
            project_tab_active={this.project_tab_active.bind(this)}
            features_tab_active={this.features_tab_active.bind(this)}
            pu_tab_active={this.pu_tab_active.bind(this)}
            startPuEditSession={this.startPuEditSession.bind(this)}
            stopPuEditSession={this.stopPuEditSession.bind(this)}
            showRunSettingsDialog={this.showRunSettingsDialog.bind(this)}
            openImportWizard={this.openImportWizard.bind(this)}
            preprocessFeature={this.preprocessSingleFeature.bind(this)}
            preprocessingFeature={this.state.preprocessingFeature}
            preprocessingProtectedAreas={this.state.preprocessingProtectedAreas}
            openAllInterestFeaturesDialog={this.openAllInterestFeaturesDialog.bind(this)}
            changeIucnCategory={this.changeIucnCategory.bind(this)}
          />
          <Popup
            active_pu={this.state.active_pu} 
            xy={this.state.popup_point}
          />
          <Login open={!this.state.loggedIn} 
            changeUserName={this.changeUserName.bind(this)} 
            changePassword={this.changePassword.bind(this)} 
            user={this.state.user} 
            password={this.state.password} 
            validateUser={this.validateUser.bind(this)} 
            loggingIn={this.state.loggingIn} 
            createNewUser={this.createNewUser.bind(this)}
            creatingNewUser={this.state.creatingNewUser}
            resendPassword={this.resendPassword.bind(this)}
            resending={this.state.resending}
            availableServers={MARXAN_REMOTE_SERVERS}
            activeServer={this.state.activeServer}
            setActiveServer={this.setActiveServer.bind(this)}
          />
          <Snackbar
            open={this.state.snackbarOpen}
            message={this.state.snackbarMessage}
            onRequestClose={this.closeSnackbar.bind(this)}
          />
          <NewProjectDialog
            open={this.state.newProjectDialogOpen}
            closeNewProjectDialog={this.closeNewProjectDialog.bind(this)}
            getPlanningUnitGrids={this.getPlanningUnitGrids.bind(this)}
            planning_unit_grids={this.state.planning_unit_grids}
            planning_units={this.state.planning_units}
            openNewPlanningUnitDialog={this.openNewPlanningUnitDialog.bind(this)}
            openAllInterestFeaturesDialog={this.openAllInterestFeaturesDialog.bind(this)}
            features={this.state.allFeatures} 
            updateTargetValue={this.updateTargetValue.bind(this)}
            openAllCostsDialog={this.openAllCostsDialog.bind(this)}
            selectedCosts={this.state.selectedCosts}
            createNewProject={this.createNewProject.bind(this)}
          />
          <NewPlanningUnitDialog 
            open={this.state.NewPlanningUnitDialogOpen} 
            closeNewPlanningUnitDialog={this.closeNewPlanningUnitDialog.bind(this)} 
            createNewPlanningUnitGrid={this.createNewPlanningUnitGrid.bind(this)}
            creatingNewPlanningUnit={this.state.creatingNewPlanningUnit}
            getCountries={this.getCountries.bind(this)}
            countries={this.state.countries}
            changeIso3={this.changeIso3.bind(this)}
            changeDomain={this.changeDomain.bind(this)}
            changeAreaKm2={this.changeAreaKm2.bind(this)}
            iso3={this.state.iso3}
            domain={this.state.domain}
            areakm2={this.state.areakm2}
          />
          <AllInterestFeaturesDialog
            open={this.state.AllInterestFeaturesDialogOpen}
            allFeatures={this.state.allFeatures}
            projectFeatures={this.state.projectFeatures}
            deleteInterestFeature={this.deleteInterestFeature.bind(this)}
            closeAllInterestFeaturesDialog={this.closeAllInterestFeaturesDialog.bind(this)}
            openNewInterestFeatureDialog={this.openNewInterestFeatureDialog.bind(this)}
            selectItem={this.selectItem.bind(this)}
            unselectItem={this.unselectItem.bind(this)}
            selectAll={this.selectAll.bind(this)}
            clearAll={this.clearAll.bind(this)}
            manageOwnState={false}
          />
          <AllCostsDialog
            open={this.state.AllCostsDialogOpen}
            costs={this.state.costs}
            closeAllCostsDialog={this.closeAllCostsDialog.bind(this)}
          />
          <NewInterestFeatureDialog
            open={this.state.NewInterestFeatureDialogOpen} 
            closeNewInterestFeatureDialog={this.closeNewInterestFeatureDialog.bind(this)}
            setName={this.setNewFeatureDatasetName.bind(this)}
            setDescription={this.setNewFeatureDatasetDescription.bind(this)}
            setFilename={this.setNewFeatureDatasetFilename.bind(this)}
            name={this.state.featureDatasetName}
            description={this.state.featureDatasetDescription}
            filename={this.state.featureDatasetFilename}
            createNewInterestFeature={this.createNewInterestFeature.bind(this)}
            resetNewConservationFeature={this.resetNewConservationFeature.bind(this)}
            MARXAN_ENDPOINT_HTTPS={MARXAN_ENDPOINT_HTTPS}
          />
          <RunSettingsDialog
            open={this.state.settingsDialogOpen}
            closeRunSettingsDialog={this.closeRunSettingsDialog.bind(this)}
            openFilesDialog={this.openFilesDialog.bind(this)}
            updateRunParams={this.updateRunParams.bind(this)}
            updatingRunParameters={this.state.updatingRunParameters}
            runParams={this.state.runParams}
            showClumpingDialog={this.showClumpingDialog.bind(this)}
            clumpingRunning={this.state.clumpingRunning}
          />
          <ClumpingDialog
            open={this.state.clumpingDialogOpen}
            closeClumpingDialog={this.hideClumpingDialog.bind(this)}
            tileset={this.state.tileset}
            RESULTS_LAYER_NAME={RESULTS_LAYER_NAME}
            map0_paintProperty={this.state.map0_paintProperty}
            map1_paintProperty={this.state.map1_paintProperty}
            map2_paintProperty={this.state.map2_paintProperty}
            map3_paintProperty={this.state.map3_paintProperty}
            map4_paintProperty={this.state.map4_paintProperty}
            blmValues={this.state.blmValues}
            mapCentre={this.state.mapCentre}
            mapZoom={this.state.mapZoom}
            rerunProjects={this.rerunProjects.bind(this)}
            changBlmMin={this.changBlmMin.bind(this)}
            changBlmMax={this.changBlmMax.bind(this)}
            blmMin={this.state.blmMin}
            blmMax={this.state.blmMax}
            setBlmValue={this.setBlmValue.bind(this)}
            clumpingRunning={this.state.clumpingRunning}
          />
          <FilesDialog
            open={this.state.filesDialogOpen}
            closeFilesDialog={this.closeFilesDialog.bind(this)}
            fileUploaded={this.fileUploaded.bind(this)}
            user={this.state.user}
            project={this.state.project}
            files={this.state.files}
          />
          <ResultsPane
            running={this.state.running} 
            dataAvailable={this.state.dataAvailable} 
            solutions={this.state.solutions}
            loadSolution={this.loadSolution.bind(this)} 
            openClassificationDialog={this.openClassificationDialog.bind(this)}
            outputsTabString={this.state.outputsTabString} 
            hideResults={this.hideResults.bind(this)}
            open={this.state.resultsPaneOpen && this.state.loggedIn}
            brew={this.state.brew}
            log={this.state.streamingLog} 
            activeResultsTab={this.state.activeResultsTab}
            legend_tab_active={this.legend_tab_active.bind(this)}
            solutions_tab_active={this.solutions_tab_active.bind(this)}
            log_tab_active={this.log_tab_active.bind(this)}
            streamingLog={this.state.streamingLog}
          />
          <ClassificationDialog 
            open={this.state.classificationDialogOpen}
            renderer={this.state.renderer}
            closeClassificationDialog={this.closeClassificationDialog.bind(this)}
            changeColorCode={this.changeColorCode.bind(this)}
            changeRenderer={this.changeRenderer.bind(this)}
            changeNumClasses={this.changeNumClasses.bind(this)}
            changeShowTopClasses={this.changeShowTopClasses.bind(this)}
            summaryStats={this.state.summaryStats}
            brew={this.state.brew}
            dataBreaks={this.state.dataBreaks}
          />
          <ImportWizard 
            open={this.state.importDialogOpen}
            user={this.state.user}
            setFilename={this.uploadPlanningUnitFromShapefile.bind(this)}
            closeImportWizard={this.closeImportWizard.bind(this)}
            MARXAN_ENDPOINT_HTTPS={MARXAN_ENDPOINT_HTTPS}
            uploadShapefile={this.importZippedShapefileAsPu.bind(this)}
          />
          <div style={{position: 'absolute', display: this.state.resultsPaneOpen ? 'none' : 'block', backgroundColor: 'rgb(0, 188, 212)', right: '0px', top: '20px', width: '20px', borderRadius: '2px', height: '88px',boxShadow:'rgba(0, 0, 0, 0.16) 0px 3px 10px, rgba(0, 0, 0, 0.23) 0px 3px 10px'}} title={"Show results"}>
            <FlatButton
              onClick={this.showResults.bind(this)}
              primary={true}
              style={{minWidth:'24px',marginTop:'6px'}}
              title={"Show results"}
              icon={<ArrowBack color={white}/>}
            />
          </div>
        </React.Fragment>
      </MuiThemeProvider>
    );
  }
}

export default App;
