import { User } from "../types/types";
import api from "./client";
export interface Credentials {
  email: string;
  password: string;
}
export async function loginApi(creds: Credentials): Promise<string> {
  const { data } = await api.post<{ token: string }>("/auth/login", creds);
  return data.token;
}

export async function fetchMe(): Promise<User> {
  const { data } = await api.get<User>("/auth/me");
  return data;
}

export async function forgotPasswordApi(email: string): Promise<void> {
  await api.post("/auth/forgot-password", { email });
}

export async function resetPasswordApi(
  token: string,
  password: string
): Promise<void> {
  await api.post("/auth/reset-password", { token, password });
}

export async function hasUsersApi(): Promise<boolean> {
  const { data } = await api.get<{ exists: boolean }>("/auth/has-users");
  return data.exists;
}

export async function createFirstUserApi({
  name,
  email,
  password,
}: {
  name: string;
  email: string;
  password: string;
}): Promise<void> {
  await api.post("/auth/create-first-user", { name, email, password });
}
