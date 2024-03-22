import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ReusableModal from "./Reuseable";
import { SIZES } from "../contants/sizes";
import { COLORS } from "../contants/colors";
import { BlurView, VibrancyView } from "@react-native-community/blur";
import fonts from "../contants/fonts";
import pixelPerfect from "../utils/pixelPerfect";
import { useTranslation } from "react-i18next";
import roundWithSuffix from "../utils/roundNumber";

const TransactionDetails = React.forwardRef((props, ref) => {
  const {
    onConfirm,
    onCancel,
    name,
    cardType,
    amount,
    onPressChat,
    isGuestTransaction,
    transactionFeedback,
    transactionAcknowledgment,
    plateFormFee,
  } = props;
  const { t } = useTranslation();

  const [selected, setSelected] = useState(1);

  return (
    <ReusableModal ref={ref}>
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <Text style={styles.HeadingLabel}>{t("Transaction Successful")}</Text>
          <View style={styles.transactionDetailsContainer}>
            <View style={styles.row}>
              <Text style={styles.label}>{t("User Name")}</Text>
              <Text style={styles.value}>{name ?? "Guest"}</Text>
            </View>

            <View style={styles.row}>
              <Text style={styles.label}>{t("Payment Type")}</Text>
              <Text style={styles.value}>{cardType}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.label}>{t("Tip Amount")}</Text>
              <Text style={styles.value}>{amount}</Text>
            </View>

            {transactionFeedback != null && (
              <View style={[styles.row, { alignItems: "flex-start" }]}>
                <Text style={[styles.label, { width: "50%" }]}>
                  {t("Feedback")}
                </Text>
                <View
                  style={{
                    width: "50%",
                    justifyContent: "flex-end",
                    alignItems: "flex-end",
                  }}
                >
                  <Text style={[styles.value, {}]}>
                    {transactionFeedback?.feedbackText}
                  </Text>
                </View>
              </View>
            )}

            {transactionAcknowledgment != null && (
              <View style={[styles.row, { alignItems: "flex-start" }]}>
                <Text style={[styles.label, { width: "50%" }]}>
                  {t("Acknowledgement")}
                </Text>
                <Text style={[styles.value, { width: "50%" }]}>
                  {transactionAcknowledgment?.feedbackText}
                </Text>
              </View>
            )}
          </View>
        </View>
        <View style={styles.optionsContainer}>
          <TouchableOpacity onPress={onConfirm} style={styles.coverBtn}>
            <Text style={styles.btnTxt}>{t("Close")}</Text>
          </TouchableOpacity>
          <View style={styles.verticalLine} />
          <TouchableOpacity
            onPress={onPressChat}
            style={styles.coverBtn}
            disabled={true}
          >
            <Text
              style={[
                styles.btnTxt,
                true && { color: COLORS.grayLight },
                // isGuestTransaction && { color: COLORS.grayLight },
              ]}
            >
              {t("Chat")}
            </Text>
          </TouchableOpacity>
        </View>
      </View>
    </ReusableModal>
  );
});
export default TransactionDetails;
const styles = StyleSheet.create({
  modalContainer: {
    width: "90%",
    alignSelf: "center",
    borderRadius: SIZES.radius * 2,
    borderWidth: 2,
    borderColor: COLORS.modalBorder,
    // backgroundColor: `rgba(255, 255, 255, 0.010)`,
    padding: 0,
    backgroundColor: `rgba(0,0,0,0.7)`,
  },
  HeadingLabel: {
    fontFamily: fonts.robotosemiBold,
    color: COLORS.white,
    fontSize: pixelPerfect(20),
    marginBottom: pixelPerfect(10),
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

    // width: "100%",
    height: pixelPerfect(50),
  },
});
