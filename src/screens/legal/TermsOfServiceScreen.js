/**
 * TermsOfServiceScreen — App Store sözleşme zorunluluğu.
 */
import React from "react";
import { View, Text, StyleSheet, ScrollView, Pressable } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import Svg, { Path } from "react-native-svg";
import T from "../../themes/tokens";

const LAST_UPDATED = "1 Haziran 2026";

export default function TermsOfServiceScreen({ navigation }) {
  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <View style={s.header}>
          <Pressable onPress={() => navigation.goBack()} style={s.back} hitSlop={12}>
            <Svg width={10} height={16} viewBox="0 0 8 14">
              <Path
                d="M7 1L1 7l6 6"
                stroke={T.text}
                strokeWidth={2.5}
                fill="none"
                strokeLinecap="round"
                strokeLinejoin="round"
              />
            </Svg>
          </Pressable>
          <Text style={s.title}>Kullanım Koşulları</Text>
          <View style={{ width: 34 }} />
        </View>

        <ScrollView contentContainerStyle={s.body}>
          <Text style={s.muted}>Son güncelleme: {LAST_UPDATED}</Text>

          <Section title="1. Hizmetin Tanımı">
            <P>
              FlashcardMobile, kelime öğrenmek için akıllı tekrar (SRS) sistemi sunan
              bir mobil uygulamadır. Hizmeti olduğu gibi sunarız.
            </P>
          </Section>

          <Section title="2. Hesap">
            <P>
              Hesap oluşturmak için geçerli bir e-posta adresi gerekir. Hesabınızın
              güvenliğinden siz sorumlusunuz. Şifrenizi kimseyle paylaşmayın.
            </P>
            <P>
              13 yaşından küçük kullanıcılar bu uygulamayı kullanamaz.
            </P>
          </Section>

          <Section title="3. Kullanıcı İçeriği">
            <P>
              Oluşturduğunuz kelime listeleri size aittir. "Public" olarak işaretlediğiniz
              listeler diğer kullanıcılar tarafından görüntülenebilir.
            </P>
            <P>
              Müstehcen, yasadışı, telifli veya rahatsız edici içerik paylaşmamalısınız.
              Bu tür içerikleri kaldırma hakkını saklı tutarız.
            </P>
          </Section>

          <Section title="4. Yasaklı Kullanımlar">
            <P>• Servisi tersine mühendisliğe tabi tutmak</P>
            <P>• Otomatik (bot) erişim sağlamak</P>
            <P>• Başka kullanıcılara zarar vermek veya rahatsız etmek</P>
            <P>• Kötü amaçlı içerik veya kod yüklemek</P>
          </Section>

          <Section title="5. Fikri Mülkiyet">
            <P>
              Uygulamanın kodu, tasarımı ve markası geliştirici tarafından korunur.
              Kullanıcının kendi oluşturduğu içerik kendisine aittir.
            </P>
          </Section>

          <Section title="6. Hesabın Sonlandırılması">
            <P>
              Hesabınızı istediğiniz zaman Profil → Hesabı Sil bölümünden kalıcı olarak
              silebilirsiniz. Kuralları ihlal eden hesapları sonlandırma hakkını saklı tutarız.
            </P>
          </Section>

          <Section title="7. Sorumluluk Reddi">
            <P>
              Hizmet "olduğu gibi" sunulur. Uygulamadaki kelimelerin/çevirilerin
              doğruluğu için garanti vermeyiz. Eğitim amaçlıdır, profesyonel kaynak
              olarak güvenilmemelidir.
            </P>
          </Section>

          <Section title="8. Değişiklikler">
            <P>
              Bu koşulları zaman zaman güncelleyebiliriz. Önemli değişikliklerde
              sizi bilgilendiririz.
            </P>
          </Section>

          <Section title="9. İletişim">
            <P>Sorularınız için: ahmet28eren@gmail.com</P>
          </Section>

          <View style={{ height: 40 }} />
        </ScrollView>
      </SafeAreaView>
    </View>
  );
}

function Section({ title, children }) {
  return (
    <View style={s.section}>
      <Text style={s.sectionTitle}>{title}</Text>
      {children}
    </View>
  );
}

function P({ children }) {
  return <Text style={s.p}>{children}</Text>;
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  header: {
    flexDirection: "row",
    alignItems: "center",
    paddingHorizontal: 16,
    paddingVertical: 8,
  },
  back: {
    width: 34,
    height: 34,
    borderRadius: 17,
    backgroundColor: T.surface,
    alignItems: "center",
    justifyContent: "center",
  },
  title: {
    flex: 1,
    textAlign: "center",
    fontSize: 18,
    fontFamily: T.fontBodyBold,
    color: T.text,
  },
  body: { paddingHorizontal: 20, paddingTop: 8, paddingBottom: 24 },
  muted: { fontSize: 12, fontFamily: T.fontBody, color: T.textMuted, marginBottom: 16 },
  section: { marginBottom: 24 },
  sectionTitle: {
    fontSize: 16,
    fontFamily: T.fontBodyBold,
    color: T.text,
    marginBottom: 8,
  },
  p: {
    fontSize: 14,
    fontFamily: T.fontBody,
    color: T.textSec,
    lineHeight: 22,
    marginBottom: 6,
  },
});
