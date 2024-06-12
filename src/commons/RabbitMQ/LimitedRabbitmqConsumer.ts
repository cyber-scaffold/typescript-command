import { injectable } from "inversify";
import { IListenerOption, RabbitmqConsumer } from "@/commons/RabbitMQ/RabbitmqAbstract";


/** 有推送数量限制的消费者类(派生类) **/
export class LimitedRabbitmqConsumer extends RabbitmqConsumer {

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