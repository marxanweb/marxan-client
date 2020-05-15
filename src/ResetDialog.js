import * as React from 'react';
import MarxanDialog from './MarxanDialog';

class ResetDialog extends React.PureComponent {
    render() {
        return (
            <MarxanDialog
                {...this.props}
                contentWidth={240}
                title="Reset database"
                okLabel='Yes'
                cancelLabel='No'
                showCancelButton={true}
                children={
                <div>Are you sure you want to reset?</div>
        }
        />
        );
    }
}

export default ResetDialog;
