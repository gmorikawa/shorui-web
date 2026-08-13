import { Component, input } from "@angular/core";

@Component({
  selector: "sh-tile-button",
  templateUrl: "./tile-button.html",
  styleUrls: ["./tile-button.scss"],
})
export class TileButton {
  label = input.required<string>();
}