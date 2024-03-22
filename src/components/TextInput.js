import React, { useState } from "react";
import {
  Alert,
  TextInput,
  View,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import propTypes from "prop-types";
import { COLORS } from "../contants/colors";
import { SIZES } from "../contants/sizes";
import pixelPerfect from "../utils/pixelPerfect";
import fonts from "../contants/fonts";
import { IMAGES } from "../contants/images";
import { useTranslation } from "react-i18next";
const CustomeTextInput = (props) => {
  const [isFocus, setIsFocus] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const { t, i18n } = useTranslation();
  const focus = () => {
    setIsFocus(true);
    props?.onFocus();
  };
  const blur = () => {
    setIsFocus(false);
    props?.onBlur();
  };
  return (
    <View style={[props.mainContainer, { ...props.customMainContainer }]}>
      <Text style={[props.textInputLabel, { ...props.customLabelStyle }]}>
        {props.label ? props.label : props.placeholder}
        {props?.isMandatory ? "*" : ""}
      </Text>
      <View
        style={[
          props.container,
          { ...props.customInputContainer },
          {
            borderColor: props.isBackroundTransparent
              ? COLORS.white
              : isFocus
              ? COLORS.activeBorder
              : COLORS.inActiveBorder,
          },
        ]}
      >
        <TextInput
          placeholder={props.placeholder}
          placeholderTextColor={props.placeholderTextColor}
          onChangeText={props.onChangeText}
          editable={props.editable}
          style={[
            props.textInputStyle,
            { ...props.customeStyleTextInput },
            props.isPassword && { width: "90%" },
            i18n?.language === "ar" && { textAlign: "right" },

            { color: isFocus ? COLORS.primary : COLORS.placeholder },
          ]}
          secureTextEntry={props.secureTextEntry ? !showPassword : false}
          value={props.value}
          // maxLength={props.length ? props.length : null}
          keyboardType={props.keyboardType}
          maxLength={props.maxLength}
          multiline={props.multiline}
          autoCorrect={false}
          autoComplete="off"
          textAlignVertical={props.textAlignVertical}
          onFocus={focus}
          onBlur={blur}
          autoCapitalize={"none"}

          // textAlign={props?.multiline ? 'top' : ''}
          // verticalAlign="top"
        />
        {props.isPassword && (
          <TouchableOpacity
            style={{
              width: "10%",
              alignItems: "center",
              justifyContent: "center",
            }}
            onPress={() => setShowPassword(!showPassword)}
          >
            {showPassword ? (
              <Image source={IMAGES.hideIcon} style={props.passwordIcon} />
            ) : (
              <Image source={IMAGES.showIcon} style={props.passwordIcon} />
            )}
          </TouchableOpacity>
        )}
      </View>
      {props.errorMessage != "" && (
        <Text style={props.errorMessageStyle}>{props.errorMessage}</Text>
      )}
    </View>
  );
};
export default CustomeTextInput;

CustomeTextInput.propTypes = {
  style: propTypes.object,
  customStyle: propTypes.object,
  isValid: propTypes.bool,
  placeholder: propTypes.string,
  placeholderTextColor: propTypes.string,
  onChangeText: propTypes.func,
  textInputStyle: propTypes.object,
  customeStyleTextInput: propTypes.object,
  secureTextEntry: propTypes.bool,
  value: propTypes.string,
  maxLength: propTypes.number,
  fill: propTypes.bool,
  container: propTypes.object,
  mainContainer: propTypes.object,
  TextInputContainer: propTypes.object,
  TextinputTextStyle: propTypes.object,
  keyboardType: propTypes.string,
  customeTextStyle: propTypes.object,
  multiline: propTypes.bool,
  onFocus: propTypes.func,
  errorMessage: propTypes.string,
  errorMessageStyle: propTypes.object,
  isPassword: propTypes.bool,
  passwordIcon: propTypes.object,
  customMainContainer: propTypes.object,
  isBackroundTransparent: propTypes.bool,
  textInputLabel: propTypes.object,
  placeholderTxtColor: propTypes.object,
};

CustomeTextInput.defaultProps = {
  onChangeText: (text) => console.log(text),
  onFocus: () => console.log(""),
  onBlur: () => console.log(""),
  isBackroundTransparent: false,
  value: "",
  customStyle: {},
  customeStyleTextInput: {},
  customeTextStyle: {},
  secureTextEntry: false,
  length: null,
  placeholder: "placeholder",
  placeholderTextColor: COLORS.placeholder,
  Text: "",
  fill: false,
  keyboardType: "default",
  errorMessage: "",
  errorMessageStyle: {
    fontFamily: fonts.robotoNormal,
    color: COLORS.error,
    fontSize: pixelPerfect(15),

    textAlign: "left",
  },
  isPassword: false,
  container: {
    width: "100%",
    paddingHorizontal: SIZES.padding / 4,
    borderColor: COLORS.inActiveBorder,
    borderWidth: 2,
    borderRadius: SIZES.radius,
    height: pixelPerfect(60),
    flexDirection: "row",
    alignItem: "center",
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primary,

    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.3,
    // shadowRadius: 4.65,

    // elevation: 8,
  },

  textInputStyle: {
    width: "100%",
    height: "100%",
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(22),
    paddingHorizontal: 5,
  },
  mainContainer: {
    width: "100%",
    backgroundColor: COLORS.white,
    marginTop: pixelPerfect(10),
  },
  passwordIcon: {
    width: pixelPerfect(20),
    height: pixelPerfect(13.94),
  },
  customMainContainer: {},
  textInputLabel: {
    fontFamily: fonts.robotosemiBold,
    color: COLORS.primary,
    fontSize: pixelPerfect(22),

    textAlign: "left",
  },
  customLabelStyle: {},
  multiline: false,
  placeholderTxtColor: {},
};
