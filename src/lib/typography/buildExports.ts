// Builds a ZIP payload using the emitters above, keeping your classic React+SCSS pairing.

import {
  emitCSS,
  emitReactModule,
  emitReactStyles,
  emitDTCG,
  RoleMap,
} from "./exporters";

type FileOut = { path: string; contents: string };

export function buildExports(opts: {
  tokens: any;
  projectName: string;
  roleMap: RoleMap;
}): FileOut[] {
  const { tokens, projectName, roleMap } = opts;

  const css = emitCSS({ tokens, roleMap, projectName });
  const reactModule = emitReactModule();
  const reactStyles = emitReactStyles();
  const dtcg = emitDTCG(tokens);

  return [
    { path: `${projectName}/typography.css`, contents: css },
    { path: `${projectName}/typography.module.scss`, contents: reactStyles },
    { path: `${projectName}/typography.react.tsx`, contents: reactModule },
    { path: `${projectName}/tokens.dtcg.json`, contents: dtcg },
  ];
}
