import React from "react";
import { Text, Image, StyleSheet } from "react-native";
import LinearGradient from "react-native-linear-gradient";
import Feather from "react-native-vector-icons/MaterialIcons";
import pixelPerfect from "../utils/pixelPerfect";
import { IMAGES } from "../contants/images";
import { COLORS } from "../contants/colors";
import { SIZES } from "../contants/sizes";
import fonts from "../contants/fonts";
import FastImage from "react-native-fast-image";
import ALLCURRENCIES from "../contants/currencies";
import roundWithSuffix from "../utils/roundNumber";
const WalletOption = ({ title, amount, currentSymbol }) => {
  return (
    <LinearGradient
      colors={["#499662", "#1C6748", "#35764A"]}
      style={styles.container}
      locations={[0.23, 0.51, 0.74]}
      useAngle={true}
      angle={125.9}
      // angleCenter={{ x: 0.5, y: 0.5 }}
    >
      <FastImage style={styles.walletIcon} source={IMAGES.walletIcon} />
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.amount}>
        {title === "Tip Received" ? "" : currentSymbol}
        {roundWithSuffix(amount)}
      </Text>
    </LinearGradient>
  );
};

export default WalletOption;
const styles = StyleSheet.create({
  container: {
    width: "30%",
    borderRadius: SIZES.radius * 2,
    padding: 5,
    borderColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "space-evenly",
    height: pixelPerfect(120),
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primary,
    shadowOffset: {
      width: 0,
      height: 3,
    },
    shadowOpacity: 0.27,
    shadowRadius: 4.65,
    elevation: 6,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  walletIcon: {
    height: pixelPerfect(22),
    width: pixelPerfect(29),
    resizeMode: "contain",
    marginLeft: pixelPerfect(3),
    tintColor: COLORS.white,
  },
  amount: {
    color: COLORS.white,
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(18),
    textAlign: "center",
  },
  title: {
    color: COLORS.white,
    fontFamily: fonts.robotoBold,
    fontSize: pixelPerfect(18),
    textAlign: "center",
  },
  dot: {
    position: "absolute",
    right: pixelPerfect(5),
    top: pixelPerfect(5),
  },
  dot1: {
    left: pixelPerfect(5),
    top: pixelPerfect(5),
  },
  dot2: {
    left: pixelPerfect(5),
    bottom: pixelPerfect(5),
  },
  dot3: {
    left: pixelPerfect(5),
    bottom: pixelPerfect(5),
  },
});
