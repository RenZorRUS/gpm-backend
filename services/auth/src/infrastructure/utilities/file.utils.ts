import { access as accessFileAsync, constants } from 'fs/promises';
import InternalServerError from 'src/application/errors/internal.server.error';

export const checkIsFileReadableAsync = async (
  filePath: string,
): Promise<void> => {
  try {
    await accessFileAsync(filePath, constants.R_OK);
  } catch {
    throw new InternalServerError(
      `File: ${filePath} is not readable or exists.`,
    );
  }
};
