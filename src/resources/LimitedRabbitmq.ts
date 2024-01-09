import { IRabbitMQConfig, IPublishOption, IListenerOption, RabbitmqProducer, RabbitmqConsumer } from "@/resources/RabbitmqAbstract";


/** 有推送数量限制的队列的生产者类(派生类) **/
export class LimitedRabbitmqProducer extends RabbitmqProducer {

  constructor(config: IRabbitMQConfig, options: IPublishOption) {
    super(config, options);
  };

  /** 创建一个并行队列 **/
  public async createQueueWithExchange() {
    this.channel = await this.connection.createChannel();
    await this.channel.assertExchange(this.Exchange_DLX, "direct", { durable: true, autoDelete: true });
    await this.channel.assertQueue(this.Queue_DLX, {
      durable: true,
      exclusive: false,
    });
    await this.channel.bindQueue(this.Queue_DLX, this.Exchange_DLX, this.RoutingKey_DLX);
    //创建消息队列
    await this.channel.assertExchange(this.Exchange_TTL, "direct", { durable: true, autoDelete: true, });
    await this.channel.assertQueue(this.Queue_TTL, {
      durable: true,
      deadLetterExchange: this.Exchange_DLX,
      deadLetterRoutingKey: this.RoutingKey_DLX
    });
    await this.channel.bindQueue(this.Queue_TTL, this.Exchange_TTL, this.RoutingKey_TTL);
    return true;
  };

  /** 创建一个并行队列 **/
  public async publishWithExchange(message: any) {
    await this.channel.publish(this.Exchange_TTL, this.RoutingKey_TTL, Buffer.from(message), {
      deliveryMode: 2,
      persistent: true,
    });
    return true;
  };

};

/** 有推送数量限制的消费者类(派生类) **/
export class LimitedRabbitmqConsumer extends RabbitmqConsumer {

  constructor(config: IRabbitMQConfig, options: IPublishOption) {
    super(config, options);
  };

  /** 创建或加入一个频道 **/
  public async createChannelWithExchange() {
    this.channel = await this.connection.createChannel();
    /** 生成频道的时候是使用交换机模式 **/
    await this.channel.assertExchange(this.Exchange_TTL, "direct", { durable: true, autoDelete: true });
    await this.channel.assertQueue(this.Queue_TTL, {
      durable: true,
      deadLetterExchange: this.Exchange_DLX,
      deadLetterRoutingKey: this.RoutingKey_DLX
    });
    /** 消费端限流,每次取有限个进行消费 **/
    await this.channel.prefetch(20);
    await this.channel.qos(20);
    await this.channel.bindQueue(this.Queue_TTL, this.Exchange_TTL, this.RoutingKey_TTL);
    return true;
  };

  /** 增加一个监听器 **/
  public async addListener(callback) {
    this.channel.consume(this.Queue_TTL, (message: any) => callback(message, this.channel), { noAck: false });
    return true;
  };
};