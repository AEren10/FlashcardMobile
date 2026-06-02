import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import supabase from "../supabase/client";
import { STORAGE_BUCKETS } from "../supabase/config";

export default function useImageUpload() {
  const [localUri, setLocalUri] = useState(null);
  const [uploading, setUploading] = useState(false);

  const pick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") throw new Error("Galeri izni gerekli.");
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
    });
    if (!res.canceled && res.assets?.[0]) {
      setLocalUri(res.assets[0].uri);
      return res.assets[0].uri;
    }
    return null;
  };

  const upload = async (uri) => {
    if (!uri) return null;
    setUploading(true);
    try {
      const ext = uri.split(".").pop();
      const fileName = `${Date.now()}.${ext}`;
      const filePath = `list-images/${fileName}`;
      const blob = await fetch(uri).then((r) => r.blob());
      const { error } = await supabase.storage
        .from(STORAGE_BUCKETS.IMAGES)
        .upload(filePath, blob, {
          contentType: `image/${ext === "jpg" ? "jpeg" : ext}`,
          upsert: false,
        });
      if (error) throw error;
      const { data } = supabase.storage.from(STORAGE_BUCKETS.IMAGES).getPublicUrl(filePath);
      return data.publicUrl;
    } finally {
      setUploading(false);
    }
  };

  const reset = () => setLocalUri(null);

  return { localUri, uploading, pick, upload, reset };
}
