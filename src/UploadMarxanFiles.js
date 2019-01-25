import * as React from 'react';
import UploadFolder from './UploadFolder';
import ShapefileUpload from './ShapefileUpload';

class UploadMarxanFiles extends React.Component {
    constructor(props) {
        super(props);
        this.state = { zipFilename: ''}; 
    }
    setzipFilename(filename) {
        this.setState({ zipFilename: filename });
        this.props.setZipFilename(filename);
    }
    render() {
        return (
            <React.Fragment>
                <div>
                    <UploadFolder label="Project folder" filesListed={this.props.filesListed}/>
                    <ShapefileUpload MARXAN_ENDPOINT_HTTPS={this.props.MARXAN_ENDPOINT_HTTPS} mandatory={true} filename={this.state.zipFilename} setFilename={this.setzipFilename.bind(this)} label="Zipped shapefile" style={{'paddingTop':'10px'}}/> 
                </div>
            </React.Fragment>
        );
    }
}

export default UploadMarxanFiles;
