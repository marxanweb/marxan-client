import * as React from 'react';
import MarxanDialog from './MarxanDialog';
import ToolbarButton from './ToolbarButton';

class UpdateWDPADialog extends React.PureComponent {
    render() {
        return (
            <MarxanDialog
                {...this.props}
                contentWidth={380}
				offsetY={260}
                title="Update WDPA"
                children={
                <React.Fragment>
                    <div style={{display: (this.props.newWDPAVersion ? 'block' : 'none')}}>
                      <br/>
                      <div dangerouslySetInnerHTML={{ __html: window.WDPA.latest_version + " is available. Details <a href='" + window.WDPA.metadataUrl + "' target='_blank'>here</a>. Click below to update. "}}/>
    					<br/>
    					<ToolbarButton title="Update WDPA" onClick={this.props.updateWDPA} label="Update" disabled={this.props.loading}/>
                    </div>
                </React.Fragment>
        }
        />
    );
}
}

export default UpdateWDPADialog;
