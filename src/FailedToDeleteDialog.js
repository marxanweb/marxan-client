import React from 'react';
import MarxanDialog from './MarxanDialog';
import ReactTable from "react-table";

class FailedToDeleteDialog extends React.Component { 
		renderName(row){
			return <div style={{width: '100%',height: '100%',backgroundColor: '#dadada',borderRadius: '2px'}} title={row.original.name}>{row.original.name}</div>;        
		}
		render() {
				let tableColumns = [];
				if (['Admin'].includes(this.props.userRole)) {
					tableColumns = [{ Header: 'User', accessor: 'user', width: 90, headerStyle: { 'textAlign': 'left' } }, { Header: 'Name', accessor: 'name', width: 200, headerStyle: { 'textAlign': 'left' }, Cell: this.renderName.bind(this) }];
				}
				else {
					tableColumns = [{ Header: 'Name', accessor: 'name', width: 200, headerStyle: { 'textAlign': 'left' }, Cell: this.renderName.bind(this) }];
				}
				if (this.props.projects) {
					return (
					<MarxanDialog 
					{...this.props} 
					// titleBarIcon={faBookOpen}
					showCancelButton={false}
					autoDetectWindowHeight={false}
					bodyStyle={{ padding:'0px 24px 0px 24px'}}
					title= {"Failed to delete " + this.props.deleteWhat} 
					contentWidth={500}
					helpLink={"user.html#deleting-features"}
					children={
						<React.Fragment key="k24">
							<div style={{marginBottom:'5px'}}>{"The " + this.props.deleteWhat + " is used in the following projects:"}</div>
								<div id="failedProjectsTable">
									<ReactTable 
									  pageSize={ this.props.projects.length }
										className={'projectsReactTable'}
										showPagination={false} 
										minRows={0}
										noDataText=''
										data={this.props.projects}
										thisRef={this} 
										columns={tableColumns}
									/>
							  </div>
						</React.Fragment>
					} 
				/>
			);
		}else{
			return null;
		}
	}
}

export default FailedToDeleteDialog;
