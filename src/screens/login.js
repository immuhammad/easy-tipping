import React, { useEffect, useState } from "react";
import { Text, StyleSheet, View, Image, TouchableOpacity } from "react-native";
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
import { doHttpPost } from "../services/HttpUtils";
import ENDPOINTS from "../contants/apis";

import AppLoading from "../common/AppLoader";
import { loginUser } from "../services/apis";
import Alert from "../common/Alert";
import { CommonActions, useIsFocused } from "@react-navigation/native";

import { dispatch } from "../redux/store";
import { saveToken, saveUser } from "../redux/slices/userSlice";
import messaging from "@react-native-firebase/messaging";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { RFValue } from "react-native-responsive-fontsize";
import crashlytics from "@react-native-firebase/crashlytics";

const Login = (props) => {
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [fcm, setFcm] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isOn, setIson] = useState(false);
  const [teamCode, setTeamCode] = useState("");

  useEffect(() => {
    if (isFocused) {
      getToken();
    }
  }, [isFocused]);

  const getToken = async () => {
    const fcmToken = await messaging().getToken();

    setFcm(fcmToken);
  };

  const _handleLogin = () => {
    setIsSubmitted(true);
    if (isOn && !Validations.isValidAmmount(teamCode)) {
      return;
    }
    if (Validations.isEmail(email) && Validations.isValidPassword(password)) {
      setLoading(true);
      let data = {
        email: email,
        password: password,
        fcmToken: fcm,
        teamCode: isOn ? teamCode : null,
      };

      loginUser(data)
        .then((res) => {
          setLoading(false);

          dispatch(saveToken(res?.data?.data?.accessToken));
          dispatch(saveUser(res?.data?.data?.user));
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: SCREEN.bottomTab }],
            })
          );
        })
        .catch((error) => {
          console.log("error for login ", error);
          setLoading(false);
          Alert(
            error?.response?.data?.data?.message
              ? error?.response?.data?.data?.message
              : "Something went wrong!"
          );
        });
    }
  };

  const _handleForgot = () => {
    props.navigation.navigate(SCREEN.forgotPasswordEmail);
  };

  return (
    <Screen>
      <View style={styles.container}>
        {AppLoading(loading)}
        <Header
          title={t("Sign In")}
          isBackBtn={true}
          onPressBackIcon={() => props.navigation.navigate(SCREEN.welcome)}
        />
        <KeyboardAwareScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <Image source={IMAGES.logo} style={styles.logo} />
          <View style={styles.loginAsTeamContainer}>
            <Text style={styles.loginAsTeamTxt}>
              {t("Login to a Team Account")}
            </Text>

            <TouchableOpacity onPress={() => setIson(!isOn)}>
              <Image
                style={styles.offImg}
                resizeMode={"contain"}
                source={isOn ? IMAGES.onswitch : IMAGES.offswitch}
              />
            </TouchableOpacity>
          </View>
          <View style={styles.txtInputContainer}>
            {isOn && (
              <TextInput
                customInputContainer={styles.txtInput}
                value={teamCode}
                onChangeText={setTeamCode}
                placeholder={t("Team Code")}
                keyboardType={"numeric"}
                errorMessage={
                  !isSubmitted
                    ? ""
                    : Validations.isValidAmmount(teamCode)
                    ? ""
                    : t("Please Enter Valid Team Code")
                }
                isMandatory={true}
              />
            )}

            <TextInput
              customInputContainer={styles.txtInput}
              value={email}
              onChangeText={setEmail}
              placeholder={t("Email Address")}
              label={t("Email")}
              keyboardType={"email-address"}
              errorMessage={
                !isSubmitted
                  ? ""
                  : Validations.isEmail(email)
                  ? ""
                  : t("Please Enter Valid Email")
              }
              isMandatory={true}
            />
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
                      "Password must be 8 characters or more, contain 1 uppercase and lower case letter, 1 number, and 1 special character."
                    )
              }
              isMandatory={true}
            />
          </View>
          <View style={styles.forgotPasswordContainer}>
            <Text style={styles.forgotPassTxt} onPress={_handleForgot}>
              {t("Forgot password?")}
            </Text>
          </View>

          <View style={styles.btnContainer}>
            <Button btnText={t("Sign In")} onPress={_handleLogin} />
          </View>
          <Text style={styles.signupTxt}>
            {t("Don’t have an Account? ")}
            <Text
              style={styles.underLine}
              onPress={() => props.navigation.navigate(SCREEN.registerOptions)}
            >
              {t("Sign Up")}
            </Text>{" "}
          </Text>
        </KeyboardAwareScrollView>
      </View>
    </Screen>
  );
};
export default Login;
const styles = StyleSheet.create({
  container: {
    flex: 1,

    // paddingHorizontal: pixelPerfect(29),
    // backgroundColor: "red",
  },
  logo: {
    height: pixelPerfect(255),
    width: pixelPerfect(270),
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: pixelPerfect(50),
  },
  txtInputContainer: {
    // marginTop: pixelPerfect(40),
  },
  txtInput: {
    // marginTop: pixelPerfect(15),
  },
  forgotPasswordContainer: {
    marginTop: pixelPerfect(15),
    alignItems: "flex-end",
  },
  forgotPassTxt: {
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(22),
    color: COLORS.secondary,
  },
  btnContainer: {
    marginTop: pixelPerfect(30),
  },
  signupTxt: {
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(22),
    color: COLORS.secondary,
    alignSelf: "center",
    marginTop: pixelPerfect(15),
  },
  underLine: {
    textDecorationLine: "underline",
  },
  loginAsTeamContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: pixelPerfect(20),
  },
  offImg: {
    width: widthPercentageToDP(15),
    height: heightPercentageToDP(10),
  },
  loginAsTeamTxt: {
    color: COLORS.primary,
    fontSize: RFValue(18),
    fontFamily: fonts.robotosemiBold,
    width: "78%",

    textAlign: "left",
  },
});
