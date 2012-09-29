# async-map-stream

Turn an asynchronous function into a through stream

## Example

``` js
var from = require("read-stream").fromArray
    , to = require("write-stream").toArray
    , asyncMap = require("async-map-stream")

from([1,2,3])
    .pipe(asyncMap(function (item, cb) {
        setTimeout(function() {
            cb(null, item * 2)
        }, 1000);
    }))
    .pipe(to([], function toList (list) {
        console.log("list", list)
    }))
```

## Installation

`npm install async-map-stream`

## Contributors

 - Raynos

## MIT Licenced
