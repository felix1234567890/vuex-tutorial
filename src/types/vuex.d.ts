// Global Vuex type declarations
declare module 'vuex' {
  export interface Store<S> {
    state: S;
    getters: any;
    dispatch: (action: string, payload?: any) => Promise<any>;
    commit: (mutation: string, payload?: any, options?: { root?: boolean }) => void;
  }

  export interface Dispatch {
    (action: string, payload?: any): Promise<any>;
  }

  export interface Commit {
    (mutation: string, payload?: any, options?: { root?: boolean }): void;
  }

  export function createStore<S>(options: any): Store<S>;
  export function useStore<S>(): Store<S>;
}

export {};
