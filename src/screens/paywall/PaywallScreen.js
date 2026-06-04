/**
 * PaywallScreen — Pro upgrade ekranı.
 *
 * 3 paket: Aylık / Yıllık (önerilen) / Lifetime
 * Stub mode'da göstermelik fiyatlar — gerçek purchase için RevenueCat key gerekir.
 *
 * Features listesi free vs pro karşılaştırması yapar.
 */
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  Pressable,
  ScrollView,
  ActivityIndicator,
  Alert,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { LinearGradient } from "expo-linear-gradient";
import * as Haptics from "expo-haptics";
import { useTheme } from "../../contexts/ThemeContext";
import { usePremium } from "../../contexts/PremiumContext";
import { getOfferings, purchase, restore } from "../../lib/purchases";
import Icon, { ICONS } from "../../components/design/Icon";
import PressableScale from "../../components/design/PressableScale";

const FEATURES = [
  { icon: ICONS.plus, text: "Sınırsız liste ve kelime" },
  { icon: ICONS.target, text: "Premium YDS / YÖKDİL / IELTS setleri" },
  { icon: ICONS.sound, text: "Telaffuz değerlendirme (gelecek)" },
  { icon: ICONS.brain, text: "AI sohbet ile pratik (gelecek)" },
  { icon: ICONS.clock, text: "Özel hatırlatıcı saatleri" },
  { icon: ICONS.palette, text: "Tema ve simge kişiselleştirme" },
  { icon: ICONS.shield, text: "Reklamsız deneyim" },
];

