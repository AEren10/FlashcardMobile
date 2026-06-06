/**
 * QuizLoadingState — QuizScreen yüklenirken skeleton.
 * Ayrı dosya (modülarite).
 */
import React from "react";
import { View } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { Skeleton } from "../../../components/design/Skeleton";

export default function QuizLoadingState({ s }) {
  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1, padding: 20, gap: 18 }}>
        <View style={{ flexDirection: "row", justifyContent: "space-between", alignItems: "center", gap: 12 }}>
          <Skeleton width={36} height={36} radius={12} />
          <View style={{ flex: 1 }}>
            <Skeleton width="100%" height={6} radius={3} />
          </View>
          <Skeleton width={40} height={16} radius={6} />
        </View>
        <View style={{ alignItems: "center", marginTop: 30, gap: 18 }}>
          <Skeleton width={150} height={26} radius={999} />
          <Skeleton width="60%" height={52} radius={10} />
        </View>
        <View style={{ flex: 1, justifyContent: "center", flexDirection: "row", flexWrap: "wrap", gap: 12 }}>
          {[0, 1, 2, 3].map((i) => (
            <Skeleton key={i} width="47%" height={72} radius={16} />
          ))}
        </View>
      </SafeAreaView>
    </View>
  );
}
