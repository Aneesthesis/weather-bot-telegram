import * as jwt from 'jsonwebtoken';

const secretKey = '785678uit';

export function generateAuthToken(admin: any): string {
  const payload = {
    adminId: admin._id,
    email: admin.email,
  };

  const token = jwt.sign(payload, secretKey, { expiresIn: '3h' });

  return token;
}

export const decodeAuthToken = (token: string): any => {
  try {
    return jwt.verify(token, secretKey);
  } catch (error) {
    console.error('Error decoding token:', (error as Error).message);
    return null;
  }
};
