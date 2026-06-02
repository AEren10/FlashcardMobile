/**
 * MyListsScreen → Kütüphane (Library) — Claude Design v2.
 * Segmented: Listelerim · Favoriler · Keşfet
 * Liste kartları cover gradient + chip + social proof + Çalış CTA.
 * FAB sağ alt → CreateList.
 */
import React, { useCallback, useMemo, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  Pressable,
  ActivityIndicator,
} from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSelector } from "react-redux";
import * as Haptics from "expo-haptics";

import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import supabaseApiService from "../../services/supabaseApi";
import Segmented from "../../components/design/Segmented";
import CategoryCover from "../../components/design/CategoryCover";
import Icon, { ICONS } from "../../components/design/Icon";
import StaggerEnter from "../../components/design/StaggerEnter";
import AnimatedFAB from "../../components/design/AnimatedFAB";
import EmptyState from "../../components/EmptyState";
import { SkeletonListCard } from "../../components/design/Skeleton";
import { FlameRefreshControl } from "../../components/design/FlameRefresh";

const TABS = ["Listelerim", "Favoriler", "Keşfet"];

const trLevel = (lvl) => {
  const m = { Beginner: "Başlangıç", Intermediate: "Orta", Advanced: "İleri" };
  return m[lvl] || lvl || "Başlangıç";
};

export default function MyListsScreen() {
  const { c } = useTheme();
  const navigation = useNavigation();
  const { isAuthenticated, isGuestUser } = useAuth();
  const [tab, setTab] = useState("Listelerim");
  const [myLists, setMyLists] = useState([]);
  const [publicLists, setPublicLists] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const favIds = useSelector((st) => st.favorites?.ids ?? []);

  const s = useMemo(() => makeStyles(c), [c]);

  const load = useCallback(async () => {
    try {
      const promises = [supabaseApiService.getAllPublicLists()];
      if (isAuthenticated() && !isGuestUser()) {
        promises.push(supabaseApiService.getLists());
      }
      const [pub, mine] = await Promise.all(promises);
      if (pub.success) setPublicLists(pub.data || []);
      if (mine?.success) setMyLists(mine.data || []);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  }, [isAuthenticated, isGuestUser]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const favoriteSet = new Set(favIds.map(String));
  const favoritesList = publicLists.filter((l) => favoriteSet.has(String(l.id)));

  const dataByTab = {
    Listelerim: myLists,
    Favoriler: favoritesList,
    Keşfet: publicLists,
  };
  const items = dataByTab[tab] || [];

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 160 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <FlameRefreshControl
              refreshing={refreshing}
              onRefresh={() => {
                setRefreshing(true);
                load();
              }}
              title="🔥 Çekip yenile..."
            />
          }
        >
          <Text style={s.title}>Kütüphane</Text>

          <Segmented
            items={TABS}
            value={tab}
            onChange={(v) => {
              Haptics.selectionAsync();
              setTab(v);
            }}
          />

          <View style={{ marginTop: 18 }}>
            {loading ? (
              <View>
                {[0, 1, 2].map((i) => (
                  <SkeletonListCard key={i} />
                ))}
              </View>
            ) : items.length === 0 ? (
              <Empty
                tab={tab}
                onCreate={() => navigation.navigate("CreateList")}
              />
            ) : (
              items.map((item, i) => (
                <StaggerEnter key={String(item.id)} index={i}>
                  <ListCard
                    item={item}
                    fav={favoriteSet.has(String(item.id))}
                    c={c}
                    s={s}
                    onOpen={() =>
                      navigation.navigate("FlashcardDetail", {
                        listId: item.id,
                        listTitle: item.title,
                        listLevel: item.level,
                        listIsPublic: item.is_public,
                      })
                    }
                    onLongPress={() =>
                      navigation.navigate("Study", {
                        listId: item.id,
                        listTitle: item.title,
                      })
                    }
                  />
                </StaggerEnter>
              ))
            )}
          </View>
        </ScrollView>

        {isAuthenticated() && !isGuestUser() && (
          <AnimatedFAB
            onPress={() => navigation.navigate("CreateList")}
            accessibilityLabel="Yeni liste oluştur"
          />
        )}
      </SafeAreaView>
    </View>
  );
}

