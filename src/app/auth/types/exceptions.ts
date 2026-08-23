import { BusinessException } from "@app/shared/types/exceptions";

export class MissingAuthTokenException extends BusinessException {
  constructor() {
    super("No auth token found.");
    this.name = "MissingAuthTokenException";
  }
}