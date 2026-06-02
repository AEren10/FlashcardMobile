/**
 * useCountUp — sayıyı 0'dan target'a animasyonlu sayar.
 * Performans: useNativeDriver text güncellemesi için kullanılamaz (false).
 * Hafif — sadece 1 listener, hızlı unmount.
 */
import { useEffect, useRef, useState } from "react";
import { Animated, Easing } from "react-native";

export default function useCountUp(target = 0, duration = 1200) {
  const anim = useRef(new Animated.Value(0)).current;
  const [val, setVal] = useState(0);

  useEffect(() => {
    anim.setValue(0);
    Animated.timing(anim, {
      toValue: 1,
      duration,
      easing: Easing.out(Easing.cubic),
      useNativeDriver: false,
    }).start();
    const id = anim.addListener(({ value }) => {
      setVal(Math.round(value * target));
    });
    return () => anim.removeListener(id);
  }, [target, duration, anim]);

  return val;
}
