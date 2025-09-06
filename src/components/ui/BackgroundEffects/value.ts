import type { IndexTotalType, ValueExpr } from "./types";

export function resolve<T>(value: ValueExpr<T>, ctx: IndexTotalType): T {
  return typeof value === "function" ? (value as any)(ctx) : value;
}
