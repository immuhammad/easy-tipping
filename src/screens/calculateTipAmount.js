import React, { useState, useRef, useEffect } from "react";
import {
  Text,
  StyleSheet,
  View,
  TextInput as Input,
  Platform,
  Image,
  TouchableOpacity,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTranslation } from "react-i18next";
import TextInput from "../components/TextInput";
import fonts from "../contants/fonts";
import { COLORS } from "../contants/colors";
import WheelScroller from "../components/WheelScroller";
import Screen from "../components/Screen";
import pixelPerfect from "../utils/pixelPerfect";
import Header from "../components/Header";
import Button from "../components/Button";
import { SIZES } from "../contants/sizes";
import { SCREEN } from "../contants/screens";
import AppSecondaryModal from "../components/AppSecondaryModal";
import AppLoading from "../common/AppLoader";
import {
  getCardList,
  getMyDetails,
  createPaymentIntent,
  createTranscation,
  makePaymentAsGuest,
  addFeedBackAsGuest,
} from "../services/apis";
import { useSelector } from "react-redux";
import { RFValue } from "react-native-responsive-fontsize";
import {
  PlatformPayButton,
  isPlatformPaySupported,
  PlatformPay,
  confirmPlatformPayPayment,
  createPlatformPayPaymentMethod,
} from "@stripe/stripe-react-native";
import ALLCURRENCIES from "../contants/currencies";
import { dispatch } from "../redux/store";
import { saveUser } from "../redux/slices/userSlice";
import PaymentWith from "../components/paymentWith";
import Alert from "../common/Alert";
import { IMAGES } from "../contants/images";
import AddFeedback from "../components/addFeedback";
import { CommonActions, useIsFocused } from "@react-navigation/native";
import CurrencyInput from "react-native-currency-input";
import { StripeProvider } from "@stripe/stripe-react-native";
import ENDPOINTS from "../contants/apis";
const CalculateTipAmmount = (props) => {
  const { from, payeeDetails, connectAccountId } = props.route.params;
  const { currency } = useSelector((state) => state.netInfoReducer);

  const modalRef = useRef(null);
  const feedbackModalRef = useRef(null);
  const paymentWithModal = useRef(null);
  const inputRef = useRef(null);
  const { t } = useTranslation();
  const { token, user } = useSelector((state) => state.userReducer);
  const wheelScrollerRef = useRef(null);
  const [loading, setLoading] = useState(false);
  const [calculatedAmount, setCalculatedAmount] = useState(0.0);
  const [enteredValue, setEnteredValue] = useState("");
  const [enteredValueForPercentage, setEnteredValueForPercentage] = useState(0);
  const [totalAmount, setTotalAmount] = useState("0");
  const [selectedPercentage, setSelectedPercentage] = useState("");
  const [isEnterAmountFocused, setIsEnterAmountFocused] = useState(true);
  const [isCalculateTipFocused, setIsCalculateTipFouces] = useState(false);
  const [totalCard, setTotalCard] = useState([]);
  const [isApplePaySupported, setIsApplePaySupported] = useState(false);

  const [transactionDetails, setTransactionDetails] = useState({});
  const currencySymbol = ALLCURRENCIES.filter(
    (data) => data.code == user?.currency
  )[0]?.symbol;
  const countryCode = ALLCURRENCIES.filter(
    (data) => data.code == user?.currency
  )[0]?.country;

  useEffect(() => {
    // setEnteredValue(enteredValue ? formatNumber(enteredValue) + "" : "");
  }, [enteredValue]);

  function formatNumber(number) {
    const formatted = parseFloat(number)
      .toFixed(2)
      .replace(/(\.0+|0+)$/, "");
    return formatted;
  }
  useEffect(() => {
    setTimeout(() => {
      inputRef.current && inputRef.current.focus();
    }, 1000);
  }, []);

  useEffect(() => {
    (async function () {
      if (Platform.OS == "android") {
        setIsApplePaySupported(
          await isPlatformPaySupported({ googlePay: { testEnv: false } })
        );
      } else {
        setIsApplePaySupported(await isPlatformPaySupported());
      }
    })();
  }, [isPlatformPaySupported]);

  const handleSelectPercentage = () => {
    wheelScrollerRef.current.setModalVisibility(true);
  };

  const onConfirmedEnteredValue = () => {
    if (parseInt(enteredValue) < 1) {
      Alert("The minimum value must be 1.", "error");
      return;
    }

    if (enteredValue != "") {
      setTotalAmount(parseFloat(enteredValue).toFixed(2) + "");
      // setTotalAmount(enteredValue);
      setEnteredValue(parseFloat(enteredValue).toFixed(2) + "");
      modalRef.current.setModalVisibility(true);
    }
  };

  const onConfirmPercentage = (value) => {
    wheelScrollerRef.current.setModalVisibility(false);
    setSelectedPercentage(value);
    setEnteredValueForPercentage(
      parseFloat(parseFloat(enteredValueForPercentage)).toFixed(2) + ""
    );
    setCalculatedAmount(
      (parseFloat(value) * parseFloat(enteredValueForPercentage)) / 100
    );
    setTotalAmount(
      (
        parseFloat(parseFloat(value) * parseFloat(enteredValueForPercentage)) /
        100
      ).toFixed(2)
    );
    // props.navigation.navigate(SCREEN.savedCards);
  };

  useEffect(() => {
    if (from != "guest")
      getCardList(token, {
        payeeId: props?.route?.params?.payeeId,
        teamId: payeeDetails?.teamId ? payeeDetails?.teamId : null,
        fromTeamId: user?.userTeam?.teamId ? user?.userTeam?.teamId : null,
        toTeamId: payeeDetails?.teamId ? payeeDetails.teamId : null,
        userTeamId: payeeDetails?.userTeamId ? payeeDetails?.userTeamId : null,
      }).then((res) => {
        setTotalCard(res?.data?.data?.cards);
      });
    _handleGetMyDetails();
  }, []);

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

  const calculteAmount = () => {
    if (selectedPercentage == "") return;

    if (
      parseInt(
        parseFloat(
          (parseFloat(selectedPercentage) *
            parseFloat(enteredValueForPercentage)) /
            100
        ).toFixed(2)
      ) < 1
    ) {
      Alert("The minimum value must be 1.", "error");
      return;
    }
    if (enteredValueForPercentage != "") {
      setCalculatedAmount(
        (parseFloat(selectedPercentage) *
          parseFloat(enteredValueForPercentage)) /
          100
      );
      setTotalAmount(
        parseFloat(
          (parseFloat(selectedPercentage) *
            parseFloat(enteredValueForPercentage)) /
            100
        ).toFixed(2) + ""
      );
      setEnteredValueForPercentage(
        parseFloat(parseFloat(enteredValueForPercentage)).toFixed(2) + ""
      );

      if (enteredValueForPercentage != "")
        modalRef.current.setModalVisibility(true);
    }
  };

  const onCancel = () => {
    wheelScrollerRef.current.setModalVisibility(false);
  };

  const onAccept = () => {
    modalRef.current.setModalVisibility(false);
    setTimeout(() => {
      if (true) {
        paymentWithModal.current.setModalVisibility(true);
        return;
      }
      if (from == "guest") {
        props.navigation.navigate(SCREEN.addCard, {
          payeeId: props?.route?.params?.payeeId,
          totalAmount: totalAmount,
          fromcalute: true,
          from: "guest",
          payeeDetails: payeeDetails,
        });
        return;
      } else {
        makePaymentWithCreditCard();
      }

      // if (isApplePaySupported) {
      //   paymentWithModal.current.setModalVisibility(true);
      // } else {
      //   makePaymentWithCreditCard();
      // }
    }, 500);
  };

  const makePaymentWithCreditCard = () => {
    paymentWithModal.current.setModalVisibility(false);
    if (totalCard.length === 0) {
      props.navigation.navigate(SCREEN.addCard, {
        payeeId: props?.route?.params?.payeeId,
        totalAmount: totalAmount,
        fromcalute: true,
        payeeDetails: payeeDetails,
        from: from,
      });
    } else {
      props.navigation.navigate(SCREEN.savedCards, {
        payeeId: props?.route?.params?.payeeId,
        totalAmount: totalAmount,
        payeeDetails: payeeDetails,
        from: from,
      });
    }
  };
  const onReject = () => {
    modalRef.current.setModalVisibility(false);
  };

  const _createPaymentIntent = () => {
    paymentWithModal.current.setModalVisibility(false);
    const payload = {
      paymentMethodType: "card",
      currency: user?.currency ? user?.currency : currency?.code,
      amount: Number(totalAmount),
      payeeId: props?.route?.params?.payeeId,
      teamId: payeeDetails?.teamId ? payeeDetails?.teamId : null,
      fromTeamId: user?.userTeam?.teamId ? user?.userTeam?.teamId : null,
      toTeamId: payeeDetails?.teamId ? payeeDetails.teamId : null,
      userTeamId: payeeDetails?.userTeamId ? payeeDetails?.userTeamId : null,
    };

    createPaymentIntent(token, payload)
      .then((res) => {
        const { clientSecret, paymentIntentId } = res.data.data;

        if (Platform.OS == "ios") {
          pay(clientSecret, paymentIntentId);
        } else {
          googlePay(clientSecret, paymentIntentId);
        }
      })
      .catch((error) => {
        Alert(
          error?.response?.data?.data?.message
            ? error?.response?.data?.data?.message
            : "Something went wrong!"
        );
        console.log("error payment intent ", error);
      });
  };
  const pay = async (clientSecret, paymentIntentId) => {
    const { error } = await confirmPlatformPayPayment(clientSecret, {
      applePay: {
        merchantIdentifier: "merchant.com.org.ObonApp.Fintech",

        cartItems: [
          {
            label: payeeDetails?.payee?.firstName,
            amount: totalAmount + "",
            paymentType: PlatformPay.PaymentType.Immediate,
          },
        ],
        paymentSummaryItems: [
          {
            label: payeeDetails?.username, // Add the merchant name here
            amount: totalAmount + "", // Replace with the actual total amount
          },
        ],

        merchantCountryCode: countryCode ? countryCode : currency?.country,
        currencyCode: user?.currency ? user?.currency : currency?.code,
        // requiredShippingAddressFields: [PlatformPay.ContactField.PostalAddress],
        // requiredBillingContactFields: [PlatformPay.ContactField.PhoneNumber],
      },
    });
    if (error) {
      console.log("errror on google pay ", error);
      // handle error
    } else {
      if (from == "guest") {
        _createTransactionAsGuest(paymentIntentId);
      } else _createTransaction(paymentIntentId);
    }
  };
  const _createTransaction = (paymentIntentId) => {
    console.log("payment intent ", paymentIntentId);
    setLoading(true);
    const data = {
      payerId: user?.id,
      payeeId: props.route?.params?.payeeId,
      paymentIntentId: paymentIntentId,
      amount: Number(totalAmount),
      teamId: payeeDetails?.teamId ? payeeDetails?.teamId : null,
      fromTeamId: user?.userTeam?.teamId ? user?.userTeam?.teamId : null,
      toTeamId: payeeDetails?.teamId ? payeeDetails.teamId : null,
      userTeamId: payeeDetails?.userTeamId ? payeeDetails?.userTeamId : null,
      currency: user?.currency ? user?.currency : currency?.code,
    };

    createTranscation(token, data)
      .then((res) => {
        setLoading(false);
        setTransactionDetails(res?.data?.data.transaction);
        setTimeout(() => {
          feedbackModalRef.current.setModalVisibility(true);
        }, 300);
        // props.navigation.navigate(SCREEN.bottomTab);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error on apple pay final", error);
        Alert(
          error?.response?.data?.data?.message
            ? error?.response?.data?.data?.message
            : "Something went wrong!"
        );
      });
  };

  const _createTransactionAsGuest = (paymentIntentId) => {
    setLoading(true);
    const data = {
      paymentIntentId: paymentIntentId,
      payeeId: props.route?.params?.payeeId,
      amount: Number(totalAmount),
      currency: currency?.code,
      name: "Guest",
      email: "guestuser@gmail.com",
      address: "Dummy",
      teamId: payeeDetails?.teamId ? payeeDetails?.teamId : null,
      fromTeamId: user?.userTeam?.teamId ? user?.userTeam?.teamId : null,
      toTeamId: payeeDetails?.teamId ? payeeDetails.teamId : null,
      userTeamId: payeeDetails?.userTeamId ? payeeDetails?.userTeamId : null,
      currency: user?.currency ? user?.currency : currency?.code,
    };

    makePaymentAsGuest(data)
      .then((res) => {
        setLoading(false);
        setTransactionDetails(res?.data?.data.transaction);
        setTimeout(() => {
          feedbackModalRef.current.setModalVisibility(true);
        }, 300);

        // props.navigation.navigate(SCREEN.login);
      })
      .catch((error) => {
        setLoading(false);
        console.log("error on create transaction as guest ", error);
      });
  };

  const googlePay = async (clientSecret, paymentIntentId) => {
    const { error } = await confirmPlatformPayPayment(clientSecret, {
      googlePay: {
        testEnv: false,
        merchantName: "",
        merchantCountryCode: countryCode ?? currency?.country,
        currencyCode: user?.currency ?? currency?.code,
        billingAddressConfig: {
          format: PlatformPay.BillingAddressFormat.Full,
          isPhoneNumberRequired: false,
          isRequired: false,
        },
      },
    });

    if (error) {
      console.log("error on google pay ", error);
      // Update UI to prompt user to retry payment (and possibly another payment method)
      return;
    }

    if (from == "guest") {
      _createTransactionAsGuest(paymentIntentId);
    } else _createTransaction(paymentIntentId);
  };

  const onConfirmFeedBackModal = (comment, rating) => {
    feedbackModalRef.current.setModalVisibility(false);

    setTimeout(() => {
      setLoading(true);

      let payload = {
        payerId: transactionDetails?.payerId,
        payeeId: props?.route?.params?.payeeId,
        feedbackText: comment,
        type: "feedback",
        transactionId: transactionDetails?.id,
        rating: rating,
      };
      addFeedBackAsGuest(token, payload)
        .then((res) => {
          setLoading(false);
          setTimeout(() => {
            if (from == "guest") {
              props.navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: SCREEN.welcome }],
                })
              );
            } else {
              props.navigation.navigate(SCREEN.bottomTab);
            }
          }, 700);
          // props.navigation.navigate(SCREEN.login);
        })
        .catch((error) => {
          console.log("error for feedback", error);
          setLoading(false);
          setTimeout(() => {
            if (from == "guest") {
              props.navigation.dispatch(
                CommonActions.reset({
                  index: 0,
                  routes: [{ name: SCREEN.welcome }],
                })
              );
            } else {
              props.navigation.navigate(SCREEN.bottomTab);
            }
          }, 700);
        });
    }, 400);
  };

  const onCancelfeedbackModal = () => {
    feedbackModalRef.current.setModalVisibility(false);
    setTimeout(() => {
      if (from == "guest") {
        props.navigation.dispatch(
          CommonActions.reset({
            index: 0,
            routes: [{ name: SCREEN.welcome }],
          })
        );
      } else {
        props.navigation.navigate(SCREEN.bottomTab);
      }
    }, 700);
  };
  // pk_test_51N3G7KH3CgfJQbH9UvRGNfeXUCzOLRTIpfmUH20uAEejjEIQGSJuQNMADI25hqwGMBMoGuWhwDtRw0dpdB4nEjer00lFEVhvvI

  // pk_live_51N3G7KH3CgfJQbH9oOe2zba2yBt21edBEsNMaKSVtGZnv1IxzdiZ4Y8jtIpdA7ySgl4G7K9Dlufhn8awjkJAFfco00i7lpd1YF

  return (
    <StripeProvider
      publishableKey={ENDPOINTS.STRIPEKEY}
      merchantIdentifier="merchant.com.org.ObonApp.Fintech"
      stripeAccountId={connectAccountId}
    >
      <Screen>
        <View style={styles.container}>
          {AppLoading(loading)}
          <Header
            title={t("How much would you like to Tip?")}
            isBackBtn={true}
            onPressBackIcon={() => props.navigation.goBack()}
          />

          <KeyboardAwareScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            <View style={styles.menualInputContainer}>
              <Text
                style={[
                  styles.label,
                  { marginBottom: pixelPerfect(22) },
                  isEnterAmountFocused
                    ? {}
                    : { color: COLORS.inActiveTabColor },
                ]}
              >
                {t("Enter Tip Amount")}
              </Text>

              <View
                style={{
                  justifyContent: "center",
                  alignItems: "center",
                  flexDirection: "row",
                  justifyContent: "center",
                }}
              >
                <Text style={styles.inputStyle}>
                  {currencySymbol ? currencySymbol : currency?.symbol}
                </Text>

                <Input
                  ref={inputRef}
                  selectionColor={COLORS.primary}
                  placeholder={"0.00"}
                  placeholderTextColor={COLORS.secondary}
                  value={enteredValue}
                  onChangeText={(e) => {
                    const regex = /^(\d+(\.\d{0,2})?|\.\d{1,2})$/;

                    if (regex.test(e) || e == "" || e == ".")
                      setEnteredValue(e);
                  }}
                  style={[
                    styles.inputStyle,

                    {
                      textAlign: "right",
                    },
                  ]}
                  keyboardType={"decimal-pad"}
                  returnKeyType={"done"}
                  onFocus={() => {
                    setIsEnterAmountFocused(true),
                      setIsCalculateTipFouces(false);
                  }}
                  maxLength={10}
                />
              </View>
            </View>
            <View style={styles.btnContainer}>
              <Button
                btnText={t("Confirm")}
                onPress={onConfirmedEnteredValue}
                disabled={!isEnterAmountFocused}
                customeStyle={
                  isEnterAmountFocused
                    ? {}
                    : { backgroundColor: COLORS.inActiveTabColor }
                }
              />
            </View>

            <Text style={styles.orLabel}>{t("OR")}</Text>

            <View style={styles.calculatedAmountContainer}>
              <Text
                style={[
                  styles.label,
                  isCalculateTipFocused
                    ? {}
                    : { color: COLORS.inActiveTabColor },
                ]}
              >
                {t("Calculate Tip Percentage")}
              </Text>
            </View>
            <View style={styles.textInputContainer}>
              <Text
                style={[
                  styles.textInputLabel,
                  !isCalculateTipFocused && { color: COLORS.inActiveBorder },
                ]}
              >
                {t("Bill Amount")}
              </Text>
              <View
                style={[
                  styles.calcInputContainer,
                  isCalculateTipFocused && { borderColor: COLORS.activeBorder },
                ]}
              >
                <Text
                  style={[
                    styles.currencySymble,
                    isCalculateTipFocused && { color: COLORS.activeBorder },
                  ]}
                >
                  {currencySymbol ? currencySymbol : currency?.symbol}
                </Text>
                <Input
                  value={enteredValueForPercentage}
                  onChangeText={(e) => {
                    const regex = /^(\d+(\.\d{0,2})?|\.\d{1,2})$/;
                    if (regex.test(e) || e == "" || e == ".")
                      setEnteredValueForPercentage(e);
                  }}
                  style={[
                    styles.customStyle,
                    isCalculateTipFocused && { color: COLORS.activeBorder },
                  ]}
                  placeholder={t("0.00")}
                  keyboardType={"decimal-pad"}
                  returnKeyType={"done"}
                  placeholderTextColor={COLORS.placeholder}
                  onFocus={() => {
                    setIsEnterAmountFocused(false);
                    setIsCalculateTipFouces(true);
                  }}
                />
              </View>

              {/* <TextInput
              placeholder={t("Enter Bill Amount")}
              onChangeText={(e) => {
                const regex = /^(\d+(\.\d{0,2})?|\.\d{1,2})$/;
                if (regex.test(e) || e == "" || e == ".")
                  setEnteredValueForPercentage(e);
              }}
              value={enteredValueForPercentage}
              keyboardType={"decimal-pad"}
              label={t("Bill Amount")}
              onFocus={() => {
                setIsEnterAmountFocused(false);
                setIsCalculateTipFouces(true);
              }}
              customInputContainer={{ borderWidth: 0 }}
              customLabelStyle={
                isCalculateTipFocused ? {} : { color: COLORS.inActiveTabColor }
              }
            /> */}
            </View>
            <View
              style={[styles.btnContainer, { marginTop: pixelPerfect(12) }]}
            >
              <TouchableOpacity
                style={[
                  styles.selectedContainer,
                  {
                    borderColor: isCalculateTipFocused
                      ? COLORS.primary
                      : COLORS.inActiveBorder,
                  },
                ]}
                onPress={handleSelectPercentage}
              >
                <Text
                  style={[
                    styles.selectedTxt,
                    {
                      color: isCalculateTipFocused
                        ? COLORS.primary
                        : COLORS.inActiveTabColor,
                    },
                  ]}
                >
                  {t(selectedPercentage === "" ? "Select " : "Selected") +
                    " " +
                    selectedPercentage +
                    "% " +
                    t("of Amount")}
                </Text>
                <Image
                  source={IMAGES.forward}
                  style={[
                    styles.dropDownIcon,
                    {
                      tintColor: isCalculateTipFocused
                        ? COLORS.primary
                        : COLORS.inActiveTabColor,
                    },
                  ]}
                />
              </TouchableOpacity>

              <Text style={[styles.amount]}>
                {currencySymbol ?? currency?.symbol}
                {parseFloat(calculatedAmount).toFixed(2)}
              </Text>
            </View>
            <View style={styles.btnContainer}>
              <Button
                btnText={t("Confirm")}
                onPress={calculteAmount}
                customeStyle={
                  isCalculateTipFocused
                    ? {}
                    : { backgroundColor: COLORS.inActiveTabColor }
                }
                disabled={!isCalculateTipFocused}
              />
            </View>
          </KeyboardAwareScrollView>
        </View>
        <WheelScroller
          ref={wheelScrollerRef}
          onCancel={onCancel}
          onConfirm={onConfirmPercentage}
        />
        <AppSecondaryModal
          onAccept={onAccept}
          onReject={onReject}
          ref={modalRef}
          title={
            <Text style={{ fontSize: pixelPerfect(22) }}>
              {t("Are you sure you want to give a tip of")}:{"\n"}
              <Text
                style={{
                  color: COLORS.secondary,
                  fontSize: pixelPerfect(40),
                  marginTop: 30,
                  lineHeight: pixelPerfect(70),
                }}
              >
                {currencySymbol ? currencySymbol : currency?.symbol}
                {totalAmount}
              </Text>
            </Text>
          }
          acceptTitle={t("Confirm")}
          rejectTitle={t("Cancel")}
        />
        <PaymentWith
          ref={paymentWithModal}
          applePayOrGooglePay={_createPaymentIntent}
          payWithCreditCard={makePaymentWithCreditCard}
          onCloseClick={() =>
            paymentWithModal.current.setModalVisibility(false)
          }
          isApplePaySupported={isApplePaySupported}
        />

        <AddFeedback
          ref={feedbackModalRef}
          onConfirm={onConfirmFeedBackModal}
          onCancel={onCancelfeedbackModal}
        />
      </Screen>
    </StripeProvider>
  );
};
export default CalculateTipAmmount;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: pixelPerfect(29),
  },
  calculatedAmountContainer: {
    justifyContent: "center",
    alignItems: "center",
    marginTop: pixelPerfect(20),
  },
  menualInputContainer: {
    alignSelf: "center",
    marginTop: pixelPerfect(30),
    borderRadius: SIZES.radius,
    overflow: "hidden",
  },
  textInputContainer: {
    alignSelf: "center",
    marginTop: pixelPerfect(30),
    borderRadius: SIZES.radius,
    overflow: "hidden",
    width: "100%",
  },
  btnContainer: {
    marginTop: pixelPerfect(10),
  },

  label: {
    fontFamily: fonts.sourceSansSemiBold,
    fontSize: pixelPerfect(20),
    marginTop: 10,
    color: COLORS.primary,
    alignSelf: "center",
  },
  amount: {
    fontFamily: fonts.sourceSansSemiBold,
    fontSize: pixelPerfect(30),
    marginTop: 10,
    color: COLORS.primary,
    fontSize: RFValue(40),
    textAlign: "center",
    fontFamily: fonts.sourceSansSemiBold,
    color: COLORS.secondary,
  },
  orLabel: {
    fontFamily: fonts.sourceSansBold,
    fontSize: pixelPerfect(24),
    marginTop: pixelPerfect(30),
    color: COLORS.secondary,
    alignSelf: "center",
  },
  headingText: {
    fontFamily: fonts.sourceSansSemiBold,
    fontSize: pixelPerfect(22),
    color: COLORS.secondary,
    paddingHorizontal: 10,
    alignSelf: "center",
  },
  inputStyle: {
    fontSize: RFValue(40),
    textAlign: "center",
    fontFamily: fonts.sourceSansSemiBold,
    color: COLORS.secondary,
  },
  selectedContainer: {
    alignItems: "center",
    justifyContent: "space-between",
    borderColor: COLORS.primary,
    borderRadius: SIZES.radius,
    borderWidth: 2,
    minHeight: pixelPerfect(60),
    flexDirection: "row",
    padding: pixelPerfect(5),
    paddingHorizontal: pixelPerfect(10),
  },

  selectedTxt: {
    color: COLORS.primary,
    fontSize: pixelPerfect(22),
    fontFamily: fonts.robotosemiBold,
    textAlign: "center",
  },
  dropDownIcon: {
    height: pixelPerfect(15),
    width: pixelPerfect(15),
    transform: [{ rotate: "90deg" }],
  },
  customStyle: {
    borderWidth: 0,

    flex: 0.9,

    height: "100%",
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(22),
    color: COLORS.placeholder,
  },
  currencySymble: {
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(22),
    color: COLORS.placeholder,
  },
  calcInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    paddingHorizontal: SIZES.padding / 4,
    borderColor: COLORS.inActiveBorder,
    borderWidth: 2,
    borderRadius: SIZES.radius,
    height: pixelPerfect(60),
    flexDirection: "row",
    alignItem: "center",
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primary,
  },
  textInputLabel: {
    fontFamily: fonts.robotosemiBold,
    color: COLORS.primary,
    fontSize: pixelPerfect(22),

    textAlign: "left",
  },
});
