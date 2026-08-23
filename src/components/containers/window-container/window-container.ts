import { Component, input } from "@angular/core";
import { CardContainer } from "../card-container/card-container";

@Component({
  selector: "window-container",
  imports: [
    CardContainer,
  ],
  templateUrl: "./window-container.html",
  styleUrls: ["./window-container.scss"],
})
export class WindowContainer {
  readonly title = input<string>();
}