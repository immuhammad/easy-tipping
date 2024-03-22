import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Image,
  Platform,
} from "react-native";
import ReusableModal from "./Reuseable";
import { SIZES } from "../contants/sizes";
import { COLORS } from "../contants/colors";
import { BlurView, VibrancyView } from "@react-native-community/blur";
import fonts from "../contants/fonts";
import pixelPerfect from "../utils/pixelPerfect";
import { useTranslation } from "react-i18next";
import { IMAGES } from "../contants/images";

const TeamAccountAs = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { onCloseClick, onSelect, onTeamCreate, onTeamJoin } = props;

  return (
    <ReusableModal ref={ref}>
      <View style={[styles.modalContainer]}>
        <TouchableOpacity style={styles.btn} onPress={onTeamCreate}>
          <Text style={styles.paymentMethodTxt}>
            {t("Create Team Account")}
          </Text>
        </TouchableOpacity>
        <TouchableOpacity style={styles.btn2} onPress={onTeamJoin}>
          <Text style={styles.paymentMethodTxt}>{t("Join Existing Team")}</Text>
        </TouchableOpacity>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => {
            onCloseClick();
          }}
        >
          <Image source={IMAGES.closeIcon} style={styles.closeIcon} />
        </TouchableOpacity>
      </View>
    </ReusableModal>
  );
});
export default TeamAccountAs;
const styles = StyleSheet.create({
  blurView: {
    width: pixelPerfect(350),
    backgroundColor: "blue",
  },

  modalContainer: {
    width: "90%",
    alignSelf: "center",
    borderRadius: SIZES.radius * 2,
    borderWidth: 2,
    borderColor: COLORS.modalBorder,
    backgroundColor: `rgba(0,0,0,0.7)`,
    padding: 0,

    // width: 300,
  },
  closeBtn: {
    position: "absolute",
    right: pixelPerfect(15),
    top: pixelPerfect(15),
  },
  closeIcon: {
    height: pixelPerfect(18),
    width: pixelPerfect(18),
    resizeMode: "contain",
    tintColor: COLORS.white,
  },
  paymentMethodTxt: {
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(24),
    color: COLORS.white,
  },
  btn: {
    marginTop: pixelPerfect(50),
    alignSelf: "center",
  },
  btn2: {
    marginVertical: pixelPerfect(20),
    alignSelf: "center",
  },
});
