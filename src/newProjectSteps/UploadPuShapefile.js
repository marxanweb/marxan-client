import * as React from 'react';
import ShapefileUpload from '../ShapefileUpload';

class UploadPuShapefile extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            zipFilename: '',
            log: '',
        };
    }
    setzipFilename(filename) {
        this.setState({ zipFilename: filename });
        this.setState({ log: "Uploaded<br/>Uploading to MapBox..." });
        this.props.uploadShapefile(this.state.zipFilename, this.state.zipFilename.slice(0, -4), "Imported as " + this.state.zipFilename + " using the import wizard");
    }
    render() {
        return (
            <React.Fragment>
                <div className={'newPUDialogPane'}>
                    <ShapefileUpload mandatory={true} filename={this.state.zipFilename} setFilename={this.setzipFilename.bind(this)} label="Zipped shapefile" style={{'paddingTop':'10px'}}/> 
                    <div id="log" dangerouslySetInnerHTML={{__html:this.state.log}} style={{width:'450px','overflowX':'hidden'}}></div>
                </div>
            </React.Fragment>
        );
    }
}

export default UploadPuShapefile;
