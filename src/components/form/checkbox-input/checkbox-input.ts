import { Component, computed, forwardRef, input, model, signal } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseInputDirective } from "@directives/base-input/base-input";

@Component({
  selector: "sh-checkbox-input",
  imports: [
    BaseInputDirective,
  ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => CheckboxInput),
    multi: true,
  }],
  templateUrl: "./checkbox-input.html",
  styleUrls: ["./checkbox-input.scss"],
})
export class CheckboxInput<T = unknown> implements ControlValueAccessor {
  onChangeFn: any = () => {};
  onTouchedFn: any = () => {};

  value = model<unknown[]>([]);
  readonly property = input<string>("")
  readonly label = input<string>("");
  readonly error = signal<boolean>(false);

  readonly options = input<T[]>([]);
  readonly getKey = input.required<(option: T) => unknown>();
  readonly getLabel = input.required<(option: T) => string>();

  readonly disabled = input<boolean>(false);
  readonly formDisabled = signal<boolean>(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  writeValue(newValue: unknown[] | null): void {
    this.value.set(newValue ?? []);
  }

  registerOnChange(fn: any): void {
    this.onChangeFn = fn;
  }

  registerOnTouched(handler: any): void {
    this.onTouchedFn = handler;
  }

  setDisabledState(disabled: boolean): void {
    this.formDisabled.set(disabled);
  }

  protected isChecked(option: T): boolean {
    return this.value().includes(this.getKey()(option));
  }

  protected handleChange(option: T, event: Event): void {
    const inputElement = event.target as HTMLInputElement;
    const checked = inputElement.checked;
    const key = this.getKey()(option);

    const updated = checked
      ? [...this.value(), key]
      : this.value().filter((value) => value !== key);

    this.value.set(updated);

    this.onChangeFn(updated);
    this.onTouchedFn();

    this.error.set(updated.length === 0);
  }
}

