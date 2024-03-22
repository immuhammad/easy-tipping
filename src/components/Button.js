import React from "react";
import {
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  View,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  widthPercentageToDP as w,
  heightPercentageToDP as h,
} from "react-native-responsive-screen";
import { COLORS } from "../contants/colors";
import fonts from "../contants/fonts";
import propTypes from "prop-types";
import * as Animatable from "react-native-animatable";
import pixelPerfect from "../utils/pixelPerfect";
import LinearGradient from "react-native-linear-gradient";
const CustomeButton = (props) => {
  return (
    <Animatable.View
      animation={"zoomIn"}
      duration={props.duration ? props.duration : 0}
      style={{
        shadowColor: COLORS.primary,
        shadowOffset: {
          width: 0,
          height: 4,
        },
        shadowOpacity: 0.3,
        shadowRadius: 4.65,

        elevation: 8,
      }}
    >
      <TouchableOpacity
        disabled={props.disabled}
        activeOpacity={0.5}
        onPress={props.onPress}
        ref={props?.ref}
      >
        <LinearGradient
          colors={
            props.disabled
              ? ["#C5C5C5", "#C5C5C5", "#C5C5C5"]
              : ["#499662", "#1C6748", "#35764A"]
          }
          // start={{ x: 0, y: 1 }}
          // end={{ x: 1, y: 0 }}

          locations={[0.23, 0.51, 0.74]}
          useAngle={true}
          angle={125.9}
          style={[props.btn, { ...props.customeStyle }]}
        >
          <Text style={[props.btnTextStyle, { ...props.customeTextStyle }]}>
            {props.btnText}
          </Text>
        </LinearGradient>
      </TouchableOpacity>
    </Animatable.View>
  );
};

export default CustomeButton;

CustomeButton.propTypes = {
  button: propTypes.string,
  onPress: propTypes.func,
  style: propTypes.object,
  btn: propTypes.object,
  customeStyle: propTypes.object,
  customeTextStyle: propTypes.object,
  btnText: propTypes.string,
  disabled: propTypes.bool,
};
CustomeButton.defaultProps = {
  button: "",
  btnText: "Button",
  customeTextStyle: {},
  customeStyle: {},
  disabled: false,
  btn: {
    width: "100%",
    height: pixelPerfect(60),
    borderRadius: h(1),
    justifyContent: "center",
    alignItems: "center",
    alignSelf: "center",
    // borderColor: colors.secondary,
    // borderWidth: 1,
  },
  btnTextStyle: {
    color: COLORS.white,
    fontSize: pixelPerfect(22),
    fontFamily: fonts.robotosemiBold,
    textAlign: "center",
  },
  onPress: () => console.log("Button Pressed"),
};
