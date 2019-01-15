import React from 'react';
import FontAwesome from 'react-fontawesome';

class UploadFolder extends React.Component {
    onChange(e) {
        this.props.filesListed(e.target.files);
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
                <div style={{'width':'180px'}}>{this.props.label}</div>
                <div className='uploadFileField' style={{width:'280px'}}>
                    <div className='uploadFileFieldIcon' style={{display: 'inline-flex'}}>
                        <div style={{display: 'inline-flex'}}>
                            <label htmlFor={'folderSelector'}>
                                <FontAwesome name='folder' title='Click to select a Marxan project folder' style={{'cursor':'pointer', display: 'inline-flex'}}/>
                            </label>
                        </div>
                        <input id='folderSelector' ref={node => this._addDirectory(node)} type='file' onChange={this.onChange.bind(this)} style={{'display':'none', 'width':'10px'}}/>
                    </div>
                    <div className='uploadFileFieldLabel' style={{width:'200px'}}>{this.props.foldername}</div>
                </div>
            </div>
        );
    }
}

export default UploadFolder;
