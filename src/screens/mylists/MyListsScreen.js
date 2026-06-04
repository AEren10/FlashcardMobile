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
  Alert,
  Share,
} from "react-native";
import * as Linking from "expo-linking";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect, useNavigation } from "@react-navigation/native";
import { useSelector, useDispatch } from "react-redux";
import * as Haptics from "expo-haptics";

import { useTheme } from "../../contexts/ThemeContext";
import { useAuth } from "../../contexts/AuthContext";
import supabaseApiService from "../../services/supabaseApi";
import {
  selectFavoriteListIds,
  fetchFavorites,
} from "../../store/favoritesSlice";
import {
  selectFavoriteWordIds,
  fetchFavoriteWordIds,
} from "../../store/favoriteWordsSlice";
import Segmented from "../../components/design/Segmented";
import CategoryCover from "../../components/design/CategoryCover";
import Icon, { ICONS } from "../../components/design/Icon";
import StaggerEnter from "../../components/design/StaggerEnter";
import AnimatedFAB from "../../components/design/AnimatedFAB";
import SmartListCard from "../../components/design/SmartListCard";
import EmptyState from "../../components/EmptyState";
import { SkeletonListCard } from "../../components/design/Skeleton";
import { FlameRefreshControl } from "../../components/design/FlameRefresh";
import usePublicLists, { invalidatePublicLists } from "../../hooks/usePublicLists";

const TABS = ["Listelerim", "Favoriler", "Keşfet"];
const SORTS = [
  { key: "newest", label: "Yeni" },
  { key: "popular", label: "Popüler" },
  { key: "az", label: "A-Z" },
];

const trLevel = (lvl) => {
  const m = { Beginner: "Başlangıç", Intermediate: "Orta", Advanced: "İleri" };
  return m[lvl] || lvl || "Başlangıç";
};

