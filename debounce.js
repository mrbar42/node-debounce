'use strict';

/**
 * Simple Debounce/Throttle module
 *
 * @param {Object|null} [conf] - conf object
 *   @param {Number}    conf.delay          delay execution. default: 200
 *   @param {Number}    conf.rollingBump    bump debounce by this number until max. default: 0 (disabled)
 *   @param {Number}    conf.rollingMax     maximum absolute delay that allowed (limits bumps). default: 0 (disabled)
 *   @param {Number}    conf.coolTime       minimum time between executions. default: 0 (disabled)
 *   @param {Boolean}   conf.trailing       weather to run one more time if there was any hit while executing. default: true
 *   @param {Boolean}   conf.wait           adds a 'done' callback to the debounced function. if false - 'done' is undefined!. default: true
 * @param {Function} cb - callback debounce
 * @constructor
 */
function Debounce(conf, cb) {
    var _this = this;
    conf = conf || {};

    var pending = false;
    var firstHit = 0;
    var lastExec = 0;
    var timer = null;
    var execLock = false;
    var debounceLock = false;

    this.hit = function () {

        if (execLock) {
            pending = true;
            return
        }

        if (debounceLock) {
            if (conf.rollingBump) {
                let diff = +new Date - firstHit;
                if (!conf.rollingMax || diff < conf.rollingMax) {
                    clearTimeout(timer);
                    timer = setTimeout(exec, Math.min(diff + conf.rollingBump, conf.rollingMax - diff));
                }
            }
            return
        }

        // not locked - start debounce
        debounceLock = true;
        firstHit = +new Date;
        clearTimeout(timer);
        timer = setTimeout(exec, conf.delay);
    };

    function exec() {
        debounceLock = false;
        execLock = true;
        if (conf.wait) {
            cb(freeLock);
        }
        else {
            cb();
            freeLock();
        }
    }

    function freeLock() {
        debounceLock = false;
        if (conf.coolTime) {
            setTimeout(()=> {
                lastExec = +new Date;
                execLock = false;

                if (pending && conf.trailing) {
                    pending = false;
                    _this.hit()
                }
            }, conf.coolTime)
        }
        else {
            lastExec = +new Date;
            execLock = false;

            if (pending && conf.trailing) {
                pending = false;
                _this.hit()
            }
        }
    }
}

module.exports = Debounce;
