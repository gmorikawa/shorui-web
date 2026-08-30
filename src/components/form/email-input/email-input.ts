import { Component, computed, forwardRef, input, model, output, signal } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseInputDirective } from "@directives/base-input/base-input";

type FocusEventListener = (event: FocusEvent) => void;

@Component({
  selector: "sh-email-input",
  imports: [
    BaseInputDirective,
  ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => EmailInput),
    multi: true,
  }],
  templateUrl: "./email-input.html",
  styleUrls: ["./email-input.scss"],
})
export class EmailInput implements ControlValueAccessor {
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
    const inputElement = event.target as HTMLInputElement
    this.value.set(inputElement.value);

    this.onChangeFn(inputElement.value);
    this.onTouchedFn();

    this.error.set(inputElement.value.trim() === '');
  }
}