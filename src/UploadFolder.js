import React from 'react';
import FontAwesome from 'react-fontawesome';

class UploadFolder extends React.Component {
    constructor(props){
        super(props);
        this.state = {folderUploadText : ''};
    }
    onChange(e) {
        this.props.filesListed(e.target.files);
        this.setState({folderUploadText: e.target.files.length + " files"});
    }
    _addDirectory(node) {
        if (node) { 
            node.directory = true;
            node.webkitdirectory = true;
        }
    }
    render() {
        return (
            <div className='uploadFileFieldIcon'>
                <div style={{display:'inline-block'}}>{this.props.label}</div>
                <div className='uploadFileField' style={{marginLeft:'17px', width:'222px', backgroundColor: '#F7F7F7', borderRadius: '5px', paddingLeft:'25px'}}>{this.state.folderUploadText}
                    <div className='uploadFileFieldIcon' style={{position: 'absolute',left: '148px'}}>
                        <div style={{display: 'inline-flex'}}>
                            <label htmlFor={'folderSelector'}>
                                <FontAwesome name='folder' title='Click to select a Marxan project folder' style={{'cursor':'pointer', display: 'inline-flex'}}/>
                            </label>
                        </div>
                        <input id='folderSelector' ref={node => this._addDirectory(node)} type='file' onChange={this.onChange.bind(this)} style={{'display':'none', 'width':'10px'}}/>
                    </div>
                    <div className='uploadFileFieldLabel'>{this.props.foldername}</div>
                </div>
            </div>
        );
    }
}

export default UploadFolder;
