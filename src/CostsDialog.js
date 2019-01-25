import React from 'react';
import MarxanDialog from './MarxanDialog';

class CostsDialog extends React.Component {
  render() {
    return (
      <MarxanDialog
      {...this.props} 
      contentWidth={370}
      offsetY={80}
      title="Costs" 
      children={            
      <React.Fragment>
        <div>
          Not yet implemented 
        </div>
      </React.Fragment>}/>
    );
  }
}

export default CostsDialog;
