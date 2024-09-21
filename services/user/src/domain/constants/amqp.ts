export const enum AMQP_ENTITY_TYPE {
  EXCHANGE = 'exchange',
  QUEUE = 'queue',
}

export const enum EXCHANGE_TYPE {
  HEADERS = 'headers',
  DIRECT = 'direct',
  FANOUT = 'fanout',
  TOPIC = 'topic',
  MATCH = 'match',
}
