import {connectToBroker} from './index'
import dotenv from 'dotenv'
dotenv.config()

async function startPublisher(amqpConn: any){
    amqpConn.createChannel(async function(err: any, ch: any) {
        /*if (closeOnErr(err)) return;
          ch.on("error", function(err) {
          console.error("[AMQP] channel error", err.message);
        });*/
        ch.on("close", function() {
          console.log("[AMQP] channel closed");
        })
        //It creates the exchange (if doenst exists already) in fanout (broadcast) policy
        ch.assertExchange(process.env.EXCHANGE_NAME, 'fanout', {durable: false})
        while (true) {
            //It publishes a message to the exchange, that will be redirected to the queues
            ch.publish(process.env.EXCHANGE_NAME, '', new Buffer('message'))
            //ch.sendToQueue(process.env.QUEUE_NAME_NETWORK+'.*', new Buffer('message'))
            console.log('Message published!')
            await sleep(3000)
          }
        //})
           
           
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
connectToBroker(startPublisher)