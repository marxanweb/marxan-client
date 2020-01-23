import React from "react";
import MarxanDialog from "./MarxanDialog";

class ImportGBIFDialog extends React.Component {
        onOk() {
            this.props.importGBIFData().then(response => {
                this.props.onCancel();
            }).catch(error => {
                this.props.onCancel();
            });
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
                
            </div>
          </React.Fragment>
        }
      />
    );
  }
}

export default ImportGBIFDialog;
