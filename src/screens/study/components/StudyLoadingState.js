/**
import { spacing } from "../../../themes/tokens";
 * StudyLoadingState — StudyScreen yüklenirken gösterilen skeleton.
 * Ayrı dosya (modülarite).
 */
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Skeleton, SkeletonFlipCard } from "../../../components/design/Skeleton";

export default function StudyLoadingState({ s }) {
  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1, padding: spacing.xl, gap: 18 }} edges={["top"]}>
        <View style={{ flexDirection: "row", justifyContent: "space-between" }}>
          <Skeleton width={40} height={40} radius={12} />
          <Skeleton width={50} height={20} radius={6} />
        </View>
        <Skeleton width="100%" height={6} radius={3} />
        <View style={{ flex: 1, justifyContent: "center" }}>
          <SkeletonFlipCard />
        </View>
        <View style={{ flexDirection: "row", justifyContent: "space-between", paddingHorizontal: spacing.sm }}>
          <Skeleton width={110} height={20} radius={6} />
          <Skeleton width={110} height={20} radius={6} />
        </View>
      </SafeAreaView>
    </View>
  );
}
