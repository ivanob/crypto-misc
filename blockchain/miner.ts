import {connectToBroker} from './index'
import uuidv1 from 'uuid/v1'
import dotenv from 'dotenv'
dotenv.config()

async function startWorker(amqpConn: any){
    amqpConn.createChannel(function(err:any, ch:any) {
        //if (closeOnErr(err)) return;
        ch.on("error", function(err: any) {
          console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", function() {
          console.log("[AMQP] channel closed");
        });

        const QUEUE_NAME = process.env.QUEUE_NAME?process.env.QUEUE_NAME+'_'+idMiner:idMiner
        //Creates the exchange if it doesnt exists
        ch.assertExchange(process.env.EXCHANGE_NAME, 'fanout', {durable: false}) 
        const exp_time = process.env.EXPIRE_MESSAGE_TIME?+process.env.EXPIRE_MESSAGE_TIME:20000
        ch.assertQueue(QUEUE_NAME, { durable: false,
            arguments: {'x-message-ttl': exp_time} },
            function(err:any, _ok:any) {
          //if (closeOnErr(err)) return;
          ch.consume("", processMsg(ch), { noAck: false })
        })
        ch.bindQueue(QUEUE_NAME, process.env.EXCHANGE_NAME, '');
      })
}

const processMsg = (ch:any) => (msg: string) => {
    work(msg, function(ok: any) {
      try {
        if (ok)
          ch.ack(msg)
        else
          ch.reject(msg, true)
      } catch (e) {
        //closeOnErr(e);
      }
    })
}

function work(msg: any, cb: any) {
    console.log("Message read: ", msg.content.toString());
    cb(true);
}

const idMiner = uuidv1()
console.log('Started miner: ' + idMiner)
connectToBroker(startWorker)
