
# Connection between nodes and miners

To simulate the network in a blockchain I am using rabbitMQ. The broker will have a broker in broadcast
mode and every miner who listens the network will create a queue binded to that broker. This will
simulate them receiving messages from its peers but in a centralized way to simplify things.

The queues are created with a TTL for each message, so if it doesnt gets read in a specific
time it will dissapear, as it would happen with lost messages in a network.

The nodes just have to connect to that exchange and publish a message with the transaction they want
to mine and it will be broadcasted to all the miners listening.
