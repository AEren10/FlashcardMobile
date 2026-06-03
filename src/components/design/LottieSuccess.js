import React, { useEffect, useRef } from "react";
import { View } from "react-native";
import LottieView from "lottie-react-native";

import successAnim from "../../assets/lottie/success.json";

export default function LottieSuccess({ size = 80, autoPlay = true, onFinish }) {
  const ref = useRef(null);

  useEffect(() => {
    if (autoPlay && ref.current) {
      ref.current.play();
    }
  }, [autoPlay]);

  return (
    <View style={{ width: size, height: size, alignItems: "center", justifyContent: "center" }}>
      <LottieView
        ref={ref}
        source={successAnim}
        autoPlay={autoPlay}
        loop={false}
        speed={1.2}
        onAnimationFinish={onFinish}
        style={{ width: size, height: size }}
      />
    </View>
  );
}
