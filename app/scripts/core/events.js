var global = this; // jshint ignore:line
define(function(require) {
    "use strict";

// based on jeromeetienne/microevent.js
// MIT license

    // the global event registry
    var registry = global._evregistry = { id: 0 };

    registry.add = function(cb) {
        if (cb._eventid || cb._eventid in this) {
            this[cb._eventid].ref += 1;
            return cb._eventid;
        }
        else {
            cb._eventid = "cb" + (this.id += 1);
            this[cb._eventid] = { cb: cb, ref: 1 };
            return cb._eventid;
        }
    };

    registry.remove = function(cbid, all) {
        if (typeof cbid === "function") {
            cbid = cbid._eventid;
        }

        if ((this[cbid].ref -= 1) === 0 || all) {
            delete this[cbid];
        }
    };

    registry.apply = function(cbid, args) {
        var cb = this[cbid];
        if (cb) {
            cb.cb.apply(global, args);
        }
    };

    var events = {

        /** when the mixin is initialized, add the data containers */
        _mixin_init: function() {
            var self = this;
            self._events = { "*": [] };
        },

        /** trigger callbacks associated with the given event */
        trigger: function(event) {
            var self = this;
            var args = Array.prototype.splice.call(arguments, 0);

            self._events[event] = self._events[event] || [];
            self._events[event].forEach(function(cbid) {
                registry.apply(cbid, args);
            });

            self._events["*"].forEach(function(cbid) {
                registry.apply(cbid, args);
            });
        },

        /** bind the event to the callback. if label is provided, this
            callback can be unbound by that label; useful for killing
            widgets, for example.
        */
        on: function(event, cb) {
            var self = this;
            if (!event || !cb) return;

            // we reregister for each event, because we can remove them individually
            event.split(" ").forEach(function(event) {
                self._events[event] = self._events[event] || [];
                self._events[event].push(registry.add(cb));
            });
        },

        /** remove the bindings from the event. */
        off: function(arg) {
            var self    = this;
            var event   = typeof arg === "string" ? arg : undefined;
            var cb      = typeof arg === "function" ? arg : undefined;
            if (!event && !cb) return;

            // unregister all cbs on the event
            if (event) {
                (self._events[event] || []).forEach(function(cbid) {
                    registry.remove(cbid);
                });

                delete self._events[event];
            }
    
            // just the given cb, but everywhere it"s registered
            // todo: this leaves refs in the event table, but they"ll fizzle
            if (cb) {
                registry.remove(cb, true);
            }
        }
    };

    return events;
});
