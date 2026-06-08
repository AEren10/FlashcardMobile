/**
 * FlashcardDetailScreen — orchestrator.
 * Alt parçalar `./components/` altında.
 */
import React, { useState, useEffect, useCallback, useLayoutEffect, useMemo } from "react";
import { View, StyleSheet, Alert, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import { useTheme } from "../../contexts/ThemeContext";
import { useToast } from "../../contexts/ToastContext";
import EmptyState from "../../components/EmptyState";
import { useAuth } from "../../contexts/AuthContext";
import { getListWords } from "../../supabase/database";
import supabaseApiService from "../../services/supabaseApi";
import { useAppDispatch, useAppSelector } from "../../store/hooks";
import { toggleFavorite, selectIsFavorite } from "../../store/favoritesSlice";
import useDifficultyTint from "../../hooks/useDifficultyTint";

import FlashcardHeader from "./components/FlashcardHeader";
import FlashcardCardArea from "./components/FlashcardCardArea";
import FlashcardCTAs from "./components/FlashcardCTAs";
import { Skeleton, SkeletonFlipCard } from "../../components/design/Skeleton";
import StarRating from "../../components/design/StarRating";
import { getListRating, rateList } from "../../supabase/ratings";

export default function FlashcardDetailScreen({ route, navigation }) {
  const { listId, listTitle, listLevel, listIsPublic, isOwner: paramIsOwner } = route.params ?? {};
  const { c } = useTheme();
  const s = useMemo(() => makeStyles(c), [c]);
  const { isAuthenticated, isGuestUser } = useAuth();
  const dispatch = useAppDispatch();
  const isFavorite = useAppSelector((s) => selectIsFavorite(s, listId));
  const toast = useToast();
  const tint = useDifficultyTint(listLevel);

  const [words, setWords] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isOwner, setIsOwner] = useState(paramIsOwner ?? false);
  const [rating, setRating] = useState({ avg: 0, count: 0, userRating: null });

  const fetchWords = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      const res = await getListWords(listId);
      setWords(res.data ?? []);
    } catch {
      setError("Kelimeler yüklenirken bir hata oluştu.");
      setWords([]);
    } finally {
      setLoading(false);
    }
  }, [listId]);

  useEffect(() => {
    if (paramIsOwner === undefined && isAuthenticated()) {
      supabaseApiService
        .checkListOwnership(listId)
        .then((r) => r.success && setIsOwner(r.isOwner))
        .catch(() => {});
    }
  }, [listId, paramIsOwner, isAuthenticated]);

  useFocusEffect(
    useCallback(() => {
      fetchWords();
    }, [fetchWords])
  );

  useEffect(() => {
    if (!listId) return;
    getListRating(listId).then((r) => {
      if (r.success) {
        setRating({ avg: r.avg, count: r.count, userRating: r.userRating });
      }
    });
  }, [listId]);

  const handleRate = useCallback(
    async (stars) => {
      if (!isAuthenticated() || isGuestUser()) {
        toast.show({ message: "Oy vermek için giriş yap", type: "info" });
        return;
      }
      if (isOwner) {
        toast.show({ message: "Kendi listene oy veremezsin", type: "info" });
        return;
      }
      const prev = rating;
      setRating((r) => ({ ...r, userRating: stars }));
      const res = await rateList(listId, stars);
      if (res.success) {
        setRating({ avg: res.avg, count: res.count, userRating: stars });
        Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
        toast.show({ message: `${stars} yıldız verildi`, type: "success" });
      } else {
        setRating(prev);
        toast.show({ message: "Oy kaydedilemedi", type: "error" });
      }
    },
    [isAuthenticated, isGuestUser, isOwner, listId, rating, toast]
  );

  // Bu ekranda tab bar'ı sakla — Çalış/Quiz butonları görünür kalsın.
  // FlashcardDetail → HomeStack → BottomTab. tabBarStyle BottomTab'da set edilmeli.
  useLayoutEffect(() => {
    const stack = navigation.getParent();
    const tab = stack?.getParent();
    tab?.setOptions({ tabBarStyle: { display: "none" } });
    return () => tab?.setOptions({ tabBarStyle: undefined });
  }, [navigation]);

  const title = listTitle ?? "Liste";

  const handleDelete = useCallback(() => {
    Alert.alert(
      "Listeyi Sil",
      "Bu listeyi silmek istediğine emin misin? Bu işlem geri alınamaz.",
      [
        { text: "Vazgeç", style: "cancel" },
        {
          text: "Sil",
          style: "destructive",
          onPress: async () => {
            try {
              const res = await supabaseApiService.deleteList(listId);
              if (res.success) {
                Haptics.notificationAsync(Haptics.NotificationFeedbackType.Success);
                navigation.goBack();
              } else {
                Alert.alert("Hata", res.error || "Liste silinemedi.");
              }
            } catch {
              Alert.alert("Hata", "Liste silinirken bir sorun oluştu.");
            }
          },
        },
      ]
    );
  }, [listId, navigation]);

  const handleShare = useCallback(async () => {
    Haptics.selectionAsync();
    const sample = words
      .slice(0, 3)
      .map((w) => `• ${w.word} — ${w.meaning}`)
      .join("\n");
    const deepLink = `https://flashcardmobile.app/list/${listId}`;
    const msg = `"${title}" kelime listesi (${words.length} kelime)\n\n${sample}${
      words.length > 3 ? "\n..." : ""
    }\n\nListeyi aç: ${deepLink}\n\nFlashcardMobile ile öğren!`;
    try {
      await Share.share({ message: msg, url: deepLink, title });
    } catch {}
  }, [title, words, listId]);

  const handleComplete = () => {
    // Kart önizlemesi bitti → direkt Study (SRS) sayfasına yönlendir
    navigation.navigate("Study", {
      listId,
      listTitle: title,
      listLevel,
    });
  };

  if (loading) {
    return (
      <View style={s.root}>
        <SafeAreaView style={{ flex: 1, padding: 22, gap: 16 }} edges={["top"]}>
          <View style={{ flexDirection: "row", alignItems: "center", gap: 12 }}>
            <Skeleton width={36} height={36} radius={12} />
            <Skeleton width={140} height={20} radius={6} />
            <View style={{ flex: 1 }} />
            <Skeleton width={36} height={36} radius={12} />
          </View>
          <Skeleton width="40%" height={14} radius={6} style={{ alignSelf: "center" }} />
          <View style={{ flex: 1, justifyContent: "center" }}>
            <SkeletonFlipCard />
          </View>
          <View style={{ flexDirection: "row", gap: 10 }}>
            <Skeleton width="48%" height={50} radius={14} />
            <Skeleton width="48%" height={50} radius={14} />
          </View>
        </SafeAreaView>
      </View>
    );
  }

  if (error || words.length === 0) {
    const isEmpty = !error && words.length === 0;
    return (
      <View style={s.root}>
        <SafeAreaView style={{ flex: 1 }}>
          <EmptyState
            kind={error ? "offline" : "search"}
            title={error ?? "Bu listede kelime yok"}
            subtitle={
              error
                ? "Lütfen internet bağlantını kontrol edip tekrar dene."
                : isOwner
                  ? "Listene kelime ekle, sonra çalışmaya başla."
                  : "Bu liste boş görünüyor."
            }
            actionLabel={
              error
                ? "Tekrar dene"
                : isEmpty && isOwner
                  ? "Kelime Ekle"
                  : "Geri dön"
            }
            onAction={
              error
                ? fetchWords
                : isEmpty && isOwner
                  ? () => navigation.navigate("CreateList", { listId })
                  : () => navigation.goBack()
            }
            secondaryLabel={isEmpty && isOwner ? "Geri dön" : undefined}
            onSecondary={isEmpty && isOwner ? () => navigation.goBack() : undefined}
          />
        </SafeAreaView>
      </View>
    );
  }

  return (
    <View style={s.root}>
      <SafeAreaView style={{ flex: 1 }}>
        <FlashcardHeader
          title={title}
          tint={tint}
          onBack={() => navigation.goBack()}
          onShare={handleShare}
          isOwner={isOwner}
          onEdit={() => navigation.navigate("CreateList", { listId, listTitle })}
          onDelete={handleDelete}
          canFavorite={isAuthenticated() && !isGuestUser()}
          isFavorite={isFavorite}
          onToggleFavorite={() => {
            Haptics.selectionAsync();
            dispatch(toggleFavorite({ listId, isFavorite }));
          }}
        />

        <View style={s.ratingRow}>
          <StarRating
            value={rating.userRating ?? rating.avg}
            onRate={isOwner ? undefined : handleRate}
            size={20}
            showMeta
            avg={rating.avg}
            count={rating.count}
          />
        </View>

        <FlashcardCardArea
          words={words}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          onComplete={handleComplete}
          listId={listId}
        />

        <FlashcardCTAs
          wordCount={words.length}
          tint={tint}
          onStudy={() =>
            navigation.navigate("Study", { listId, listTitle: title, listLevel })
          }
          onQuiz={() =>
            navigation.navigate("Quiz", { listId, listTitle: title, listLevel })
          }
        />
      </SafeAreaView>
    </View>
  );
}

function makeStyles(c) {
  return StyleSheet.create({
    root: { flex: 1, backgroundColor: c.bgBase },
    center: { alignItems: "center", justifyContent: "center" },
    ratingRow: {
      alignItems: "center",
      paddingHorizontal: 22,
      paddingTop: 8,
      paddingBottom: 4,
    },
  });
}
