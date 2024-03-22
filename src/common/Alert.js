import React from "react";
import { ToastAndroid, Platform } from "react-native";

import Toast, { BaseToast, ErrorToast } from "react-native-toast-message";
const Alert = (message, type) => {
  Toast.show({
    type: type ? type : "error",
    text1: "",
    text2: message,
    visibilityTime: 5000,
    autoHide: true,
    topOffset: 60,
  });
};
export default Alert;

//================================ React Native Imported Files ======================================//

//================================ Local Imported Files ======================================//

import { COLORS } from "../contants/colors";
import fonts from "../contants/fonts";
import pixelPerfect from "../utils/pixelPerfect";

export const toastConfig = {
  success: (props) => (
    <BaseToast
      {...props}
      style={{ borderLeftColor: COLORS.primary }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        backgroundColor: COLORS.white,
      }}
      text1Style={{
        fontSize: pixelPerfect(16),
        color: COLORS.primary,
        fontFamily: fonts.robotoBold,
      }}
      text1NumberOfLines={2}
      text2Style={{
        fontSize: pixelPerfect(14),
        color: COLORS.primary,
        fontFamily: fonts.robotoBold,
      }}
      text2NumberOfLines={2}
    />
  ),
  error: (props) => (
    <ErrorToast
      {...props}
      style={{ borderLeftColor: "#F44238FF" }}
      contentContainerStyle={{
        paddingHorizontal: 15,
        backgroundColor: COLORS.white,
      }}
      text1Style={{
        fontSize: pixelPerfect(16),
        color: "#F44238FF",
        fontFamily: fonts.robotoBold,
      }}
      text1NumberOfLines={2}
      text2Style={{
        fontSize: pixelPerfect(14),
        color: "#F44238FF",
        fontFamily: fonts.robotoBold,
      }}
      text2NumberOfLines={2}
    />
  ),
};
