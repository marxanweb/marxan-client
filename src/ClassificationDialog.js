/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from 'react';
import 'react-table/react-table.css';
import MarxanDialog from './MarxanDialog';
import RendererSelector from './RendererSelector.js'; 
import ColorSelector from './ColorSelector.js';
import { BarChart, ReferenceLine, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Label } from 'recharts';

let RENDERERS = ["equal_interval", "jenks", "std_deviation", "quantile"];
let COLORCODES = ["opacity", "OrRd", "PuBu", "BuPu", "Oranges", "BuGn", "YlOrBr", "YlGn", "Reds", "RdPu", "Greens", "YlGnBu", "Purples", "GnBu", "Greys", "YlOrRd", "PuRd", "Blues", "PuBuGn", "Spectral", "RdYlGn", "RdBu", "PiYG", "PRGn", "RdYlBu", "BrBG", "RdGy", "PuOr", "Set2", "Accent", "Set1", "Set3", "Dark2", "Paired", "Pastel2", "Pastel1"];
let NUMCLASSES = ["3", "4", "5", "6", "7", "8", "9"];
let TOPCLASSES = ["1", "2", "3", "4", "5", "6", "7", "8", "9"];

class ClassificationDialog extends React.Component {

	render() { 
		let breaks = this.props.dataBreaks.map((item, index) => {
			//dont include the bottom line as we will use the y axis
			return <ReferenceLine x={item} key={index} stroke="#00BCD4" />;
		});
		return (
			<MarxanDialog 
				{...this.props} 
				contentWidth={390}
				rightX={0}
				offsetY={80}
				showCancelButton={false}
				helpLink={"user.html#changing-how-the-results-are-displayed"}
				title="Classification" 
				children={
					<div style={{height:'275px'}} key="k6">
						<BarChart width={250} height={150} data={this.props.summaryStats}>
							<CartesianGrid strokeDasharray="1" stroke="#f4f4f4"/>
							<XAxis dataKey="number" tick={{fontSize:11}} type={'number'}>
								<Label value="Sum solutions" offset={0} position="insideBottom" style={{fontSize:'11px',color:'#222222'}} />
							</XAxis> 
							<YAxis tick={{fontSize:11}}>
								<Label value='Count' angle={-90} position='insideLeft' style={{fontSize:'11px',color:'#222222'}}/>
							</YAxis>
							<Tooltip />
							<Bar dataKey="count" fill="#E14081" />
							{breaks}
						</BarChart>
						<div className={'renderers'}>
							<ColorSelector values={COLORCODES} changeValue={this.props.changeColorCode} property={this.props.renderer.COLORCODE} floatingLabelText={"Colour scheme"} brew={this.props.brew} />
							<RendererSelector values={RENDERERS} changeValue={this.props.changeRenderer} property={this.props.renderer.CLASSIFICATION} floatingLabelText={"Classification"}/>
							<RendererSelector values={NUMCLASSES} changeValue={this.props.changeNumClasses} property={this.props.renderer.NUMCLASSES} floatingLabelText={"Number of classes"} />
							<RendererSelector values={TOPCLASSES} changeValue={this.props.changeShowTopClasses} property={this.props.renderer.TOPCLASSES} floatingLabelText={"Show top n classes"}/>
						</div>
					</div>
				} 
			/>
		);
	}
}

export default ClassificationDialog;
