import React, { Component, useState, useEffect } from "react";
import {
  Animated,
  View,
  StatusBar,
  ImageBackground,
  StyleSheet,
  Dimensions,
} from "react-native";

import { CommonActions } from "@react-navigation/native";

import { SCREEN } from "../contants/screens";
import { IMAGES } from "../contants/images";
import { COLORS } from "../contants/colors";
import pixelPerfect from "../utils/pixelPerfect";
import { useSelector } from "../redux/store";

const { height, width } = Dimensions.get("window");

const SplashScreen = (props) => {
  const { user } = useSelector((state) => state.userReducer);
  let [splashBackAnim, setSplashBackAnim] = useState(new Animated.Value(0));
  let [splashOverlayAnim, setSplashOverlayAnim] = useState(
    new Animated.Value(0)
  );
  useEffect(() => {
    setTimeout(() => {
      Animated.sequence([
        Animated.timing(splashBackAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
        Animated.timing(splashOverlayAnim, {
          toValue: 1,
          duration: 1200,
          useNativeDriver: true,
        }),
      ]).start(async () => {
        reset(true);
      });
    }, 1500);
  }, []);

  reset = async () => {
    if (user == null)
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: SCREEN.welcome }],
        })
      );
    else {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: SCREEN.bottomTab }],
        })
      );
    }
  };
  return (
    <>
      <StatusBar backgroundColor={COLORS.primary} barStyle={"light-content"} />

      <View style={styles.mainContainer}>
        <Animated.Image
          source={IMAGES.logo}
          style={[styles.logo, { opacity: splashBackAnim }]}
          resizeMode={"contain"}
        />
      </View>
    </>
  );
};
export default SplashScreen;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainContainer: { flex: 1, alignItems: "center", justifyContent: "center" },
  logo: {
    height: height / 2.3,
    width: width / 2.3,
    alignSelf: "center",
    // marginTop: height / 15,
  },
  healthAndWellness: {
    color: COLORS.white,
    fontSize: pixelPerfect(16),
    alignSelf: "center",
    fontWeight: "500",
  },
});
