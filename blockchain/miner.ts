import {connectToQueue} from './index'

async function startWorker(amqpConn: any){
    amqpConn.createChannel(function(err:any, ch:any) {
        //if (closeOnErr(err)) return;
        ch.on("error", function(err: any) {
          console.error("[AMQP] channel error", err.message);
        });
        ch.on("close", function() {
          console.log("[AMQP] channel closed");
        });
    
        ch.prefetch(10);
        ch.assertQueue("jobs", { durable: true }, function(err:any, _ok:any) {
          //if (closeOnErr(err)) return;
          ch.consume("hello", processMsg(ch), { noAck: false })
        });
      });
}

const processMsg = (ch:any) => (msg: string) => {
    work(msg, function(ok: any) {
      try {
        if (ok)
          ch.ack(msg);
        else
          ch.reject(msg, true);
      } catch (e) {
        //closeOnErr(e);
      }
    })
}

function work(msg: any, cb: any) {
    console.log("PDF processing of ", msg.content.toString());
    cb(true);
}

console.log('Started miner')
connectToQueue(startWorker)
