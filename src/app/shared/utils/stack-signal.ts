import { signal, type Signal } from '@angular/core';

export interface Stack<T> {
  readonly value: Signal<readonly T[]>;

  push(item: T): void;
  pop(): T | undefined;
  peek(): T | undefined;
  clear(): void;
  length(): number;
}

export function stackSignal<T>(initial: readonly T[] = []): Stack<T> {
  const stack = signal<T[]>([...initial]);

  return {
    value: stack.asReadonly(),

    push(item: T): void {
      stack.update(items => [...items, item]);
    },

    pop(): T | undefined {
      const item = stack().at(-1);

      if (item !== undefined) {
        stack.update(items => items.slice(0, -1));
      }

      return item;
    },

    peek(): T | undefined {
      return stack().at(-1);
    },

    clear(): void {
      stack.set([]);
    },

    length(): number {
      return stack().length;
    },
  };
}
