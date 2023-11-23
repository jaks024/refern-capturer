import { createContext } from 'react';
import { User } from './types';

export interface UserContextType {
  user: User | undefined;
  signOut: () => void;
}

export const UserContext = createContext<UserContextType>({
  user: undefined,
  signOut: () => {},
});
