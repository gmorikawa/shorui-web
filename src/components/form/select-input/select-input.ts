import { Component, computed, forwardRef, input, model, output, signal } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseInputDirective } from "@directives/base-input/base-input";

type FocusEventListener = (event: FocusEvent) => void;

@Component({
  selector: "sh-select-input",
  imports: [
    BaseInputDirective,
  ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SelectInput),
    multi: true,
  }],
  templateUrl: "./select-input.html",
  styleUrls: ["./select-input.scss"],
})
export class SelectInput<T = unknown> implements ControlValueAccessor {
  onChangeFn: any = () => {};
  onTouchedFn: any = () => {};

  value = model<string>("");
  readonly property = input<string>("")
  readonly label = input<string>("");
  readonly placeholder = input<string>("");
  readonly error = signal<boolean>(false);

  readonly options = input<T[]>([]);
  readonly optionValue = input.required<(option: T) => string>();
  readonly optionLabel = input.required<(option: T) => string>();

  readonly disabled = input<boolean>(false);
  readonly formDisabled = signal<boolean>(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  readonly blur = output<FocusEvent>();
  readonly focus = output<FocusEvent>();

  writeValue(newValue: string | null): void {
    this.value.set(newValue ?? "");
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

  protected handleChange(event: Event): void {
    const selectElement = event.target as HTMLSelectElement;
    this.value.set(selectElement.value);

    this.onChangeFn(selectElement.value);
    this.onTouchedFn();

    this.error.set(selectElement.value.trim() === '');
  }
}
