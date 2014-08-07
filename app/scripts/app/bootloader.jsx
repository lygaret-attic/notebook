/** @jsx React.DOM */
define(function(require) {
    "use strict";

    var React       = require("react");
    var Dropbox     = require("dropbox");
    var when        = require("when/when");
    var nodefn      = require("when/node");

    var pu          = require("core/promiseutil");

    var loading = React.createClass({
        displayName: "loading",

        render: function() {
            return <h1>Loading</h1>;
        }
    });

    var login = React.createClass({
        displayName: "login",

        doLogin: function() {
            var self = this;
            self.props.client.authenticate();
        },

        render: function() {
            var self = this;
            return <a href="javascript:void(0)" onClick={self.doLogin}>login with dropbox</a>;
        }
    });

    var error = React.createClass({
        displayName: "error",

        render: function() {
            var self = this;
            return <p style={{"color":"red"}}>{self.props.message}</p>;
        }
    });

    var good = React.createClass({
        displayName: "application",

        render: function() {
            var self = this;
            return <p>Welcome, {self.props.email}</p>;
        }
    });

    // build a promisified version of the dropbox client
    var makeClient = function(config) {
        var client = new Dropbox.Client({ key: config.dropbox.apikey });   
        for (var key in client) {
            if (typeof client[key] === "function") {
                client[key + "_async"] = nodefn.lift(client[key]);
            }
        }

        return client;
    };

    return React.createClass({

        getInitialState: function() {
            return { scene: <loading /> };
        },

        componentDidMount: function() {
            var self = this;

            // build a client, and check if we're authenticated
            makeClient(self.props.config)
                .authenticate_async({ interactive: false }) 
                .then(function(client) {
                    if (!client.isAuthenticated()) {
                        // if we're not authenticated, show the login screen
                        self.setState({ scene: <login client={client} /> });
                        return;
                    }

                    return when.join(
                        // if we are authenticated, get some base data and boot the app
                        client.getAccountInfo_async().then(pu.at(1)),
                        client.readdir_async("/").then(pu.at(1))
                    )
                    .spread(function(user, root) {
                        self.setState({ scene: <good email={user.email} /> });
                    });
                })

                .otherwise(function(e) {
                    // otherwise, show the error screen
                    console.error(e);
                    self.setState({ scene: <error message={e} /> });
                });
        },

        render: function() {
            var self = this;
            return self.state.scene;
        }
    });

});
