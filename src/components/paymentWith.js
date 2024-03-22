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

const PaymentWith = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const {
    onCloseClick,
    onSelect,
    applePayOrGooglePay,
    payWithCreditCard,
    isApplePaySupported,
  } = props;

  return (
    <ReusableModal ref={ref}>
      <View style={[styles.modalContainer]}>
        <Text style={[styles.instructionTxt]}>
          {t(
            "EasyTipping platform accepts instant payments via Google Pay and Apple Pay. Please ensure you've set up these payment methods for seamless transactions."
          )}
        </Text>
        <Text style={[styles.thankYouMsg]}>{t("Thank you!")}</Text>

        {!isApplePaySupported ? null : (
          <TouchableOpacity style={styles.btn2} onPress={applePayOrGooglePay}>
            <Image
              source={Platform.OS == "ios" ? IMAGES.applePay : IMAGES.googlePay}
              style={styles.paymentIcon}
            />
            <Text style={[styles.paymentMethodTxt, { color: COLORS.black }]}>
              {" "}
              {Platform.OS == "ios" ? t("Apple Pay") : t("Google Pay")}
            </Text>
          </TouchableOpacity>
        )}

        <TouchableOpacity style={styles.btn} onPress={payWithCreditCard}>
          <Text style={styles.paymentMethodTxt}>
            {t("Via Credit Card/Debit Card")}
          </Text>
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
export default PaymentWith;
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
    // marginTop: pixelPerfect(10),
    alignSelf: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: 8,
    borderRadius: SIZES.radius,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: COLORS.primary,
    marginVertical: pixelPerfect(20),
  },
  btn2: {
    marginTop: pixelPerfect(20),
    alignSelf: "center",
    borderWidth: 2,
    borderColor: COLORS.primary,
    padding: 8,
    borderRadius: SIZES.radius,
    width: "90%",
    justifyContent: "center",
    alignItems: "center",
    flexDirection: "row",
    backgroundColor: COLORS.primary,
  },
  instructionTxt: {
    color: COLORS.modalBorder,
    marginTop: pixelPerfect(50),
    width: "90%",
    alignSelf: "center",
    fontFamily: fonts.robotoNormal,
    fontSize: pixelPerfect(18),
    textAlign: "center",
  },
  thankYouMsg: {
    color: COLORS.modalBorder,

    alignSelf: "center",
    fontFamily: fonts.robotoNormal,
    fontSize: pixelPerfect(18),
  },
  paymentIcon: {
    height: pixelPerfect(25),
    width: pixelPerfect(25),
  },
});
