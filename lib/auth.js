import { findUserByCredentials } from "@/data/users";

// Dummy authentication: validates against the predictable mock user list only.

export function login(email, password) {
  const user = findUserByCredentials(email, password);
  if (!user) {
    return { success: false, error: "Invalid email or password." };
  }
  if (user.isBlocked) {
    return { success: false, error: "This account has been blocked." };
  }
  return { success: true, user };
}
