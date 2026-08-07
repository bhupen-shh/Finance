export const USERNAME = "admin";

export const PASSWORD = "admin123";

export function login(username: string, password: string) {

  return username === USERNAME && password === PASSWORD;
}