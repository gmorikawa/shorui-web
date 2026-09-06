import { Component, input } from "@angular/core";

export type AlertBoxType = 'success' | 'error' | 'warning';

@Component({
  selector: "alert-box",
  templateUrl: "./alert-box.html",
  styleUrls: ["./alert-box.scss"],
  host: {
    '[class.is-hidden]': '!show()',
    '[class.is-visible]': 'show()',
    '[class.is-success]': "type() === 'success'",
    '[class.is-error]': "type() === 'error'",
    '[class.is-warning]': "type() === 'warning'",
  },
})
export class AlertBox {
  public show = input<boolean>(false);
  public type = input<AlertBoxType>('error');
  public message = input<string>('');
}
