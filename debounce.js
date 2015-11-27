'use strict';

/**
 * Simple Debounce/Throttle module
 *
 * @param {Object|null|*} [conf] - conf object
 *   @param {Number}    conf.delay          delay execution. default: 200
 *   @param {Number}    conf.rollingBump    bump debounce by this number until max. default: 0 (disabled)
 *   @param {Number}    conf.rollingMax     maximum absolute delay that allowed (limits bumps). default: 0 (disabled)
 *   @param {Number}    conf.coolTime       minimum time between executions. default: 0 (disabled)
 *   @param {Boolean}   conf.trailing       weather to run one more time if there was any hit while executing. default: true
 *   @param {Boolean}   conf.wait           adds a 'done' callback to the debounced function. if false - 'done' is undefined!. default: true
 * @param {Function|*} cb - callback debounce
 * @constructor
 */
function Debounce(conf, cb) {
    var _this = this;
    cb = typeof conf == 'function' && conf || cb;
    conf = conf || {};

    var firstHit = 0;
    var currentDelay = 0;
    var timer, pending, execLock, debounceLock, rollingMax;

    this.hit = function () {
        if (execLock) {
            pending = true;
            return
        }

        if (debounceLock) {
            if (conf.rollingBump && !rollingMax) {
                let diff = +new Date - firstHit;
                let newTarget = diff + conf.rollingBump;
                if (newTarget < currentDelay) {
                    // this bump will not change anything
                    return
                }

                newTarget += Math.min(conf.rollingBump * 0.1, 100);

                let newDelay;
                if (conf.rollingMax && newTarget > conf.rollingMax) {
                    rollingMax = true;
                    currentDelay = conf.rollingMax;
                    newDelay = conf.rollingMax - diff;
                }
                else {
                    currentDelay = newTarget;
                    newDelay = conf.rollingBump
                }
                clearTimeout(timer);
                timer = setTimeout(exec, newDelay);
            }

            return
        }

        // not locked - start debounce
        debounceLock = true;
        firstHit = +new Date;
        currentDelay = conf.delay;
        clearTimeout(timer);
        timer = setTimeout(exec, currentDelay);
    };

    function exec() {
        debounceLock = rollingMax = false;
        execLock = true;

        if (conf.wait !== false) return cb(freeLock);

        cb();
        freeLock();
    }

    function freeLock() {
        debounceLock = false;

        if (conf.coolTime) {
            return setTimeout(unlock, conf.coolTime);
        }
        unlock()
    }

    function unlock() {
        execLock = false;

        if (conf.trailing !== false && pending) {
            pending = false;
            _this.hit()
        }
    }
}

module.exports = Debounce;
