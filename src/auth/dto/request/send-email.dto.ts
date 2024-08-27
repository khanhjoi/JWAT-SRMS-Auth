export class SendMailDTO {
  email: string;
  subject?: string;
  notificationMessage?: string;
  template?: string;
  userName?: string;
  resetPasswordUrl?: string;
}

export class SendEmail {
  constructor(
    public readonly email: string,
    public readonly subject?: string,
    public readonly notificationMessage?: string,
    public readonly userName?: string,
    public readonly resetPasswordUrl?: string,
  ) {}
  toString() {
    return JSON.stringify({
      email: this.email,
      subject: this.subject,
      notificationMessage: this.notificationMessage,
      userName: this.userName,
      resetPasswordUrl: this.resetPasswordUrl,
    });
  }
}
