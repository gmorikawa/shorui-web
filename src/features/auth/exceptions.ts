import { BusinessException } from "@features/shared/exceptions";

export class MissingAuthTokenException extends BusinessException {
  constructor() {
    super("No auth token found.");
    this.name = "MissingAuthTokenException";
  }
}