export default function MyListsScreen() {
  const { c } = useTheme();
  const navigation = useNavigation();
  const { isAuthenticated, isGuestUser, getUserId, signOut } = useAuth();
  const userId = getUserId();
  const [tab, setTab] = useState("Listelerim");
  const [myLists, setMyLists] = useState([]);
  const [myListsLoading, setMyListsLoading] = useState(true);
  const [sortKey, setSortKey] = useState("newest");
  const {
    lists: publicLists,
    loading: publicLoading,
    refreshing,
    refresh: refreshPublic,
  } = usePublicLists();
  const favIds = useSelector(selectFavoriteListIds);
  const favoriteWordIds = useSelector(selectFavoriteWordIds);
  const dispatch = useDispatch();
  const loading = publicLoading || myListsLoading;

  const s = useMemo(() => makeStyles(c), [c]);

  const load = useCallback(async () => {
    if (isAuthenticated() && !isGuestUser()) {
      dispatch(fetchFavorites());
      dispatch(fetchFavoriteWordIds());
      const mine = await supabaseApiService.getLists();
      if (mine?.success) setMyLists(mine.data || []);
    }
    setMyListsLoading(false);
  }, [isAuthenticated, isGuestUser, dispatch]);

  const refresh = useCallback(() => {
    refreshPublic();
    load();
  }, [refreshPublic, load]);

  useFocusEffect(
    useCallback(() => {
      load();
    }, [load])
  );

  const handleLongPress = useCallback(
    (item) => {
      Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Medium);
      const isOwner = userId && item.user_id === userId;
      // Deep link AppNavigator linking config'iyle uyumlu olmalı: MainTabs > Home > FlashcardDetail
      // Tam path: "home/list/:listId" (Home stack altındaki FlashcardDetail = "list/:listId")
      const shareLink = Linking.createURL(`/home/list/${item.id}`);
      const buttons = [];

      buttons.push({
        text: "Paylaş",
        onPress: async () => {
          try {
            await Share.share({
              message: `"${item.title}" listesini incele: ${shareLink}`,
              url: shareLink,
              title: item.title,
            });
          } catch {}
        },
      });

      if (isOwner) {
        buttons.push({
          text: "Düzenle",
          onPress: () => navigation.navigate("CreateList", { listId: item.id }),
        });
        buttons.push({
          text: "Sil",
          style: "destructive",
          onPress: () => {
            Alert.alert(
              "Listeyi sil?",
              `"${item.title}" ve içindeki kelimeler kalıcı silinecek.`,
              [
                { text: "Vazgeç", style: "cancel" },
                {
                  text: "Sil",
                  style: "destructive",
                  onPress: async () => {
                    await supabaseApiService.deleteList(item.id);
                    await invalidatePublicLists();
                    refresh();
                  },
                },
              ]
            );
          },
        });
      } else {
        buttons.push({
          text: "Çalışmaya Başla",
          onPress: () =>
            navigation.navigate("Study", { listId: item.id, listTitle: item.title }),
        });
      }
      buttons.push({ text: "İptal", style: "cancel" });
      Alert.alert(item.title, "İşlem seç", buttons);
    },
    [userId, navigation, load]
  );

  const favoriteSet = new Set(favIds.map(String));
  const favoritesList = publicLists.filter((l) => favoriteSet.has(String(l.id)));

  // Listelerim: mistakes listesini ayır (özel pin alanında gösterilecek)
  const mistakesList = myLists.find((l) => l.kind === "mistakes");
  const regularMyLists = myLists.filter((l) => l.kind !== "mistakes");

  const dataByTab = {
    Listelerim: regularMyLists,
    Favoriler: favoritesList,
    Keşfet: publicLists.filter((l) => l.kind !== "mistakes"),
  };
  const rawItems = dataByTab[tab] || [];

  // Sort
  const items = useMemo(() => {
    const sorted = [...rawItems];
    if (sortKey === "popular") {
      sorted.sort((a, b) => (b.study_count ?? 0) - (a.study_count ?? 0));
    } else if (sortKey === "az") {
      sorted.sort((a, b) => (a.title || "").localeCompare(b.title || "", "tr"));
    } else {
      sorted.sort((a, b) => (b.inserted_at || "").localeCompare(a.inserted_at || ""));
    }
    return sorted;
  }, [rawItems, sortKey]);

  const showSmartPins = tab === "Listelerim" && !loading;
  // Sort + smart pins boş listede gözükmesin — empty CTA üstte kalsın
  const isEmpty = !loading && items.length === 0;
  const showFilters = !isEmpty;
  const showPinsActual = showSmartPins && !isEmpty;

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }} edges={["top"]}>
        <ScrollView
          contentContainerStyle={{ padding: 20, paddingBottom: 160 }}
          showsVerticalScrollIndicator={false}
          refreshControl={
            <FlameRefreshControl
              refreshing={refreshing}
              onRefresh={refresh}
              title="Yenile"
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

          {showFilters && <View style={s.sortRow}>
            {SORTS.map((sort) => {
              const active = sortKey === sort.key;
              return (
                <Pressable
                  key={sort.key}
                  onPress={() => {
                    Haptics.selectionAsync();
                    setSortKey(sort.key);
                  }}
                  style={[
                    s.sortChip,
                    {
                      backgroundColor: active ? c.accentGlow : c.bgElevated,
                      borderColor: active ? c.borderAccent : c.border,
                    },
                  ]}
                >
                  <Text
                    style={[
                      s.sortChipTxt,
                      {
                        color: active ? c.accent : c.textSec,
                        fontFamily: c.fontBodySemi,
                      },
                    ]}
                  >
                    {sort.label}
                  </Text>
                </Pressable>
              );
            })}
          </View>}

          <View style={{ marginTop: 18 }}>
            {/* Smart pins (sadece Listelerim sekmesinde + dolu) */}
            {showPinsActual && (
              <View style={{ marginBottom: 6 }}>
                <Text style={s.smartHeader}>Senin İçin</Text>
                <SmartListCard
                  iconPath={ICONS.bookmark}
                  title="Favori Kelimelerim"
                  subtitle="Kart sağ üstündeki yer iminden eklediklerin."
                  count={favoriteWordIds.length}
                  accent={c.accent}
                  onPress={() => navigation.navigate("FavoriteWords")}
                />
                {mistakesList && (
                  <SmartListCard
                    iconPath={ICONS.target}
                    title={mistakesList.title}
                    subtitle="Çalışırken takıldığın kelimeler. 3 kez doğru bilince çıkar."
                    count={mistakesList.word_count ?? 0}
                    accent={c.error}
                    onPress={() =>
                      navigation.navigate("FlashcardDetail", {
                        listId: mistakesList.id,
                        listTitle: mistakesList.title,
                        listLevel: mistakesList.level,
                        listIsPublic: mistakesList.is_public,
                      })
                    }
                  />
                )}
                <View style={s.divider} />
                <Text style={s.smartHeader}>Listelerim</Text>
              </View>
            )}

            {loading ? (
              <View>
                {[0, 1, 2].map((i) => (
                  <SkeletonListCard key={i} />
                ))}
              </View>
            ) : items.length === 0 ? (
              <Empty
                tab={tab}
                isGuest={isGuestUser()}
                onCreate={() => {
                  if (isGuestUser()) {
                    Alert.alert(
                      "Kayıt gerekli",
                      "Kendi listeni oluşturmak için hesap açmalısın. Kayıt olmak istiyor musun?",
                      [
                        { text: "Vazgeç", style: "cancel" },
                        { text: "Kayıt Ol", onPress: () => signOut?.() ?? null },
                      ]
                    );
                    return;
                  }
                  navigation.navigate("CreateList");
                }}
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
                    onLongPress={() => handleLongPress(item)}
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
            <Text style={s.publicBadgeTxt}>Public</Text>
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

function Empty({ tab, isGuest, onCreate }) {
  if (tab === "Listelerim") {
    return (
      <View style={{ paddingVertical: 30 }}>
        <EmptyState
          kind="list"
          title={isGuest ? "Misafir modundayken liste oluşturulamaz" : "Kendine ait listen yok"}
          subtitle={
            isGuest
              ? "Kendi listeni yapmak, ilerlemeni cihazlar arası senkronize etmek için kayıt ol."
              : "İlk listeni oluştur — toplu yapıştır ile saniyeler içinde 50 kelime ekleyebilirsin."
          }
          actionLabel={isGuest ? "Kayıt Ol" : "İlk Listeni Oluştur"}
          onAction={onCreate}
        />
      </View>
    );
  }
  if (tab === "Favoriler") {
    return (
      <View style={{ paddingVertical: 30 }}>
        <EmptyState
          kind="search"
          title="Favori listen yok"
          subtitle="Keşfet sekmesinde bir liste aç → sağ üst yıldıza bas. Burada hızlı erişim için birikecek."
        />
      </View>
    );
  }
  return (
    <View style={{ minHeight: 420 }}>
      <EmptyState
        kind="search"
        title="Public liste bekleniyor"
        subtitle="Topluluk listeleri çok yakında. Şimdilik kendi listelerinden başlayabilirsin."
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
    smartHeader: {
      fontFamily: c.fontBodyBold,
      fontSize: 13,
      color: c.textSec,
      letterSpacing: 0.5,
      textTransform: "uppercase",
      marginBottom: 10,
      marginTop: 6,
    },
    sortRow: { flexDirection: "row", gap: 8, marginTop: 14 },
    sortChip: {
      paddingHorizontal: 14,
      paddingVertical: 6,
      borderRadius: 999,
      borderWidth: 1,
    },
    sortChipTxt: {
      fontSize: 12,
      letterSpacing: 0.3,
    },
    divider: {
      height: 1,
      backgroundColor: c.border,
      marginVertical: 16,
      opacity: 0.5,
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
