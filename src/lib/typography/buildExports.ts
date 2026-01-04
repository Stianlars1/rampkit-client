// src/lib/typography/buildExports.ts
import { emitCSS } from "./emit/css";
import { emitSCSS } from "./emit/scss";
import { emitReactModule } from "./emit/react";
import { emitReactStyles } from "./emit/reactStyles";
import { emitDTCG } from "./emit/dtcg";
import { emitTailwindPlugin } from "./emit/tailwind";
import { RoleMap } from "./types";
import { emitLESS } from "@/lib/typography/emit/less";

type FileOut = { path: string; contents: string };

export function buildExports(opts: {
  tokens: any;
  projectName: string;
  roleMap: RoleMap;
}): FileOut[] {
  const { tokens, projectName, roleMap } = opts;

  const outputType = tokens?.typography?.outputType?.value ?? "static";

  const css = emitCSS({ tokens, roleMap, projectName });
  const scss = emitSCSS(roleMap, outputType);
  const less = emitLESS(roleMap, outputType);
  const reactModule = emitReactModule();
  const reactStyles = emitReactStyles();
  const dtcg = emitDTCG(tokens);
  const tailwind = emitTailwindPlugin();

  return [
    { path: `${projectName}/typography.css`, contents: css },
    { path: `${projectName}/typography.scss`, contents: scss },
    { path: `${projectName}/typography.less`, contents: less },
    { path: `${projectName}/typography.module.scss`, contents: reactStyles },
    { path: `${projectName}/typography.react.tsx`, contents: reactModule },
    { path: `${projectName}/tailwind.plugin.js`, contents: tailwind },
    { path: `${projectName}/tokens.dtcg.json`, contents: dtcg },
  ];
}
