import { cacheLife } from "next/cache";

export const getCopyrightYear = async () => {
  "use cache";
  cacheLife("days");

  return new Date().getFullYear();
};
