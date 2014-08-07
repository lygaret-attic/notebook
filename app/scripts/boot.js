"use strict";

require.config({
    baseUrl: "./scripts",
    paths: {
        "domready"  : "../bower_components/requirejs-domready/domready",
        "text"      : "../bower_components/requirejs-text/text",
        "json"      : "../bower_components/requirejs-json/json",

        "react"     : "../bower_components/react/react-with-addons",
        "dropbox"   : "../bower_components/dropbox-build/dropbox",
        "when"      : "../bower_components/when"
    },

    shim: {
        "dropbox": { exports: "Dropbox" }
    }
});

require(["domready!", "react", "./app/bootloader", "json!../env.json"], function(document, React, bootloader, config) {
    React.renderComponent(bootloader({ config: config }, null), document.getElementById("root"));
});
