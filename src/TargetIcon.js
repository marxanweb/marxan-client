import * as React from 'react';
import { blue300, indigo900, pink400 } from 'material-ui/styles/colors';

class TargetIcon extends React.PureComponent {
    constructor(props) {
        super(props);
        this.state = { editing: false };
    }
    onClick(event) {
        this.startEditing();
    }
    isNumber(str) {
        var pattern = /^\d+$/;
        return pattern.test(str); // returns a boolean
    }
    onChange(event) {
        if (event.nativeEvent.target.value > 100) return;
        this.newTargetValue = event.nativeEvent.target.value;
        if (this.isNumber(this.newTargetValue) || (this.newTargetValue === "")) {
            this.newTargetValue = (this.newTargetValue === "") ? 0 : Number(this.newTargetValue);
            this.props.updateTargetValue(this);
        }
    }
    onKeyPress(event) {
        if (event.nativeEvent.key === "Enter") this.stopEditing();
    }
    startEditing() {
        this.setState({ editing: true });
        document.getElementById("input_" + this.props.interestFeature.id).focus();
        document.getElementById("input_" + this.props.interestFeature.id).select();
    }
    stopEditing() {
        this.setState({ editing: false });
    }
    render() {
        let backgroundColor = (this.props.targetStatus === "Does not occur in planning area") ? "lightgray" : (this.props.targetStatus === "Unknown") ? "white" : (this.props.targetStatus === "Target achieved") ? "white" : "rgb(255, 64, 129)";
        let fontColor = (this.props.targetStatus === "Does not occur in planning area") ? "white" : (this.props.targetStatus === "Unknown") ? blue300 : (this.props.targetStatus === "Target achieved") ? blue300 : "white";
         return (
            <div onClick={this.onClick.bind(this)} style={{position:'absolute',left:'8px',top:'17px'}}>
                <div title={this.props.targetStatus} style={{'display': (this.state.editing) ? 'none' : 'inline-flex', backgroundColor: backgroundColor, size:'0', color:fontColor, userSelect:'none', alignItems:'center', justifyContent:'center', fontSize:'12px', borderRadius:'50%', height:'33px', width:'33px', left:'8px', border:'1px lightgray solid'}}
                >{this.props.target_value}%</div>
                <div style={{'display': (this.state.editing) ? 'inline-flex' : 'none',size:'30','backgroundColor':'#2F6AE4','userSelect':'none','alignItems':'center','justifyContent':'center','borderRadius':'50%',height:'33px',width:'33px',left:'8px'}}>
                    <input id={"input_" + this.props.interestFeature.id} onBlur={this.stopEditing.bind(this)} onKeyPress={this.onKeyPress.bind(this)} onChange={this.onChange.bind(this)} style={{'backgroundColor':'transparent','border':'0px',height:'33px',width:'33px','fontSize':'13px',display:'inline-flex','textAlign':'center',color:blue300}} value={this.props.target_value}/>
                </div>
            </div>
        );
    }
}

export default TargetIcon;
