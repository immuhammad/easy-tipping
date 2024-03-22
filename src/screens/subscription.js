//================================ React Native Imported Files ======================================//

import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, View, Image, Text } from "react-native";
import { useTranslation } from "react-i18next";

//================================ Local Imported Files ======================================//

import { SIZES } from "../contants/sizes";

import Screen from "../components/Screen";
import pixelPerfect from "../utils/pixelPerfect";
import Header from "../components/Header";
import { IMAGES } from "../contants/images";
import fonts from "../contants/fonts";
import { COLORS } from "../contants/colors";
import Button from "../components/Button";
import {
  getCardList,
  getSubscriptionPayment,
  cancelSubscription,
  getMyDetails,
} from "../services/apis";
import { useSelector } from "react-redux";
import { SCREEN } from "../contants/screens";
import { useIsFocused } from "@react-navigation/native";
import { dispatch } from "../redux/store";
import { saveUser } from "../redux/slices/userSlice";
import AppLoading from "../common/AppLoader";
import ALLCURRENCIES from "../contants/currencies";
import moment from "moment";
import AppSecondaryModal from "../components/AppSecondaryModal";
import {
  PlatformPayButton,
  isPlatformPaySupported,
  PlatformPay,
  confirmPlatformPayPayment,
  createPlatformPayPaymentMethod,
  StripeProvider,
} from "@stripe/stripe-react-native";
import ENDPOINTS from "../contants/apis";

