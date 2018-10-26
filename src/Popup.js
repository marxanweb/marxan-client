import React from 'react';
import ReactTable from "react-table";

class Popup extends React.Component {
    render() {
        let data = this.props.active_pu ? Object.keys(this.props.active_pu).map(key => ({ key, value: this.props.active_pu[key] })) : [];
        let left = this.props.xy.x + 25 + 'px';
        let top = this.props.xy.y - 25 + 'px';
        return (
            <div style={{'display': data.length>0 ? 'block' : 'none','left': left,'top':top}} id="popup">
                <div className={'popupHeader'}>Planning unit properties</div>
                <ReactTable
                  showPagination={false}
                  minRows={0}
                  pageSize={200}
                  noDataText=''
                  data={data}
                  columns={[{
                     Header: 'Property',
                     accessor: 'key' 
                  },{
                     Header: 'Value',
                     accessor: 'value' 
                  }]}
                />
            </div>
        );
    }
}

export default Popup;
