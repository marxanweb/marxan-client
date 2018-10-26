import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import ReactTable from "react-table";

class Info extends React.Component {
  renderCell(props){
    let html;
    switch (props.row.key) {
      case 'Total area':
      case 'Area protected':
      case 'Planning unit area':
      case 'Target area':
        html = <div>{Math.round(props.row.value/1000000)} Km<span style={{verticalAlign: 'super', fontSize: 'smaller'}}>2</span></div>;
        break;
      case 'Preprocessed':
        html = (props.row.value) ? <div>Yes</div> : <div>No</div>;
        break;
      default:
        html = <div title={props.row.value}>{props.row.value}</div>;
    }
    return html;
  }
    render(){
        let data = ['id','alias','area','creation_date','description','feature_class_name','preprocessed','protected_area','pu_area','pu_count','spf','target_area','target_value'].map((item)=>{
          let key = "";
              switch (item) {
                case 'id':
                  key = "ID";
                  break;
                case 'alias':
                  key = "Alias";
                  break;
                case 'area':
                  key = "Total area";
                  break;
                case 'creation_date':
                  key = "Creation date";
                  break;
                case 'description':
                  key = "Description";
                  break;
                case 'feature_class_name':
                  key = "Feature class name";
                  break;
                case 'preprocessed':
                  key = "Preprocessed";
                  break;
                case 'protected_area':
                  key = "Area protected";
                  break;
                case 'pu_area':
                  key = "Planning unit area";
                  break;
                case 'pu_count':
                  key = "Planning unit count";
                  break;
                case 'spf':
                  key = "SPF";
                  break;
                case 'target_area':
                  key = "Target area";
                  break;
                case 'target_value':
                  key = "Target percent";
                  break;
              }
              return {key: key, value: this.props.feature[item]};
            });
            let c = <ReactTable 
                      showPagination={false} 
                      className={'infoTable'}
                      minRows={0}
                      pageSize={13}
                      data={data}
                      noDataText=''
                      columns={[{
                         Header: 'Key', 
                         accessor: 'key',
                         width:120,
                         headerStyle:{'textAlign':'left'},
                      },{
                         Header: 'Value',
                         accessor: 'value',
                         width:160,
                         headerStyle:{'textAlign':'left'},
                         Cell: props => this.renderCell(props)
                      }
                      ]}
                    />;
        return <Dialog title="Info" 
          overlayStyle={{display:'none'}} 
          open={this.props.open}               
          className={'dialogGeneric'}
          style={{marginTop:'205px', width:'350px', marginLeft: '135px'}}
          actions={[
            <React.Fragment>
              <RaisedButton 
                  label="OK" 
                  onClick={this.props.closeInfoDialog}
                  primary={true} 
                  className="projectsBtn"
                  style={{height:'25px'}}
              />
          </React.Fragment>
          ]} 
          onRequestClose={this.props.closeInfoDialog} 
          contentStyle={{width:'350px'}}
          titleClassName={'dialogTitleStyle'}
          children={c}
          />;
    }
}

export default Info;
