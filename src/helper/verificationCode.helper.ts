import bcrypt from "bcryptjs";
import transporter from "../config/nodemailer.config";
import fs from "fs";
import path from "path";

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

export const sendEmailVerificationCode = async (
  email: string,
  code: string,
) => {
  const templatePath = path.join(
    __dirname,
    "../assets/emailTemplates/verificationCode.html",
  );
  let html = fs.readFileSync(templatePath, "utf-8");

  html = html.replace("{{CODE}}", code);

  await transporter.sendMail({
    from: "DocuScanIA <no-reply@docuscania.com>",
    to: email,
    subject: "Código para recuperar contraseña",
    html: html,
  });
};

//
