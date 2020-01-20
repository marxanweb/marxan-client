//NO LONGER USED
import * as React from 'react';
import MarxanDialog from './MarxanDialog';
import MetChart from "./MetChart";
import { Tabs, Tab } from 'material-ui/Tabs';
import sdg15 from './images/sdg15.png';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Label } from 'recharts';

class AnalysisDialog extends React.PureComponent {
	getRepresentationScore(features){
		let sum = 0, amount_under_protection_property, total_amount_property;
		//get the names of the properties that we will use to calculate the representation scores
		if (features.length){
			if (features[0].hasOwnProperty('current_protected_area')){
				amount_under_protection_property = 'current_protected_area';
				total_amount_property = 'country_area';
			}else{
				amount_under_protection_property = 'protected_area';
				total_amount_property = 'pu_area';
			}
		}
		//iterate through the features and get the value for each feature
		features.forEach(item => {
			let val = ((item[amount_under_protection_property]/item[total_amount_property])/(item.target_value/100));
			sum = sum + ((val > 1) ? 1 : val);
		});
		//get the mean value
		let mean = (sum / features.length);
		return (mean*100);
	}
    render() {
		//join the data from the gap analysis onto the feature data
		let _data = this.props.gapAnalysis.map(item => {
			//get the matching projectFeatures item
			var stats = this.props.projectFeatures.filter(item2 => {
				return (item2.feature_class_name === item._feature_class_name);
			})[0];
			return Object.assign(item, stats);
		});
		let charts = (this.props.gapAnalysis.length) && _data.map((item, index) => {
		    return <MetChart {...item} title={item._alias} color={window.colors[index % window.colors.length]} key={item._feature_class_name} units={'km2'} showCountryArea={false}/>;
		});
		//get the representation score
		let score = (this.props.gapAnalysis.length) ? this.getRepresentationScore(_data) : 'Calcuating..';
        return (
            <MarxanDialog
				showSpinner={this.props.preprocessing}
				autoDetectWindowHeight={false}
                {...this.props}
                contentWidth={680}
                title="Analysis and Evaluation"
                children={
                <React.Fragment>
					<Tabs>
						<Tab label="Coverage" className={'analysisTab'}>
						<div className="analysisReport">
							<div className={'countryLabel'}>Papua New Guinea</div>
							<div className={'countryMap'}></div>
							<div className={'representationTable'}>
								<div className={'representationHeader'}>Terrestrial Area</div>
								<div className={'representationBody'}>
									<div className={'sdgImage'}>
						  	            <img
						  	              src={sdg15}
						  	              alt="SDG Target 15"
						  	              title={"SDG Target 15"}
						  	            />
									</div>
									<div className={'coveragePercent'}>12.4%</div>
									<div className={'coverageLabel'}>Coverage</div>
									<div className={'landAreaProtected'}>72314.2 Km2</div>
									<div className={'landAreaProtectedLabel'}>Protected Land Area</div>
									<div className={'totalArea'}>582735.7 Km2</div>
									<div className={'totalAreaLabel'}>Total Land Area</div>
								</div>
								<div className={'representationFooter'}>Terrestrial Aichi Target 11 threshold (17%)</div>
							</div>
							</div>
						</Tab>
						<Tab label="Current Network" className={'analysisTab'}>
							<div className="analysisReport">
								<div className={'countryLabel'}>Papua New Guinea</div>
								<div className={'analysisChartsDiv'}>
									{charts}
								</div>
							</div>
						</Tab>
						<Tab label="Proposed Network" className={'analysisTab'}>
							<div className="analysisReport">
								<div className={'countryLabel'}>Papua New Guinea</div>
								<div className={'countryMap'}></div>
								<div className={'representationTable'}>
									<div className={'blueBoxes totalFeatures'}>Total Features</div>
									<div className={'blueBoxes targetsMet'}>Targets met</div>
									<div className={'blueBoxes targetsMetProp'}>Prop meeting targets</div>
									<div className={'lightblueBoxes totalFeaturesValue'}>{this.props.gapAnalysis.length}</div>
									<div className={'lightblueBoxes targetsMetValue'}>20</div>
									<div className={'lightblueBoxes targetsMetPropValue'}>50%</div>
									<div className={'targetsFooter'}>Representation of ecosystem features at 17%</div>
								</div>
								<div className={'representationChart'}></div>
								<div className={'representationScore'}>Representation score</div>
								<div className={'representationScoreValue'}>{score}</div>
								<div className={'representationScoreColors'}></div>
								<div className={'analysisChartHolder2'}>
									<BarChart width={500} height={200} data={_data}>
										<CartesianGrid strokeDasharray="1" stroke="#f4f4f4"/>
										<XAxis dataKey="alias" angle={-90} textAnchor="end" interval={0}>
										</XAxis> 
										<YAxis tick={{fontSize:11}} >
											<Label value='Percent Protected' angle={-90} position='insideLeft' style={{fontSize:'11px',color:'#222222'}}/>
										</YAxis>
										<Tooltip />
										<Bar dataKey="protected_percent" fill="#E14081" />
									</BarChart>
								</div>
							</div>
						</Tab>
					</Tabs>
                </React.Fragment>
        }
        />
    );
}
}

export default AnalysisDialog;
