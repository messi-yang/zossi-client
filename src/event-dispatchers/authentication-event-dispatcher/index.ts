export class AuthenticationEventDispatcher {
  private window: Window;

  constructor() {
    this.window = global.window;
  }

  static new(): AuthenticationEventDispatcher {
    return new AuthenticationEventDispatcher();
  }

  public publishUnauthenticatedEvent() {
    this.window.dispatchEvent(new CustomEvent('UNAUTHENTICATED'));
  }

  public subscribeUnauthenticatedEvent(eventHandler: () => void): () => void {
    this.window.addEventListener('UNAUTHENTICATED', eventHandler);

    return () => {
      this.window.removeEventListener('UNAUTHENTICATED', eventHandler);
    };
  }
}
