import { Component, input } from "@angular/core";

@Component({
  selector: "shortcut-button",
  templateUrl: "./shortcut-button.html",
  styleUrls: ["./shortcut-button.scss"],
})
export class ShortcutButton {
  icon = input.required<string>();
  label = input.required<string>();
}