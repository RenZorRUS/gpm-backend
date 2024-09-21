export interface IEmailVerificationMessage {
  readonly activationTokenExpiration: Date;
  readonly activationToken: string;
  readonly firstName: string;
  readonly lastName: string;
  readonly userId: number;
  readonly email: string;
}
