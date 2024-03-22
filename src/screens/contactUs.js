//================================ React Native Imported Files ======================================//

import React, { useState } from "react";
import {
  StyleSheet,
  View,
  Text,
  TouchableOpacity,
  TextInput as Input,
} from "react-native";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";

//================================ Local Imported Files ======================================//

import fonts from "../contants/fonts";
import { COLORS } from "../contants/colors";
import Button from "../components/Button";
import Header from "../components/Header";
import Screen from "../components/Screen";
import TextInput from "../components/TextInput";
import pixelPerfect from "../utils/pixelPerfect";
import CountryPicker from "react-native-country-picker-modal";
import { SIZES } from "../contants/sizes";
import Validations from "../utils/Validations";
import AppLoading from "../common/AppLoader";
import Alert from "../common/Alert";
import { sendMessageToSupport } from "../services/apis";
import { useSelector } from "../redux/store";
const ContactUs = (props) => {
  const { t, i18n } = useTranslation();
  const { token, user } = useSelector((state) => state.userReducer);
  const [name, setName] = useState("");
  const [number, setNumber] = useState("");
  const [email, setEmail] = useState("");
  const [message, setMessage] = useState("");
  const [countryCode, setCountryCode] = useState("US");
  const [country, setCountry] = useState("1");
  const [isVisible, setVisible] = useState(false);

  const [isFocus, setIsFocus] = useState(false);
  const [phoneNumber, setPhoneNumber] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const onSelect = (country) => {
    setCountryCode(country.cca2);
    setCountry(country.callingCode[0]);
  };
  const handleContactUs = () => {
    setIsSubmitted(true);
    if (
      Validations.isEmail(email) &&
      Validations.isValidName(name) &&
      Validations.isValidPhone(phoneNumber) &&
      message != ""
    ) {
      const data = {
        name: name,
        email: email,
        contactNumber: country + phoneNumber,
        message: message,
      };
      setLoading(true);
      sendMessageToSupport(token, data)
        .then((res) => {
          setLoading(false);

          Alert(
            t(
              "Thank you for contacting our support team. We have received your message and appreciate you reaching out to us."
            ),
            "success"
          );
          props.navigation.goBack();
        })
        .catch((error) => {
          setLoading(false);

          Alert(
            error?.response?.data?.data?.message
              ? error?.response?.data?.data?.message
              : "Something went wrong!"
          );
        });
    }
  };

  const _handleSetMessage = (txt) => {
    if (txt.length < 301) setMessage(txt);
  };

  return (
    <Screen>
      {AppLoading(loading)}
      <View style={styles.container}>
        <Header
          title={t("Contact Us")}
          isBackBtn={true}
          onPressBackIcon={() => props.navigation.goBack()}
        />
        <KeyboardAwareScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View style={styles.txtInputContainer}>
            <TextInput
              customInputContainer={styles.txtInput}
              value={name}
              onChangeText={setName}
              placeholder={t("Enter Name")}
              label={t("Name")}
              errorMessage={
                !isSubmitted
                  ? ""
                  : Validations.isValidName(name)
                  ? ""
                  : t("Please Enter Valid Name")
              }
            />

            <Text style={styles.phoneNumberLabel}>{t("Phone Number")}</Text>

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
                style={styles.mainCountryContainer}
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

                    height: "100%",
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

            <TextInput
              customInputContainer={styles.txtInput}
              value={user?.email}
              onChangeText={setEmail}
              placeholder={t("Email Address")}
              label={t("Email")}
              errorMessage={
                !isSubmitted
                  ? ""
                  : Validations.isEmail(email)
                  ? ""
                  : t("Please Enter Valid Email")
              }
              editable={false}
            />
            <TextInput
              customeStyleTextInput={{ height: pixelPerfect(148) }}
              customInputContainer={{
                height: pixelPerfect(148),
                // marginTop: pixelPerfect(15),
              }}
              value={message}
              onChangeText={_handleSetMessage}
              multiline={true}
              textAlignVertical={"top"}
              placeholder={t("Message")}
              label={t("Message")}
              errorMessage={
                !isSubmitted
                  ? ""
                  : message != ""
                  ? ""
                  : t("Please Enter Message")
              }
            />
            <Text style={styles.txtCount}>{message?.length}/300</Text>
          </View>

          <View style={styles.btnContainer}>
            <Button btnText={t("Submit")} onPress={handleContactUs} />
          </View>
        </KeyboardAwareScrollView>
      </View>
    </Screen>
  );
};
export default ContactUs;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: pixelPerfect(29),
  },
  txtInputContainer: {
    marginTop: pixelPerfect(100),
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
    fontSize: pixelPerfect(12),
    color: COLORS.secondary,
  },
  btnContainer: {
    marginTop: pixelPerfect(142),
  },
  signupTxt: {
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(12),
    color: COLORS.secondary,
    alignSelf: "center",
    marginTop: pixelPerfect(15),
  },
  underLine: {
    textDecorationLine: "underline",
  },
  dividerStyle: {
    height: pixelPerfect(30),
    alignSelf: "center",
    width: pixelPerfect(1),
    backgroundColor: COLORS.primary,
  },
  customInput: {
    width: "70%",
    height: pixelPerfect(55) - SIZES.padding / 2,
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(22),
    paddingHorizontal: 10,
  },
  phoneNumberLabel: {
    fontFamily: fonts.robotosemiBold,
    color: COLORS.primary,
    fontSize: pixelPerfect(22),

    textAlign: "left",
    marginTop: pixelPerfect(10),
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
    height: "100%",
    alignItems: "center",
  },
  textInputLabel: {
    fontFamily: fonts.robotosemiBold,
    color: COLORS.primary,
    fontSize: pixelPerfect(18),
    textAlign: "left",
    marginTop: pixelPerfect(10),
  },
  txtCount: {
    fontFamily: fonts.robotosemiBold,
    color: COLORS.primary,
    fontSize: pixelPerfect(16),
    textAlign: "left",
  },
});
