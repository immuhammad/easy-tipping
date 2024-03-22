import React, { useState } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  TextInput as Input,
} from "react-native";
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
import { forgotPassword } from "../services/apis";
import Alert from "../common/Alert";
import CountryPicker from "react-native-country-picker-modal";
import { SIZES } from "../contants/sizes";
const ForgotPassword = (props) => {
  const { t, i18n } = useTranslation();
  const [email, setEmail] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [isFocus, setIsFocus] = useState(false);
  const [countryCode, setCountryCode] = useState("US");
  const [country, setCountry] = useState("1");
  const [isVisible, setVisible] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const onSelect = (country) => {
    setCountryCode(country.cca2);
    setCountry(country.callingCode[0]);
  };
  // const _handleForgotPassword = () => {
  //   setIsSubmitted(true);
  //   if (Validations.isEmail(email)) {
  //     setLoading(true);
  //     let data = {
  //       email: email,
  //     };
  //     forgotPassword(data)
  //       .then((res) => {
  //         setLoading(false);
  //         props.navigation.navigate(SCREEN.otpVerification, {
  //           from: "forgotPassword",
  //           data: { ...res.data.data, email: email },
  //         });
  //       })
  //       .catch((error) => {
  //         setLoading(false);
  //         Alert(error?.response.data.data.message);
  //       });
  //   }
  // };

  const _handleForgotPassword = () => {
    setIsSubmitted(true);
    if (Validations.isValidPhone(phoneNumber)) {
      setLoading(true);
      let data = {
        phoneNumber: "+" + country + phoneNumber,
      };
      forgotPassword(data)
        .then((res) => {
          setLoading(false);
          props.navigation.navigate(SCREEN.otpVerification, {
            from: "forgotPassword",
            data: { ...res.data.data, phone: "+" + country + phoneNumber },
          });
        })
        .catch((error) => {
          setLoading(false);
          Alert(error?.response.data.data.message);
        });
    }
  };

  return (
    <Screen>
      <View style={styles.container}>
        {AppLoading(loading)}
        <Header
          title={t("Forgot Password")}
          isBackBtn={true}
          onPressBackIcon={() => props.navigation.navigate(SCREEN.welcome)}
        />
        <KeyboardAwareScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <Image source={IMAGES.logo} style={styles.logo} />

          <Text style={styles.phoneNumberLabel}>{t("Phone Number") + "*"}</Text>
          <View
            style={[
              styles.phoneMainContainer,
              {
                borderColor: isFocus
                  ? COLORS.activeBorder
                  : COLORS.inActiveBorder,
              },
            ]}
          >
            <TouchableOpacity
              activeOpacity={0.8}
              style={[
                styles.mainCountryContainer,
                {
                  height: "100%",
                  alignItems: "center",
                },
              ]}
              onPress={() => setVisible(!isVisible)}
            >
              <CountryPicker
                withCallingCode={true}
                countryCode={countryCode}
                withCallingCodeButton={false}
                withFlagButton={true}
                visible={isVisible}
                containerButtonStyle={styles.pickerButtonStyle}
                onSelect={(Country) => onSelect(Country)}
                withFilter={true}
                onClose={() => setVisible(false)}
              />
              {country ? (
                <Text
                  style={[
                    styles.textInputLabel,
                    {
                      paddingRight: 5,
                      fontSize: pixelPerfect(22),
                      marginTop: 0,
                    },
                  ]}
                >
                  +{country}
                </Text>
              ) : null}
            </TouchableOpacity>
            <View style={styles.dividerStyle} />
            <Input
              style={[
                styles.customInput,
                {
                  textAlign: i18n?.language === "ar" ? "right" : "left",
                  color: isFocus ? COLORS.primary : COLORS.placeholder,
                },
              ]}
              value={phoneNumber}
              onChangeText={setPhoneNumber}
              placeholderTextColor={COLORS.placeholder}
              placeholder={t("Phone Number")}
              keyboardType={"phone-pad"}
              onFocus={() => setIsFocus(true)}
              onBlur={() => setIsFocus(false)}
              maxLength={12}
            />
          </View>
          {isSubmitted && !Validations.isValidPhone(phoneNumber) && (
            <Text style={styles.errorMessageStyle}>
              {t("Please Enter Valid Phone Number")}
            </Text>
          )}

          <View style={styles.btnContainer}>
            <Button
              btnText={t("Reset Password")}
              onPress={_handleForgotPassword}
            />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Screen>
  );
};
export default ForgotPassword;
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
    marginTop: pixelPerfect(100),
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
  phoneNumberLabel: {
    fontFamily: fonts.robotosemiBold,
    color: COLORS.primary,
    fontSize: pixelPerfect(22),

    textAlign: "left",
    marginTop: pixelPerfect(10),
    marginTop: pixelPerfect(100),
  },
  errorMessageStyle: {
    fontFamily: fonts.robotoNormal,
    color: COLORS.error,
    fontSize: pixelPerfect(12),

    textAlign: "left",
  },
  phoneMainContainer: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: SIZES.padding / 4,
    borderWidth: 2,
    borderRadius: SIZES.radius,
    height: pixelPerfect(55),
    alignItem: "center",
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primary,
  },
  mainCountryContainer: {
    flexDirection: "row",
    alignSelf: "center",
  },
  pickerButtonStyle: {
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 5,
    color: COLORS.primary,
  },
  textInputLabel: {
    fontFamily: fonts.robotosemiBold,
    color: COLORS.primary,
    fontSize: pixelPerfect(14),
    textAlign: "left",
    marginTop: pixelPerfect(10),
  },
  customInput: {
    width: "70%",
    height: pixelPerfect(55) - SIZES.padding / 4,
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(22),
    paddingHorizontal: 10,
  },
});
