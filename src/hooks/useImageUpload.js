import { useState } from "react";
import * as ImagePicker from "expo-image-picker";
import supabase from "../supabase/client";
import { STORAGE_BUCKETS } from "../supabase/config";

/**
 * base64 → Uint8Array — fetch().blob() React Native'de 0-byte gönderiyor,
 * bu yüzden ImagePicker base64'ünden Uint8Array decode ediyoruz.
 */
function base64ToUint8Array(base64) {
  const bin = global.atob ? global.atob(base64) : Buffer.from(base64, "base64").toString("binary");
  const len = bin.length;
  const arr = new Uint8Array(len);
  for (let i = 0; i < len; i++) arr[i] = bin.charCodeAt(i);
  return arr;
}

export default function useImageUpload() {
  const [localUri, setLocalUri] = useState(null);
  const [asset, setAsset] = useState(null); // { uri, base64, mimeType }
  const [uploading, setUploading] = useState(false);

  const pick = async () => {
    const { status } = await ImagePicker.requestMediaLibraryPermissionsAsync();
    if (status !== "granted") throw new Error("Galeri izni gerekli.");
    const res = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: "images",
      allowsEditing: true,
      aspect: [16, 9],
      quality: 0.8,
      base64: true, // KRİTİK: blob fetch RN'de bozuk, base64 ile bypass
    });
    if (!res.canceled && res.assets?.[0]) {
      const a = res.assets[0];
      setLocalUri(a.uri);
      setAsset({
        uri: a.uri,
        base64: a.base64,
        mimeType: a.mimeType || a.type,
      });
      return a.uri;
    }
    return null;
  };

  const upload = async (uriOrAsset) => {
    // Geriye dönük: uri string'i alırsa uyarı ver, asset bekleriz
    const a =
      typeof uriOrAsset === "object" && uriOrAsset !== null
        ? uriOrAsset
        : asset;
    if (!a || !a.uri) return null;
    if (!a.base64) {
      throw new Error("base64 missing — picker'da base64: true olmalı");
    }
    setUploading(true);
    try {
      const ext = (a.uri.split(".").pop() || "jpg").toLowerCase().split("?")[0];
      const fileName = `${Date.now()}.${ext}`;
      const filePath = `list-images/${fileName}`;
      const contentType =
        a.mimeType || `image/${ext === "jpg" ? "jpeg" : ext}`;
      const bytes = base64ToUint8Array(a.base64);
      const { error } = await supabase.storage
        .from(STORAGE_BUCKETS.IMAGES)
        .upload(filePath, bytes, { contentType, upsert: false });
      if (error) throw error;
      const { data } = supabase.storage
        .from(STORAGE_BUCKETS.IMAGES)
        .getPublicUrl(filePath);
      // Cache-busting suffix — yeni upload anında görünür
      return data.publicUrl ? `${data.publicUrl}?t=${Date.now()}` : null;
    } finally {
      setUploading(false);
    }
  };

  const reset = () => {
    setLocalUri(null);
    setAsset(null);
  };

  return { localUri, asset, uploading, pick, upload, reset };
}
