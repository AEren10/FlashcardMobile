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
};

export default function Icon({ d, size = 24, stroke = "currentColor", fill = "none", sw = 1.8, style }) {
  return (
    <Svg width={size} height={size} viewBox="0 0 24 24" fill={fill} style={style}>
      <Path d={d} stroke={stroke} strokeWidth={sw} strokeLinecap="round" strokeLinejoin="round" fill={fill === "none" ? "none" : fill} />
    </Svg>
  );
}
