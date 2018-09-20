export class MessageHandler {
  infos: string[] = [];
  warnings: string[] = [];
  errors: string[] = [];

  constructor(){}

  private formatMessage(level, msg) {
    return level.toUpperCase() + ': ' + msg;
  }

  addError(msg) {
    this.errors.unshift(this.formatMessage('error', msg));
  }

  addErrors(msgs) {
    for(let msg of msgs) {
      this.addError(msg);
    }
  }

  addWarning(msg) {
    this.warnings.unshift(this.formatMessage('warning', msg));
  }

  addWarnings(msgs) {
    for(let msg of msgs) {
      this.addWarning(msg);
    }
  }

  addInfo(msg) {
    this.infos.unshift(this.formatMessage('info', msg));
  }

  addInfos(msgs) {
    for(let msg of msgs) {
      this.addInfo(msg);
    }
  }

  clear() {
    this.clearInfos();
    this.clearWarnings();
    this.clearErrors();
  }

  clearInfos() {
    this.infos = [];
  }

  clearWarnings() {
    this.warnings = [];
  }

  clearErrors() {
    this.errors = []
  }
}
