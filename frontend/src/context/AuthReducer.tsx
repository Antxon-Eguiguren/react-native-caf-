import {User} from '../interfaces/User';

export interface AuthState {
  user: User | null;
  token: string | null;
  status: 'checking' | 'authenticated' | 'not-authenticated';
  loginError: string | null;
  signUpError: string | null;
}

type AuthAction =
  | {type: 'login'; payload: {token: string; user: User}}
  | {type: 'signup'; payload: {token: string; user: User}}
  | {type: 'logout'}
  | {type: 'addLoginError'; payload: string}
  | {type: 'addSignUpError'; payload: string}
  | {type: 'removeErrors'}
  | {type: 'notAuthenticated'};

export const AuthReducer = (
  state: AuthState,
  action: AuthAction,
): AuthState => {
  switch (action.type) {
    case 'login':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        status: 'authenticated',
        loginError: null,
        signUpError: null,
      };

    case 'signup':
      return {
        ...state,
        user: action.payload.user,
        token: action.payload.token,
        status: 'authenticated',
        loginError: null,
        signUpError: null,
      };

    case 'addLoginError':
      return {
        ...state,
        user: null,
        token: null,
        status: 'not-authenticated',
        loginError: action.payload,
        signUpError: null,
      };

    case 'addSignUpError':
      return {
        ...state,
        user: null,
        token: null,
        status: 'not-authenticated',
        loginError: null,
        signUpError: action.payload,
      };

    case 'removeErrors':
      return {
        ...state,
        loginError: null,
        signUpError: null,
      };

    case 'notAuthenticated':
    case 'logout':
      return {
        ...state,
        user: null,
        token: null,
        status: 'not-authenticated',
      };

    default:
      return state;
  }
};
