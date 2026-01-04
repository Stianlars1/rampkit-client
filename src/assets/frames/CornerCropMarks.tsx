export const CornerCropMarks = ({ className }: { className?: string }) => {
  return (
    <svg
      viewBox="0 0 1362 462"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      <path
        d="M1 61V1H61"
        stroke="white"
        strokeOpacity="0.25"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M1361 61V1H1301"
        stroke="white"
        strokeOpacity="0.25"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M1 401V461H61"
        stroke="white"
        strokeOpacity="0.25"
        strokeWidth="2"
        strokeLinecap="round"
      />
      <path
        d="M1361 401V461H1301"
        stroke="white"
        strokeOpacity="0.25"
        strokeWidth="2"
        strokeLinecap="round"
      />
    </svg>
  );
};
