export type ViewType =
  | "sign_in"
  | "sign_up"
  | "forgotten_password"
  | "magic_link"
  | "update_password";

export type RedirectTo = undefined | string;

export interface ViewsMap {
  [key: string]: ViewType;
}
