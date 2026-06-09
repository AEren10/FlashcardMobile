import { radius } from "../../themes/tokens";
import React from "react";
import { View, Text, Pressable, StyleSheet } from "react-native";
import T from "../themes/tokens";
import Icon, { ICONS } from "./design/Icon";

export default class ErrorBoundary extends React.Component {
  state = { error: null };

  static getDerivedStateFromError(error) {
    return { error };
  }

  componentDidCatch(error, info) {
    console.error("[ErrorBoundary]", error, info?.componentStack);
  }

  reset = () => this.setState({ error: null });

  render() {
    if (!this.state.error) return this.props.children;
    return (
      <View style={s.wrap}>
        <View style={s.emoji}><Icon d={ICONS.shield} size={56} stroke="#CF7B68" sw={1.5} /></View>
        <Text style={s.title}>Bir şeyler ters gitti</Text>
        <Text style={s.msg} numberOfLines={4}>
          {String(this.state.error?.message ?? this.state.error)}
        </Text>
        <Pressable style={s.btn} onPress={this.reset}>
          <Text style={s.btnText}>Tekrar dene</Text>
        </Pressable>
      </View>
    );
  }
}

// ErrorBoundary class component, useTheme kullanamaz — dark token'ları statik kullan.
const s = StyleSheet.create({
  wrap: { flex: 1, alignItems: "center", justifyContent: "center", padding: 24, backgroundColor: T.bgBase },
  emoji: { marginBottom: 12, alignItems: "center" },
  title: { fontSize: 20, fontFamily: T.fontBodyBold, marginBottom: 8, color: T.textPrimary },
  msg: { fontSize: 14, fontFamily: T.fontBody, color: T.textSec, textAlign: "center", marginBottom: 20 },
  btn: {
    backgroundColor: T.accent,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: radius.sm,
  },
  btnText: { color: T.textOnAccent, fontFamily: T.fontBodyBold, fontSize: 15 },
});