export default function PaywallScreen({ navigation, route }) {
  const { c } = useTheme();
  const { refresh, isStub } = usePremium();
  const source = route?.params?.source || "unknown";
  const [offerings, setOfferings] = useState(null);
  const [loading, setLoading] = useState(true);
  const [selected, setSelected] = useState("yearly");
  const [purchasing, setPurchasing] = useState(false);

  useEffect(() => {
    getOfferings()
      .then((o) => {
        setOfferings(o);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const handlePurchase = async () => {
    if (purchasing) return;
    Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
    const pkg = offerings?.[selected];
    if (!pkg) {
      Alert.alert("Hata", "Paket bulunamadı.");
      return;
    }
    if (isStub) {
      Alert.alert(
        "Test modu",
        "Henüz RevenueCat anahtarı yapılandırılmamış. .env'e EXPO_PUBLIC_RC_IOS_KEY / EXPO_PUBLIC_RC_ANDROID_KEY ekleyin."
      );
      return;
    }
    setPurchasing(true);
    const r = await purchase(pkg);
    setPurchasing(false);
    if (r.cancelled) return;
    if (r.success) {
      Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
      await refresh();
      Alert.alert("🎉 Pro aktif!", "Tüm özellikler açıldı. Teşekkürler!");
      navigation.goBack();
    } else {
      Alert.alert("Satın alma başarısız", r.error || "Lütfen tekrar dene.");
    }
  };

  const handleRestore = async () => {
    Haptics.selectionAsync();
    const r = await restore();
    if (r.success) {
      await refresh();
      Alert.alert("Geri yüklendi", "Pro statün aktif.");
      navigation.goBack();
    } else {
      Alert.alert("Önceki satın alma yok", r.error || "Cihazında geri yüklenecek bir abonelik bulunamadı.");
    }
  };

  const PackOption = ({ keyName, title, priceString, sub, badge }) => {
    const active = selected === keyName;
    return (
      <PressableScale
        onPress={() => {
          Haptics.selectionAsync();
          setSelected(keyName);
        }}
        scaleDown={0.98}
        style={[
          s.pack,
          {
            borderColor: active ? c.accent : c.border,
            backgroundColor: c.bgElevated,
          },
        ]}
      >
        {active && (
          <LinearGradient
            colors={[c.accentGlow, "transparent"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1, y: 1 }}
            style={StyleSheet.absoluteFill}
          />
        )}
        {badge && (
          <View style={[s.badge, { backgroundColor: c.accent }]}>
            <Text style={[s.badgeTxt, { color: c.textOnAccent, fontFamily: c.fontBodyBold }]}>
              {badge}
            </Text>
          </View>
        )}
        <View style={s.packLeft}>
          <View
            style={[
              s.radio,
              {
                borderColor: active ? c.accent : c.border,
                backgroundColor: active ? c.accent : "transparent",
              },
            ]}
          >
            {active && <View style={[s.radioInner, { backgroundColor: c.textOnAccent }]} />}
          </View>
          <View>
            <Text style={[s.packTitle, { color: c.textPrimary, fontFamily: c.fontBodyBold }]}>
              {title}
            </Text>
            {sub && (
              <Text style={[s.packSub, { color: c.textSec, fontFamily: c.fontBody }]}>
                {sub}
              </Text>
            )}
          </View>
        </View>
        <Text style={[s.packPrice, { color: c.textPrimary, fontFamily: c.fontNum }]}>
          {priceString}
        </Text>
      </PressableScale>
    );
  };

  const monthly = offerings?.monthly;
  const yearly = offerings?.yearly;
  const lifetime = offerings?.lifetime;

  return (
    <View style={[s.root, { backgroundColor: c.bgBase }]}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={s.header}>
          <Pressable onPress={() => navigation.goBack()} hitSlop={12} style={[s.close, { backgroundColor: c.bgSurface }]}>
            <Icon d={ICONS.x} size={18} stroke={c.textPrimary} sw={2.2} />
          </Pressable>
          <Pressable onPress={handleRestore} hitSlop={12}>
            <Text style={[s.restore, { color: c.textSec, fontFamily: c.fontBodySemi }]}>
              Geri Yükle
            </Text>
          </Pressable>
        </View>

        <ScrollView contentContainerStyle={{ paddingBottom: 32 }} showsVerticalScrollIndicator={false}>
          {/* Hero */}
          <View style={s.hero}>
            <View style={[s.crown, { backgroundColor: c.accentGlow, borderColor: c.borderAccent }]}>
              <Icon d={ICONS.crown} size={36} stroke={c.accent} fill={c.accentGlow} sw={1.5} />
            </View>
            <Text style={[s.title, { color: c.textPrimary, fontFamily: c.fontDisplay }]}>
              FlashcardMobile Pro
            </Text>
            <Text style={[s.subtitle, { color: c.textSec, fontFamily: c.fontBody }]}>
              Daha hızlı öğren, sınırsız çalış, reklamsız deneyim.
            </Text>
          </View>

          {/* Features */}
          <View style={s.features}>
            {FEATURES.map((f, i) => (
              <View key={i} style={s.feature}>
                <View style={[s.featureIcon, { backgroundColor: c.accentGlow, borderColor: c.borderAccent }]}>
                  <Icon d={f.icon} size={14} stroke={c.accent} sw={1.8} />
                </View>
                <Text style={[s.featureText, { color: c.textPrimary, fontFamily: c.fontBody }]}>
                  {f.text}
                </Text>
              </View>
            ))}
          </View>

          {/* Packages */}
          {loading ? (
            <ActivityIndicator color={c.accent} style={{ marginTop: 30 }} />
          ) : (
            <View style={s.packs}>
              <PackOption
                keyName="yearly"
                title="Yıllık"
                priceString={yearly?.product?.priceString || yearly?.priceString || "449 ₺"}
                sub="~37 ₺/ay · %58 indirim"
                badge="EN POPÜLER"
              />
              <PackOption
                keyName="monthly"
                title="Aylık"
                priceString={monthly?.product?.priceString || monthly?.priceString || "89 ₺"}
                sub="İstediğinde iptal et"
              />
              <PackOption
                keyName="lifetime"
                title="Yaşam boyu"
                priceString={lifetime?.product?.priceString || lifetime?.priceString || "1.499 ₺"}
                sub="Tek seferlik ödeme"
              />
            </View>
          )}

          {/* CTA */}
          <Pressable
            onPress={handlePurchase}
            disabled={purchasing || loading}
            style={({ pressed }) => [
              s.cta,
              {
                backgroundColor: c.accent,
                shadowColor: c.accent,
                opacity: pressed || purchasing ? 0.85 : 1,
              },
            ]}
          >
            {purchasing ? (
              <ActivityIndicator color={c.textOnAccent} />
            ) : (
              <Text style={[s.ctaText, { color: c.textOnAccent, fontFamily: c.fontBodyBold }]}>
                Pro'ya Geç
              </Text>
            )}
          </Pressable>

          <Text style={[s.legal, { color: c.textMuted, fontFamily: c.fontBody }]}>
            Otomatik yenilenir. İstediğin zaman App Store / Play Store'dan iptal edebilirsin.
            Bu app verilerini takip etmez — tek amacı kelime öğrenmek.
          </Text>

          {isStub && (
            <View style={[s.stubBanner, { backgroundColor: c.bgSurface, borderColor: c.warning }]}>
              <Text style={[s.stubText, { color: c.warning, fontFamily: c.fontBodySemi }]}>
                Test modu: Gerçek satın alma yapılmaz
              </Text>
            </View>
          )}
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1 },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 18,
    paddingTop: 8,
  },
  close: {
    width: 36,
    height: 36,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  restore: { fontSize: 13 },
  hero: {
    alignItems: "center",
    paddingTop: 16,
    paddingBottom: 24,
    paddingHorizontal: 22,
  },
  crown: {
    width: 80,
    height: 80,
    borderRadius: 24,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    marginBottom: 16,
  },
  title: { fontSize: 30, lineHeight: 34, textAlign: "center" },
  subtitle: { fontSize: 14, lineHeight: 20, textAlign: "center", marginTop: 8, maxWidth: 300 },
  features: {
    paddingHorizontal: 22,
    gap: 10,
  },
  feature: {
    flexDirection: "row",
    alignItems: "center",
    gap: 12,
  },
  featureIcon: {
    width: 26,
    height: 26,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
  },
  featureText: { fontSize: 14, flex: 1 },
  packs: {
    paddingHorizontal: 22,
    marginTop: 22,
    gap: 10,
  },
  pack: {
    flexDirection: "row",
    alignItems: "center",
    padding: 16,
    borderRadius: 16,
    borderWidth: 2,
    overflow: "hidden",
  },
  packLeft: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    gap: 14,
  },
  radio: {
    width: 22,
    height: 22,
    borderRadius: 11,
    borderWidth: 2,
    alignItems: "center",
    justifyContent: "center",
  },
  radioInner: {
    width: 10,
    height: 10,
    borderRadius: 5,
  },
  packTitle: { fontSize: 16 },
  packSub: { fontSize: 11, marginTop: 2 },
  packPrice: { fontSize: 18 },
  badge: {
    position: "absolute",
    top: -10,
    right: 14,
    paddingHorizontal: 8,
    paddingVertical: 3,
    borderRadius: 99,
  },
  badgeTxt: { fontSize: 9, letterSpacing: 0.5 },
  cta: {
    marginHorizontal: 22,
    marginTop: 22,
    paddingVertical: 16,
    borderRadius: 16,
    alignItems: "center",
    shadowOffset: { width: 0, height: 0 },
    shadowOpacity: 0.4,
    shadowRadius: 16,
    elevation: 6,
  },
  ctaText: { fontSize: 15, letterSpacing: 0.3 },
  legal: {
    fontSize: 11,
    marginHorizontal: 32,
    marginTop: 16,
    textAlign: "center",
    lineHeight: 16,
  },
  stubBanner: {
    marginHorizontal: 22,
    marginTop: 14,
    padding: 10,
    borderRadius: 10,
    borderWidth: 1,
    alignItems: "center",
  },
  stubText: { fontSize: 11, letterSpacing: 0.3 },
});
