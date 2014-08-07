define(function() {
    "use strict";

    return {

        /** pipe the given value through the promise */
        or: function(r) { return function() { return r; }; },

        /** for a promise that returns an array, pipe the nth element through only */
        at: function(n) { return function() { return arguments[0][n]; }; },

        /** skip the given number of arguments */
        skip: function(n) { 
            return function() {
                return Array.prototype.splice.call(arguments, 0, n);
            };
        }

    };

});
