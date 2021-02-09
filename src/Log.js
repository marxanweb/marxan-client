/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import * as React from "react";
import LogItem from "./LogItem";

class Log extends React.Component {
  render() {
    let children = this.props.messages.map((message, index) => {
      let className = "";
      //message cleaning and formatting
      switch (message.status) {
        case "RunningMarxan": //from marxan runs - remove all the double line endings
          className = "logItem logMessage";
          Object.assign(message, {
            info: message.info
              .replace(/(\n\n {2}Init)/gm, "\n  Init")
              .replace(/(\n\n {2}ThermalAnnealing)/gm, "\n  ThermalAnnealing")
              .replace(/(\n\n {2}Iterative)/gm, "\n  Iterative")
              .replace(/(\n\n {2}Best)/gm, "\n  Best"),
          });
          break;
        case "Started":
        case "Uploading":
          className = "logItem logStart";
          break;
        case "Preprocessing":
        case "FeatureCreated":
          className = "logItem logMessageBlock";
          break;
        case "Finished":
        case "UploadComplete":
        case "UploadFailed":
          className = "logItem logFinish";
          break;
        default:
          className = "logItem logNone";
          break;
      }
      //if there is an error, then set that as the message
      if (message.hasOwnProperty("error"))
        Object.assign(message, { info: message.error });
      return (
        <LogItem
          message={message}
          key={index}
          preprocessing={this.props.preprocessing}
          className={className}
        />
      );
    });
    return (
      <div
        id="log"
        onMouseEnter={this.props.mouseEnter}
        onMouseLeave={this.props.mouseLeave}
      >
        {children}
      </div>
    );
  }
}

export default Log;
