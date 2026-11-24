export class ReauthenticationRequiredError extends Error {
  constructor() {
    super('reauthentication_required')
    this.name = 'ReauthenticationRequiredError'
  }
}
