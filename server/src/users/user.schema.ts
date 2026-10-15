export enum UserRole {
  STUDENT = 'STUDENT',
  ALUMNI = 'ALUMNI',
}

export enum VerificationStatus {
  PENDING = 'PENDING',
  VERIFIED = 'VERIFIED',
  REJECTED = 'REJECTED',
}

export type UserDocument = {
  id: string;
  _id?: string;
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  verificationStatus: VerificationStatus;
  createdAt?: Date;
  updatedAt?: Date;
};
