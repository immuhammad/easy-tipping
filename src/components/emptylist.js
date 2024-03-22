import React from "react";
import { View, Image, StyleSheet, Text } from "react-native";
import { IMAGES } from "../contants/images";
import FastImage from "react-native-fast-image";
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from "react-native-responsive-screen";
import { COLORS } from "../contants/colors";
import fonts from "../contants/fonts";
import pixelPerfect from "../utils/pixelPerfect";
import { useTranslation } from "react-i18next";

const EmptyList = () => {
  const { t } = useTranslation();
  return (
    <View>
      <FastImage
        style={styles.imgStyle}
        resizeMode={"contain"}
        source={IMAGES.noDataPlaceholder}
      />
      <Text style={styles.noDataFound}>{t("No Data Found")}</Text>
    </View>
  );
};

const styles = StyleSheet.create({
  imgStyle: {
    width: w(41.8),
    height: h(32.6),
    opacity: 4,
    alignSelf: "center",
  },
  noDataFound: {
    alignSelf: "center",
    color: COLORS.primary,
    fontFamily: fonts.robotoBold,
    fontSize: pixelPerfect(22),
  },
});
export default EmptyList;
