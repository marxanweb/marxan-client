import React from "react";
import MarxanDialog from "./MarxanDialog";
import TextField from 'material-ui/TextField';

class ImportGBIFDialog extends React.Component {
        constructor(props) {
            super(props);
            this.state = { gbifID: '2492936' };
        }
        onOk() {
            this.props.importGBIFData(this.state.gbifID,'Megalurulus rufus','Fiji Long-legged Warbler').then(response => {
                this.props.onCancel();
            }).catch(error => {
                this.props.onCancel();
            });
        }
        changeGBIFID(event, value){
            this.setState({gbifID: value});
        }
        render() {
                return (
                        <MarxanDialog
        {...this.props}
        contentWidth={768}
        offsetY={80}
        title="Import GBIF data"
        helpLink={"docs_user.html#import-gbif-data"}
        onOk={this.onOk.bind(this)}
        showCancelButton={false}
		autoDetectWindowHeight={false}
        children={
          <React.Fragment key={'importGBIFKey'}>
            <div className={'importGBIFContent'}>
                <TextField value={this.state.gbifID} onChange={this.changeGBIFID.bind(this)} floatingLabelText="GBIFID" floatingLabelFixed={true}/>
            </div>
          </React.Fragment>
        }
      />
    );
  }
}

export default ImportGBIFDialog;
