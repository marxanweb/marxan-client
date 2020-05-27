import React from 'react';
import ReactTable from "react-table";

class MarxanTable extends React.Component {
    //filters the data in the table from the search text
    filterData(){
        if (this.props.searchText === "") return this.props.data;
        let filteredData = this.props.data.filter(item => {
            if (this.props.searchText.startsWith("!")){ //does not contain search 
                return !(Object.keys(item).some(key => (this.props.searchColumns.includes(key))&&(item[key] && item[key].includes(this.props.searchText.substring(1)))));
            }else{ //contains search - this will exit the some loop (and return true) if there are any matching items
                return Object.keys(item).some(key => (this.props.searchColumns.includes(key))&&(item[key] && item[key].includes(this.props.searchText)));
            }
        });
        //call the dataFiltered method passing the filtered data
        if (this.props.hasOwnProperty("dataFiltered")) this.props.dataFiltered(filteredData);
        return filteredData;
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
