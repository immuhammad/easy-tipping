import React from "react";
import { StyleSheet, View, SafeAreaView, Platform } from "react-native";
import { COLORS } from "../contants/colors";
import { SIZES } from "../contants/sizes";
import pixelPerfect from "../utils/pixelPerfect";

export default function Screen({ children, customStyle }) {
  return Platform.OS === "ios" ? (
    <SafeAreaView style={{ flex: 1, backgroundColor: COLORS.white }}>
      <View style={[styles.screenIOS, { ...customStyle }]}>{children}</View>
    </SafeAreaView>
  ) : (
    <View style={[styles.screen, { ...customStyle }]}>{children}</View>
  );
}

const styles = StyleSheet.create({
  screen: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: SIZES.padding / 2,
    paddingHorizontal: pixelPerfect(29),
    paddingBottom: 50,
    // paddingLeft: 50,
  },
  screenIOS: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingVertical: SIZES.padding / 2,
    paddingHorizontal: pixelPerfect(29),
    // paddingBottom: 50,
  },
});
