# node-debounce

Simple debounce/throttle module in less than 100 lines


``` javascript

// this is the default conf
const options = {
    delay: 200,     // delay execution. default: 200
    rollingBump: 0, // bump debounce by this number until max. default: 0 (disabled)
    rollingMax: 0,  // maximum absolute delay that allowed (limits bumps). default: 0 (disabled)
    coolTime: 0,    // minimum time between executions. default: 0 (disabled)
    trailing: true, // weather to run one more time if there was any hit while executing. default: true
    wait: true      // adds a 'done' callback to the debounced function. if false - 'done' is undefined!. default: true
}

const func = function (done) {
    // simulate async operation
    setTimeout(function (done) {
        console.log("Done doing that async thing!");
        done();
    }, 1000)
};

const debounce = new Debounce(options, func);

// simulate hits
setInterval(function () {
    debounce.hit();
}, 50)

```

*note - written for node >= 4.x. an es5 version is in es5 folder