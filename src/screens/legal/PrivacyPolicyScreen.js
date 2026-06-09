/**
 * PrivacyPolicyScreen — KVKK/GDPR uyumlu gizlilik politikası.
 * App Store metadata'sında URL yerine in-app erişim için.
 */
import { radius, spacing } from "../../themes/tokens";
import React, { useMemo } from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import { useTheme } from "../../contexts/ThemeContext";

const LAST_UPDATED = "1 Haziran 2026";

export default function PrivacyPolicyScreen({ navigation }) {
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={s.header}>
          <Pressable onPress={() => navigation.goBack()} style={s.back} hitSlop={12}>
            <Svg width={10} height={16} viewBox="0 0 8 14">
              <Path
                d="M7 1L1 7l6 6"
                stroke={c.textPrimary}
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
          <Text style={s.title}>Gizlilik Politikası</Text>
          <View style={{ width: 34 }} />
        </View>

        <ScrollView contentContainerStyle={s.body}>
          <Text style={s.muted}>Son güncelleme: {LAST_UPDATED}</Text>

          <Section title="1. Toplanan Veriler">
            <P>
              Hesap oluşturduğunuzda e-posta adresinizi topluyoruz. Uygulama içinde
              oluşturduğunuz kelime listeleri, çalışma ilerlemeniz ve favori listeleriniz
              hesabınızla ilişkilendirilir.
            </P>
            <P>
              Onayınız olması halinde Sentry üzerinden anonim çökme raporları toplanır.
              Bu veriler kişisel bilgi içermez ve sadece hataları gidermek için kullanılır.
            </P>
          </Section>

          <Section title="2. Verilerin Kullanımı">
            <P>
              Topladığımız verileri yalnızca uygulamanın çalışması için kullanırız:
              kimlik doğrulama, ilerlemenizi cihazlar arası senkronizasyon, çökme analizleri.
            </P>
            <P>
              Verilerinizi üçüncü taraflarla paylaşmayız, reklam veya pazarlama
              amacıyla kullanmayız.
            </P>
          </Section>

          <Section title="3. Üçüncü Taraf Servisler">
            <P>• Supabase — auth ve veritabanı (Frankfurt/AB sunucuları)</P>
            <P>• Sentry — opsiyonel çökme raporları (kullanıcı onayı ile)</P>
            <P>• Apple/Google Push — bildirim gönderimi</P>
          </Section>

          <Section title="4. Verilerin Saklanması">
            <P>
              Verileriniz AB içindeki Supabase sunucularında, şifrelenmiş olarak saklanır.
              Hesabınızı sildiğinizde tüm verileriniz 30 gün içinde kalıcı olarak silinir.
            </P>
          </Section>

          <Section title="5. Haklarınız (KVKK / GDPR)">
            <P>• Verilerinize erişme</P>
            <P>• Verilerinizi düzeltme veya silme</P>
            <P>• İşlemeye itiraz etme</P>
            <P>• Verilerinizi taşınabilir biçimde alma</P>
            <P>Bu hakları kullanmak için: ahmet28eren@gmail.com</P>
          </Section>

          <Section title="6. Çocukların Gizliliği">
            <P>
              Uygulama 13 yaş altı kullanıcılara yönelik değildir. 13 yaşından küçük
              bir kullanıcı tarafından veri toplandığını fark edersek derhal sileriz.
            </P>
          </Section>

          <Section title="7. Değişiklikler">
            <P>
              Bu politikada yapılan önemli değişikliklerde sizi bilgilendiririz.
              Güncel sürüm her zaman uygulamadan erişilebilir.
            </P>
          </Section>

          <Section title="8. İletişim">
            <P>
              Sorularınız veya talepleriniz için: ahmet28eren@gmail.com
            </P>
          </Section>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Section({ title, children }) {
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function P({ children }) {
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  return <Text style={s.p}>{children}</Text>;
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    header: {
      flexDirection: "row",
      alignItems: "center",
      paddingHorizontal: spacing.lg,
      paddingVertical: spacing.sm,
    },
    back: {
      width: 34,
      height: 34,
      borderRadius: radius.md,
      backgroundColor: c.bgSurface,
      alignItems: "center",
      justifyContent: "center",
    },
    title: {
      flex: 1,
      textAlign: "center",
      fontSize: 18,
      fontFamily: c.fontBodyBold,
      color: c.textPrimary,
    },
    body: { paddingHorizontal: spacing.xl, paddingTop: spacing.sm, paddingBottom: spacing.xxl },
    muted: { fontSize: 12, fontFamily: c.fontBody, color: c.textMuted, marginBottom: spacing.lg },
    section: { marginBottom: spacing.xxl },
    sectionTitle: {
      fontSize: 16,
      fontFamily: c.fontBodyBold,
      color: c.textPrimary,
      marginBottom: spacing.sm,
    },
    p: {
      fontSize: 14,
      fontFamily: c.fontBody,
      color: c.textSec,
      lineHeight: 22,
      marginBottom: 6,
    },
  });
}
