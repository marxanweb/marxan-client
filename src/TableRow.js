/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from "react";

class TableRow extends React.Component {
  render() {
    const subcontent = this.props.htmlContent
      ? this.props.htmlContent
      : this.props.title;
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          backgroundColor: "#dadada",
          borderRadius: "2px",
        }}
        title={this.props.title}
      >
        {subcontent}
      </div>
    );
  }
}

export default TableRow;
