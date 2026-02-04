import bcrypt from "bcryptjs";

export const generateOTP = (): string => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

export const hashOTP = (otp: string) => {
  const salts = bcrypt.genSaltSync(10);
  const hash = bcrypt.hashSync(otp, salts);
  return hash;
};

export const verifyOTP = (otp: string, hashedOTP: string): boolean => {
  return bcrypt.compareSync(otp, hashedOTP);
};
