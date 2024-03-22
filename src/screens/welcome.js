//================================ React Native Imported Files ======================================//

import React, { useState, useEffect, useRef } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  Animated,
  I18nManager,
  TouchableOpacity,
  ScrollView,
} from "react-native";
import { useTranslation } from "react-i18next";

//================================ Local Imported Files ======================================//

import { COLORS } from "../contants/colors";
import Button from "../components/Button";
import SocialLogin from "../components/SocialLogin";
import { SCREEN } from "../contants/screens";
import Screen from "../components/Screen";
import { IMAGES } from "../contants/images";
import pixelPerfect from "../utils/pixelPerfect";
import fonts from "../contants/fonts";
import AppCurrencyModal from "../components/CurrencyModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import RNRestart from "react-native-restart";
import { RFValue } from "react-native-responsive-fontsize";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import Geolocation from "@react-native-community/geolocation";
import { getGeoLocationBasedCurrency } from "../services/apis";
import ALLCURRENCIES from "../contants/currencies";
import { dispatch } from "../redux/store";
import { useSelector } from "../redux/store";
import { updateCurrency } from "../redux/slices/netInfoSlice";
import AppUpdatePopup from "../components/updateAppPopup";
const Welcome = (props) => {
  const { currency } = useSelector((state) => state.netInfoReducer);
  const { t, i18n } = useTranslation();
  const languageModal = useRef(null);

  const btnRef = useRef(null);
  const Languages = [
    {
      id: 0,
      name: "English",
      image: IMAGES.USFlag,
    },
    {
      id: 1,
      name: "French",
      image: IMAGES.franceFlag,
    },
    {
      id: 2,
      name: "Spanish",
      image: IMAGES.spanishFlag,
    },
    {
      id: 3,
      name: "Arabic",
      image: IMAGES.KSAFlag,
    },
    {
      id: 4,
      name: "Italian",
      image: IMAGES.italianFlag,
    },
    {
      id: 5,
      name: "German",
      image: IMAGES.germanFlag,
    },
  ];

  // let [logoSize, setLogoSize] = useState(new Animated.Value(200));
  var logoSize = new Animated.Value(0);

  useEffect(() => {
    Animated.timing(logoSize, {
      toValue: 100,
      duration: 1000,
    }).start();
  }, []);

  useEffect(() => {
    getCurrentLocation();
  }, []);

  const getCurrentLocation = () => {
    if (Platform.OS == "ios") Geolocation.requestAuthorization();
    Geolocation.getCurrentPosition((info) => {
      _handleGeoBasedCurrency(info.coords.latitude, info.coords.longitude);
    });
  };

  const _handleGeoBasedCurrency = (lat, lng) => {
    getGeoLocationBasedCurrency(null, { lat: lat, long: lng })
      .then((res) => {
        //check if stripe supports

        let currentCurrency = ALLCURRENCIES.filter(
          (data) => data.code == res.data.data.currencyCode
        );
        console.log("response for get currency ", currentCurrency[0]);

        if (currentCurrency.length > 0) {
          dispatch(updateCurrency(currentCurrency[0]));
        }
        console.log(
          "currency is ",
          ALLCURRENCIES.filter(
            (data) => data.code == res.data.data.currencyCode
          )
        );
      })
      .catch((error) => {
        console.log("error on get currency ", error);
      });
  };

  const onSelectLanguage = async (item) => {
    const perviousLng = await AsyncStorage.getItem("language");
    languageModal.current.setModalVisibility(false);
    const lng =
      item?.name == "English"
        ? "en"
        : item?.name == "French"
        ? "fr"
        : item?.name == "Spanish"
        ? "es"
        : item?.name == "Arabic"
        ? "ar"
        : item?.name == "Italian"
        ? "it"
        : "de";
    await AsyncStorage.setItem("language", lng);
    i18n.changeLanguage(lng).then(() => {
      I18nManager.forceRTL(lng == "ar" ? true : false);
      if (lng == "ar" || perviousLng == "ar") {
        setTimeout(() => {
          RNRestart.Restart();
        }, 300);
      }
    });
  };

  const currentLang = (currentLng) => {
    return currentLng == "en"
      ? t("English")
      : currentLng == "fr"
      ? t("French")
      : currentLng == "es"
      ? t("Spanish")
      : currentLng == "ar"
      ? t("Arabic")
      : currentLng == "it"
      ? t("Italian")
      : t("German");
  };

  return (
    <Screen>
      <ScrollView
        showsHorizontalScrollIndicator={false}
        showsVerticalScrollIndicator={false}
        bounces={false}
      >
        <View style={styles.container}>
          <View style={styles.changeLngContainer}>
            <TouchableOpacity
              onPress={() => languageModal.current.setModalVisibility(true)}
            >
              <Text style={styles.orLoginTxt}>{t("Select Language")}</Text>
            </TouchableOpacity>
          </View>
          <Image source={IMAGES.logo} style={[styles.logo]} />
          <Text style={styles.welcomeTxt}>{t("Welcome")}</Text>
          <View style={styles.btnContainer}>
            <Button
              btnText={t("Login")}
              customeStyle={styles.btn}
              onPress={() => props.navigation.navigate(SCREEN.login)}
            />
            <Button
              btnText={t("Register")}
              customeStyle={styles.btn}
              onPress={() => props.navigation.navigate(SCREEN.registerOptions)}
            />
            <Text style={[styles.orLoginTxt, { marginTop: 10 }]}>
              {t("OR")}
            </Text>
            <Button
              btnText={t("Give tip as guest")}
              customeStyle={styles.btn}
              onPress={() =>
                props.navigation.navigate(SCREEN.paymentOptions, {
                  from: "guest",
                })
              }
            />
          </View>
          <Text style={styles.orLoginTxt}>{t("Or login with")}</Text>
          <View style={styles.socialLoginsContainer}>
            <SocialLogin {...props} />
          </View>
        </View>
      </ScrollView>
      <AppCurrencyModal
        ref={languageModal}
        data={Languages}
        isCurrency={false}
        onSelect={(item) => onSelectLanguage(item)}
        onCloseClick={() => languageModal.current.setModalVisibility(false)}
        selectedItem={currentLang(i18n.language)}
      />
    </Screen>
  );
};
export default Welcome;

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  logo: {
    height: pixelPerfect(255),
    width: pixelPerfect(270),
    alignSelf: "center",
    marginTop: pixelPerfect(30),
    resizeMode: "contain",
  },
  welcomeTxt: {
    fontFamily: fonts.sourceSansSemiBold,
    fontSize: pixelPerfect(40),
    marginTop: pixelPerfect(44),
    color: COLORS.primary,
    alignSelf: "center",
  },
  btnContainer: {
    marginTop: pixelPerfect(34),
  },
  btn: {
    marginTop: pixelPerfect(15),
  },
  socialLoginsContainer: {
    // marginTop: pixelPerfect(10),
  },
  changeLngContainer: {
    width: "100%",
    alignItems: "flex-end",
    marginTop: pixelPerfect(1),
  },
  lngChngTxt: {
    color: COLORS.secondary,
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(18),
  },
  orLoginTxt: {
    color: COLORS.secondary,
    fontSize: pixelPerfect(24),
    fontFamily: fonts.sourceSansSemiBold,
    textAlign: "center",
    marginTop: heightPercentageToDP(1),
  },
  globeImg: {
    width: widthPercentageToDP(13),
    height: heightPercentageToDP(6),
  },
});
