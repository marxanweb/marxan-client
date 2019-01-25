import React from 'react'; 
import {FontAwesomeIcon} from '@fortawesome/react-fontawesome';
import {faPlusCircle} from '@fortawesome/free-solid-svg-icons';
import {faCircle} from '@fortawesome/free-regular-svg-icons';
import {faCheckCircle} from '@fortawesome/free-regular-svg-icons';
import Delete from 'material-ui/svg-icons/action/delete';
import ToolbarButton from './ToolbarButton';
import MarxanDialog from './MarxanDialog';
import ReactTable from "react-table";

class FeaturesDialog extends React.Component { 

    constructor(props){ 
        super(props);
        this.state = {selectedFeature: undefined};
    }
    _delete() {
      this.props.deleteFeature(this.state.selectedFeature);
      this.setState({selectedFeature: undefined});
    }
    _new() {
        //show the new feature dialog
        this.props.openNewFeatureDialog();
        //close the dialog
        this.props.onCancel();
    }
    clickFeature(event, feature) {
        if (this.props.addingRemovingFeatures){
            this.props.clickFeature(feature);
        }else{
          this.setState({selectedFeature: feature});
        }
    }
    onOk(evt){
        if (this.props.addingRemovingFeatures){
            this.props.onOk();
        }else{
          this.unselectFeature();
          this.props.onCancel();
        }
    }
    unselectFeature(evt){
      this.setState({selectedFeature: undefined});
      this.props.onCancel();
    }
    render() {
        if (this.props.allFeatures){
            return (
                <MarxanDialog 
                    {...this.props} 
                    showSpinner={this.props.loadingFeatures}
                    autoDetectWindowHeight={false}
                    bodyStyle={{ padding:'0px 24px 0px 24px'}}
                    title="Features"  
                    showCancelButton={true}
                    onOk={this.onOk.bind(this)}
                    onCancel={this.unselectFeature.bind(this)}
                    children={
                        <React.Fragment>
                            <div style={{marginBottom:'5px'}}>There are a total of {this.props.allFeatures.length} features:</div>
                                <div id="projectsTable">
                                    <ReactTable 
                                        pageSize={15}
                                        className={'projectsReactTable'}
                                        showPagination={false} 
                                        minRows={0}
                                        data={this.props.allFeatures}
                                        thisRef={this}
                                        columns={[
                                            {Header:'Name',accessor:'alias',width:170,headerStyle:{'textAlign':'left'}},
                                            {Header:'Description',accessor:'description',width:330,headerStyle:{'textAlign':'left'}},
                                            {Header:'Date',accessor:'creation_date',width:150,headerStyle:{'textAlign':'left'}}
                                        ]}
                                        getTrProps={(state, rowInfo, column) => {
                                            return {
                                                style: {
                                                    background: ((state.thisRef.props.selectedFeatureIds.includes(rowInfo.original.id))||(state.thisRef.state.selectedFeature&&state.thisRef.state.selectedFeature.id === rowInfo.original.id)) ? "aliceblue" : ""
                                                },
                                                onClick: (e) => {
                                                    state.thisRef.clickFeature(e, rowInfo.original);
                                                }
                                            };
                                        }}
                                    />
                              </div>
                              <div id="projectsToolbar">
                                <div style={{display: (this.props.metadata.OLDVERSION) ? "block" : "none"}} className={'tabTitle'}>This is an imported project. Only features from this project are shown.</div>
                                <ToolbarButton 
                                    show={(this.props.userRole !== "ReadOnly")&&(!this.props.metadata.OLDVERSION)&&(!this.props.addingRemovingFeatures)}
                                    icon={<FontAwesomeIcon icon={faPlusCircle} />} 
                                    title="New feature"
                                    onClick={this._new.bind(this)} 
                                    label={"New"}
                                />
                                <ToolbarButton  
                                    show={(this.props.userRole === "Admin")&&(!this.props.metadata.OLDVERSION)&&(!this.props.addingRemovingFeatures)}
                                    icon={<Delete color="red" style={{height:'20px',width:'20px'}}/>} 
                                    title="Delete feature" 
                                    disabled={this.state.selectedFeature === undefined}
                                    onClick={this._delete.bind(this)} 
                                    label={"Delete"}
                                />
                                <ToolbarButton 
                                    show={this.props.addingRemovingFeatures}
                                    icon={<FontAwesomeIcon icon={faCircle} />} 
                                    title="Clear all features"
                                    onClick={this.props.clearAllFeatures} 
                                    label={"Clear all"}
                                />
                                <ToolbarButton 
                                    show={this.props.addingRemovingFeatures}
                                    icon={<FontAwesomeIcon icon={faCheckCircle} />} 
                                    title="Select all features"
                                    onClick={this.props.selectAllFeatures} 
                                    label={"Select all"}
                                />
                              </div>
                        </React.Fragment>
                    } 
                />
            );
        }else{
            return null;
        }
    }
}

export default FeaturesDialog;
