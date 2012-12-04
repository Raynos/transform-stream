var ReadWriteStream = require("read-write-stream")

module.exports = mapAsync

function mapAsync(iterator, serial) {
    var endCount = 0
        , ended = false
        , queue = ReadWriteStream(write, end)
        , push = queue.push
        , stream = queue.stream

    // Legacy through API :(
    stream.queue = push

    return stream

    function write(chunk, queue) {
        if (ended === true) {
            return false
        }

        if (iterator.length === 1) {
            var newValue = iterator(chunk)

            if (newValue !== undefined) {
                push(newValue)
            }

            return
        }

        endCount++
        var result
        if (iterator.length === 2) {
            result = iterator.call(stream, chunk, finish)
        } else {
            result = iterator.call(stream, chunk, push, finish)
        }

        return serial ? false : result
    }

    function finish(err, data) {
        if (err) {
            return stream.emit("error", err)
        }

        if (arguments.length === 2) {
            queue.push(data)
        }

        if (serial) {
            stream.emit("drain")
        }

        endCount--
        if (endCount === 0 && ended) {
            queue.end()
        }
    }

    function end() {
        ended = true
        if (endCount === 0) {
            queue.end()
        }
    }
}
