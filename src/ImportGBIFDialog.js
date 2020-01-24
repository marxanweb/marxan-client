import React from "react";
import MarxanDialog from "./MarxanDialog";
import TextField from 'material-ui/TextField';

class ImportGBIFDialog extends React.Component {
    constructor(props) {
        super(props);
        this.state = { searchText: '','gbifID': 0, 'suggestions':[], clicked:false, selectedItem: {} };
    }
    onOk() {
        this.props.importGBIFData(this.state.selectedItem).then(response => {
            this.props.onCancel();
        }).catch(error => {
            this.props.onCancel();
        });
    }
    changeSearchText(event, value){
        if (this.state.searchText.length>2 && !this.state.clicked){
            //get the gbif suggested names
            this.props.gbifSpeciesSuggest(this.state.searchText).then((response)=>{
                this.setState({suggestions: response});
            });
        }
        this.setState({searchText: value, clicked: false});
    }
    onClick(item, evt){
        this.setState({clicked: true}, ()=>{
            this.setState({searchText: item.scientificName, selectedItem: item});            
        });
    }
    render() {
        let suggestions = this.state.suggestions.map((item)=>{
            return <div key={item.key} className={'suggestion'} onClick={this.onClick.bind(this, item)}>{item.scientificName}</div>;
        });
        return (
            <MarxanDialog
                {...this.props}
                contentWidth={540}
                offsetY={80}
                title="Import GBIF data"
                helpLink={"docs_user.html#import-gbif-data"}
                onOk={this.onOk.bind(this)}
                showCancelButton={false}
        		autoDetectWindowHeight={false}
                children={
                  <React.Fragment key={'importGBIFKey'}>
                    <div className={'importGBIFContent'}>
                        <TextField value={this.state.searchText} onChange={this.changeSearchText.bind(this)} floatingLabelText="Search" floatingLabelFixed={true} style={{width:'350px'}}/>
                        <div className={'suggestions'} style={{display:(this.state.searchText.length>2 && !this.state.clicked) ? 'block' : 'none'}}>{suggestions}</div>
                    </div>
                    </React.Fragment>
                }
            />
        );
    }
}

export default ImportGBIFDialog;