function ListCard({ item, fav, c, s, onOpen, onLongPress }) {
  return (
    <Pressable onPress={onOpen} onLongPress={onLongPress} delayLongPress={400} style={s.card}>
      <CategoryCover difficulty={item.level} height={72}>
        {item.is_public && (
          <View style={s.publicBadge}>
            <Text style={s.publicBadgeTxt}>🌍 Public</Text>
          </View>
        )}
        {fav && (
          <View style={s.starWrap}>
            <Icon d={ICONS.star} size={20} fill="#fff" stroke="#fff" sw={1.5} />
          </View>
        )}
      </CategoryCover>
      <View style={{ padding: 16 }}>
        <Text style={s.cardTitle} numberOfLines={1}>
          {item.title}
        </Text>
        <Text style={s.cardSub}>
          {trLevel(item.level)} · {item.word_count ?? "?"} kelime
        </Text>
        <View style={s.cardFooter}>
          <Icon d={ICONS.flame} size={14} fill={c.warning} stroke={c.warning} sw={1.5} />
          <Text style={s.socialTxt}>{item.study_count ?? 0} kişi çalışıyor</Text>
        </View>
      </View>
    </Pressable>
  );
}

function Empty({ tab, onCreate }) {
  if (tab === "Listelerim") {
    return (
      <View style={{ minHeight: 420 }}>
        <EmptyState
          kind="list"
          title="Henüz liste yok"
          subtitle="Kendi kelime listeni oluştur, çalışmaya hemen başla."
          actionLabel="İlk Listeni Oluştur"
          onAction={onCreate}
        />
      </View>
    );
  }
  if (tab === "Favoriler") {
    return (
      <View style={{ minHeight: 420 }}>
        <EmptyState
          kind="search"
          title="Henüz favorin yok"
          subtitle="Keşfet sekmesinden beğendiğin listeleri ⭐ ile favorilere ekle."
        />
      </View>
    );
  }
  return (
    <View style={{ minHeight: 420 }}>
      <EmptyState
        kind="search"
        title="Henüz public liste yok"
        subtitle="Topluluk listeleri yakında burada olacak."
      />
    </View>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    title: {
      fontFamily: c.fontDisplay,
      fontSize: 34,
      color: c.textPrimary,
      marginBottom: 18,
    },
    card: {
      backgroundColor: c.bgElevated,
      borderRadius: 16,
      borderWidth: 1,
      borderColor: c.border,
      overflow: "hidden",
      marginBottom: 14,
    },
    starWrap: { position: "absolute", top: 12, right: 12 },
    publicBadge: {
      position: "absolute",
      top: 10,
      right: 10,
      paddingHorizontal: 9,
      paddingVertical: 4,
      borderRadius: 999,
      backgroundColor: "rgba(0,0,0,0.32)",
      borderWidth: 1,
      borderColor: "rgba(255,255,255,0.25)",
    },
    publicBadgeTxt: {
      fontFamily: c.fontBodyBold,
      fontSize: 10,
      color: "#FFFFFF",
      letterSpacing: 0.3,
    },
    cardTitle: { fontFamily: c.fontBodyBold, fontSize: 17, color: c.textPrimary },
    cardSub: { fontFamily: c.fontBody, fontSize: 12, color: c.textSec, marginTop: 3 },
    cardFooter: {
      flexDirection: "row",
      alignItems: "center",
      gap: 5,
      marginTop: 14,
    },
    socialFlame: { fontSize: 12 },
    socialTxt: { fontFamily: c.fontBody, fontSize: 12, color: c.textSec },
    fab: {
      position: "absolute",
      right: 18,
      bottom: 104,
      width: 56,
      height: 56,
      borderRadius: 18,
      alignItems: "center",
      justifyContent: "center",
      shadowOffset: { width: 0, height: 8 },
      shadowOpacity: 0.5,
      shadowRadius: 24,
      elevation: 8,
    },
    emptyTitle: { fontSize: 16, marginTop: 14 },
    emptySub: { fontSize: 13, marginTop: 6, textAlign: "center", maxWidth: 240 },
  });
}
