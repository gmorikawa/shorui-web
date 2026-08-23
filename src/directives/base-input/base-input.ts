import { Directive, HostBinding } from "@angular/core";

@Directive({
  selector: "input[base-input], select[base-input]",
  standalone: true,
})
export class BaseInputDirective {
  @HostBinding("class.base-input")
  protected readonly baseInputClass = true;
}