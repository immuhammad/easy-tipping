import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ReusableModal from "./Reuseable";
import { SIZES } from "../contants/sizes";
import { COLORS } from "../contants/colors";
import { BlurView, VibrancyView } from "@react-native-community/blur";
import fonts from "../contants/fonts";
import pixelPerfect from "../utils/pixelPerfect";
import { useTranslation } from "react-i18next";
import StarRating from "react-native-star-rating";
import { Rating, AirbnbRating } from "react-native-ratings";
import { IMAGES } from "../contants/images";
import Validations from "../utils/Validations";
import TextInput from "../components/TextInput";
const InviteMember = React.forwardRef((props, ref) => {
  const { onConfirm, onCancel } = props;
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const { t } = useTranslation();

  const _handleSendEmail = () => {
    setIsSubmitted(true);
    if (!Validations.isEmail(email)) return;
    onConfirm(email);
    setEmail("");
    setIsSubmitted(false);
  };

  return (
    <ReusableModal ref={ref}>
      <View style={[styles.modalContainer]}>
        <View style={styles.feedbackContainer}>
          <Text style={styles.label}>
            {t("Enter email to send invitation code.")}
          </Text>
          <View style={styles.inputContainer}>
            <TextInput
              customMainContainer={styles.customMainContainer}
              customInputContainer={styles.customInputContainer}
              isBackroundTransparent={true}
              customeStyleTextInput={styles.customeStyleTextInput}
              onChangeText={setEmail}
              value={email}
              customLabelStyle={{ color: COLORS.white }}
              placeholder={t("Email Address")}
              label={t("Email Address")}
              keyboardType={"email-address"}
              errorMessage={
                !isSubmitted
                  ? ""
                  : Validations.isEmail(email)
                  ? ""
                  : t("Please Enter Valid Email")
              }
            />
          </View>
        </View>
        <View style={styles.optionsContainer}>
          <TouchableOpacity onPress={_handleSendEmail} style={styles.coverBtn}>
            <Text style={styles.btnTxt}>{t("Confirm")}</Text>
          </TouchableOpacity>
          <View style={styles.verticalLine} />
          <TouchableOpacity onPress={onCancel} style={styles.coverBtn}>
            <Text style={styles.btnTxt}>{t("Cancel")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ReusableModal>
  );
});
export default InviteMember;
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
  label: {
    fontFamily: fonts.robotosemiBold,
    color: COLORS.white,
    fontSize: pixelPerfect(18),
    // marginBottom: pixelPerfect(10),
  },
  container: {
    padding: pixelPerfect(20),
    alignItems: "center",
  },
  optionsContainer: {
    borderTopWidth: 2,
    borderColor: COLORS.modalBorder,
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    borderBottomRightRadius: SIZES.radius * 2,
    borderBottomLeftRadius: SIZES.radius * 2,
    backgroundColor: COLORS.primary,
    height: pixelPerfect(50),
    width: "100%",
  },
  verticalLine: {
    width: 2,
    backgroundColor: COLORS.modalBorder,
    height: pixelPerfect(50),
  },
  btnTxt: {
    fontSize: pixelPerfect(15),
    fontFamily: fonts.robotosemiBold,
    color: COLORS.white,
  },
  feedbackContainer: {
    padding: pixelPerfect(15),
    alignItems: "center",
    justifyContent: "center",

    width: "100%",
    marginBottom: pixelPerfect(15),
  },
  ratingStarLable: {
    fontFamily: fonts.robotoNormal,
    fontSize: pixelPerfect(15),
    color: COLORS.white,
    marginTop: pixelPerfect(15),
  },
  customMainContainer: {
    backgroundColor: "transparent",
    marginTop: pixelPerfect(15),
  },
  customInputContainer: {
    backgroundColor: COLORS.white,
    borderWidth: 1,
  },
  multilineCustomMainContainer: {
    backgroundColor: "transparent",
    marginTop: pixelPerfect(15),
    height: pixelPerfect(142),
  },
  multilineCustomInputContainer: {
    backgroundColor: "transparent",
    borderWidth: 1,
    height: pixelPerfect(142),
  },
  customeStyleTextInput: {
    // fontSize: pixelPerfect(18),
    // fontFamily: fonts.robotoNormal,
    color: COLORS.white,
  },
  coverBtn: {
    padding: 10,
    width: "45%",
    alignItems: "center",
  },
});
