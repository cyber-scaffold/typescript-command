import { injectable } from "inversify";
import { IPublishOption, RabbitmqProducer } from "@/commons/RabbitMQ/RabbitmqAbstract";


/** 有推送数量限制的队列的生产者类(派生类) **/
export class LimitedRabbitmqProducer extends RabbitmqProducer {

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