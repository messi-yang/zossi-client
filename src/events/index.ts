import { EventType } from './event-type';
import type { ApiUnauthorizedEvent, ApiErrorredEvent } from './api-event';

type Event = ApiUnauthorizedEvent | ApiErrorredEvent;

const eventFactory = {
  newApiUnauthorizedEvent: (): ApiUnauthorizedEvent => ({
    type: 'API_UNAUTHORIZED',
  }),
};

export class EventMediator {
  private window: Window;

  constructor() {
    this.window = global.window;
  }

  static new(): EventMediator {
    return new EventMediator();
  }

  public publish(event: Event) {
    this.window.dispatchEvent(new CustomEvent(event.type, { detail: event }));
  }

  public subscribe<T extends Event>(eventType: EventType, eventHandler: (event: T) => void): () => void {
    const handler = (event: globalThis.Event) => {
      const customEvent = event as CustomEvent;
      eventHandler(customEvent.detail);
    };
    this.window.addEventListener(eventType, handler);

    return () => {
      this.window.removeEventListener(eventType, handler);
    };
  }
}

export { EventType, eventFactory };
export type { ApiUnauthorizedEvent, ApiErrorredEvent };
