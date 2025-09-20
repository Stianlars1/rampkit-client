import { emitCSS } from "./emit/css";
import { emitSCSS } from "./emit/scss";
import { emitDTCG } from "./emit/dtcg";
import { emitReactModule } from "./emit/react";
import { emitReactStyles } from "./emit/reactStyles";
import { emitTailwindPlugin } from "./emit/tailwind";

export function buildExports({
  tokens,
  projectName,
  roleMap,
}: {
  tokens: any;
  projectName: string;
  roleMap?: Record<"display" | "headline" | "title" | "body" | "label", string>;
}) {
  const files: { path: string; contents: string }[] = [];
  const outputType = tokens.typography.outputType?.value || "static";

  files.push({
    path: `${projectName}/tokens/typography.tokens.json`,
    contents: emitDTCG(tokens),
  });

  files.push({
    path: `${projectName}/styles/typography.css`,
    contents: emitCSS({
      family: tokens.typography.font.family.sans.value,
      roles: {
        display: tokens.typography.roles.display,
        headline: tokens.typography.roles.headline,
        title: tokens.typography.roles.title,
        body: tokens.typography.roles.body,
        label: tokens.typography.roles.label,
      },
      roleMap: roleMap || {
        display: "display",
        headline: "headline",
        title: "title",
        body: "body",
        label: "label",
      },
      outputType,
    }),
  });

  files.push({
    path: `${projectName}/styles/typography.utilities.scss`,
    contents: emitSCSS(
      roleMap || {
        display: "display",
        headline: "headline",
        title: "title",
        body: "body",
        label: "label",
      },
      outputType,
    ),
  });

  files.push({
    path: `${projectName}/components/typography.tsx`,
    contents: emitReactModule(),
  });

  files.push({
    path: `${projectName}/components/typography.module.scss`,
    contents: emitReactStyles(),
  });

  files.push({
    path: `${projectName}/tailwind/typography.plugin.js`,
    contents: emitTailwindPlugin(),
  });

  return files;
}
