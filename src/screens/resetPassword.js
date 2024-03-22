import React, { useState } from "react";
import { Text, StyleSheet, View, Image } from "react-native";
import Screen from "../components/Screen";
import pixelPerfect from "../utils/pixelPerfect";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";
import TextInput from "../components/TextInput";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import fonts from "../contants/fonts";
import { COLORS } from "../contants/colors";
import Button from "../components/Button";
import { SCREEN } from "../contants/screens";
import { IMAGES } from "../contants/images";
import Validations from "../utils/Validations";
import AppLoading from "../common/AppLoader";
import { resetForgotPassword } from "../services/apis";
import { CommonActions } from "@react-navigation/native";
import Alert from "../common/Alert";
const ResetPassword = (props) => {
  const { data, otp } = props.route.params;
  const { t } = useTranslation();
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const _handleResetPassword = () => {
    setIsSubmitted(true);
    if (
      Validations.isValidPassword(password) &&
      Validations.comparePassword(confirmPassword, password)
    ) {
      setLoading(true);

      resetForgotPassword({
        phoneNumber: data.phone,

        password: password,
      })
        .then((res) => {
          setLoading(false);
          // Alert(res.data.data.message);

          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: SCREEN.welcome }],
            })
          );
        })
        .catch((error) => {
          setLoading(false);
          console.log("error on reset password ", error);
          // Alert(error?.response.data.data.message);
        });
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        {AppLoading(loading)}
        <Header
          title={t("Reset Password")}
          isBackBtn={true}
          onPressBackIcon={() => props.navigation.navigate(SCREEN.welcome)}
        />
        <KeyboardAwareScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <Image source={IMAGES.logo} style={styles.logo} />
          <View style={styles.txtInputContainer}>
            <TextInput
              customInputContainer={styles.txtInput}
              isPassword={true}
              secureTextEntry={true}
              value={password}
              onChangeText={setPassword}
              placeholder={t("Password")}
              errorMessage={
                !isSubmitted
                  ? ""
                  : Validations.isValidPassword(password)
                  ? ""
                  : t(
                      "Password must be 8 characters or more, contain 1 uppercase and lower case letter, 1 number, and 1 special character"
                    )
              }
            />
            <TextInput
              customInputContainer={styles.txtInput}
              isPassword={true}
              secureTextEntry={true}
              value={confirmPassword}
              onChangeText={setConfirmPassword}
              placeholder={t("Confirm Password")}
              errorMessage={
                !isSubmitted
                  ? ""
                  : password !== confirmPassword || confirmPassword == ""
                  ? t("Password Not Matched")
                  : ""
              }
            />
          </View>

          <View style={styles.btnContainer}>
            <Button btnText={t("Submit")} onPress={_handleResetPassword} />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Screen>
  );
};
export default ResetPassword;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    height: pixelPerfect(200),
    width: pixelPerfect(200),
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: pixelPerfect(50),
  },
  txtInputContainer: {
    marginTop: pixelPerfect(70),
  },
  txtInput: {
    // marginTop: pixelPerfect(15),
  },

  btnContainer: {
    marginTop: pixelPerfect(100),
  },
  signupTxt: {
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(12),
    color: COLORS.secondary,
    alignSelf: "center",
    marginTop: pixelPerfect(15),
  },
  // logo: {
  //   height: pixelPerfect(200),
  //   width: pixelPerfect(200),
  //   resizeMode: "contain",
  //   alignSelf: "center",
  //   marginTop: pixelPerfect(50),
  // },
});
