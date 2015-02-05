(function(){
    if (typeof module !== 'undefined' && module.exports) {
        module.exports = EventEmitter();
    }else{
        if(window.ngp)
            if(window.ngp.oFns)window.ngp.oFns.EventEmitter = EventEmitter();
            else{
                window.ngp.oFns = {
                    EventEmitter:EventEmitter()
                };
            }
    }

    function EventEmitter() {

        function EE(fn, context, once) {
            this.fn = fn;
            this.context = context;
            this.once = once || false;
        }

        function EventEmitterFactory(){
            this._events = undefined;
        }

        EventEmitterFactory.prototype.listeners = function listeners(event) {
            if (!this._events || !this._events[event]) return [];
            if (this._events[event].fn) return [this._events[event].fn];

            for (var i = 0, l = this._events[event].length, ee = new Array(l); i < l; i++) {
                ee[i] = this._events[event][i].fn;
            }

            return ee;
        };

        EventEmitterFactory.prototype.trigger = function trigger(event) {
            if (!this._events || !this._events[event]) return false;

            var listeners = this._events[event]
                , len = arguments.length
                , args
                , i;

            if ('function' === typeof listeners.fn) {
                if (listeners.once) this.removeListener(event, listeners.fn, true);

                for (i = 1, args = new Array(len -1); i < len; i++) {
                    args[i - 1] = arguments[i];
                }

                listeners.fn.apply(listeners.context, args);
            } else {
                var length = listeners.length
                    , j;

                for (i = 0; i < length; i++) {
                    if (listeners[i].once) this.removeListener(event, listeners[i].fn, true);

                    if (!args) for (j = 1, args = new Array(len -1); j < len; j++) {
                        args[j - 1] = arguments[j];
                    }

                    listeners[i].fn.apply(listeners[i].context, args);
                }
            }

            return true;
        };

        EventEmitterFactory.prototype.addListener = function addListener(event, fn, context) {
            var listener = new EE(fn, context || this);

            if (!this._events) this._events = {};
            if (!this._events[event]) this._events[event] = listener;
            else {
                if (!this._events[event].fn) this._events[event].push(listener);
                else this._events[event] = [
                    this._events[event], listener
                ];
            }

            return this;
        };

        EventEmitterFactory.prototype.once = function once(event, fn, context) {
            var listener = new EE(fn, context || this, true);

            if (!this._events) this._events = {};
            if (!this._events[event]) this._events[event] = listener;
            else {
                if (!this._events[event].fn) this._events[event].push(listener);
                else this._events[event] = [
                    this._events[event], listener
                ];
            }

            return this;
        };

        EventEmitterFactory.prototype.removeListener = function removeListener(event, fn, once) {
            if (!this._events || !this._events[event]) return this;

            var listeners = this._events[event]
                , events = [];

            if (fn) {
                if (listeners.fn && (listeners.fn !== fn || (once && !listeners.once))) {
                    events.push(listeners);
                }
                if (!listeners.fn) for (var i = 0, length = listeners.length; i < length; i++) {
                    if (listeners[i].fn !== fn || (once && !listeners[i].once)) {
                        events.push(listeners[i]);
                    }
                }
            }

            //
            // Reset the array, or remove it completely if we have no more listeners.
            //
            if (events.length) {
                this._events[event] = events.length === 1 ? events[0] : events;
            } else {
                delete this._events[event];
            }

            return this;
        };

        EventEmitterFactory.prototype.removeAllListeners = function removeAllListeners(event) {
            if (!this._events) return this;

            if (event) delete this._events[event];
            else this._events = {};

            return this;
        };

        EventEmitterFactory.prototype.off = EventEmitterFactory.prototype.removeListener;
        EventEmitterFactory.prototype.on = EventEmitterFactory.prototype.addListener;

        return EventEmitterFactory;
    }
})();