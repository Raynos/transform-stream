var ReadWriteStream = require("read-write-stream")

module.exports = mapAsync

function mapAsync(iterator, flush, serial) {
    var endCount = 0
        , ended = false
        , queue = ReadWriteStream(write, end)
        , push = queue.push
        , stream = queue.stream
        , running = false

    if (typeof flush === "boolean") {
        serial = flush
        flush = noop
    }

    if (!flush) {
        flush = noop
    }

    if (!iterator) {
        iterator = identity
    }

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
        running = true
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
        if (endCount === 0) {
            running = false
            if (ended) {
                queue.end()
                stream.emit("finish")
            }
        }
    }

    function end() {
        ended = true
        if (serial && running) {
            stream.once("drain", flushed)
        } else {
            flushed()
        }

        if (endCount === 0) {
            queue.end()
            stream.emit("finish")
        }

        function flushed() {
            if (flush.length === 0) {
                var value = flush()
                if (value !== undefined) {
                    queue.push(value)
                }

                return
            }

            endCount++
            var result
            if (flush.length === 1) {
                flush.call(stream, finish)
            } else {
                flush.call(stream, push, finish)
            }
        }
    }
}

function identity(x) {
    return x
}

function noop() {}
