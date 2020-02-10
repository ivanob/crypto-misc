import {connectToQueue} from './index'

async function startPublisher(amqpConn: any){
    amqpConn.createChannel(async function(err: any, ch: any) {
        /*if (closeOnErr(err)) return;
          ch.on("error", function(err) {
          console.error("[AMQP] channel error", err.message);
        });*/
        ch.on("close", function() {
          console.log("[AMQP] channel closed");
        })
        while (true) {
          /*var [exchange, routingKey, content] = offlinePubQueue.shift()
          //publish(exchange, routingKey, content)
          publish('amq.direct', 'b', new Buffer('abcd'))*/
           ch.sendToQueue('hello', new Buffer('message'))
           console.log('Message published!')
           await sleep(2000);
        }
      });
}

function sleep(ms: number) {
  return new Promise(resolve => setTimeout(resolve, ms));
}

/*function publish(exchange: string, routingKey: string, content: string) {
    try {
      pubChannel.publish(exchange, routingKey, content, { persistent: true },
        function(err: any, ok: any) {
          if (err) {
            console.error("[AMQP] publish", err);
            offlinePubQueue.push([exchange, routingKey, content]);
            pubChannel.connection.close();
          }
          else if(ok){
            console.log('[AMQP] Message published!')
            setTimeout(start, 10000)
          }
        })
    } catch (e) {
      console.error("[AMQP] publish", e.message);
      offlinePubQueue.push([exchange, routingKey, content]);
    }
  }*/

console.log('Started node')
connectToQueue(startPublisher)