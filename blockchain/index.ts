import util from 'util'
import amqp from 'amqplib/callback_api'
import dotenv from 'dotenv'
dotenv.config()

const reconnectTime = 20000

/* This function will create a connection to the broker and use
that connection to execute the function passed as parameter */
async function connectToBroker(action: (conn:any)=>{}) {
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
          return setTimeout(connectToBroker, reconnectTime);
        })
        console.log("[AMQP] connected")
        action(conn)
      }
    )
}

export {connectToBroker}