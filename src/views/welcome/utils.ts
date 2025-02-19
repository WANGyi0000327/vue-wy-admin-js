export { cloneDeep, randomGradient, useDark } from "@pureadmin/utils";
export { default as dayjs } from "dayjs";

export function getRandomIntBetween(min: number, max: number) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}
