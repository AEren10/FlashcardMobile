/**
 * Icon — outline SVG ikonlar, design v2 spec.
 */
import React from "react";
import Svg, { Path } from "react-native-svg";

export const ICONS = {
  home: "M3 10.5 12 3l9 7.5M5 9.5V20a1 1 0 0 0 1 1h12a1 1 0 0 0 1-1V9.5",
  bolt: "M13 2 4 14h6l-1 8 9-12h-6l1-8Z",
  books: "M4 5a1 1 0 0 1 1-1h4v16H5a1 1 0 0 1-1-1V5Zm6-1h4a1 1 0 0 1 1 1v14a1 1 0 0 1-1 1h-4V4Z",
  user: "M12 12a4 4 0 1 0 0-8 4 4 0 0 0 0 8ZM4 21a8 8 0 0 1 16 0",
  sound: "M11 5 6 9H3v6h3l5 4V5Zm4 3a5 5 0 0 1 0 8m2.5-11a8 8 0 0 1 0 14",
  flame: "M12 3c1 3-2 4-2 7a3 3 0 0 0 6 0c0-1-.3-2-.8-2.7C16.5 9 18 11 18 14a6 6 0 1 1-12 0c0-4 4-6 6-11Z",
  arrow: "M5 12h14m-6-6 6 6-6 6",
  plus: "M12 5v14M5 12h14",
  check: "M5 13l4 4L19 7",
  x: "M6 6l12 12M18 6 6 18",
  star: "M12 3l2.6 5.6L21 9.3l-4.5 4.3 1.1 6.4L12 17l-5.6 3 1.1-6.4L3 9.3l6.4-.7L12 3Z",
  lightbulb: "M9 21h6m-3-3v3M12 3a6 6 0 0 0-4 10.5V17h8v-3.5A6 6 0 0 0 12 3Z",
  grid: "M4 4h6v6H4zM14 4h6v6h-6zM14 14h6v6h-6zM4 14h6v6H4z",
  target: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20Zm0 4a6 6 0 1 0 0 12 6 6 0 0 0 0-12Zm0 4a2 2 0 1 0 0 4 2 2 0 0 0 0-4Z",
  trophy: "M8 21h8m-4-4v4M6 4h12v5a6 6 0 0 1-12 0V4Zm-2 0h2m12 0h2",
  clock: "M12 6v6l4 2m-4 8a10 10 0 1 1 0-20 10 10 0 0 1 0 20Z",
  bookmark: "M6 4a2 2 0 0 1 2-2h8a2 2 0 0 1 2 2v18l-6-3.5L6 22V4Z",
  stamp: "M5 21h14M7 17h10M6 13h12a2 2 0 0 0 2-2V8a8 8 0 0 0-16 0v3a2 2 0 0 0 2 2Z",
  search: "M11 3a8 8 0 1 0 0 16 8 8 0 0 0 0-16Zm10 18-4.35-4.35",
  mail: "M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v12a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V6Zm0 0 9 6 9-6",
  lock: "M7 11V7a5 5 0 0 1 10 0v4m-9 0h8a2 2 0 0 1 2 2v6a2 2 0 0 1-2 2H8a2 2 0 0 1-2-2v-6a2 2 0 0 1 2-2Z",
  globe: "M12 2a10 10 0 1 0 0 20 10 10 0 0 0 0-20ZM2 12h20M12 2a15 15 0 0 1 4 10 15 15 0 0 1-4 10 15 15 0 0 1-4-10A15 15 0 0 1 12 2Z",
  sparkle: "M12 2l1.5 5.5L19 9l-5.5 1.5L12 16l-1.5-5.5L5 9l5.5-1.5L12 2Zm5 11l.8 2.2L20 16l-2.2.8L17 19l-.8-2.2L14 16l2.2-.8L17 13ZM6 14l.6 1.4L8 16l-1.4.6L6 18l-.6-1.4L4 16l1.4-.6L6 14Z",
  pencil: "M17 3a2.83 2.83 0 0 1 4 4L7.5 20.5 2 22l1.5-5.5L17 3Z",
  share: "M4 12v8a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2v-8M16 6l-4-4-4 4M12 2v13",
  briefcase: "M2 9a2 2 0 0 1 2-2h16a2 2 0 0 1 2 2v11a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V9ZM8 7V5a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2",
  plane: "M2 12l7-2V4.5a1.5 1.5 0 0 1 3 0V10l7 2v3l-7-2v4l2 1.5V21l-3.5-1L7 21v-2.5L9 17v-4l-7 2v-3Z",
  graduation: "M2 10l10-5 10 5-10 5-10-5Zm4 3v5l6 3 6-3v-5",
  laptop: "M3 6a2 2 0 0 1 2-2h14a2 2 0 0 1 2 2v9H3V6ZM2 17h20v1a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2v-1Z",
  food: "M3 3v18m0-12c0-3 2-6 5-6s5 3 5 6m-5 0v12m6-18v6a3 3 0 0 0 3 3h1V3m-1 18v-9",
  sun: "M12 5a7 7 0 1 0 0 14 7 7 0 0 0 0-14ZM12 1v2m0 18v2m11-11h-2M3 12H1m17.07-7.07-1.41 1.41M6.34 17.66l-1.41 1.41m0-14.14 1.41 1.41m11.32 11.32 1.41 1.41",
  palette: "M12 2a10 10 0 0 0 0 20c1.1 0 2-.9 2-2 0-.5-.2-1-.5-1.3-.3-.4-.5-.8-.5-1.3a2 2 0 0 1 2-2h2.4A5.6 5.6 0 0 0 22 10c0-4.4-4.5-8-10-8Zm-6 9a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3-4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm6 0a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Zm3 4a1.5 1.5 0 1 1 0-3 1.5 1.5 0 0 1 0 3Z",
  leaf: "M17 8C8 10 5.9 16.2 3.8 19.2M17 8c3.5-1 6 0 6 0s0 3-1.5 6c-2.2 4.3-8.5 6.8-18 6M17 8l-4 4",
  mountain: "M3 20h18L14.3 4.4a1 1 0 0 0-1.8 0l-3.2 6.4L7.4 8.2a1 1 0 0 0-1.6.2L3 20Z",
  crown: "M2 17l3-13 5 7 2-6 2 6 5-7 3 13H2Z",
  brain: "M12 2a5 5 0 0 0-4.4 2.6A4.5 4.5 0 0 0 3 9a4 4 0 0 0 .7 5.5A5 5 0 0 0 8 22h1V12m3-10a5 5 0 0 1 4.4 2.6A4.5 4.5 0 0 1 21 9a4 4 0 0 1-.7 5.5A5 5 0 0 1 16 22h-1V12",
  shield: "M12 2l8 4v5c0 5.5-3.8 10.7-8 12-4.2-1.3-8-6.5-8-12V6l8-4Z",
};

export default function Icon({ d, size = 24, stroke = "currentColor", fill = "none", sw = 1.8, style }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} style={style}>
      <Path d={d} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill={fill === "none" ? "none" : fill} />
    </Svg>
  );
}
