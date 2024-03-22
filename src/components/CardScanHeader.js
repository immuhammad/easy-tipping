import React from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import { IMAGES } from "../contants/images";
import pixelPerfect from "../utils/pixelPerfect";
import fonts from "../contants/fonts";
import { COLORS } from "../contants/colors";
import { useTranslation } from "react-i18next";

const CardScanHeader = ({
  title,
  isBackBtn,
  onPressBackIcon,
  isRightIcon,
  RightIcon,
  onRightIconPress,
  customContainer,
  onScan,
}) => {
  const { t, i18n } = useTranslation();
  return (
    <View style={[styles.container, !isBackBtn && {}, { ...customContainer }]}>
      {isBackBtn && (
        <TouchableOpacity activeOpacity={0.8} onPress={onPressBackIcon}>
          <Image
            source={IMAGES.backIcon}
            style={[
              styles.backIcon,
              {
                transform: [
                  { rotate: i18n?.language === "ar" ? "180deg" : "0deg" },
                ],
              },
            ]}
          />
        </TouchableOpacity>
      )}
      <Text style={styles.headingText}>{title}</Text>

      <TouchableOpacity onPress={onScan}>
        <Image
          source={IMAGES.scanIcon}
          style={{
            width: pixelPerfect(50),
            height: pixelPerfect(50),
            marginBottom: -5,
          }}
        />
      </TouchableOpacity>
    </View>
  );
};
export default CardScanHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",

    // alignItems: "center",
  },
  backIcon: {
    height: pixelPerfect(22),
    width: pixelPerfect(13.75),
    margin: pixelPerfect(5),
    // marginTop: pixelPerfect(10),
  },
  headingText: {
    fontFamily: fonts.sourceSansSemiBold,
    fontSize: pixelPerfect(35),
    color: COLORS.primary,
    paddingHorizontal: 10,
    textAlign: "center",
  },
  rightIcon: {
    height: pixelPerfect(22),
    width: pixelPerfect(22),
  },
});
