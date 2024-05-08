export type EventHandlerSubscriber<T> = (payload: T) => void;
export class EventHandler<T> {
  private subscribers: EventHandlerSubscriber<T>[] = [];

  static create<T>() {
    return new EventHandler<T>();
  }

  public publish(payload: T) {
    this.subscribers.forEach((sub) => {
      sub(payload);
    });
  }

  public subscribe(handler: EventHandlerSubscriber<T>): () => void {
    this.subscribers.push(handler);

    return () => {
      this.subscribers = this.subscribers.filter((sub) => sub !== handler);
    };
  }
}
