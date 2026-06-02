/**
 * FlashcardDetailScreen — orchestrator.
 * Alt parçalar `./components/` altında.
 */
import React, { useState, useEffect, useCallback } from "react";
import { View, StyleSheet, ActivityIndicator, Alert, Share } from "react-native";
import { SafeAreaView } from "react-native-safe-area-context";
import { useFocusEffect } from "@react-navigation/native";
import * as Haptics from "expo-haptics";

import T from "../../themes/tokens";
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
import WordChipList from "./components/WordChipList";

export default function FlashcardDetailScreen({ route, navigation }) {
  const { listId, listTitle, listLevel, listIsPublic, isOwner: paramIsOwner } = route.params ?? {};
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
    const msg = `📚 "${title}" kelime listesi (${words.length} kelime)\n\n${sample}${
      words.length > 3 ? "\n..." : ""
    }\n\nListeyi aç: ${deepLink}\n\nFlashcardMobile ile öğren!`;
    try {
      await Share.share({ message: msg, url: deepLink, title });
    } catch {}
  }, [title, words, listId]);

  const handleComplete = () =>
    toast.show({
      message: "Tüm kelimeleri gördün! 🎉 Şimdi çalış veya quiz dene.",
      type: "success",
    });

  if (loading) {
    return (
      <View style={[s.root, s.center]}>
        <ActivityIndicator color={T.lime} size="large" />
      </View>
    );
  }

  if (error || words.length === 0) {
    return (
      <View style={s.root}>
        <SafeAreaView style={{ flex: 1 }}>
          <EmptyState
            emoji={error ? "⚠️" : "📭"}
            title={error ?? "Bu listede kelime yok"}
            subtitle={
              error
                ? "Lütfen internet bağlantını kontrol edip tekrar dene."
                : "Önce listeye kelime ekle."
            }
            actionLabel={error ? "Tekrar dene" : "Geri dön"}
            onAction={error ? fetchWords : () => navigation.goBack()}
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

        <FlashcardCardArea
          words={words}
          currentIndex={currentIndex}
          setCurrentIndex={setCurrentIndex}
          onComplete={handleComplete}
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

        <WordChipList
          words={words}
          currentIndex={currentIndex}
          onSelect={setCurrentIndex}
        />
      </SafeAreaView>
    </View>
  );
}

const s = StyleSheet.create({
  root: { flex: 1, backgroundColor: T.bg },
  center: { alignItems: "center", justifyContent: "center" },
});
