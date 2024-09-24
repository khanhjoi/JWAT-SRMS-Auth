import {
  AuthServiceController,
  AuthServiceControllerMethods,
  GetInfoUserByIdRequest,
  GetInfoUserByEmailRequest,
  GetInfoUserResponse,
} from '@khanhjoi/protos';
import { Controller } from '@nestjs/common';
import { Observable } from 'rxjs';
import { UserService } from 'src/user/user.service';

@Controller()
@AuthServiceControllerMethods()
export class AuthGrpcController implements AuthServiceController {
  constructor(private userService: UserService) {}

  getInfoById(
    request: GetInfoUserByIdRequest,
  ):
    | Promise<GetInfoUserResponse>
    | Observable<GetInfoUserResponse>
    | GetInfoUserResponse {
    const user = this.userService.findUserById(request.userId);

    return user;
  }

  getInfoByEmail(
    request: GetInfoUserByEmailRequest,
  ):
    | Promise<GetInfoUserResponse>
    | Observable<GetInfoUserResponse>
    | GetInfoUserResponse {
    const user = this.userService.findUserByEmail(request.email);
    return user;
  }
}
