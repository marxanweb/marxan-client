import React from 'react';
import RaisedButton from 'material-ui/RaisedButton';
import Dialog from 'material-ui/Dialog';
import ReactTable from "react-table";
import {isNumber, isValidTargetValue} from './genericFunctions.js';

class Info extends React.Component {
  updateFeatureValue(key, evt){
    var value = (key === "target_value") ? evt.currentTarget.innerHTML.substr(0, evt.currentTarget.innerHTML.length-1) : evt.currentTarget.innerHTML;
    if (((key === "target_value") && (isValidTargetValue(value))) || ((key === "spf") && (isNumber(value)))) {
      this.props.updateFeature(this.props.feature, key, value, true);      
    }else{
      alert("Invalid value");
    }
  }
  
  renderCell(props){
    let html;
    switch (props.row.key) {
      case 'Preprocessed':
        html = (props.row.value) ? <div>Yes</div> : <div>No</div>;
        break;
      case 'Creation date': 
        html = <div>{props.row.value.slice(0, props.row.value.length-7)}</div>;
        break;
      case 'Target percent':
        html = <div contentEditable suppressContentEditableWarning title={props.row.value} onBlur={this.updateFeatureValue.bind(this, "target_value")}>{props.row.value}%</div>;
        break;
      case 'Species Penalty Factor':
        html = <div contentEditable suppressContentEditableWarning title={props.row.value} onBlur={this.updateFeatureValue.bind(this, "spf")}>{props.row.value}</div>;
        break;
      case 'Total area':
      case 'Area protected':
      case 'Planning unit area':
      case 'Target area':
        //set the font color to red if the area protected is less than the target area
        let color = (this.props.feature.protected_area < this.props.feature.target_area) && (props.row.key === 'Area protected') ? "red" : "rgba(0, 0, 0, 0.6)";
        //rounded to 1 dp
        html = <div title={props.row.value/1000000 + ' Km2'} style={{color:color}}>{String(Number(props.row.value/1000000).toFixed(1)).replace(/\B(?=(\d{3})+(?!\d))/g, ",")} Km<span style={{verticalAlign: 'super', fontSize: 'smaller'}}>2</span></div>;
        break;
      default:
        html = <div title={props.row.value}>{props.row.value}</div>;
    }
    html = (props.row.value === -1) ? <div>Not calculated</div> : html;
    return html;
  }
    render(){
      //change the order here to change the rendering order in the info panel - you also need to update the pageSize below
        let data = ['id','alias','feature_class_name','description','creation_date','tilesetid','area','target_value','spf','preprocessed','pu_count','pu_area','target_area','protected_area'].map((item)=>{
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
                case 'tilesetid':
                  key = "Mapbox ID";
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
                  key = "Species Penalty Factor";
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
                      pageSize={14}
                      data={data}
                      noDataText=''
                      columns={[{
                         Header: 'Key', 
                         accessor: 'key',
                         width:150,
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
          style={{marginTop:'205px', width:'380px', marginLeft: '135px'}}
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
          contentStyle={{width:'380px'}}
          titleClassName={'dialogTitleStyle'}
          children={c}
          />;
    }
}

export default Info;
