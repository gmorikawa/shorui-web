import { Component, computed, ElementRef, forwardRef, input, model, signal, viewChild } from "@angular/core";
import { ControlValueAccessor, NG_VALUE_ACCESSOR } from "@angular/forms";
import { BaseInputDirective } from "@directives/base-input/base-input";
import type { Binary } from "@app/file/types/override";

@Component({
  selector: "sh-file-input",
  imports: [
    BaseInputDirective,
  ],
  providers: [{
    provide: NG_VALUE_ACCESSOR,
    useExisting: forwardRef(() => FileInput),
    multi: true,
  }],
  templateUrl: "./file-input.html",
  styleUrl: "./file-input.scss",
})
export class FileInput implements ControlValueAccessor {
  onChangeFn: any = () => {};
  onTouchedFn: any = () => {};

  private readonly inputElement = viewChild.required<ElementRef<HTMLInputElement>>("input");

  value = model<Binary | Binary[] | null>(null);
  readonly property = input<string>("")
  readonly label = input<string>("");
  readonly placeholder = input<string>("");
  readonly error = signal<boolean>(false);

  readonly accept = input<string>("");
  readonly multiple = input<boolean>(false);

  readonly disabled = input<boolean>(false);
  readonly formDisabled = signal<boolean>(false);
  readonly isDisabled = computed(() => this.disabled() || this.formDisabled());

  writeValue(newValue: Binary | Binary[] | null): void {
    this.value.set(newValue ?? null);

    if (!newValue) {
      this.inputElement().nativeElement.value = "";
    }
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
    const files = Array.from(inputElement.files ?? []);
    const newValue = this.multiple() ? files : (files[0] ?? null);
    this.value.set(newValue);

    this.onChangeFn(newValue);
    this.onTouchedFn();

    this.error.set(files.length === 0);
  }
}
