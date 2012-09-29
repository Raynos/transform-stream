var ReadWriteStream = require("read-write-stream")

module.exports = mapAsync

function mapAsync(iterator) {
    var counter = 0
        , ended = false
        , queue = ReadWriteStream(write, end)
        , stream = queue.stream

    return stream

    function write(chunk, queue) {
        counter++
        iterator(chunk, next)
    }

    function next(err, data) {
        if (err) {
            return stream.emit("error", err)
        }

        queue.push(data)

        counter--
        if (counter === 0 && ended) {
            queue.end()
        }
    }

    function end() {
        ended = true
        if (counter === 0) {
            queue.end()
        }
    }
}
