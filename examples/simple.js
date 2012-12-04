var from = require("read-stream").fromArray
    , to = require("write-stream").toArray

    , transform = require("..")

from([1,2,3])
    .pipe(transform(function (item, finish) {
        setTimeout(function() {
            finish(null, item * 2)
        }, 1000)
    }))
    .pipe(transform(function (item, next, finish) {
        setTimeout(function () {
            next(item * 2)
        }, 500)

        setTimeout(function () {
            next(item * 3)
        }, 1000)

        setTimeout(function () {
            finish()
        }, 1500)
    }))
    .pipe(transform(function (item) {
        return item * 2
    }))
    .pipe(transform(function (item, finish) {
        console.log("does not")

        setTimeout(function () {
            console.log("run in parallel")
            finish(null, item)
        }, 1000)
    }, true))
    .pipe(to(function toList (list) {
        // 8 12 16 24 24 36
        console.log("list", list)
    }))
