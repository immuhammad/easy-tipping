import {
  ActivityIndicator,
  Dimensions,
  Pressable,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
} from "react-native";
import React, { useState } from "react";
import ReusableModal from "./Reuseable";

import { SIZES } from "../contants/sizes";
import { COLORS } from "../contants/colors";
import fonts from "../contants/fonts";
import pixelPerfect from "../utils/pixelPerfect";

const AlertMessage = React.forwardRef((props, ref) => {
  const {
    title,

    onAccept = null,

    acceptTitle,
  } = props;

  const value = 50;

  return (
    <ReusableModal ref={ref}>
      <View style={styles.modalContainer}>
        <View>
          <Text style={styles.modalTitle}>{title}</Text>
          <View style={styles.optionsContainer}>
            <TouchableOpacity onPress={onAccept} style={styles.coverBtn}>
              <Text style={styles.btnTxt}>{acceptTitle}</Text>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </ReusableModal>
  );
});

export default AlertMessage;

const styles = StyleSheet.create({
  modalContainer: {
    width: "90%",
    alignSelf: "center",
    borderRadius: SIZES.radius * 2,
    borderWidth: 1,
    borderColor: COLORS.modalBorder,
    width: "90%",
    alignSelf: "center",
    borderRadius: SIZES.radius * 2,
    borderColor: COLORS.modalBorder,
    backgroundColor: "rgba(0, 0, 0, 0.5)",
    // backgroundColor: `rgba(255, 162, 107,)`,
    padding: 0,
  },
  modalTitle: {
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(22),
    color: COLORS.white,
    margin: pixelPerfect(36),
    textAlign: "center",
    lineHeight: pixelPerfect(30),
    padding: 4,
  },
  optionsContainer: {
    borderTopWidth: 1,
    borderColor: COLORS.modalBorder,
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    borderBottomRightRadius: SIZES.radius * 2,
    borderBottomLeftRadius: SIZES.radius * 2,
    backgroundColor: COLORS.primary,
  },
  verticalLine: {
    width: 2,
    backgroundColor: COLORS.modalBorder,
    height: pixelPerfect(50),
  },
  btnTxt: {
    fontSize: pixelPerfect(18),
    fontFamily: fonts.robotosemiBold,
    color: COLORS.white,
  },
  coverBtn: {
    padding: 10,
    width: "45%",
    alignItems: "center",
  },
});
