export {};

declare global {
  interface Window {
    sa_event?: (event: string) => void;
  }
}
