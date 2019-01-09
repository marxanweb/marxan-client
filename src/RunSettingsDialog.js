import React from 'react';
import 'react-table/react-table.css';
import Dialog from 'material-ui/Dialog';
import RaisedButton from 'material-ui/RaisedButton';
import ReactTable from "react-table";
import FontAwesome from 'react-fontawesome';

class RunSettingsDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { data: [], updateEnabled: false };
        this.renderEditable = this.renderEditable.bind(this);
    }
    componentDidUpdate(prevProps) {
        if (prevProps.runParams !== this.props.runParams) {
            this.setState({ data: this.props.runParams });
        }
    }
    openParametersDialog(){
        this.props.openParametersDialog();
    }
    //posts the results back to the server
    updateRunParams() {
        //ui feedback 
        this.setState({ updateEnabled: false });
        this.props.updateRunParams(this.state.data);
        this.props.closeRunSettingsDialog();
    }
    setUpdateEnabled() {
        this.setState({ updateEnabled: true });
    }
    renderEditable(cellInfo) {
        return (
            <React.Fragment>
                <div
                    style={{ backgroundColor: "#fafafa", float: ([...this.state.data][cellInfo.index]['key'] === 'BLM') ? 'left' : 'none'}}
                    contentEditable
                    suppressContentEditableWarning
                    onFocus={this.setUpdateEnabled.bind(this)}
                    onBlur={e => {
                      const data = [...this.state.data];
                      data[cellInfo.index][cellInfo.column.id] = e.target.innerHTML;
                      this.setState({ data });
                    }}
                  >{this.state.data[cellInfo.index]["value"]}</div>
                  <FontAwesome name='external-link-alt' onClick={this.props.showClumpingDialog} title='Click to open the BLM comparison dialog' style={{display: ([...this.state.data][cellInfo.index]['key'] === 'BLM') ? 'block' : 'none', 'cursor':'pointer', 'paddingTop':'6px', 'paddingLeft':'30px'}}/>
            </React.Fragment>
        );
    }
    render() {
        return (
            <Dialog 
                overlayStyle={{display:'none'}} 
                className={'dialogGeneric'}
                style={{marginLeft: '80px', marginTop:'155px', width: '500px !important'}}
                title="Run settings" 
                children={
                    <div style={{height:'275px'}}>
                        <ReactTable 
                            showPagination={false} 
                            className={'summary_infoTable'}
                            minRows={0}
                            pageSize={200}
                            data={this.state.data}
                            noDataText=''
                            columns={[{
                               Header: 'Parameter', 
                               accessor: 'key',
                               width:165,
                               headerStyle:{'textAlign':'left'},
                            },{
                               Header: 'Value',
                               accessor: 'value',
                               width:193,
                               headerStyle:{'textAlign':'left'},
                               Cell: this.renderEditable
                            }]}
                          />
                        <div id="spinner"><FontAwesome spin name='sync' style={{'display': (this.props.updatingRunParameters ? 'inline-block' : 'none')}} className={'runParametersSpinner'}/></div>
                    </div>
                } 
                actions={
                    [
                        // <RaisedButton 
                        //     label="Files" 
                        //     primary={true} 
                        //     onClick={this.props.openFilesDialog} 
                        //     className="projectsBtn" 
                        //     style={{height:'25px'}}
                        // />,
                        <RaisedButton 
                            label="OK" 
                            primary={true} 
                            onClick={this.updateRunParams.bind(this)} 
                            className="projectsBtn" 
                            style={{height:'25px'}}
                        />,
                    ]       
                } 
                open={this.props.open} 
                onRequestClose={this.props.closeSettingsDialog} 
                contentStyle={{width:'400px'}}
                titleClassName={'dialogTitleStyle'}
            />
        );
    }
}

export default RunSettingsDialog;
