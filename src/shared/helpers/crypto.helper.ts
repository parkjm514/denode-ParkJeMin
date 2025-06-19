import * as bcrypt from 'bcryptjs';

export const bcryptHash = async function (string: string): Promise<string> {
  const salt = await bcrypt.genSalt();
  const hashedString = await bcrypt.hash(string, salt);

  return hashedString;
};

export const bcryptCompare = async function (
  string: string,
  bcryptHashedString: string,
): Promise<boolean> {
  return bcrypt.compare(string, bcryptHashedString);
};
