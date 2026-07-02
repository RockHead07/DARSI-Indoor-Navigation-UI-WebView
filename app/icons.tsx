// ponytail: inline SVG paths, shared across screens — no icon dependency for ~13 glyphs
export const icons = {
  search: "M21 21l-4.35-4.35M11 19a8 8 0 100-16 8 8 0 000 16z",
  pin: "M12 21s7-5.686 7-11a7 7 0 10-14 0c0 5.314 7 11 7 11z M12 10a1 1 0 100-2 1 1 0 000 2z",
  map: "M9 4l6 2 5-2v14l-5 2-6-2-5 2V6l5-2z M9 4v14 M15 6v14",
  flask: "M9 3h6 M10 3v6l-4 8a2 2 0 001.8 3h8.4a2 2 0 001.8-3l-4-8V3 M7 15h10",
  eye: "M2 12s3.5-7 10-7 10 7 10 7-3.5 7-10 7-10-7-10-7z M12 15a3 3 0 100-6 3 3 0 000 6z",
  scan: "M4 7V5a1 1 0 011-1h2 M17 4h2a1 1 0 011 1v2 M20 17v2a1 1 0 01-1 1h-2 M7 20H5a1 1 0 01-1-1v-2 M4 12h16",
  camera:
    "M4 8a2 2 0 012-2h1l1.5-2h7L18 6h1a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V8z M12 16a3.5 3.5 0 100-7 3.5 3.5 0 000 7z",
  x: "M6 6l12 12 M18 6L6 18",
  heart: "M12 20s-7-4.35-7-9.5A4.5 4.5 0 0112 6a4.5 4.5 0 017 4.5c0 5.15-7 9.5-7 9.5z",
  activity: "M3 12h4l3 8 4-16 3 8h4",
  navigation: "M12 2l7 19-7-4-7 4 7-19z",
  sliders: "M4 6h16 M14 4v4 M4 12h16 M8 10v4 M4 18h16 M17 16v4",
  clock: "M12 21a9 9 0 100-18 9 9 0 000 18z M12 7v5l3 2",
  bell: "M18 9a6 6 0 10-12 0c0 6-2.5 8-2.5 8h17S18 15 18 9z M10.5 20a2 2 0 003 0",
  pill: "M10.5 4.5l-6 6a4.24 4.24 0 106 6l6-6a4.24 4.24 0 10-6-6z M8 7l6 6",
  stethoscope:
    "M6 3H4v5a4 4 0 008 0V3h-2 M9 15v1a4 4 0 008 0v-3 M17 12a1.6 1.6 0 100 .1z",
} as const;

export type IconName = keyof typeof icons;

export function Icon({
  name,
  className = "",
  size = 18,
}: {
  name: IconName;
  className?: string;
  size?: number;
}) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth={1.8}
      strokeLinecap="round"
      strokeLinejoin="round"
      className={className}
      aria-hidden
    >
      <path d={icons[name]} />
    </svg>
  );
}
