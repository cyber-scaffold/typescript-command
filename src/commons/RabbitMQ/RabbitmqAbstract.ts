import { red, green } from "colors";
import amqp, { Connection } from "amqplib";
import { injectable, inject } from "inversify";

import { ApplicationConfigManager } from "@/commons/Application/ApplicationConfigManager";
import { logger } from "@/utils/logger";

export interface IPublishOption {
  exchangeName: string;
  routerName: string;
  queueName: string;
};

/** Rabbitmq生产者的抽象基础类 **/
@injectable()
export abstract class RabbitmqProducer {

  public channel: any;

  protected Exchange_TTL: string;

  protected Queue_TTL: string;

  protected RoutingKey_TTL: string;

  protected Exchange_DLX: string;

  protected Queue_DLX: string;

  protected RoutingKey_DLX: string;

  /** 创建Rabbitmq之后的连接 **/
  protected connection: Connection;

  constructor(
    @inject(ApplicationConfigManager) private readonly applicationConfigManager: ApplicationConfigManager
  ) { };

  /** 消息队列初始化 **/
  public async initialize(options: IPublishOption) {
    try {
      const { exchangeName, routerName, queueName } = options;
      this.Exchange_TTL = `${exchangeName}_TTL`;
      this.Queue_TTL = `${queueName}_TTL`;
      this.RoutingKey_TTL = `${routerName}_TTL`;
      this.Exchange_DLX = `${exchangeName}_DLX`;
      this.Queue_DLX = `${queueName}_DLX`;
      this.RoutingKey_DLX = `${routerName}_DLX`;
      const { rabbitmq } = this.applicationConfigManager.getRuntimeConfig();
      const rabbitConfig = {
        hostname: rabbitmq.host,
        port: rabbitmq.port,
        username: rabbitmq.username,
        password: rabbitmq.password
      };
      this.connection = await amqp.connect({
        protocol: "amqp",
        ...rabbitConfig
      });
      logger.info(green("RabbitMQ-生产者-连接成功!"));
      /** 处理断线重连 **/
      this.connection.on("close", (error) => {
        logger.error("RabbitMQ连接已关闭,2s后准备重新连接", error);
        return setTimeout(this.initialize, 2000);
      });
    } catch (error) {
      logger.error(red("RabbitMQ连接初始化发生错误,2s后准备重新连接"), error);
      return setTimeout(this.initialize, 2000);
    };
  };

  /** 销毁连接,用于单元测试 **/
  public async destroy() {
    await this.connection.close();
    console.log("RabbitMQ 已断开连接!!!");
  };

  /** 断言交换机模式的频道(如果频道不存在的话就会创建) **/
  public abstract createQueueWithExchange(): Promise<Boolean>;

  /** 将消息发布到交换机上 **/
  public abstract publishWithExchange(message: any): Promise<Boolean>;

};


export interface IListenerOption {
  exchangeName: string;
  routerName: string;
  queueName: string;
};

/** Rabbitmq消费者者的抽象基础类 **/
@injectable()
export abstract class RabbitmqConsumer {

  public channel: any;

  protected Exchange_TTL: string;

  protected Queue_TTL: string;

  protected RoutingKey_TTL: string;

  protected Exchange_DLX: string;

  protected RoutingKey_DLX: string;

  /** 创建Rabbitmq之后的连接 **/
  protected connection: Connection;

  constructor(
    @inject(ApplicationConfigManager) private readonly applicationConfigManager: ApplicationConfigManager
  ) { };

  /** 消息队列初始化 **/
  public async initialize(options: IPublishOption) {
    try {
      const { exchangeName, routerName, queueName } = options;
      this.Exchange_TTL = `${exchangeName}_TTL`;
      this.Queue_TTL = `${queueName}_TTL`;
      this.RoutingKey_TTL = `${routerName}_TTL`;
      this.Exchange_DLX = `${exchangeName}_DLX`;
      this.RoutingKey_DLX = `${routerName}_DLX`;
      const { rabbitmq } = this.applicationConfigManager.getRuntimeConfig();
      const rabbitConfig = {
        hostname: rabbitmq.host,
        port: rabbitmq.port,
        username: rabbitmq.username,
        password: rabbitmq.password
      };
      this.connection = await amqp.connect({
        protocol: "amqp",
        ...rabbitConfig
      });
      logger.info(green("RabbitMQ-消费者-连接成功!"));
      /** 处理断线重连 **/
      this.connection.on("close", (error) => {
        logger.error(red(`RabbitMQ连接已关闭,2s后准备重新连接 ${error}`));
        return setTimeout(this.initialize, 2000);
      });
    } catch (error) {
      logger.error(red(`RabbitMQ连接初始化发生错误,2s后准备重新连接 ${error}`));
      return setTimeout(this.initialize, 2000);
    };
  };

  /** 销毁连接,用于单元测试 **/
  public async destroy() {
    await this.connection.close();
    console.log("RabbitMQ 已断开连接!!!");
  };

  /** 断言频道(如果频道不存在的话就会创建) **/
  public abstract createChannelWithExchange(): Promise<Boolean>;

  /** 增加一个消费者监听 **/
  public abstract addListener(callback): Promise<Boolean>;

};