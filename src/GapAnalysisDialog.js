import * as React from 'react';
import MarxanDialog from './MarxanDialog';
import MetChart from "./MetChart";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Label } from 'recharts';
import Toggle from 'material-ui/Toggle';
class GapAnalysisDialog extends React.PureComponent {
  constructor(props) {
    super(props);
    this.state = {showChart:false};
  }
		getRepresentationScore(features) {
			let sum = 0,
				amount_under_protection_property, total_amount_property;
			//get the names of the properties that we will use to calculate the representation scores
			if (features.length) {
				if (features[0].hasOwnProperty('current_protected_area')) {
					amount_under_protection_property = 'current_protected_area';
					total_amount_property = 'country_area';
				}
				else {
					amount_under_protection_property = 'protected_area';
					total_amount_property = 'pu_area';
				}
			}
			//iterate through the features and get the value for each feature
			features.forEach(item => {
				let val = ((item[amount_under_protection_property] / item[total_amount_property]) / (item.target_value / 100));
				if (!isNaN(val)) sum = sum + ((val > 1) ? 1 : val);
			});
			//get the mean value
			let mean = (sum / features.length);
			return Number(mean * 100).toFixed(1);
		}
		toggleView(event, isInputChecked){
			this.setState({showChart:isInputChecked})	;
		} 
		renderTooltip(a,b,c){
			return 'wibble';
		}
		render() {
				//join the data from the gap analysis onto the feature data
				let _data = this.props.gapAnalysis.map(item => {
					//get the matching projectFeatures item
					var stats = this.props.projectFeatures.filter(item2 => {
						return (item2.feature_class_name === item._feature_class_name);
					})[0];
					return Object.assign(item, {target_value: stats.target_value});
				});
				let charts = _data.map((item, index) => {
					if (item.country_area > 0) {
						return <MetChart {...item} title={item._alias} color={window.colors[index % window.colors.length]} key={item._feature_class_name} units={'km2'} showCountryArea={false}/>;
					}
					else {
						return null;
					}
				});
				//get the representation score
				let score = (this.props.gapAnalysis.length) ? this.getRepresentationScore(_data) : 'Calcuating..';
				return (
						<MarxanDialog
				showSpinner={this.props.preprocessing}
				autoDetectWindowHeight={false}
                {...this.props}
                contentWidth={680}
                title="Gap Analysis"
                helpLink={"docs_user.html#gap-analysis-window"}
                onRequestClose={this.props.closeGapAnalysisDialog}
                showCancelButton={false}
                children={
                <React.Fragment>
					<div className="analysisReport">
						A gap analysis calculates how much of each conservation feature is protected within the existing protected area network and then summarises the representation as a score. For more information see the online help.
						<div className={'analysisReportInner'}>
							<div className={'analysisChartsDiv'} style={{display: (this.state.showChart) ? 'none' : 'block'}}>
								{charts}
							</div>
							<BarChart width={550} height={350} data={_data} margin={{bottom:80, top:20}} style={{display: (this.state.showChart) ? 'block' : 'none',margin:'auto'}}>
								<CartesianGrid strokeDasharray="1" stroke="#f4f4f4"/>
								<XAxis dataKey="_alias" angle={-45} textAnchor="end" interval={0}>
								</XAxis> 
								<YAxis tick={{fontSize:11}} >
									<Label value='Percent Protected' angle={-90} position='insideBottomLeft' style={{fontSize:'11px',color:'#222222'}} offset={30}/>
								</YAxis>
								<Tooltip content={this.renderTooltip} />
								<Bar dataKey="current_protected_percent" fill="#E14081" />
							</BarChart>
						</div>
						Representation score: <span className={'score'}>{score}</span>
						<Toggle label="Show as a chart" onToggle={this.toggleView.bind(this)} style={{width:'unset',float:'right',paddingTop:'2px'}} labelStyle={{fontSize:'14px',width:'100px',color:'rgba(0, 0, 0, 0.6)'}}/>
					</div>
                </React.Fragment>
        }
        />
    );
}
}

export default GapAnalysisDialog;
