//================================ React Native Imported Files ======================================//

import React from "react";
import {
  Image,
  StyleSheet,
  TextInput,
  TouchableWithoutFeedback,
  View,
} from "react-native";

//================================ Local Imported Files ======================================//

import { COLORS } from "../contants/colors";
import pixelPerfect from "../utils/pixelPerfect";
import fonts from "../contants/fonts";

const AppInput = (props) => {
  return (
    <View
      style={[
        styles.inputFieldTextView,
        props.style,
        props.shadow,
        {
          height: props.height || pixelPerfect(60),
          width: props.width || pixelPerfect(281),
          marginTop: props.marginTop || 0,
          paddingBottom: props.paddingBottom,
          paddingTop: props.paddingTop,
          backgroundColor: props.backgroundColor || COLORS.white,
          paddingLeft: props.paddingLeft || "0%",
          borderWidth: props.borderWidth,
          borderColor: props.borderColor || COLORS.primary,
          borderRadius: props.borderRadius || pixelPerfect(10),
        },
      ]}
    >
      {props.leftIconPath !== undefined && (
        <Image
          style={
            props.imageStyle !== undefined
              ? props.imageStyle
              : {
                  height: pixelPerfect(24),
                  width: pixelPerfect(24),
                  resizeMode: "contain",
                  marginLeft: pixelPerfect(15),
                }
          }
          source={props.leftIconPath}
        />
      )}
      <TextInput
        value={props.value}
        secureTextEntry={props.secureTextEntry}
        style={[styles.inputFieldText, props.textInputStyle]}
        onChangeText={props.onChangeText}
        autoCapitalize={"none"}
        placeholder={props.placeholder}
        placeholderTextColor={
          props.placeholderTextColor
            ? props.placeholderTextColor
            : COLORS.primary
        }
        onSubmitEditing={props.onSubmitEditing}
        onFocus={props.onFocus}
        onBlur={props.onBlur}
        ref={props.ref}
        multiline={props.multiline}
        maxHeight={props.maxHeight}
        autoGrow={props.autoGrow}
        onContentSizeChange={props.onContentSizeChange}
        onEndEditing={props.onEndEditing}
        keyboardType={props.keyboardType}
        textAlignVertical={props.textAlignVertical}
        editable={props.editable}
      />
      {props.rightIconPath !== undefined && (
        <TouchableWithoutFeedback onPress={props.onRightIconPress}>
          <Image
            source={props.rightIconPath}
            style={{ height: 25, width: 25, resizeMode: "contain" }}
          />
        </TouchableWithoutFeedback>
      )}
    </View>
  );
};

export default AppInput;

const styles = StyleSheet.create({
  inputFieldTextView: {
    flexDirection: "row",
    alignItems: "center",
    alignSelf: "center",
  },
  inputFieldText: {
    paddingHorizontal: pixelPerfect(16),
    height: "100%",
    width: "88%",
    fontFamily: fonts.robotoNormal,
    fontSize: pixelPerfect(15),
    textAlignVertical: "top",
    color: COLORS.primary,

    // backgroundColor: 'red',
  },
});