const Subscription = (props) => {
  const cancelSubscriptionPopup = useRef(null);
  const { t } = useTranslation();
  const [totalCard, setTotalCard] = useState([]);
  const { token, user } = useSelector((state) => state.userReducer);

  const [loading, setLoading] = useState(true);
  const [paymentDetails, setPaymentDetails] = useState({
    currency: "usd",
    from: "USD",
    to: "USD",
    amount: 0,
  });
  const currencySymbol = ALLCURRENCIES.filter(
    (data) => data.code == user?.currency
  )[0]?.symbol;

  useEffect(() => {
    getCardList(token).then((res) => {
      setTotalCard(res?.data?.data?.cards);
    });
    _getPaymentDetails();
  }, []);
  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      _handleGetMyDetails();
    }
  }, [isFocused]);

  const _handleGetMyDetails = () => {
    let query = user?.userTeam ? "/" + user?.userTeam?.teamCode : "/" + null;

    getMyDetails(token, query)
      .then((res) => {
        const {
          approvedByTeamOwner,
          businessLogoUrl,
          businessName,
          profileImg,
          isSubscriptionPurchased,
          currentPeriodEndDate,
          reviewsCount,
          currency,
          username,
        } = res?.data?.data?.user;
        dispatch(
          saveUser({
            ...user,
            approvedByTeamOwner: approvedByTeamOwner,
            businessLogoUrl: businessLogoUrl,
            businessName: businessName,
            profileImg: profileImg,
            username: username,
            isSubscriptionPurchased: isSubscriptionPurchased,
            currentPeriodEndDate: currentPeriodEndDate,
            reviewsCount: reviewsCount,
            currency: currency,
          })
        );
      })
      .catch((error) => {
        console.log("error on get my details  ", error);
      });
  };

  const _handleHandleProceed = () => {
    if (totalCard.length === 0) {
      props.navigation.navigate(SCREEN.addCard, {
        fromcalute: false,
        fromSubscription: true,
      });
    } else {
      props.navigation.navigate(SCREEN.savedCards, {
        fromSubscription: true,
        fromcalute: false,
      });
    }
  };

  const _getPaymentDetails = () => {
    getSubscriptionPayment(token)
      .then((res) => {
        setLoading(false);
        setPaymentDetails(res.data.data);
      })
      .catch((error) => {
        console.log("error on get payment details ", error);
      });
  };

  const _cancelSubscription = () => {
    cancelSubscriptionPopup.current.setModalVisibility(false);
    const data = {
      subscriptionId: user?.subscriptionId,
    };

    cancelSubscription(token, data)
      .then((res) => {
        dispatch(saveUser(res?.data?.data?.user));
      })
      .catch((error) => {
        console.log("error on subcritp", error);
      });
  };

  return (
    <StripeProvider
      publishableKey={ENDPOINTS.STRIPEKEY}
      merchantIdentifier="merchant.com.org.ObonApp.Fintech"
    >
      <Screen>
        <View style={styles.container}>
          <Header
            title={t("Subscription")}
            isBackBtn={true}
            onPressBackIcon={() => props.navigation.goBack()}
          />
          {AppLoading(loading)}
          {!loading && (
            <>
              {user?.isSubscriptionPurchased ? (
                <View style={styles.contentContainer}>
                  <Text style={styles.label}>
                    {t("Subscription Information")}
                  </Text>
                  <View style={styles.row}>
                    <Text style={styles.value}>
                      {t("Your Subscription is Active - Enjoy")}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Image style={styles.checkIcon} source={IMAGES.clickIcon} />
                    <Text style={styles.value}>{t("No Ads")}</Text>
                  </View>

                  <View style={styles.row}>
                    <Image style={styles.checkIcon} source={IMAGES.clickIcon} />
                    <Text style={styles.value}>{t("Upload Company Logo")}</Text>
                  </View>
                  <View style={styles.row}>
                    <Image style={styles.checkIcon} source={IMAGES.clickIcon} />
                    <Text style={styles.value}>
                      {t("Use Your Business Name")}
                    </Text>
                  </View>
                </View>
              ) : user?.currentPeriodEndDate ? (
                <>
                  <View style={styles.row}>
                    <Text style={styles.label}>
                      {t("Your subscription has been canceled.")}
                    </Text>
                  </View>
                  <View style={styles.row}>
                    <Text style={styles.value}>
                      {t(
                        "Please note that your subscription will remain active until"
                      )}{" "}
                      {user?.currentPeriodEndDate}
                      {". "}
                      {t(
                        "After this date, you can resubscribe, but it will no longer be on a recurring basis."
                      )}
                    </Text>
                  </View>
                </>
              ) : (
                <>
                  <View style={styles.contentContainer}>
                    <Text style={styles.label}>{t("Includes")}</Text>
                    <View style={styles.row}>
                      <Image
                        style={styles.checkIcon}
                        source={IMAGES.clickIcon}
                      />
                      <Text style={styles.value}>{t("No Ads")}</Text>
                    </View>

                    <View style={styles.row}>
                      <Image
                        style={styles.checkIcon}
                        source={IMAGES.clickIcon}
                      />
                      <Text style={styles.value}>
                        {t("Upload Company Logo")}
                      </Text>
                    </View>
                    <View style={styles.row}>
                      <Image
                        style={styles.checkIcon}
                        source={IMAGES.clickIcon}
                      />
                      <Text style={styles.value}>
                        {t("Use Your Business Name")}
                      </Text>
                    </View>
                  </View>
                  <View style={styles.packageDetails}>
                    <Text style={styles.packageTxt}>
                      {currencySymbol}
                      {parseFloat(paymentDetails?.amount).toFixed(2)}
                    </Text>
                    <Text style={styles.perAnunTxt}>/{t("Annum")}</Text>
                  </View>
                </>
              )}

              <View style={styles.btnContainer}>
                {user?.isSubscriptionPurchased ? (
                  <Button
                    btnText={t("Cancel Subscription")}
                    onPress={() =>
                      cancelSubscriptionPopup.current.setModalVisibility(true)
                    }
                  />
                ) : user?.currentPeriodEndDate ? null : (
                  <Button
                    btnText={t("Proceed")}
                    onPress={_handleHandleProceed}
                  />
                )}
              </View>
            </>
          )}
        </View>
        <AppSecondaryModal
          ref={cancelSubscriptionPopup}
          title={t("Are you sure you want to cancel your subscription?")}
          acceptTitle={t("Yes")}
          rejectTitle={t("No")}
          onAccept={_cancelSubscription}
          onReject={() =>
            cancelSubscriptionPopup.current.setModalVisibility(false)
          }
        />
      </Screen>
    </StripeProvider>
  );
};
export default Subscription;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: pixelPerfect(29),
  },
  contentContainer: { marginTop: pixelPerfect(70), width: "100%" },
  label: {
    fontFamily: fonts.robotoBold,
    fontSize: pixelPerfect(25),
    alignSelf: "flex-start",
    color: COLORS.primary,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: pixelPerfect(15),
  },
  checkIcon: {
    height: pixelPerfect(15),
    width: pixelPerfect(15),
    marginRight: pixelPerfect(5),
    resizeMode: "contain",
  },
  value: {
    fontFamily: fonts.robotoNormal,
    fontSize: pixelPerfect(18),

    color: COLORS.primary,
  },
  packageDetails: {
    alignSelf: "center",
    marginTop: pixelPerfect(80),
    alignItems: "flex-end",
  },
  packageTxt: {
    fontSize: pixelPerfect(55),
    fontFamily: fonts.robotoBold,
    color: COLORS.primary,
  },
  perAnunTxt: {
    fontSize: pixelPerfect(35),
    fontFamily: fonts.robotoNormal,
    color: COLORS.inActiveBorder,
  },
  btnContainer: {
    marginTop: pixelPerfect(150),
  },
});
