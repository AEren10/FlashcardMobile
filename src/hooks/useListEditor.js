import { useCallback, useEffect, useState } from "react";
import supabaseApiService from "../services/supabaseApi";

const BLANK_WORD = { word: "", meaning: "", example: "" };

export default function useListEditor(listId) {
  const isEdit = !!listId;
  const [title, setTitle] = useState("");
  const [isPublic, setIsPublic] = useState(false);
  const [existingImageUrl, setExistingImageUrl] = useState(null);
  const [words, setWords] = useState([{ ...BLANK_WORD }, { ...BLANK_WORD }, { ...BLANK_WORD }]);
  const [originalWordIds, setOriginalWordIds] = useState([]);
  const [fetching, setFetching] = useState(isEdit);

  useEffect(() => {
    if (!isEdit) return;
    let alive = true;
    (async () => {
      try {
        const listRes = await supabaseApiService.getList(listId);
        if (!alive || !listRes.success) return;
        setTitle(listRes.data.title || "");
        setIsPublic(!!listRes.data.is_public);
        setExistingImageUrl(listRes.data.image_url || null);
        const wr = await supabaseApiService.getListWords(listId);
        if (alive && wr.success && wr.data?.length) {
          const mapped = wr.data.map((w) => ({
            id: w.id,
            word: w.word || "",
            meaning: w.meaning || "",
            example: w.example || "",
          }));
          setWords(mapped);
          setOriginalWordIds(mapped.map((w) => w.id).filter(Boolean));
        }
      } finally {
        if (alive) setFetching(false);
      }
    })();
    return () => {
      alive = false;
    };
  }, [listId, isEdit]);

  const updateWord = (index, field, value) =>
    setWords((prev) => prev.map((w, i) => (i === index ? { ...w, [field]: value } : w)));

  const addWord = () => setWords((prev) => [...prev, { ...BLANK_WORD }]);
  const removeWord = (index) =>
    setWords((prev) => (prev.length > 1 ? prev.filter((_, i) => i !== index) : prev));

  const validate = () => {
    if (!title.trim()) return "Liste adı gerekli.";
    const valid = words.filter((w) => w.word.trim() && w.meaning.trim());
    if (!valid.length) return "En az bir kelime ve anlamı ekle.";
    return null;
  };

  const save = useCallback(
    async (imageUrl) => {
      const validWords = words.filter((w) => w.word.trim() && w.meaning.trim());
      if (isEdit) {
        const up = await supabaseApiService.updateList(listId, {
          title: title.trim(),
          image_url: imageUrl,
          is_public: isPublic,
        });
        if (!up.success) throw new Error(up.error || "Liste güncellenemedi.");

        const keptIds = validWords.filter((w) => w.id).map((w) => w.id);
        const toDelete = originalWordIds.filter((id) => !keptIds.includes(id));
        await Promise.all(toDelete.map((id) => supabaseApiService.deleteWord(id)));

        for (const w of validWords) {
          const payload = {
            word: w.word.trim(),
            meaning: w.meaning.trim(),
            example: w.example.trim() || null,
          };
          if (w.id) await supabaseApiService.updateWord(w.id, payload);
          else await supabaseApiService.createWord({ list_id: listId, ...payload });
        }
        return { id: listId };
      }

      const cr = await supabaseApiService.createList({
        title: title.trim(),
        description: "",
        level: "Başlangıç",
        image_url: imageUrl,
        is_public: isPublic,
      });
      if (!cr.success) throw new Error(cr.error || "Liste oluşturulamadı.");
      const newId = cr.data.id;
      for (const w of validWords) {
        await supabaseApiService.createWord({
          list_id: newId,
          word: w.word.trim(),
          meaning: w.meaning.trim(),
          example: w.example.trim() || null,
        });
      }
      return { id: newId };
    },
    [isEdit, listId, title, isPublic, words, originalWordIds]
  );

  return {
    isEdit,
    title,
    setTitle,
    isPublic,
    setIsPublic,
    existingImageUrl,
    words,
    updateWord,
    addWord,
    removeWord,
    fetching,
    validate,
    save,
  };
}
