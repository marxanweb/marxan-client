import React from 'react';
import ReactTable from "react-table";

class MarxanTable extends React.Component {
    //filters the data in the table
    filterData(){
        if (this.props.searchText === "") return this.props.data;
        return this.props.data.filter(item => {
            return Object.keys(item).some(key => (this.props.searchColumns.includes(key))&&(item[key] && item[key].includes(this.props.searchText)));
        });
    }
    render() {
        let filteredData = this.filterData();
        return (
            <ReactTable 
                {...this.props}
                pageSize={filteredData.length} 
                className={'projectsReactTable noselect'} 
                showPagination={false} 
                minRows={0} 
                data={filteredData}
                columns={this.props.columns} 
            />
        );
    }
}

export default MarxanTable;
