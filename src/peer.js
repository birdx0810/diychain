var smoke = require('smokesignal')


var node = smoke.createNode({
  port: 8495
, address: smoke.localIp('192.168.102.1/255.255.255.0')
, seeds: [{port: 2018, address:'192.168.102.143'}]
})

node.on('connect', function() {
  node.broadcast.write('HEYO! I\'m here')
})

node.on('disconnect', function() {
})
process.stdin.pipe(node.broadcast).pipe(process.stdout)
node.start()
node.stop()