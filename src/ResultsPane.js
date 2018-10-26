import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import ReactTable from "react-table";
import Paper from 'material-ui/Paper';
import { Tabs, Tab } from 'material-ui/Tabs';
import Legend from './Legend';
import FontAwesome from 'react-fontawesome';
import FlatButton from 'material-ui/FlatButton';
import Settings from 'material-ui/svg-icons/action/settings';

class ResultsPane extends React.Component {
  loadSolution(solution) {
    this.props.loadSolution(solution);
  }
  hideResults(){
    this.props.hideResults();
  }
  render() {
    return (
      <React.Fragment>
        <div style={{width:'300px',height:'400px', position:'absolute',right:'140px','display': (this.props.open ? 'block' : 'none')}}>
          <Paper zDepth={2} className='ResultsPanePaper'>
            <div className="resultsTitle">Results</div>
              <FlatButton
                onClick={this.hideResults.bind(this)}
                primary={true}
                style={{position: 'absolute',display:'block',top:'27px',left:'385px', minWidth:'0px'}}
                title={"Hide results"}
                icon={<FontAwesome name='arrow-right' style={{top:'8px','color':'white'}}/>}
              />
            <Tabs contentContainerStyle={{'margin':'20px'}} className={'resultsTabs'}>
              <Tab label="Legend">
                <div>
                <Legend
                  brew={this.props.brew}
                />
                </div>
                <RaisedButton 
                  icon={<Settings style={{height:'20px',width:'20px'}}/>} 
                  title="Legend Settings"
                  onClick={this.props.openClassificationDialog} 
                  style={{ top:'277px', marginRight:'4px',padding: '0px',minWidth: '30px',width: '24px',height: '24px',position:'absolute'}}
                  overlayStyle={{lineHeight:'24px',height:'24px'}}
                  buttonStyle={{marginTop:'-7px',lineHeight:'24px',height:'24px'}} 
                />
              </Tab>
              <Tab label="Solutions">
                <div id="solutionsPanel" style={{'display': (this.props.dataAvailable && !this.props.running ? 'block' : 'none')}}>
                  <ReactTable
                    infoPanel={this}
                    getTrProps={(state, rowInfo, column, instance) => {
                        return {
                          onClick: (e, handleOriginal) => {
                            if (instance.lastSelectedRow) instance.lastSelectedRow.style['background-color'] = '';
                            instance.lastSelectedRow = e.currentTarget;
                            e.currentTarget.style['background-color'] = 'lightgray';
                            instance.props.infoPanel.loadSolution(rowInfo.original.Run_Number);
                          },
                          title: 'Click to show on the map'
                        };
                      }}
                    className={'summary_infoTable -highlight'}
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
              <Tab label="Log">
                <div id="log" dangerouslySetInnerHTML={{__html:this.props.log}}></div>
              </Tab>
            </Tabs>     
          </Paper>
        </div>
      </React.Fragment>
    );
  }
}

export default ResultsPane;
