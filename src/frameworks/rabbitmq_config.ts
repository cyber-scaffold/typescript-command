import amqp, { Connection } from "amqplib";

export async function connectRabbitmq(complate_callback: (rabbit_connecting: Connection) => void | Promise<any>): Promise<any> {
  try {
    const rabbitConfig = {
      hostname: "0.0.0.0",
      port: 25672,
      username: "root",
      password: ""
    }
    const connection = await amqp.connect({
      protocol: "amqp",
      ...rabbitConfig
    });
    connection.on("close", (error) => {
      console.log("RabbitMQ连接已关闭,2s后准备重新连接", error);
      connection && connection.close();
      return setTimeout(() => connectRabbitmq(complate_callback), 2000);
    });
    console.log("RabbitMQ连接成功!");
    await complate_callback(connection);
  } catch (error) {
    console.log("RabbitMQ连接初始化发生错误,2s后准备重新连接", error);
    return setTimeout(() => connectRabbitmq(complate_callback), 2000);
  };
};

interface IPublishOption {
  exchange_name: string;
  router_name: string;
  queue_name: string;
};

export async function createPublishWithExchange(rabbitMQ: Connection, option: IPublishOption) {
  const { exchange_name, router_name, queue_name } = option;

  const Exchange_TTL = `${exchange_name}_TTL`;
  const Queue_TTL = `${queue_name}_TTL`;
  const RoutingKey_TTL = `${router_name}_TTL`;
  const Exchange_DLX = `${exchange_name}_DLX`;
  const Queue_DLX = `${queue_name}_DLX`;
  const RoutingKey_DLX = `${router_name}_DLX`;
  const channel = await rabbitMQ.createChannel();
  return async (message: any) => {

    await channel.assertExchange(Exchange_DLX, "direct", { durable: true, autoDelete: true });
    await channel.assertQueue(Queue_DLX, {
      durable: true,
      exclusive: false,
    });
    await channel.bindQueue(Queue_DLX, Exchange_DLX, RoutingKey_DLX);
    //创建消息队列
    await channel.assertExchange(Exchange_TTL, "direct", { durable: true, autoDelete: true, });
    await channel.assertQueue(Queue_TTL, {
      durable: true,
      deadLetterExchange: Exchange_DLX,
      deadLetterRoutingKey: RoutingKey_DLX
    });
    await channel.bindQueue(Queue_TTL, Exchange_TTL, RoutingKey_TTL);

    await channel.publish(Exchange_TTL, RoutingKey_TTL, Buffer.from(message), {
      deliveryMode: 2,
      persistent: true,
    });
  };
};

interface IListenerOption {
  exchange_name: string;
  router_name: string;
  queue_name: string;
};

export async function createListenerWithExchange(rabbitMQ: Connection, option: IListenerOption) {
  const { exchange_name, router_name, queue_name } = option;

  const Exchange_TTL = `${exchange_name}_TTL`;
  const Queue_TTL = `${queue_name}_TTL`;
  const RoutingKey_TTL = `${router_name}_TTL`;
  const Exchange_DLX = `${exchange_name}_DLX`;
  // const Queue_DLX = `${queue_name}_DLX`;
  const RoutingKey_DLX = `${router_name}_DLX`;

  const channel = await rabbitMQ.createChannel();

  await channel.assertExchange(Exchange_TTL, "direct", { durable: true, autoDelete: true });
  await channel.assertQueue(Queue_TTL, {
    durable: true,
    deadLetterExchange: Exchange_DLX,
    deadLetterRoutingKey: RoutingKey_DLX
  });
  await channel.bindQueue(Queue_TTL, Exchange_TTL, RoutingKey_TTL);

  async function consume_callback(callback: Function): Promise<void> {
    channel.consume(Queue_TTL, (message: any) => callback(message));
  };

  return { channel, consume_callback };
};