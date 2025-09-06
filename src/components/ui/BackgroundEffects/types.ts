export type IndexTotalType = {
  index: number;
  total: number;
};

export type ValueExpr<T = unknown> = T | ((ctx: IndexTotalType) => T);

export type AnimationSide = Record<string, ValueExpr>;

export type AnimationPreset = {
  id: string;
  label: string;
  // Height for each step. Return number (px) or CSS string (e.g. "22vh").
  height: ValueExpr<string | number>;
  from: AnimationSide;
  to: AnimationSide & {
    // duration/ease/delay can be expressions too
    duration?: ValueExpr<number>;
    ease?: ValueExpr<string>;
    delay?: ValueExpr<number>;
  };
};
