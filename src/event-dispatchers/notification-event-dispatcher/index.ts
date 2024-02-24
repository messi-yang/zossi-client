export class NotificationEventDispatcher {
  constructor(private window: Window) {}

  static new(): NotificationEventDispatcher {
    return new NotificationEventDispatcher(global.window);
  }

  public publishErrorTriggeredEvent(message: string) {
    this.window.dispatchEvent(new CustomEvent('ERROR_TRIGGERED', { detail: { message } }));
  }

  public subscribeErrorTriggeredEvent(eventHandler: (message: string) => void): () => void {
    const eventHandlerCb = (event: globalThis.Event) => {
      if (event instanceof CustomEvent) {
        eventHandler(event.detail.message);
      }
    };

    this.window.addEventListener('ERROR_TRIGGERED', eventHandlerCb);

    return () => {
      this.window.removeEventListener('ERROR_TRIGGERED', eventHandlerCb);
    };
  }
}
