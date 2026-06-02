/**
 * OfflineBanner — internet kesilince üstte slide-down bant.
 * NetInfo subscription, useNativeDriver transform.
 */
import React, { useEffect, useRef, useState } from "react";
import { Animated, Text, StyleSheet, View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import NetInfo from "@react-native-community/netinfo";
import { useTheme } from "../../contexts/ThemeContext";

export default function OfflineBanner() {
  const { c } = useTheme();
  const [offline, setOffline] = useState(false);
  const slide = useRef(new Animated.Value(-100)).current;

  useEffect(() => {
    const unsub = NetInfo.addEventListener((state) => {
      const isOffline = !state.isConnected || state.isInternetReachable === false;
      setOffline(isOffline);
    });
    return unsub;
  }, []);

  useEffect(() => {
    Animated.spring(slide, {
      toValue: offline ? 0 : -100,
      useNativeDriver: true,
      stiffness: 220,
      damping: 22,
    }).start();
  }, [offline, slide]);

  return (
    <Animated.View
      pointerEvents="none"
      style={[
        s.wrap,
        {
          transform: [{ translateY: slide }],
        },
      ]}
    >
      <SafeAreaView edges={["top"]} style={{ backgroundColor: c.warning }}>
        <View style={s.bar}>
          <Text style={s.dot}>●</Text>
          <Text style={[s.txt, { fontFamily: c.fontBodyBold }]}>
            Çevrimdışısın · değişiklikler senkronize olacak
          </Text>
        </View>
      </SafeAreaView>
    </Animated.View>
  );
}

const s = StyleSheet.create({
  wrap: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    zIndex: 9999,
  },
  bar: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
    paddingVertical: 8,
    paddingHorizontal: 16,
  },
  dot: { color: "#0B0D14", fontSize: 10 },
  txt: { color: "#0B0D14", fontSize: 12, letterSpacing: 0.3 },
});
