import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ReusableModal from "./Reuseable";
import { SIZES } from "../contants/sizes";
import { COLORS } from "../contants/colors";
import fonts from "../contants/fonts";
import pixelPerfect from "../utils/pixelPerfect";
import { useTranslation } from "react-i18next";
import { RFValue } from "react-native-responsive-fontsize";
const CardEncryptedModal = React.forwardRef((props, ref) => {
  const { onConfirm, onCancel, name, cardType, amount } = props;
  const { t } = useTranslation();
  return (
    <ReusableModal ref={ref}>
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <Text style={styles.HeadingLabel}>
            {t(
              "We take the security and privacy of your information very seriously. When you choose to save your credit card details within our app for future transactions, we want to assure you that your data is encrypted and in safe hands. "
            )}
          </Text>
        </View>
        <View style={styles.optionsContainer}>
          <TouchableOpacity onPress={onConfirm} style={styles.coverBtn}>
            <Text style={styles.btnTxt}>{t("Confirm")}</Text>
          </TouchableOpacity>
          <TouchableOpacity onPress={onConfirm} style={styles.coverBtn}>
            <Text style={styles.btnTxt}>{t("Cancel")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ReusableModal>
  );
});
export default CardEncryptedModal;
const styles = StyleSheet.create({
  modalContainer: {
    width: "90%",
    alignSelf: "center",
    borderRadius: SIZES.radius * 2,
    borderWidth: 1,
    borderColor: COLORS.modalBorder,
    backgroundColor: "rgba(255, 255, 255, 0.04)",
    padding: 0,
  },
  HeadingLabel: {
    width: "96%",
    fontFamily: fonts.robotosemiBold,
    color: COLORS.white,
    fontSize: RFValue(16),
    // marginBottom: pixelPerfect(10),
    textAlign: "justify",
  },
  container: {
    padding: pixelPerfect(30),
    alignItems: "center",
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
  transactionDetailsContainer: {
    width: "100%",
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: pixelPerfect(15),
  },
  label: {
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(18),
    color: COLORS.white,
  },
  value: {
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(18),
    color: COLORS.white,
  },
  coverBtn: {
    padding: 10,
    alignItems: "center",
    justifyContent: "center",
    width: "100%",
    height: pixelPerfect(50),
  },
});
