import { t } from "i18next";
import React, { useState } from "react";
import {
  SafeAreaView,
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  ScrollView,
} from "react-native";
import { RFValue } from "react-native-responsive-fontsize";
import CustomeButton from "../components/Button";
import { COLORS } from "../contants/colors";
import fonts from "../contants/fonts";
import pixelPerfect from "../utils/pixelPerfect";
import { CommonActions } from "@react-navigation/native";
import AppLoading from "../common/AppLoader";
import { createStripeConnectLink } from "../services/apis";
import { SCREEN } from "../contants/screens";
import { useSelector } from "../redux/store";
import Header from "../components/Header";
import Screen from "../components/Screen";
import Alert from "../common/Alert";
const StipeTermsScreen = (props) => {
  const [loading, setLoading] = useState(false);
  const { token, user } = useSelector((state) => state.userReducer);
  const points = [
    "Please note that when you choose to link your Stripe account with our application, you will be redirected to the secure Stripe platform to provide the necessary information.",
    "We want to make it clear that all the information you provide during the linking process, including your payment and account details, will be directly handled and stored by Stripe, not our platform.",
    "Stripe is a trusted and widely-used payment processing service that prioritizes the security and privacy of your data.",
    "Stripe is a popular payment processing and merchant services company. It is accredited by the Better Business Bureau (BBB) and maintains an A+ rating. Stripe offers a global payment system that can accept over 135 currencies Companies using Stripe Payments for Payment Processing include: Amazon.com, Target, Sony, T-Mobile etc",
    "By leveraging Stripe's robust infrastructure, we ensure that your sensitive information is handled in accordance with their industry-leading security standards.",
    "Rest assured that we do not have access to or store any of your payment information within our application.",
    "We value your trust and are committed to maintaining the highest level of security and confidentiality throughout your experience with our platform.",
  ];
  const _handleCreateStripeLink = () => {
    setTimeout(() => {
      setLoading(true);
      createStripeConnectLink(token)
        .then((res) => {
          console.log("response of create stripe link ", res);
          setLoading(false);
          setTimeout(() => {
            onRegisterStipeAccount(res.data.data.url);
          }, 400);
        })
        .catch((error) => {
          console.log("error on creating link ", error);
          setLoading(false);
          Alert(
            error?.response?.data?.data?.message
              ? error?.response?.data?.data?.message
              : "Something went wrong!"
          );
        });
    }, 400);
  };

  const onRegisterStipeAccount = (link) => {
    props.navigation.navigate(SCREEN.webView, {
      from: "register",
      user: user,
      link: link,
      showHeader: false,
    });
  };
  const onLaterRegisterStripeAccount = () => {
    props.navigation.dispatch(
      CommonActions.reset({
        index: 0,
        routes: [{ name: SCREEN.bottomTab }],
      })
    );
  };

  const Bullets = (txt) => {
    return (
      <View style={styles.bulletContainer}>
        <Text style={{ fontWeight: "bold", color: COLORS.black }}>{"➔"}</Text>
        <Text style={styles.subTxt}>{txt}</Text>
      </View>
    );
  };

  return (
    <Screen customStyle={{ paddingHorizontal: pixelPerfect(10) }}>
      {AppLoading(loading)}
      <View style={styles.innerContiner}>
        <View>
          <Header
            title={t("")}
            isBackBtn={true}
            onPressBackIcon={() => props.navigation.goBack()}
          />

          <View style={{ marginTop: pixelPerfect(30) }} />
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            contentContainerStyle={{ paddingBottom: 70 }}
          >
            <Text style={styles.headingTxt}>
              {t(
                "Important Information Regarding the Linking of Your Stripe Account"
              )}
            </Text>

            {points.map((data) => Bullets(data))}
            <View style={{ marginTop: pixelPerfect(80) }} />
            <CustomeButton
              onPress={_handleCreateStripeLink}
              btnText={"I Acknowledge"}
            />
          </ScrollView>
        </View>
      </View>
    </Screen>
  );
};

const styles = StyleSheet.create({
  mainContiner: {
    flex: 1,
    backgroundColor: COLORS.white,
  },
  skipTxt: {
    color: COLORS.primary,
    fontSize: RFValue(15),
    fontFamily: fonts.robotosemiBold,
    marginVertical: 10,
  },
  skipBtnTxt: {
    alignSelf: "flex-end",
    backgroundColor: "white",
  },
  innerContiner: {
    paddingHorizontal: 20,
    flex: 1,
    justifyContent: "space-between",
  },
  headingTxt: {
    fontSize: RFValue(22),
    fontFamily: fonts.robotosemiBold,
    color: COLORS.black,
    textAlign: "center",
    marginVertical: 10,
    marginTop: 0,
  },
  subTxt: {
    color: "#313131",
    fontFamily: fonts.robotoNormal,
    fontSize: RFValue(16),
    // marginTop: 15,
    // textAlign: "justify",
    marginLeft: 5,
    width: "95%",
  },
  bulletContainer: {
    flexDirection: "row",
    marginTop: 5,
    width: "100%",
    // backgroundColor: "red",
  },
  bullet: {
    height: 10,
    width: 10,
    borderRadius: 20,
    backgroundColor: "#313131",
    marginTop: 5,
  },
});

export default StipeTermsScreen;
