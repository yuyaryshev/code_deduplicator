import React from "react";
import { render } from "react-dom";

import { apiUrl } from "./models/myUrl";
import { ytheme } from "./components/ytheme";
import { fjmap } from "ystd";

const useHotReloading = true;

(async () => {
    try {
        console.log(`Use localStorage.debug = '...' to change debug output!`);
        document.body.style.backgroundColor = ytheme.backgroundColor;
        let root = document.querySelector("#root");
        if (!root) {
            root = document.createElement("div");
            root.id = "root";
            document.body.appendChild(root);
        }

        console.log(`Starting...`);
        console.log(`Base URL = '${apiUrl()}'`);
        console.log(
            "fjmap test",
            fjmap([1, 2, 3], "-", (x: number) => x)
        );

        render(<div>It's indexSmall rendered here!</div>, root);
        document.body.removeChild(document.querySelector("#unsupported_message")!);
    } catch (e) {}
    // loadSurvey(surveyIdFromUrl());
})();

if ((module as any).hot) {
    (module as any).hot.accept();
}
