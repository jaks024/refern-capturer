import { useContext } from 'react';
import { UserContext } from '../UserContext';

export const useUser = () => {
  const { user, signOut } = useContext(UserContext);
  return {
    user,
    signOut,
  };
};
