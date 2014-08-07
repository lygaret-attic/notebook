define(function(require) {
    "use strict";

    var klass   = require("core/klass");
    var events  = require("core/events");

/**
    storage manages a local cache of a dropbox file. it uses the cache
    revision from dropbox to determine whether or not the version it
    has in localStorage matches what"s in dropbox, and sync changes 
    automatically.
**/

    var storage = function(client, options) {
        var self = this;
        self.client = client;
        self.options = options;

        klass.initialize_mixins(self);
    };
    klass.mixin(storage, events);

    return storage;

});
