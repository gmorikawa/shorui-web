import { Component, input } from "@angular/core";

export interface BreadcrumbItem {
  label: string;
  onClick?: () => void;
  url?: string;
}

@Component({
  selector: "breadcrumb-navigator",
  templateUrl: "./breadcrumb-navigator.html",
  styleUrls: ["./breadcrumb-navigator.scss"],
})
export class BreadcrumbNavigator {
  readonly items = input<BreadcrumbItem[]>([]);
}
