import { Component, computed, forwardRef, input, model, signal } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseInputDirective } from "@directives/base-input/base-input";

@Component({
  selector: "sh-password-input",
  imports: [
    BaseInputDirective,
  ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => PasswordInput),
    multi: true,
  }],
  templateUrl: "./password-input.html",
  styleUrl: "./password-input.scss",
})
export class PasswordInput implements ControlValueAccessor {
  onChangeFn: any = () => {};
  onTouchedFn: any = () => {};

  value = model<string>("");
  readonly property = input<string>("")
  readonly label = input<string>("");
  readonly placeholder = input<string>("");
  readonly error = signal<boolean>(false);

  readonly disabled = input<boolean>(false);
  readonly formDisabled = signal<boolean>(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  writeValue(value: string | null): void {
    this.value.apply(value ?? '');
  }

  registerOnChange(handler: any): void {
    this.onChangeFn = handler;
  }

  registerOnTouched(handler: any): void {
    this.onTouchedFn = handler;
  }

  setDisabledState(disabled: boolean): void {
    this.disabled.apply(disabled);
  }

  protected handleChange(event: Event): void {
    const inputElement = event.target as HTMLInputElement
    this.value.set(inputElement.value);

    this.onChangeFn(inputElement.value);
    this.onTouchedFn();

    this.error.set(inputElement.value.trim() === '');
  }
}
