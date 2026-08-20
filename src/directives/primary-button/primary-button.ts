import { Directive, HostBinding, input } from "@angular/core";

type ButtonType = "button" | "submit" | "reset";

@Directive({
  selector: "button[primary-button]",
  standalone: true,
})
export class PrimaryButtonDirective {
  public type = input<ButtonType>("button");
  public disabled = input<boolean>(false);

  @HostBinding("class.primary-button")
  protected readonly primaryButtonClass = true;

  @HostBinding("attr.type")
  protected get buttonType(): ButtonType {
    return this.type();
  }

  @HostBinding("disabled")
  protected get isDisabled(): boolean {
    return this.disabled();
  }
}