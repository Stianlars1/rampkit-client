export const RampkitLogo = ({
  className,
  widthAndHeight = 200,
}: {
  className?: string;
  widthAndHeight?: number;
}) => (
  <svg
    width={widthAndHeight}
    height={widthAndHeight}
    viewBox="0 0 3160 3160"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path d="M0 942.944C0 166.43 166.43 0 942.944 0H2217.06C2993.57 0 3160 166.43 3160 942.944V2217.06C3160 2993.57 2993.57 3160 2217.06 3160H942.944C166.43 3160 0 2993.57 0 2217.06V942.944Z" />
    <rect x="1284" y="2182" width="543" height="543" rx="32" />
    <rect x="2207" y="1319" width="530" height="529" rx="32" />
  </svg>
);
