import { emitCSS } from "./emit/css";
import { emitSCSS } from "./emit/scss";
import { emitDTCG } from "./emit/dtcg";
import { emitReactModule } from "./emit/react";
import { emitReactStyles } from "./emit/reactStyles";
import { emitTailwindPlugin } from "./emit/tailwind";

// Assembles a list of files to export for the generated typography system.
// The returned array can be passed to the export helper to build a ZIP.  The
// structure of the paths mirrors typical project organisation: tokens live
// under `tokens/`, styles under `styles/`, components under `components/` and
// optional Tailwind plugin under `tailwind/`.
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

  // Provide the Tailwind plugin as a snippet.  It is optional and left
  // commented in the export.  Users can copy it into their project if they
  // prefer Tailwind utilities.
  files.push({
    path: `${projectName}/tailwind/typography.plugin.js`,
    contents: emitTailwindPlugin(),
  });

  return files;
}
