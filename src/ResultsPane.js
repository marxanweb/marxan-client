import React from 'react';
import ToolbarButton from './ToolbarButton';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faEraser } from '@fortawesome/free-solid-svg-icons';
import ReactTable from "react-table";
import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';
import Legend from './Legend'; 
import Settings from 'material-ui/svg-icons/action/settings';
import Clipboard from 'material-ui/svg-icons/action/assignment';

class ResultsPane extends React.Component {
  constructor(props) {
    super(props);
    this.state = { showClipboard: false, selectedSolution: undefined };
  }
  componentDidUpdate(prevProps, prevState) {
    //if the streaming log has changed then scroll to the bottom of the div
    if (this.props.log !== prevProps.log) {
      var objDiv = document.getElementById("log");
      if (objDiv) {
        objDiv.scrollTop = objDiv.scrollHeight;
      }
      this.resetSolution();//unselect a solution
    }
  }
  loadSolution(solution) { //loads the solution using the projects owner
    this.props.loadSolution(solution, this.props.owner);
  }

  mouseEnter(event) {
    this.setState({ showClipboard: true });
  }

  mouseLeave(event) {
    this.setState({ showClipboard: false });
  }

  selectText(node) {
    node = document.getElementById(node);
    if (document.body.createTextRange) {
      const range = document.body.createTextRange();
      range.moveToElementText(node);
      range.select();
    }
    else if (window.getSelection) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);
    }
    else {
      console.warn("Could not select text in node: Unsupported browser.");
    }
  }

  copyLog(evt) {
    this.selectText("log");
    evt.target.focus();
    document.execCommand('copy');
  }

  //resets the currently selected solution
  resetSolution(){
    if (this.state.selectedSolution) this.changeSolution(undefined, undefined); 
  }
  
  //fired in the onClick event handler of the react table
  changeSolution(event, solution) {
    this.setState({ selectedSolution: solution });
    if (solution) this.loadSolution(solution.Run_Number);
  }
  
  render() {
    return (
      <React.Fragment>
        <div style={{width:'300px',height:'400px', position:'absolute',right:'140px','display': (this.props.open ? 'block' : 'none')}}>
          <Paper zDepth={2} className='ResultsPanePaper'>
            <div className="resultsTitle">Results</div>
            <Tabs contentContainerStyle={{'margin':'20px'}} className={'resultsTabs'} value={this.props.activeResultsTab} id='resultsTabs'>
              <Tab label="Legend" value="legend" onActive={this.props.legend_tab_active} >
                <div>
                  <Legend
                    brew={this.props.brew}
                    resultsLayer={ this.props.resultsLayer }
                    wdpaLayer={ this.props.wdpaLayer }
                    pa_layer_visible={this.props.pa_layer_visible}
                    changeOpacity={this.props.changeOpacity}
                    results_layer_opacity={this.props.results_layer_opacity}
                    wdpa_layer_opacity={this.props.wdpa_layer_opacity}
                  />
                  <ToolbarButton 
                    icon={<Settings style={{height:'20px',width:'20px'}}/>} 
                    title="Legend Settings"
                    onClick={this.props.openClassificationDialog} 
                    style={{ top:'440px', position:'absolute', marginLeft:'-7px'}}
                  />
                </div>
              </Tab>
              <Tab label="Solutions" value="solutions" onActive={this.props.solutions_tab_active} >
                <div id="solutionsPanel" style={{'display': (!this.props.running ? 'block' : 'none')}}>
                  <ReactTable
                    thisRef={this}
                    getTrProps={(state, rowInfo, column, instance) => {
                        return { 
                          onClick: (e) => {
                              state.thisRef.changeSolution(e, rowInfo.original);
                          },
                          style: { 
                              background: (rowInfo.original.Run_Number === (state.thisRef.state.selectedSolution&&state.thisRef.state.selectedSolution.Run_Number)) ? "aliceblue" : ""
                          },
                          title: 'Click to show on the map'
                        };
                      }}
                    className={'solutions_infoTable -highlight'}
                    showPagination={false}
                    minRows={0}
                    pageSize={200}
                    noDataText=''
                    data={this.props.solutions}
                    columns={[{
                       Header: 'Run', 
                       accessor: 'Run_Number',
                       width:40,
                       headerStyle:{'textAlign':'left'}                             
                    },{
                       Header: 'Score',
                       accessor: 'Score',
                       width:80,
                       headerStyle:{'textAlign':'left'}
                    },{
                       Header: 'Cost',
                       accessor: 'Cost' ,
                       width:80,
                       headerStyle:{'textAlign':'left'}
                    },{
                       Header: 'Planning Units',
                       accessor: 'Planning_Units' ,
                       width:50,
                       headerStyle:{'textAlign':'left'}
                    },{
                       Header: 'Missing Values',
                       accessor: 'Missing_Values' ,
                       width:105,
                       headerStyle:{'textAlign':'left'}
                    }]}
                  />
                </div>
              </Tab>
              <Tab label="Log" value="log" onActive={this.props.log_tab_active} >
                <div id="log" onMouseEnter={this.mouseEnter.bind(this)} onMouseLeave={this.mouseLeave.bind(this)}>{this.props.log}
                  <ToolbarButton  
                    icon={<Clipboard style={{height:'20px',width:'20px'}}/>} 
                    title="Copy to clipboard"
                    onClick={this.copyLog.bind(this)} 
                    show={this.state.showClipboard}
                    style={{position:'absolute',top:'421px',right:'70px'}}
                  />
                  <ToolbarButton  
                    icon={<FontAwesomeIcon icon={faEraser} />} 
                    title="Clear log"
                    onClick={this.props.clearLog.bind(this)} 
                    show={this.state.showClipboard}
                    style={{position:'absolute',top:'421px',right:'30px'}}
                  />
                </div>
              </Tab>
            </Tabs>     
          </Paper>
        </div>
      </React.Fragment>
    );
  }
}

export default ResultsPane;