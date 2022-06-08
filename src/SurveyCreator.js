import React, { Component, useState } from "react";
import * as Survey from "survey-core";
import * as SurveyCreatorCore from "survey-creator-core";
import * as SurveyCreatorReact from "survey-creator-react";
import "survey-core/defaultV2.css";
import "survey-creator-core/survey-creator-core.css";

Survey.StylesManager.applyTheme("defaultV2");

export default function SurveyCreator(props) {
  let [creator, setCreator] = useState();

  if (creator === undefined) {
    let options = {
      showEmbededSurveyTab: true,
      showLogicTab: true,
      showTranslationTab: true,
      isAutoSave: false,
    };
    creator = new SurveyCreatorReact.SurveyCreator(options);
    creator.saveSurveyFunc = (saveNo, callback) => {
      callback(saveNo, true);

      if ("title" in creator.JSON === false) {
        console.log("title not set");
        // TODO how to report saving error?
        return;
      }

      // If you use a web service:
      saveSurveyJson(
        "http://localhost:3030/api/create?name=" + saveNo + "-" + creator.JSON["title"],
        creator.JSON,
        saveNo,
        callback
      );
    };
    // this.creator.tabs().push({
    //   name: "survey-templates",
    //   title: "My Custom Tab",
    //   template: "custom-tab-survey-templates",
    //   action: () => {
    //     this.creator.makeNewViewActive("survey-templates");
    //   },
    //   data: {},
    // });
    setCreator(creator);
  }

  creator.JSON = props.json;

  return (<div style={{ height: "calc(100% - 70px)" }}>
    {/* <script type="text/html" id="custom-tab-survey-templates"> */}
    {/*     {`<div id="test">TEST</div>`} */}
    {/*   </script> */}

    <SurveyCreatorReact.SurveyCreatorComponent creator={creator}></SurveyCreatorReact.SurveyCreatorComponent>

  </div>);
}

// If you use a web service:
function saveSurveyJson(url, json, saveNo, callback) {
  const request = new XMLHttpRequest();
  request.open('POST', url);
  request.setRequestHeader('Content-Type', 'application/json;charset=UTF-8');
  request.setRequestHeader('Access-Control-Allow-Origin', 'http://localhost:3000/');
  request.addEventListener('load', () => {
      callback(saveNo, true);
  });
  request.addEventListener('error', () => {
      callback(saveNo, false);
  });
  var res = request.send(JSON.stringify(json));
  console.log(JSON.stringify(res));
}
