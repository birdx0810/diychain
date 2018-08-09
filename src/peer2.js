var smoke = require('smokesignal')
var node = smoke.createNode({
  port: 2019
, address: smoke.localIp('192.168.43.1/255.255.255.0')
, seeds: [{port: 2018, address:'192.168.43.43'}]
})

node.on('connect', function() {
  node.broadcast.write('HEYO! I\'m here')
})

node.on('disconnect', function() {
})
process.stdin.pipe(node.broadcast).pipe(process.stdout)
node.start()
