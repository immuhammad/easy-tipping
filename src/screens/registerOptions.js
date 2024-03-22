//================================ React Native Imported Files ======================================//

import React from "react";
import { StyleSheet, View, Image } from "react-native";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";
import { SCREEN } from "../contants/screens";
import Screen from "../components/Screen";
import pixelPerfect from "../utils/pixelPerfect";
import Header from "../components/Header";
import { IMAGES } from "../contants/images";
const RegisterOptions = (props) => {
  const { t, i18n } = useTranslation();

  return (
    <Screen>
      <View style={styles.container}>
        <Header
          title={t("Register As")}
          isBackBtn={true}
          onPressBackIcon={() => props.navigation.goBack()}
        />
        <Image source={IMAGES.logo} style={styles.logo} />
        <View style={styles.btnContainer}>
          <Button
            btnText={t("Tip Receiver")}
            customeStyle={styles.btn}
            onPress={() =>
              props.navigation.navigate(SCREEN.registerAsPayee, {
                from: "payee",
                isSocailLogin: props?.route?.params?.isSocailLogin,
                data: props?.route?.params?.data,
                socailType: props?.route?.params?.socailType,
              })
            }
          />

          <Button
            btnText={t("Tip Giver")}
            customeStyle={styles.btn}
            onPress={() =>
              props.navigation.navigate(SCREEN.register, {
                from: "payer",
                isSocailLogin: props?.route?.params?.isSocailLogin,
                data: props?.route?.params?.data,
                socailType: props?.route?.params?.socailType,
              })
            }
          />
        </View>
      </View>
    </Screen>
  );
};
export default RegisterOptions;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  btnContainer: {
    marginTop: pixelPerfect(70),
  },
  btn: {
    marginTop: pixelPerfect(15),
  },
  logo: {
    height: pixelPerfect(255),
    width: pixelPerfect(270),
    resizeMode: "contain",
    alignSelf: "center",
    marginTop: pixelPerfect(50),
  },
});
