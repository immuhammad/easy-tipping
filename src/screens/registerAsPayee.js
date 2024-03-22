//================================ React Native Imported Files ======================================//

import React, { useRef } from "react";
import { StyleSheet, View, Image } from "react-native";
import { useTranslation } from "react-i18next";

//================================ Local Imported Files ======================================//

import Button from "../components/Button";
import { SCREEN } from "../contants/screens";
import Screen from "../components/Screen";
import pixelPerfect from "../utils/pixelPerfect";
import Header from "../components/Header";
import { IMAGES } from "../contants/images";
// import AppSecondaryModal from "../components/AppSecondaryModal";
import TeamAccountAs from "../components/TeamAccountAs";
const RegisterAsPayee = (props) => {
  console.log("social type1122", props?.route?.params?.socailType);
  const { t } = useTranslation();
  // const modalRef = useRef(null);
  const accountAs = useRef(null);
  const _onTeamAccount = () => {
    accountAs.current.setModalVisibility(false);
    setTimeout(() => {
      props.navigation.navigate(SCREEN.register, {
        from: "payee",
        accountType: "team",
        isSocailLogin: props?.route?.params?.isSocailLogin,
        data: props?.route?.params?.data,
        socailType: props?.route?.params?.socailType,
      });
    }, 300);
  };
  const _onJoinTeam = () => {
    accountAs.current.setModalVisibility(false);
    setTimeout(() => {
      props.navigation.navigate(SCREEN.register, {
        from: "payee",
        accountType: "teamMember",
        isSocailLogin: props?.route?.params?.isSocailLogin,
        data: props?.route?.params?.data,
        socailType: props?.route?.params?.socailType,
      });
    }, 300);
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Header
          title={t("Account Type")}
          isBackBtn={true}
          onPressBackIcon={() => props.navigation.goBack()}
        />
        <Image source={IMAGES.logo} style={styles.logo} />
        <View style={styles.btnContainer}>
          <Button
            btnText={t("Individual Account")}
            customeStyle={styles.btn}
            onPress={() =>
              props.navigation.navigate(SCREEN.register, {
                from: "payee",
                accountType: "Indvidual",
                isSocailLogin: props?.route?.params?.isSocailLogin,
                data: props?.route?.params?.data,
                socailType: props?.route?.params?.socailType,
              })
            }
          />
          <Button
            btnText={t("Team Account")}
            customeStyle={styles.btn}
            onPress={() => accountAs.current.setModalVisibility(true)}
          />
          <Button
            btnText={t("Business Account")}
            customeStyle={styles.btn}
            onPress={() =>
              props.navigation.navigate(SCREEN.register, {
                from: "payee",
                accountType: "Bussiness",
                isSocailLogin: props?.route?.params?.isSocailLogin,
                data: props?.route?.params?.data,
                socailType: props?.route?.params?.socailType,
              })
            }
          />
        </View>
      </View>

      <TeamAccountAs
        ref={accountAs}
        onTeamCreate={_onTeamAccount}
        onTeamJoin={_onJoinTeam}
        onCloseClick={() => accountAs.current.setModalVisibility(false)}
      />
    </Screen>
  );
};
export default RegisterAsPayee;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: pixelPerfect(29),
  },

  btnContainer: {
    marginTop: pixelPerfect(50),
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
