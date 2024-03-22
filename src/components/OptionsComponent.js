import React from "react";
import { View, Image, StyleSheet, TouchableOpacity } from "react-native";
import pixelPerfect from "../utils/pixelPerfect";
import { useTranslation } from "react-i18next";
import { IMAGES } from "../contants/images";
import fonts from "../contants/fonts";
import H1 from "../common/H1";

const OptionsComponent = (props) => {
  const { t, i18n } = useTranslation();

  return (
    <TouchableOpacity
      activeOpacity={0.7}
      disabled={props.disable}
      style={styles.container}
      onPress={() => props.onPressCard()}
    >
      <View style={styles.row}>
        <Image source={props.image} style={styles.iconStyle} />
        <View style={styles.nameView}>
          <H1
            text={props.title}
            numberOfLines={2}
            customStyle={{
              fontSize: pixelPerfect(22),
              fontFamily: fonts.robotoNormal,
            }}
          />
        </View>
      </View>
      <View style={styles.forwardIconView}>
        <Image
          source={IMAGES.forward}
          style={[
            styles.forwardStyle,
            {
              transform: [
                { rotate: i18n?.language === "ar" ? "180deg" : "0deg" },
              ],
            },
          ]}
        />
      </View>
    </TouchableOpacity>
  );
};

export default OptionsComponent;

const styles = StyleSheet.create({
  container: {
    // height: pixelPerfect(20),
    paddingHorizontal: pixelPerfect(5),
    alignSelf: "center",
    alignItems: "center",
    marginBottom: pixelPerfect(26),
    flexDirection: "row",

    width: "100%",
    justifyContent: "space-between",
  },
  nameView: {
    textAlign: "left",
    justifyContent: "center",
    marginLeft: pixelPerfect(13.35),

    width: "80%",
  },
  forwardIconView: {
    justifyContent: "center",
    alignItems: "flex-end",
  },
  forwardStyle: {
    height: pixelPerfect(16.5),
    width: pixelPerfect(13.1),
  },
  iconStyle: {
    height: pixelPerfect(25),
    width: pixelPerfect(25),
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
});
