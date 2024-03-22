//================================ React Native Imported Files ======================================//

import React from "react";
import {
  Image,
  View,
  Text,
  StyleSheet,
  SafeAreaView,
  TouchableOpacity,
} from "react-native";
import {
  widthPercentageToDP as wp,
  heightPercentageToDP as hp,
} from "react-native-responsive-screen";
import { useTranslation } from "react-i18next";
import { COLORS } from "../contants/colors";
import fonts from "../contants/fonts";
import pixelPerfect from "../utils/pixelPerfect";

const AppHeader = (props) => {
  return (
    <SafeAreaView
      style={[
        styles.container,
        {
          backgroundColor:
            props.backgroundColor !== undefined
              ? props.backgroundColor
              : COLORS.white,
        },
      ]}
    >
      <TouchableOpacity
        style={[styles.headerProfile, { width: wp(10) }]}
        onPress={props.onLeftIconPress}
      >
        {props.leftIconPath !== undefined && (
          <Image
            resizeMode="contain"
            style={[
              styles.img,
              props.lefticonSize !== undefined
                ? {
                    height: props.lefticonSize,
                    width: props.lefticonSize,
                  }
                : { height: pixelPerfect(20), width: pixelPerfect(11.5) },
              {
                tintColor: props.tintColor ? props.tintColor : COLORS.secondary,
              },
            ]}
            source={props.leftIconPath}
          />
        )}

        {props.leftText !== undefined && (
          <Text style={styles.text}>{props.leftText}</Text>
        )}
      </TouchableOpacity>
      <View style={styles.headerLogo}>
        {props.titleLogoPath !== undefined && (
          <Image
            style={
              props.titleLogosize !== undefined
                ? {
                    height: props.titleLogosize,
                    width: props.titleLogosize,
                  }
                : { width: 30, height: 30 }
            }
            source={props.titleLogoPath}
          />
        )}
        {props.title && (
          <Text style={[styles.title, { color: COLORS.primary }]}>
            {props.title !== undefined ? props.title : "Header"}
          </Text>
        )}
      </View>
      <TouchableOpacity
        style={styles.headerMenu}
        onPress={props.onRightIconPress}
      >
        {props.rightIconOnePath !== undefined && (
          <View
            style={{
              height: hp(4),
              width: hp(4),
              borderRadius: hp(1),
              justifyContent: "center",
              alignItems: "center",
              marginRight: wp(2),
            }}
          >
            <Image
              resizeMode="contain"
              style={[
                styles.img,
                { tintColor: COLORS.white },
                props.rightIconSize !== undefined
                  ? {
                      height: props.rightIconSize,
                      width: props.rightIconSize,
                    }
                  : { height: pixelPerfect(20), width: pixelPerfect(22) },
              ]}
              source={props.rightIconOnePath}
            />
          </View>
        )}

        {props.rightIconTwoPath !== undefined && (
          <Image
            resizeMode="cover"
            style={[
              styles.img,
              props.rightIconSize !== undefined
                ? {
                    height: props.rightIconSize,
                    width: props.rightIconSize,
                    borderRadius: props.rightIconSize,
                  }
                : {
                    height: 25,
                    width: 25,
                  },
            ]}
            source={{ uri: props.rightIconTwoPath }}
          />
        )}

        {props.rightText !== undefined && (
          <Text style={styles.text}>{props.rightText}</Text>
        )}
      </TouchableOpacity>
    </SafeAreaView>
  );
};

export default AppHeader;

const styles = StyleSheet.create({
  container: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  headerProfile: {
    justifyContent: "flex-start",
    alignSelf: "center",
    flexDirection: "row",
  },
  headerLogo: {
    flexDirection: "row",
    justifyContent: "center",
    alignItems: "center",
    width: wp(60),
  },
  headerMenu: {
    flexDirection: "row",
    width: wp(10),
    alignItems: "center",
    alignSelf: "center",
    justifyContent: "center",
  },
  title: {
    fontFamily: fonts.sourceSansSemiBold,
    fontSize: pixelPerfect(30),
    color: COLORS.primary,
    textAlign: "center",
  },
  text: {
    alignSelf: "center",
    marginLeft: wp(2),
    fontSize: wp(4.4),
    paddingLeft: wp(1),
  },
  img: {
    alignSelf: "center",
  },
});
