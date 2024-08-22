import { IsNotEmpty, IsString, IsStrongPassword } from "class-validator";

export class ResetPasswordReqDTO {
  
  @IsNotEmpty()
  @IsStrongPassword()
  newPassword: string;
}