import React from 'react';
/*eslint-disable no-unused-vars*/
import axios, { post } from 'axios';
/*eslint-enable no-unused-vars*/
import FontAwesome from 'react-fontawesome';

//From AshikNesin https://gist.github.com/AshikNesin/e44b1950f6a24cfcd85330ffc1713513

class ShapefileUpload extends React.Component {

    constructor(props) {
        super(props);
        this.state = { loading: false };
        this.onChange = this.onChange.bind(this);
        this.fileUpload = this.fileUpload.bind(this);
    }

    onChange(e) {
        if (e.target.files.length) {
            this.fileUpload(e.target.files[0]);
            //reset the file selector
            document.getElementById(this.id).value = "";
        }
    }

    fileUpload(value) {
        this.setState({ loading: true });
        const url = this.props.MARXAN_ENDPOINT_HTTPS + "uploadShapefile";
        const formData = new FormData();
        this.filename = value['name']; //from the open file dialog
        formData.append('value', value); 
        formData.append('filename', this.filename);
        formData.append('name', this.props.name);
        formData.append('description', this.props.description); 
        post(url, formData, {withCredentials: this.props.SEND_CREDENTIALS}).then(function(response){
            this.finishedLoading(response);
        }.bind(this));
    }

    finishedLoading(response) {
        if (!this.props.checkForErrors(response.data)){
            this.setState({ loading: false });
            this.props.setFilename(this.filename);
        }
    } 
    render() {
        this.id = "upload" + this.props.parameter;
        return (
            <form className='FileUploadForm'>
                <table>
                    <tbody>
                        <tr>
                            <td>
                                <div style={{'width':'113px'}}>{this.props.label}</div>
                            </td>
                            <td className='uploadFileTD'> 
                                <div className='uploadFileField' style={{width:'222px'}}>
                                    <div className='uploadFileFieldIcon'>
                                        <label htmlFor={this.id}><FontAwesome name='file' title='Click to upload a file' style={{'cursor':'pointer'}}/></label>
                                        <input type="file" onChange={this.onChange} accept=".zip" style={{'display':'none', 'width':'10px'}} id={this.id} />
                                    </div>
                                    <div className='mandatoryIcon'>
                                        <FontAwesome name='exclamation-circle' title='Required field' style={{ color: 'red', 'display': (this.props.filename  === '' && this.props.mandatory) ? 'block' : 'none'}}/>
                                    </div>
                                    <div className='uploadFileFieldLabel' style={{width:'184px'}}>{this.props.filename}</div>
                                </div>
                            </td>
                            <td><FontAwesome name='sync' spin style={{'display': (this.state.loading ? 'block' : 'none'), 'marginLeft':'6px'}}/></td>
                        </tr>
                    </tbody>
                </table>
            </form>
        );
    }
}

export default ShapefileUpload;
