export interface LoginConfig {
  title?: string;
  subtitle?: string;
  loginButtonLabel?: string;
  successCallback?: () => void;
}

export const DEFAULT_LOGIN_CONFIG = {
  title: 'Bienvenido de nuevo',
  subtitle: 'Inicia sesión con tu cuenta',
  loginButtonLabel: 'Acceder',
};
