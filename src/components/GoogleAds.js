import React, { useMemo, memo } from "react";
import { View, StyleSheet, Platform, Dimensions } from "react-native";
import {
  TestIds,
  AdEventType,
  BannerAd,
  InterstitialAd,
  BannerAdSize,
} from "react-native-google-mobile-ads";
import pixelPerfect from "../utils/pixelPerfect";
const adUnitIdAndroid = false
  ? TestIds.BANNER
  : "ca-app-pub-2223681413344982/4507638565";

const adUnitIdIos = false
  ? TestIds.BANNER
  : "ca-app-pub-2223681413344982/2704151043";
const { height, width } = Dimensions.get("window");
const GoogleAds = () => {
  return (
    <View style={styles.adsContainer}>
      <BannerAd
        unitId={Platform.OS == "android" ? adUnitIdAndroid : adUnitIdIos}
        // size={BannerAdSize.ANCHORED_ADAPTIVE_BANNER}
        size={BannerAdSize.MEDIUM_RECTANGLE}
        // size={`${width - 50}x${height / 5}`}
        requestOptions={{
          requestNonPersonalizedAdsOnly: true,
        }}
        onAdFailedToLoad={(e) => console.log("ad fails ", e)}
        onAdLoaded={(e) => console.log("ad loaded ", e)}
      />
    </View>
  );
};

export default memo(GoogleAds);
const styles = StyleSheet.create({
  adsContainer: {
    height: pixelPerfect(300),

    // height: height / 5,

    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    marginTop: pixelPerfect(5),
  },
});
