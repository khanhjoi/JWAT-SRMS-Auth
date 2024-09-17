import { Inject, Injectable, OnModuleInit } from '@nestjs/common';
import { ClientKafka } from '@nestjs/microservices';
import { SendEmail, SendMailDTO } from './dto/request/send-email.dto';

// connect kafka first
// @Injectable()
// export class NotificationClient implements OnModuleInit {
//   constructor(
//     @Inject('NOTIFICATION_SERVICE')
//     private readonly notificationService: ClientKafka,
//   ) {}

//   async onModuleInit() {
//     const requestPatterns = ['send_welcome', 'send_forgot_password', 'send_reset_success'];
//     requestPatterns.forEach(pattern => this.notificationService.subscribeToResponseOf(pattern));
//     await this.notificationService.connect();
//   }

//   sendWelcomeMail(data: SendMailDTO) {
//     return this.notificationService.emit(
//       'send_welcome',
//       new SendEmail(
//         data.email,
//         data.subject,
//         data.notificationMessage,
//         data.userName,
//         data.resetPasswordUrl,
//       ),
//     );
//   }

//   sendForgotMail(data: SendMailDTO) {
//     return this.notificationService.emit(
//       'send_forgot_password',
//       new SendEmail(
//         data.email,
//         data.subject,
//         data.notificationMessage,
//         data.userName,
//         data.resetPasswordUrl,
//       ),
//     );
//   }

//   sendResetPasswordSuccess(data: SendMailDTO) {
//     return this.notificationService.emit(
//       'send_reset_success',
//       new SendEmail(
//         data.email,
//         data.subject,
//         data.notificationMessage,
//         data.userName,
//         data.resetPasswordUrl,
//       ),
//     );
//   }
// }

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
