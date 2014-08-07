define(function(require) {
    "use strict";

// based on heir v2.0.0 - http://git.io/F87mKg
// MIT license, Oliver Caldwell

    return {

        /** Sets up the prototype chain for dest to inherit from super */
        inherit: function(dest, sup) {
            var proto;

            proto = dest.prototype = Object.create(sup.prototype);
            proto.constructor = dest;
            proto._super = sup.prototype;
        },

        /** Copies all properties from the mixin to the destination */
        mixin: function(dest, mixin) {
            var key;
            var proto = dest.prototype;

            // the mixin can add initialization code, that"s invoked with the initialize_mixin proc
            if (mixin._mixin_init) {
                proto._mixins = proto._mixins || [];
                proto._mixins.push(mixin._mixin_init);
            }

            // copy our own keys over
            for (key in mixin) {
                if (key === "_mixin") return;
                if (mixin.hasOwnProperty(key)) {
                    proto[key] = mixin[key];
                }
            }
        },

        initialize_mixins: function(dest, args) {
            var initializers = dest._mixins;
            if (initializers && initializers.length) {
                for(var i = 0; i < initializers.length; i++) {
                    initializers[i].apply(dest, args);
                }
            }
        }
    };

});
