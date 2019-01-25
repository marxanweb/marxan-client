import * as React from 'react';
import Checkbox from 'material-ui/Checkbox';
class Options extends React.Component {
    render() {
        return (
            <React.Fragment>
                <div className={'newPUDialogPane'}>
                <Checkbox 
                    label="Include existing protected areas"
                    
                />
                </div>
            </React.Fragment>
        );
    }
}

export default Options;
 