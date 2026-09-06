import { Service, signal } from "@angular/core";
import { AlertBoxType } from "@components/feedback/alert-box/alert-box";

@Service()
export class FeedbackService {
  private readonly showTimeout: number | undefined = 5000;
  public readonly message = signal<string>('');
  public readonly type = signal<AlertBoxType>('success');
  public readonly show = signal<boolean>(false);

  showSuccessMessage(message: string): void {
    this.showMessage(message, 'success');
  }

  showErrorMessage(message: string): void {
    this.showMessage(message, 'error');
  }

  showWarningMessage(message: string): void {
    this.showMessage(message, 'warning');
  }

  private showMessage(message: string, type: 'success' | 'error' | 'warning'): void {
    this.message.set(message);
    this.type.set(type);
    this.show.set(true);

    setTimeout(() => {
      this.show.set(false);
    }, this.showTimeout);
  }
}
