import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  Alert as AlertNative,
  Image,
} from "react-native";
import Screen from "../components/Screen";
import pixelPerfect from "../utils/pixelPerfect";
import Header from "../components/Header";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import fonts from "../contants/fonts";
import { COLORS } from "../contants/colors";
import Button from "../components/Button";
import OTPInputView from "@twotalltotems/react-native-otp-input";
import { SIZES } from "../contants/sizes";
import H2 from "../common/H2";
import AppSecondaryModal from "../components/AppSecondaryModal";
import { doHttpPost } from "../services/HttpUtils";
import ENDPOINTS from "../contants/apis";
import Alert from "../common/Alert";
import AppLoading from "../common/AppLoader";
import { CommonActions } from "@react-navigation/native";
import { SCREEN } from "../contants/screens";
import {
  resendOTP,
  verifyOTP,
  registerUser,
  sendOtp,
  verifyForgotOTP,
  forgotPassword,
  createStripeConnectLink,
} from "../services/apis";
import { dispatch } from "../redux/store";
import { saveToken, saveUser } from "../redux/slices/userSlice";
import { useSelector } from "../redux/store";
import { IMAGES } from "../contants/images";
import AlertMessage from "../components/AlertMessage";
const OTPVerification = (props) => {
  const { token, user } = useSelector((state) => state.userReducer);
  let { from, data } = props?.route?.params;

  const { t } = useTranslation();
  const [otp, setOtp] = useState();
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  const addStripeRef = useRef(null);
  const alertMessageRef = useRef(null);

  const _handleVerifyOTP = (value) => {
    setLoading(true);

    verifyOTP({ phoneNumber: data.phone, enteredOTP: value })
      .then((res) => {
        if (res.data.success) _handleRegisterUser();
        else Alert("Invalid OTP");
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Alert(
          error?.response?.data?.data?.message
            ? error?.response?.data?.data?.message
            : "Something went wrong!"
        );
      });
  };
  const _handleRegisterUser = () => {
    registerUser(data)
      .then((res) => {
        dispatch(saveToken(res?.data?.data?.accessToken));
        dispatch(saveUser(res?.data?.data?.user));
        if (
          res?.data?.data?.user?.accountType === "teamMember" &&
          res?.data?.data?.user?.userType != "payer" &&
          res?.data?.data?.user?.teamCode !== undefined
        ) {
          setLoading(false);
          onTeamJoin();
        } else if (res?.data?.data?.user?.userType == "payer") {
          setLoading(false);
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: SCREEN.bottomTab }],
            })
          );
        } else {
          setLoading(false);
          setTimeout(() => {
            addStripeRef.current.setModalVisibility(true);
          }, 300);
        }
      })
      .catch((error) => {
        setLoading(false);
        Alert(
          error?.response?.data?.data?.message
            ? error?.response?.data?.data?.message
            : "Something went wrong!"
        );
      });
  };

  const _handleResendOTP = () => {
    setLoading(true);
    resendOTP({ phoneNumber: data?.phone })
      .then((res) => {
        Alert("Resent OTP on provided phone.", "success");
        setLoading(false);
      })
      .catch((error) => {
        setLoading(false);
        Alert(
          error?.response?.data?.data?.message
            ? error?.response?.data?.data?.message
            : "Something went wrong!"
        );
      });
  };

  const _handleVerifyForgotPassword = (value) => {
    setLoading(true);
    verifyForgotOTP({ phoneNumber: data?.phone, enteredOTP: value })
      .then((res) => {
        setLoading(false);

        if (res?.data?.success) {
          props.navigation.navigate(SCREEN.resetPassword, {
            data: data,
            otp: value,
          });
        } else Alert(t("Invalid OTP!"));
      })
      .catch((error) => {
        setLoading(false);

        Alert(t("Invalid OTP!"));
      });
  };
  const _handleResendForgotOtp = () => {
    setLoading(true);
    forgotPassword({ phoneNumber: data?.phone })
      .then((res) => {
        setLoading(false);
        Alert("OTP resent to your given phone number.", "success");
      })
      .catch((error) => {
        setLoading(false);

        Alert(
          error?.response?.data?.data?.message
            ? error?.response?.data?.data?.message
            : "Something went wrong!"
        );
      });
  };

  const _handleCreateStripeLink = () => {
    addStripeRef.current.setModalVisibility(false);
    setTimeout(() => {
      props.navigation.navigate(SCREEN.STRIPESCREEN);
      // setLoading(true);
      // createStripeConnectLink(token)
      //   .then((res) => {
      //     setLoading(false);
      //     onRegisterStipeAccount(res.data.data.url);
      //   })
      //   .catch((error) => {
      //     console.log("error on creating link ", error);
      //     setLoading(false);
      //     Alert(error?.response?.data?.data?.message);
      //   });
    }, 400);
  };

  const onRegisterStipeAccount = (link) => {
    addStripeRef.current.setModalVisibility(false);
    props.navigation.navigate(SCREEN.webView, {
      from: "register",
      user: user,
      link: link,
      showHeader: false,
    });
  };

  const onLaterRegisterStripeAccount = () => {
    addStripeRef.current.setModalVisibility(false);
    setTimeout(() => {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: SCREEN.bottomTab }],
        })
      );
    }, 700);
  };

  const onTeamJoin = () => {
    setAlertMessage(
      t(
        "Your request has been sent to the team admin. Please wait for your request to be approved."
      )
    );
    alertMessageRef.current.setModalVisibility(true);
    // AlertNative.alert(
    //   "Signup Successful",
    //   "Your request has been sent to the team admin. Please wait for your request to be approved.",
    //   [
    //     {
    //       text: "OK",
    //       onPress: () => {
    //         props.navigation.dispatch(
    //           CommonActions.reset({
    //             index: 0,
    //             routes: [{ name: SCREEN.login }],
    //           })
    //         );
    //       },
    //     },
    //   ],
    //   { cancelable: false }
    // );
  };

  const onJoinRequestSent = () => {
    alertMessageRef.current.setModalVisibility(false);
    setTimeout(() => {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: SCREEN.login }],
        })
      );
    }, 300);
  };
  return (
    <Screen>
      <View style={styles.container}>
        {AppLoading(loading)}
        <Header
          title={t("Verification")}
          isBackBtn={true}
          onPressBackIcon={() => props.navigation.goBack()}
        />
        <KeyboardAwareScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <Image source={IMAGES.logo} style={styles.logo} />
          <View style={styles.lableContainer}>
            <H2 text={t("Enter Verification Code")} />
          </View>
          <Text style={styles.sentTxt}>
            {t("Please enter the OTP sent via SMS and/or Email")}
          </Text>
          <View style={styles.otpInputContainer}>
            <OTPInputView
              style={styles.otpStyle}
              pinCount={6}
              // code={this.state.code} //You can supply this prop or not. The component will be used as a controlled / uncontrolled component respectively.
              // onCodeChanged = {code => { this.setState({code})}}
              codeInputFieldStyle={styles.inputBoxStyle}
              codeInputHighlightStyle={styles.inputActiveBoxStyle}
              placeholderCharacter="__"
              placeholderTextColor={COLORS.inActiveBorder}
              onCodeChanged={(e) => setOtp(e)}
              onCodeFilled={
                from == "forgotPassword"
                  ? _handleVerifyForgotPassword
                  : _handleVerifyOTP
              }
            />
          </View>
          <View style={styles.optResendContainer}>
            <Text style={styles.resendOTPTxt}>
              {t("Did not receive a code? ")}
              <Text
                style={styles.underLine}
                onPress={
                  from == "forgotPassword"
                    ? _handleResendForgotOtp
                    : _handleResendOTP
                }
              >
                {t("Resend")}
              </Text>{" "}
            </Text>
          </View>

          <AppSecondaryModal
            ref={addStripeRef}
            title={t("To receive tips, register for a Stripe account now.")}
            acceptTitle={t("Now")}
            rejectTitle={t("Later")}
            onAccept={_handleCreateStripeLink}
            onReject={onLaterRegisterStripeAccount}
          />
        </KeyboardAwareScrollView>
      </View>
      <AlertMessage
        ref={alertMessageRef}
        title={alertMessage}
        acceptTitle={t("Ok")}
        onAccept={onJoinRequestSent}
      />
    </Screen>
  );
};
export default OTPVerification;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  otpInputContainer: {
    marginTop: pixelPerfect(50),
    height: pixelPerfect(60),
  },
  otpStyle: {
    width: "100%",
    alignSelf: "center",
    color: COLORS.activeBorder,
  },
  inputBoxStyle: {
    borderRadius: SIZES.radius,
    borderColor: COLORS.inActiveBorder,
    color: COLORS.primary,
    borderWidth: 2,
    fontSize: pixelPerfect(22),
  },
  inputActiveBoxStyle: {
    borderRadius: SIZES.radius,
    borderColor: COLORS.activeBorder,
  },
  lableContainer: {
    alignItems: "center",
    marginTop: pixelPerfect(50),
  },
  optResendContainer: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: pixelPerfect(30),
  },
  btnContainer: {
    marginTop: pixelPerfect(186),
  },
  resendOTPTxt: {
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(13.5),
    color: COLORS.secondary,
    alignSelf: "center",
  },
  underLine: {
    textDecorationLine: "underline",
    fontFamily: fonts.robotoBold,
  },
  logo: {
    height: pixelPerfect(255),
    width: pixelPerfect(270),
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: pixelPerfect(50),
  },
  sentTxt: {
    color: COLORS.primary,
    fontFamily: fonts.robotoNormal,
    alignSelf: "center",
  },
});
