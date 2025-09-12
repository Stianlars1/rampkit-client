// Defines the shape of role mappings and functions to construct design tokens
// for the typography system.  A role represents a semantic typographic
// category such as `display`, `headline`, `title`, `body` or `label`.

export type RoleKey = "display" | "headline" | "title" | "body" | "label";

// A mapping from role names to the scale step names.  For example,
// `display: "3xl"` means that the display role uses the `3xl` step from
// the generated scale.  Users can customise this mapping.
export type RoleMap = Record<RoleKey, string>;

// Provide sensible defaults for the role mapping.  These follow the
// conventions used by Material 3 and Fluent (largest for display, smallest
// for label).
export const defaultRoleMap: RoleMap = {
  display: "3xl",
  headline: "2xl",
  title: "lg",
  body: "md",
  label: "sm",
};

// Given a fluid scale (an array of step names and their clamp strings), the
// font family and a root line height, construct a design tokens object in
// the W3C Design Tokens JSON format.  The returned object includes
// typography roles with their corresponding font sizes as clamp strings and
// includes the root line height and family information.
export function buildRoleMap({
  scale,
  family,
  rootLeading,
}: {
  scale: { steps: { name: string; clamp: string }[] };
  family: string;
  rootLeading: number;
}) {
  const stepRecord = Object.fromEntries(scale.steps.map((s) => [s.name, s.clamp]));
  const role = (name: string) => stepRecord[name] ?? stepRecord["md"];

  return {
    $schema: "https://design-tokens.github.io/schema.json",
    typography: {
      font: {
        family: {
          sans: { value: family, type: "fontFamily" },
        },
      },
      lineHeight: {
        root: { value: rootLeading, type: "lineHeight" },
      },
      roles: {
        display: { size: { value: role(defaultRoleMap.display), type: "fontSize" } },
        headline: { size: { value: role(defaultRoleMap.headline), type: "fontSize" } },
        title: { size: { value: role(defaultRoleMap.title), type: "fontSize" } },
        body: { size: { value: role(defaultRoleMap.body), type: "fontSize" } },
        label: { size: { value: role(defaultRoleMap.label), type: "fontSize" } },
      },
    },
  };
}