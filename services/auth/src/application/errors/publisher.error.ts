export default class PublisherError extends Error {
  constructor(message: string) {
    super(message);
    this.name = 'PublisherError';
  }
}
