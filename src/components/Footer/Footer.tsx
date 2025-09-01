import styles from "./Footer.module.scss";
import { GithubIcon, RadixIcon } from "@/lib/icons/icons";
import { GITHUB_SOURCE_URL, RADIX_UI_URL, STIAN_URL } from "@/lib/utils/urls";
import { Button } from "@/components/ui/Button/Button";
import Image from "next/image";

export const Footer = () => {
  return (
    <>
      <footer className={styles.footer}>
        <div className={styles.left}>
          <p>
            <Image
              src={"/icon0.svg"}
              alt={"Logo"}
              width={32}
              height={32}
              className={styles.brandLogo}
            />
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
            href={RADIX_UI_URL}
            title={"Radix Colors"}
            aria-label={"Radix Colors"}
          >
            <RadixIcon />
          </Button>
          <Button
            variant={"outline"}
            size={"icon"}
            as={"link"}
            href={GITHUB_SOURCE_URL}
            title={"Source code on GitHub"}
            aria-label={"Source code on GitHub"}
          >
            <GithubIcon />
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
            />
          </Button>
        </div>
      </footer>
    </>
  );
};
