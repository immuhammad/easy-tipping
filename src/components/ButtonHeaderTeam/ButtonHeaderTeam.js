import { t } from "i18next";
import React, { useState } from "react";
import { View, TouchableOpacity, Text, StyleSheet } from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { COLORS } from "../../contants/colors";
import fonts from "../../contants/fonts";

const ButtonHeaderTeam = (props) => {
  const [activeBtn, setActiveBtn] = useState(1);

  return (
    <View style={styles.mainContiner}>
      <TouchableOpacity
        onPress={() => {
          setActiveBtn(1), props.active(1);
        }}
        style={activeBtn === 1 ? styles.activeBtn : styles.inActiveBtn}
      >
        <Text style={activeBtn === 1 ? styles.activeTxt : styles.inActiveTxt}>
          {t("Members")}
        </Text>
      </TouchableOpacity>
      <TouchableOpacity
        onPress={() => {
          setActiveBtn(2), props.active(2);
        }}
        style={activeBtn === 2 ? styles.activeBtn : styles.inActiveBtn}
      >
        <Text style={activeBtn === 2 ? styles.activeTxt : styles.inActiveTxt}>
          {t("Requests")}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContiner: {
    width: widthPercentageToDP(90),
    height: heightPercentageToDP(6.5),
    backgroundColor: "#EFEFEF",
    marginTop: heightPercentageToDP(3),
    alignSelf: "center",
    borderRadius: heightPercentageToDP(1),
    flexDirection: "row",
  },
  activeBtn: {
    width: widthPercentageToDP(45),
    height: heightPercentageToDP(6.5),
    backgroundColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    borderRadius: heightPercentageToDP(1),
  },
  inActiveBtn: {
    width: widthPercentageToDP(45),
    height: heightPercentageToDP(6.5),
    backgroundColor: "#EFEFEF",
    alignItems: "center",
    justifyContent: "center",
    borderRadius: heightPercentageToDP(3),
  },
  activeTxt: {
    color: COLORS.white,
    fontFamily: fonts.sourceSansBold,
    fontSize: RFValue(13),
  },
  inActiveTxt: {
    color: COLORS.primary,
    fontFamily: fonts.sourceSansSemiBold,
    fontSize: RFValue(13),
  },
});

export default ButtonHeaderTeam;
