import * as React from 'react';
import MarxanDialog from './MarxanDialog';
import ReactTable from "react-table";
import MetChart from "./MetChart";

class AnalysisDialog extends React.PureComponent {
    render() {
		let tableColumns = [];
		tableColumns = [
			{ Header: 'Name', accessor: '_alias', width: 215, headerStyle: { 'textAlign': 'left' }}, 
			{ Header: 'Area', accessor: 'total_area', width: 60, headerStyle: { 'textAlign': 'left' }}, 
			{ Header: 'Country area', accessor: 'country_area', width: 150, headerStyle: { 'textAlign': 'left' }}, 
			{ Header: 'Protected area', accessor: 'protected_area', width: 150, headerStyle: { 'textAlign': 'left' }}, 
			{ Header: '% protected', accessor: 'percent_protected', width: 112, headerStyle: { 'textAlign': 'left' }}
		];
		let charts = this.props.gapAnalysis.map((item, index) => {
		    return <MetChart percentMet={item.percent_protected} country_area={item.country_area} total_area={item.total_area} protected_area={item.protected_area} title={item._alias} color={window.colors[index % window.colors.length]} key={item._feature_class_name} units={'km2'} showCountryArea={true}/>;
		});
        return (
            <MarxanDialog
				showSpinner={this.props.preprocessing}
                {...this.props}
                contentWidth={680}
                title="Analysis and Evaluation"
                children={
                <React.Fragment>
					<ReactTable 
					    pageSize={ this.props.gapAnalysis.length }
    					className={'projectsReactTable noselect'}
    					showPagination={false} 
    					minRows={0}
    					noDataText=''
    					data={this.props.gapAnalysis}
    					thisRef={this} 
    					columns={tableColumns}
    					style={{display:'none'}}
					/>
					{charts}
                </React.Fragment>
        }
        />
    );
}
}

export default AnalysisDialog;
