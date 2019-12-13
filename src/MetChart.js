import * as React from 'react';
import { PieChart, Pie, Cell } from 'recharts';
import Divider from 'material-ui/Divider';

class MetChart extends React.Component {
    getArea(value){
        let scale;
        switch (this.props.units) {
            case 'm2':
                scale = 1;
                break;
            case 'ha':
                scale = 0.0001;
                break;
            case 'km2':
                scale = 0.000001;
                break;
            default:
                // code
        }
        return Number((value * scale).toFixed(1));
    }
    render() {
        let rounded = Number(this.props.percentMet.toFixed(1));
        let country_area = this.getArea(this.props.country_area);
        let protected_area = this.getArea(this.props.protected_area);
        let total_area = this.getArea(this.props.total_area);
        let titleText = "Area: " +  total_area + ' ' + this.props.units + "\nCountry area: " + country_area + ' ' + this.props.units +"\nProtected area: " + protected_area + ' ' + this.props.units;
        const data = (this.props.showCountryArea) ? [{ name: 'Protected area', value: protected_area},{ name: 'Country area', value: (country_area - protected_area) }, { name: 'Total area', value: (total_area - country_area) }] : [{ name: 'Protected area', value: protected_area}, { name: 'Total area', value: (total_area - protected_area) }];
        const colors = ['#D9D9D9', this.props.color];
        return (
            <React.Fragment>
                <div className="MetChart">
                    <div className="MetChartTitle">{this.props.title}</div>
                    <Divider/>
                    <div className='MetChartInner'>
                        <PieChart width={120} height={120}>
                          <Pie data={data} cx="50%" cy="50%" isAnimationActive={false} startAngle={90} endAngle={450} innerRadius={30} outerRadius={50}>
                            {
                              data.map((entry, index) => {
                              let _color;
                                switch (index) {
                                    case 0:
                                        _color = this.props.color;
                                        break;
                                    case 1:
                                        _color = (this.props.showCountryArea) ? "#bbbbbb" : "#dddddd";
                                        break;
                                    default:
                                        _color = "#dddddd";
                                        break;
                                }
                                return <Cell key={index} fill={_color} strokeWidth={2}/>;
                              })
                            }
                          </Pie>
                        </PieChart>
                        <div style={{color:colors[1]}} className="MetChartPercentLabel">
                            {rounded}%
                        </div>
                        <div className="MetChartDiv" style={this.props.clickable!==false ? {cursor: 'pointer'} : null} title={titleText} />
                    </div>
                </div>
            </React.Fragment>
        );
    }
}

export default MetChart;