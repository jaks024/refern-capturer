export interface User {
  _id: string;
  email: string;
  username: string;
  at: string;
  photoUrl: string;

  storageUsage: number;
  storageLimit: number;

  capturerAccessCode: string;

  createdAt: string;
  updatedAt: string;
}
