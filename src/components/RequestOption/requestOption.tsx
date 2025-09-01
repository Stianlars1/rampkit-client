import { GitHubLogoIcon } from "@radix-ui/react-icons";
import styles from "./requestOption.module.css";
import { useState } from "react";
import { EXPORT_FORMAT_GITHUB_ISSUES_URL } from "@/lib/utils/urls";
import { Button } from "@/components/ui/Button/Button";
import { cx } from "@/lib/utils/cx";

const RequestExportOption = () => {
  const handleGithubIssue = async () => {
    window.open(EXPORT_FORMAT_GITHUB_ISSUES_URL, "_blank");
  };

  const [isExpaned, setIsExpanded] = useState(false);
  const handleExpand = () => {
    setIsExpanded((prev) => !prev);
  };
  return (
    <div className={styles.container}>
      <Button
        className={styles.expandButton}
        variant={"link"}
        onClick={handleExpand}
      >
        Don&apos;t see your preferred format?
      </Button>
      {isExpaned && (
        <>
          <p>
            Request a new export format through our GitHub issues.
            <br />
            We&apos;re always looking to support more frameworks and tools.
          </p>
          <Button
            onClick={handleGithubIssue}
            variant="outline"
            className={cx(styles.openIssueButton)}
          >
            <GitHubLogoIcon />
            Request Export Format
          </Button>
        </>
      )}
    </div>
  );
};

export default RequestExportOption;
