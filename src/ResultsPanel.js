/*
 * Copyright (c) 2020 Andrew Cottam.
 *
 * This file is part of marxanweb/marxan-client
 * (see https://github.com/marxanweb/marxan-client).
 *
 * License: European Union Public Licence V. 1.2, see https://opensource.org/licenses/EUPL-1.2
 */
import React from "react";
import ToolbarButton from "./ToolbarButton";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEraser } from "@fortawesome/free-solid-svg-icons";
import ReactTable from "react-table";
import Paper from "material-ui/Paper";
import { Tabs, Tab } from "material-ui/Tabs";
import MapLegend from "./MapLegend";
import Log from "./Log";
import Clipboard from "material-ui/svg-icons/action/assignment";
import Sync from "material-ui/svg-icons/notification/sync";

let runtime = 0;

class ResultsPanel extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      showClipboard: false,
      selectedSolution: undefined,
      runtimeStr: "00:00s",
    };
  }
  componentDidUpdate(prevProps, prevState) {
    //scroll the log div to the bottom
    // if (this.props.messages.length !== prevProps.messages.length) {
    // 	var objDiv = document.getElementById("log");
    // 	if (objDiv) objDiv.scrollTop = objDiv.scrollHeight;
    // }
    var objDiv = document.getElementById("log");
    if (objDiv) objDiv.scrollTop = objDiv.scrollHeight;
    if (this.props.solutions !== prevProps.solutions) {
      this.resetSolution(); //unselect a solution
    }
    if (
      this.props &&
      this.props.preprocessing &&
      prevProps &&
      !prevProps.preprocessing
    )
      this.startTimer();
    if (
      prevProps &&
      prevProps.preprocessing &&
      this.props &&
      !this.props.preprocessing
    )
      this.stopTimer();
  }
  str_pad_left(string, pad, length) {
    return (new Array(length + 1).join(pad) + string).slice(-length);
  }
  startTimer() {
    runtime = 0;
    this.timer = setInterval(() => {
      var minutes = Math.floor(runtime / 60);
      var seconds = runtime - minutes * 60;
      var finalTime =
        this.str_pad_left(minutes, "0", 2) +
        ":" +
        this.str_pad_left(seconds, "0", 2);
      this.setState({ runtimeStr: finalTime });
      runtime = runtime + 1;
    }, 1000);
  }
  stopTimer() {
    //clear the timer
    clearInterval(this.timer);
    this.timer = null;
  }
  loadSolution(solution) {
    //loads the solution using the projects owner
    this.props.loadSolution(solution, this.props.owner);
  }

  mouseEnter(event) {
    this.setState({ showClipboard: true });
  }

  mouseLeave(event) {
    if (event.relatedTarget.id !== "buttonsDiv")
      this.setState({ showClipboard: false });
  }

  selectText(node) {
    node = document.getElementById(node);
    if (document.body.createTextRange) {
      const range = document.body.createTextRange();
      range.moveToElementText(node);
      range.select();
    } else if (window.getSelection) {
      const selection = window.getSelection();
      const range = document.createRange();
      range.selectNodeContents(node);
      selection.removeAllRanges();
      selection.addRange(range);
    } else {
      console.warn("Could not select text in node: Unsupported browser.");
    }
  }

  copyLog(evt) {
    this.selectText("log");
    evt.target.focus();
    document.execCommand("copy");
  }

  //resets the currently selected solution
  resetSolution() {
    if (this.state.selectedSolution) this.changeSolution(undefined, undefined);
  }

  //fired in the onClick event handler of the react table
  changeSolution(event, solution) {
    this.setState({ selectedSolution: solution });
    if (solution) this.loadSolution(solution.Run_Number);
  }

  render() {
    return (
      <React.Fragment>
        <div
          style={{
            width: "300px",
            height: "400px",
            position: "absolute",
            right: "140px",
            display: this.props.open ? "block" : "none",
          }}
        >
          <Paper zDepth={2} className="ResultsPanelPaper">
            <div className="resultsTitle">Results</div>
            <Tabs
              contentContainerStyle={{ margin: "20px" }}
              className={"resultsTabs"}
              value={this.props.activeResultsTab}
              id="resultsTabs"
            >
              <Tab
                label="Legend"
                value="legend"
                onActive={() => this.props.setActiveTab("legend")}
              >
                <div className={"legendTab"}>
                  <MapLegend {...this.props} brew={this.props.brew} />
                </div>
              </Tab>
              <Tab
                label="Solutions"
                value="solutions"
                onActive={() => this.props.setActiveTab("solutions")}
              >
                <div
                  id="solutionsPanel"
                  style={{ display: !this.props.processing ? "block" : "none" }}
                >
                  {this.props.solutions && this.props.solutions.length > 0 ? (
                    <ReactTable
                      thisRef={this}
                      getTrProps={(state, rowInfo, column, instance) => {
                        return {
                          onClick: (e) => {
                            state.thisRef.changeSolution(e, rowInfo.original);
                          },
                          style: {
                            background:
                              rowInfo.original.Run_Number ===
                              (state.thisRef.state.selectedSolution &&
                                state.thisRef.state.selectedSolution.Run_Number)
                                ? "aliceblue"
                                : "",
                          },
                          title: "Click to show on the map",
                        };
                      }}
                      className={"solutions_infoTable -highlight"}
                      showPagination={false}
                      minRows={0}
                      pageSize={this.props.solutions.length}
                      noDataText=""
                      data={this.props.solutions}
                      columns={[
                        {
                          Header: "Run",
                          accessor: "Run_Number",
                          width: 40,
                          headerStyle: { textAlign: "left" },
                        },
                        {
                          Header: "Score",
                          accessor: "Score",
                          width: 80,
                          headerStyle: { textAlign: "left" },
                        },
                        {
                          Header: "Cost",
                          accessor: "Cost",
                          width: 80,
                          headerStyle: { textAlign: "left" },
                        },
                        {
                          Header: "Planning Units",
                          accessor: "Planning_Units",
                          width: 50,
                          headerStyle: { textAlign: "left" },
                        },
                        {
                          Header: "Missing Values",
                          accessor: "Missing_Values",
                          width: 105,
                          headerStyle: { textAlign: "left" },
                        },
                      ]}
                    />
                  ) : null}
                </div>
              </Tab>
              <Tab
                label="Log"
                value="log"
                onActive={() => this.props.setActiveTab("log")}
                style={{
                  display:
                    this.props.userRole === "ReadOnly" ? "none" : "block",
                }}
              >
                <Log
                  messages={this.props.messages}
                  id="log"
                  mouseEnter={this.mouseEnter.bind(this)}
                  mouseLeave={this.mouseLeave.bind(this)}
                  preprocessing={this.props.preprocessing}
                />
                <div
                  id="buttonsDiv"
                  style={{
                    position: "absolute",
                    top: "430px",
                    right: "16px",
                    padding: "10px",
                  }}
                >
                  <ToolbarButton
                    icon={
                      <Clipboard style={{ height: "20px", width: "20px" }} />
                    }
                    title="Copy to clipboard"
                    onClick={this.copyLog.bind(this)}
                    show={this.state.showClipboard}
                  />
                  <ToolbarButton
                    icon={<FontAwesomeIcon icon={faEraser} />}
                    title="Clear log"
                    onClick={this.props.clearLog.bind(this)}
                    show={this.state.showClipboard}
                  />
                </div>
                <div
                  className={"runtime"}
                  style={{
                    display: this.props.preprocessing ? "block" : "none",
                  }}
                >
                  Runtime: {this.state.runtimeStr}s
                </div>
              </Tab>
            </Tabs>
            <div
              className="processingDiv"
              style={{ display: this.props.preprocessing ? "block" : "none" }}
              title="Processing.."
            >
              <Paper zDepth={2}>
                <div className="processingText"></div>
                <Sync
                  className="spin processingSpin"
                  style={{ color: "rgb(255, 64, 129)" }}
                />
              </Paper>
            </div>
          </Paper>
        </div>
      </React.Fragment>
    );
  }
}

export default ResultsPanel;
