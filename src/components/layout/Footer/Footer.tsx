import styles from "./Footer.module.scss";
import { GithubIcon, RadixIcon, RampkitIcon } from "@/lib/icons/icons";
import {
  COLORPALETTE_URL,
  GITHUB_SOURCE_URL,
  RADIX_UI_URL,
  RAMPKIT_URL,
  STIAN_URL,
} from "@/lib/utils/urls";
import { Button } from "@/components/ui/Button/Button";
import Image from "next/image";
import { cx } from "@/lib/utils/cx";
import Link from "next/link";
import layoutStyles from "./../../../app/layout.module.scss";

export const Footer = () => {
  return (
    <div className={cx(styles.wrapper, layoutStyles.footer)}>
      <footer className={styles.footer}>
        <div className={styles.left}>
          <p>
            <Link href={RAMPKIT_URL} className={styles.brandLink}>
              <Image
                src={"/logo/round/rampkit_round.svg"}
                alt={"Logo"}
                width={32}
                height={32}
                className={styles.brandLogo}
              />
            </Link>
            Built with ♥ by Rampkit{" "}
          </p>

          <small>
            © {new Date().getFullYear()} Rampkit. All rights reserved.
          </small>
        </div>

        <div className={styles.right}>
          <Button
            variant={"outline"}
            size={"icon"}
            as={"link"}
            href={COLORPALETTE_URL}
            title={"ColorPalette.dev"}
            aria-label={"ColorPalette dot dev"}
            className={cx(styles.v1, styles.icon)}
          >
            v1
          </Button>
          <Button
            variant={"outline"}
            size={"icon"}
            as={"link"}
            href={RADIX_UI_URL}
            title={"Radix Colors"}
            aria-label={"Radix Colors"}
          >
            <RadixIcon className={styles.icon} />
          </Button>
          <Button
            variant={"outline"}
            size={"icon"}
            as={"link"}
            href={GITHUB_SOURCE_URL}
            title={"Source code on GitHub"}
            aria-label={"Source code on GitHub"}
          >
            <GithubIcon className={styles.icon} />
          </Button>
          <Button
            variant={"outline"}
            size={"icon"}
            as={"link"}
            href={STIAN_URL}
            title={"Stian, the creator"}
            aria-label={"Stian, the creator"}
          >
            <Image
              src={"/bitmoji.png"}
              alt={"Stian, the creator"}
              width={32}
              height={32}
              className={styles.icon}
            />
          </Button>
        </div>
      </footer>
    </div>
  );
};
