import { Component, computed, forwardRef, input, model, signal } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseInputDirective } from "@directives/base-input/base-input";

type CheckboxOptions = {
  value: boolean;
  property: string;
};

@Component({
  selector: "sh-switch-input",
  imports: [
    BaseInputDirective,
  ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => SwitchInput),
    multi: true,
  }],
  templateUrl: "./switch-input.html",
  styleUrls: ["./switch-input.scss"],
})
export class SwitchInput implements ControlValueAccessor {
  onChangeFn: any = () => {};
  onTouchedFn: any = () => {};

  value = model<boolean>(false);
  readonly property = input<string>("")
  readonly label = input<string>("");
  readonly placeholder = input<string>("");
  readonly error = signal<boolean>(false);

  readonly disabled = input<boolean>(false);
  readonly formDisabled = signal<boolean>(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  writeValue(newValue: boolean | null): void {
    this.value.set(newValue ?? false);
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
    const inputElement = event.target as HTMLInputElement;
    const checked = inputElement.checked;
    this.value.set(checked);

    this.onChangeFn(checked);
    this.onTouchedFn();

    this.error.set(!checked);
  }
}