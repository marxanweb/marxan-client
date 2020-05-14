import React from "react";
import MarxanDialog from "./MarxanDialog";
import Checkbox from 'material-ui/Checkbox';

class MarxanImportFeatureDialog extends React.Component {
    handleCheck(evt, isChecked){
        this.props.setAddToProject(isChecked);
    }
    render() {
        return (
            <MarxanDialog
                {...this.props}
                actions={[this.props.actions,
            			<div style={{width: '100%', maxWidth: '500px', textAlign:'left'}}>
        					<Checkbox
        						label="Add to project"
        						style={{fontSize:'12px',paddingLeft: '10px', width:'200px',display:'inline-block',verticalAlign:'bottom'}}
        						onCheck={this.handleCheck.bind(this)}
        						checked={this.props.addToProject}
        					/>
            			</div>
					]
                }
            />
        );
    }
}

export default MarxanImportFeatureDialog;
