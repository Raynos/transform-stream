var from = require("read-stream").fromArray
    , to = require("write-stream").toArray

    , asyncMap = require("..")

from([1,2,3])
    .pipe(asyncMap(function (item, cb) {
        setTimeout(function() {
            cb(null, item * 2)
        }, 1000);
    }))
    .pipe(to([], function toList (list) {
        console.log("list", list)
    }))
