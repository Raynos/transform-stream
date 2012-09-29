var from = require("read-stream").fromArray
    , to = require("write-stream").toArray

    , map = require("..")

from([1,2,3])
    .pipe(map(function (item, cb) {
        setTimeout(function() {
            cb(null, item * 2)
        }, 1000);
    }))
    .pipe(map(function (item) {
        return item * 2
    }))
    .pipe(to([], function toList (list) {
        console.log("list", list)
    }))
