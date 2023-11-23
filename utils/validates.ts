import { z, type ZodIssue } from "../deps.ts";
import { PASSWORD_KEY, USERNAME_KEY } from "./consts.ts";

interface LuciaPluginTextValidateResultSuccess {
  success: true;
  errors: string[];
  data: string;
}

interface LuciaPluginTextValidateResultFailure {
  success: false;
  errors: string[];
}

type LuciaPluginTextValidateResult =
  | LuciaPluginTextValidateResultSuccess
  | LuciaPluginTextValidateResultFailure;

export type LuciaPluginUsernameValidate = (
  username: string,
) => LuciaPluginTextValidateResult;
export type LuciaPluginPasswordValidate = (
  username: string,
) => LuciaPluginTextValidateResult;

const usernameCreateSchema = z
  .coerce
  .string()
  .trim()
  .min(8)
  .max(32)
  .regex(/[0-9]+/)
  .regex(/[a-z]+/)
  .regex(/^[a-z0-9]+/);

const passwordCreateSchema = z
  .coerce
  .string()
  .trim()
  .min(18)
  .max(48)
  .regex(/[0-9]+/)
  .regex(/[a-z]+/)
  .regex(/[A-Z]+/)
  .regex(/[!\";:#$%&&'\(\)=~|]+/)
  .regex(/^[a-zA-Z0-9!\";:#$%&'\(\)=~|]+/);

const usernameValidSchema = z
  .coerce
  .string()
  .trim();

const passwordValidSchema = z
  .coerce
  .string()
  .trim();

export function usernameCreateValidate(
  username: string | undefined | null,
): LuciaPluginTextValidateResult {
  const result = usernameCreateSchema.safeParse(username);

  if (result.success) {
    return { success: true, errors: [], data: result.data };
  }
  return {
    success: result.success,
    errors: result.error.issues.map((i: ZodIssue) =>
      `[${USERNAME_KEY}] ${i.message}`
    ),
  };
}
export function passwordCreateValidate(
  password: string | undefined | null,
): LuciaPluginTextValidateResult {
  const result = passwordCreateSchema.safeParse(password);

  if (result.success) {
    return { success: true, errors: [], data: result.data };
  }
  return {
    success: result.success,
    errors: result.error.issues.map((i: ZodIssue) =>
      `[${PASSWORD_KEY}] ${i.message}`
    ),
  };
}

export function usernameValidate(
  username: string | undefined | null,
): LuciaPluginTextValidateResult {
  const result = usernameValidSchema.safeParse(username);

  if (result.success) {
    return { success: true, errors: [], data: result.data };
  }
  return {
    success: result.success,
    errors: result.error.issues.map((i: ZodIssue) =>
      `[${USERNAME_KEY}] ${i.message}`
    ),
  };
}
export function passwordValidate(
  password: string | undefined | null,
): LuciaPluginTextValidateResult {
  const result = passwordValidSchema.safeParse(password);

  if (result.success) {
    return { success: true, errors: [], data: result.data };
  }
  return {
    success: result.success,
    errors: result.error.issues.map((i: ZodIssue) =>
      `[${PASSWORD_KEY}] ${i.message}`
    ),
  };
}
