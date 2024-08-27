import { Inject, Injectable } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { SendEmail, SendMailDTO } from './dto/request/send-email.dto';

@Injectable()
export class NotificationClient {
  constructor(
    @Inject('NOTIFICATION_SERVICE')
    private readonly notificationService: ClientKafka,
  ) {}

  sendWelcomeMail(data: SendMailDTO) {
    this.notificationService.emit(
      'send_welcome',
      new SendEmail(
        data.email,
        data.subject,
        data.notificationMessage,
        data.userName,
        data.resetPasswordUrl,
      ),
    );
  }

  sendForgotMail(data: SendMailDTO) {
    this.notificationService.emit(
      'send_forgot_password',
      new SendEmail(
        data.email,
        data.subject,
        data.notificationMessage,
        data.userName,
        data.resetPasswordUrl,
      ),
    );
  }

  sendResetPasswordSuccess(data: SendMailDTO) {
    this.notificationService.emit(
      'send_reset_success',
      new SendEmail(
        data.email,
        data.subject,
        data.notificationMessage,
        data.userName,
        data.resetPasswordUrl,
      ),
    );
  }
}
