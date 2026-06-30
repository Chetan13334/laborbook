export type StoreListener = () => void;

export class ObservableStore {
  private listeners = new Set<StoreListener>();

  subscribe = (listener: StoreListener) => {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  };

  protected emitChange() {
    for (const listener of this.listeners) {
      listener();
    }
  }
}
