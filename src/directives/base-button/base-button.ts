import { Directive, HostBinding, input } from "@angular/core";

type ButtonType = "button" | "submit" | "reset";

@Directive({
  selector: "button[base-button]",
  standalone: true,
})
export class BaseButtonDirective {
  public type = input<ButtonType>("button");
  public disabled = input<boolean>(false);

  @HostBinding("class.base-button")
  protected readonly baseButtonClass = true;

  @HostBinding("attr.type")
  protected get buttonType(): ButtonType {
    return this.type();
  }

  @HostBinding("disabled")
  protected get isDisabled(): boolean {
    return this.disabled();
  }
}