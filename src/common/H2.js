import React from "react";
import { Text, View, StyleSheet } from "react-native";
import pixelPerfect from "../utils/pixelPerfect";
import fonts from "../contants/fonts";
import { COLORS } from "../contants/colors";
const H2 = ({ text, customStyle }) => {
  return <Text style={[styles.h2, { ...customStyle }]}>{text}</Text>;
};
export default H2;
const styles = StyleSheet.create({
  h2: {
    fontSize: pixelPerfect(19.5),
    fontFamily: fonts.robotosemiBold,
    color: COLORS.primary,
  },
});
