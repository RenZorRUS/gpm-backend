import type { ICryptoService } from 'src/application/services/crypto.service';
import { randomBytes } from 'crypto';
import {
  hash as hashPasswordAsync,
  compare as comparePasswordAsync,
} from 'bcrypt';

export default class CryptoService implements ICryptoService {
  private static readonly saltRounds = 10;

  public generateVerificationToken(randomBytesSize = 32): string {
    return randomBytes(randomBytesSize).toString('hex');
  }

  public async hashPassword(password: string): Promise<string> {
    return hashPasswordAsync(password, CryptoService.saltRounds);
  }

  public async verifyPassword(
    password: string,
    hash: string,
  ): Promise<boolean> {
    return comparePasswordAsync(password, hash);
  }
}
