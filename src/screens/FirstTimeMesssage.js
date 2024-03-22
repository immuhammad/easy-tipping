import React from "react";
import {
  View,
  Text,
  StyleSheet,
  Image,
  TouchableOpacity,
  Dimensions,
} from "react-native";

import Modal from "react-native-modal";
import { RFValue } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { COLORS } from "../contants/colors";
import { IMAGES } from "../contants/images";
import { useDispatch, useSelector } from "react-redux";
import { toolTip } from "../redux/slices/userSlice";
const { height, width } = Dimensions.get("screen");
import { useTranslation } from "react-i18next";
const CustomeMessage = () => {
  const { t } = useTranslation();
  let dispatch = useDispatch();
  const { isTooltipViewed } = useSelector((state) => state.userReducer);

  return (
    <Modal
      animationIn={"fadeIn"}
      animationOut={"fadeOut"}
      isVisible={isTooltipViewed}
      backdropOpacity={0}
      onBackdropPress={() => {
        dispatch(toolTip(false));
      }}
    >
      <View style={styles.modalContiner}>
        <Text style={styles.txtStyle}>
          {t(" Tap here to give a tip Scan the QR code or enter the Unique ID")}
        </Text>
        <TouchableOpacity
          onPress={() => {
            dispatch(toolTip(false));
          }}
        >
          <Image
            resizeMode={"contain"}
            style={styles.crossImgStyle}
            source={IMAGES.closeIcon}
          />
        </TouchableOpacity>

        <View style={[styles.triangle]} />
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalContiner: {
    flex: 1,
    backgroundColor: COLORS.primary,
    position: "absolute",
    bottom: heightPercentageToDP(12),
    height: heightPercentageToDP(10),
    borderRadius: heightPercentageToDP(1),
    paddingHorizontal: heightPercentageToDP(1.5),
    width: widthPercentageToDP(90),
    flexDirection: "row",
    justifyContent: "space-between",
    paddingTop: 20,
  },
  crossImgStyle: {
    width: widthPercentageToDP(3),
    height: heightPercentageToDP(3),
    tintColor: COLORS.white,
  },
  txtStyle: {
    color: "white",
    fontSize: RFValue(14),
    width: "90%",
  },
  triangle: {
    width: 0,
    height: 0,
    backgroundColor: "transparent",
    borderStyle: "solid",
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 20,
    borderLeftColor: "transparent",
    borderRightColor: "transparent",
    borderBottomColor: COLORS.primary,
    transform: [{ rotate: "180deg" }],
    position: "absolute",
    bottom: -15,

    left: width / 2 - widthPercentageToDP(5) - 10,
  },
});

export default CustomeMessage;
