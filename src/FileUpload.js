import React from 'react';
/*eslint-disable no-unused-vars*/
import axios, { post } from 'axios';
/*eslint-enable no-unused-vars*/
import FontAwesome from 'react-fontawesome';

//From AshikNesin https://gist.github.com/AshikNesin/e44b1950f6a24cfcd85330ffc1713513

class FileUpload extends React.Component {

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
        this.props.fileUploaded(false, '');
        this.setState({ loading: true });
        const url = "https://db-server-blishten.c9users.io/marxan/webAPI2.py/postFile";
        const formData = new FormData();
        formData.append('value', value);
        formData.append('filename', value['name']);
        formData.append('parameter', this.props.parameter);
        formData.append('user', this.props.user);
        formData.append('project', this.props.project);
        const config = {
            headers: {
                'content-type': 'multipart/form-data'
            }
        };
        post(url, formData, config).then((response) => this.finishedLoading(response));
    }

    finishedLoading(response) {
        if (response.error === undefined) {
            this.setState({ loading: false });
            this.props.fileUploaded(true, this.props.parameter,response.data.file); 
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
                                <div style={{'width':'180px'}}>{this.props.label}</div>
                            </td>
                            <td className='uploadFileTD'> 
                                <div className='uploadFileField'>
                                    <div className='uploadFileFieldIcon'>
                                        <label htmlFor={this.id}><FontAwesome name='file' title='Click to upload a file' style={{'cursor':'pointer'}}/></label>
                                        <input type="file" onChange={this.onChange} accept=".dat" style={{'display':'none', 'width':'10px'}} id={this.id} />
                                    </div>
                                    <div className='mandatoryIcon'>
                                        <FontAwesome name='exclamation-circle' title='Required field' style={{ color: 'red', 'display': (this.props.value  === '' && this.props.mandatory) ? 'block' : 'none'}}/>
                                    </div>
                                    <div className='uploadFileFieldLabel'>{this.props.value}</div>
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

export default FileUpload;
