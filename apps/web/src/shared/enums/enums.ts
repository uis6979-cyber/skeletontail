export const GENDER = {
  male: "male",
  female: "female",
} as const;

export type Gender = keyof typeof GENDER;

export const LANGUAGE = {
  es: "es",
  en: "en",
} as const;

export type Language = keyof typeof LANGUAGE;