import * as React from 'react';
import Checkbox from 'material-ui/Checkbox';

class CheckBoxField extends React.PureComponent {

  //pass all of the Conservation features properties in the click event of the checkbox so we can store an array of checked Conservation features
  handleCheck = (event, isInputChecked) => {
    this.props.onChange(event, isInputChecked, this.props.interestFeature);
  };

  render() {
    return (
          <Checkbox onCheck={this.handleCheck.bind(this)} checked={this.props.checked} style={{position:'absolute',left:'10px'}}/>
    )}
}

export default CheckBoxField;