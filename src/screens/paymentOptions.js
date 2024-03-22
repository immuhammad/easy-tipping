import React from "react";
import { StyleSheet, View, Text, Image } from "react-native";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";
import { SCREEN } from "../contants/screens";
import Screen from "../components/Screen";
import pixelPerfect from "../utils/pixelPerfect";
import Header from "../components/Header";
import fonts from "../contants/fonts";
import { heightPercentageToDP } from "react-native-responsive-screen";
import { COLORS } from "../contants/colors";
import { IMAGES } from "../contants/images";

const PaymentOptions = (props) => {
  const { from } = props.route.params;
  const { t } = useTranslation();
  return (
    <Screen>
      <View style={styles.container}>
        <Header
          title={t("Get Receiver Details")}
          isBackBtn={true}
          onPressBackIcon={() => props.navigation.goBack()}
        />
        <Image source={IMAGES.logo} style={styles.logo} />
        <View style={styles.btnContainer}>
          <Button
            btnText={t("Scan QR Code")}
            customeStyle={styles.btn}
            onPress={() =>
              props.navigation.navigate(SCREEN.scanQRCode, { from })
            }
          />
          <Text style={[styles.orLoginTxt, { marginTop: 20, marginBottom: 8 }]}>
            {t("OR")}
          </Text>
          <Button
            btnText={t("Enter Unique ID")}
            customeStyle={styles.btn}
            onPress={() =>
              props.navigation.navigate(SCREEN.enterUniqueCode, { from })
            }
          />
        </View>
      </View>
    </Screen>
  );
};
export default PaymentOptions;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnContainer: { flex: 1, justifyContent: "center" },
  btn: {
    marginTop: pixelPerfect(15),
  },
  orLoginTxt: {
    color: COLORS.primary,
    fontSize: pixelPerfect(16),
    fontFamily: fonts.sourceSansSemiBold,
    textAlign: "center",
  },
  logo: {
    height: pixelPerfect(255),
    width: pixelPerfect(270),
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: pixelPerfect(50),
  },
});
