import React from "react";
import { View, StyleSheet, TouchableOpacity, Image, Text } from "react-native";
import { IMAGES } from "../contants/images";
import pixelPerfect from "../utils/pixelPerfect";
import fonts from "../contants/fonts";
import { COLORS } from "../contants/colors";
import { useTranslation } from "react-i18next";

const Header = ({
  title,
  isBackBtn,
  onPressBackIcon,
  isRightIcon,
  RightIcon,
  onRightIconPress,
  customContainer,
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
      {isBackBtn &&
        (isRightIcon ? (
          <TouchableOpacity
            style={{
              width: pixelPerfect(17.75),
            }}
            onPress={onRightIconPress}
          >
            <Image source={RightIcon} style={styles.rightIcon} />
          </TouchableOpacity>
        ) : (
          <View
            style={{
              width: pixelPerfect(17.75),
            }}
          />
        ))}
    </View>
  );
};
export default Header;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",

    // alignItems: "center",
  },
  backIcon: {
    height: pixelPerfect(22),
    width: pixelPerfect(13.75),
    margin: pixelPerfect(5),
    marginTop: pixelPerfect(10),
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
