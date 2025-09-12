export type User = {
  name: string;
  email: string;
};

export type AuthContext = {
  user: User | null;
  token: string | null;
  login: () => void;
  logout: () => void;
};
