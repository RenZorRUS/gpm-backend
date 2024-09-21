export interface ICryptoService {
  hashPassword(password: string): Promise<string>;
  verifyPassword(password: string, hash: string): Promise<boolean>;
  generateVerificationToken(randomBytesSize?: number): string;
}
