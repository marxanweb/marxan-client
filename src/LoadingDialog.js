import React from 'react';
import MarxanDialog from './MarxanDialog';

class LoadingDialog extends React.Component {
	render() {
		return (
			<React.Fragment>
				<MarxanDialog 
					{...this.props} 
					showOverlay={true}
					showCancelButton={false}
					hideOKButton={true}
					contentWidth={358}
					title="Loading.." 
					modal={true} 
					/>
			</React.Fragment>
		);
	}
}

export default LoadingDialog;
