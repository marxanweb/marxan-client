import React from 'react';
import Checkbox from 'material-ui/Checkbox';
import Sync from 'material-ui/svg-icons/notification/sync'; 

class LoadingCheckbox extends React.Component {
    render() {
        return (
            <div>
                <div style={{position:'relative'}}>
        			<Checkbox
        			    {...this.props}
        			    labelStyle={{width:'100%'}}
        				style={{fontSize:'12px'}}
        			/>
        			<Sync className='spin' style={{display: (this.props.loading) ? 'inline-block' : 'none', color: 'rgb(255, 64, 129)', position: 'absolute', top: '5px', left: '20px',height:"16px",width:"22px"}} key={"spinner"}/>
    			</div>
			</div>
        );
    }
}

export default LoadingCheckbox;
