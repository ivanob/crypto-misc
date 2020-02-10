import util from 'util'
import amqp from 'amqplib/callback_api'
import dotenv from 'dotenv'
dotenv.config()

const reconnectTime = 20000

async function connectToQueue(action: (conn:any)=>{}) {
    const connectQueue: any = util.promisify(amqp.connect)
    connectQueue(process.env.AMQP_URL + '?heartbeat=60').then(
      (conn: any) => {
        conn.on("error", function(err: any) {
          if (err.message !== "Connection closing") {
            console.error("[AMQP] conn error", err.message);
          }
        })
        conn.on("close", function() {
          console.error("[AMQP] reconnecting");
          return setTimeout(connectToQueue, reconnectTime);
        })
        console.log("[AMQP] connected")
        action(conn)
      }
    )
}

export {connectToQueue}