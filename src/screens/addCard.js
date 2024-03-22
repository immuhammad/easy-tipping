import React, { useRef, useEffect, useState } from "react";
import { StyleSheet, View, Image, Text, TouchableOpacity } from "react-native";
import validator from "card-validator";
import { useTranslation } from "react-i18next";
import MaskInput from "react-native-mask-input";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { IMAGES } from "../contants/images";
import { COLORS } from "../contants/colors";
import Screen from "../components/Screen";
import pixelPerfect from "../utils/pixelPerfect";
import Header from "../components/Header";
import CardScanHeader from "../components/CardScanHeader";
import Button from "../components/Button";
import { SIZES } from "../contants/sizes";
import AppSecondaryModal from "../components/AppSecondaryModal";
import fonts from "../contants/fonts";
import FlipCard from "react-native-flip-card";
import Alert from "../common/Alert";
import { CommonActions, useIsFocused } from "@react-navigation/native";
import {
  addCard,
  createTranscation,
  getStripeToken,
  makePaymentAsGuest,
  buySubscription,
  addFeedBackAsGuest,
  createBankToken,
} from "../services/apis";
// import {
//   CardField,
//   StripeProvider,
//   useStripe,
//   initStripe,
// } from "@stripe/stripe-react-native";
import AppLoading from "../common/AppLoader";
import { useSelector } from "../redux/store";
import {
  heightPercentageToDP,
  widthPercentageToDP,
} from "react-native-responsive-screen";
import { SCREEN } from "../contants/screens";
import { RFValue } from "react-native-responsive-fontsize";
import messaging from "@react-native-firebase/messaging";
import CardScanner from "rn-card-scanner";
import ScanCard from "../components/ScanCard";
import Validations from "../utils/Validations";

import {
  StripeProvider,
  useStripe,
  CardField,
  CardForm,
  initPaymentSheet,
  CardFieldInput,
} from "@stripe/stripe-react-native";
import AddFeedback from "../components/addFeedback";
import ImagePicker from "react-native-image-crop-picker";
import TextRecognition from "react-native-text-recognition";

const AddCard = (props) => {
  const { currency } = useSelector((state) => state.netInfoReducer);
  const { confirmPayment, createToken, createPaymentMethod } = useStripe();
  const { from, payeeDetails } = props.route.params;
  const feedbackModalRef = useRef(null);
  const modalRef = useRef(null);
  const cardScannerRef = useRef(null);
  const isFocused = useIsFocused();
  const { token, user } = useSelector((state) => state.userReducer);

  const [isOn, setIson] = useState(false);
  const creditCardMask = [
    "*",
    "*",
    "*",
    "*",
    "",
    " ",
    "*",
    "*",
    "*",
    "*",
    "",
    " ",
    "*",
    "*",
    "*",
    "*",
    "",
    " ",
    /\d/,
    /\d/,
    /\d/,
    /\d/,
    "",
    " ",
  ];
  const dataMask = [/\d/, /\d/, "/", /\d/, /\d/];
  const CVCmask = [/\d/, /\d/, /\d/];
  const { t, i18n } = useTranslation();
  const [cardDetails, setCardDetails] = React.useState();
  const [card, setCard] = React.useState("");
  const [date, setDate] = React.useState("");
  const [cardHolderName, setCardHolderName] = React.useState("");
  const [year, setYear] = React.useState("");
  const [cvv, setCvv] = React.useState("");
  const [isFlip, setIsFlip] = React.useState(false);
  const [isLoading, setIsLoading] = React.useState(false);
  const [fcm, setFcm] = useState("");
  const [isSubmitted, setIsSubmitted] = React.useState(false);
  const [transactionDetails, setTransactionDetails] = useState({});
  const [inProgress, setInProgress] = useState(false);
  const onAccept = () => {
    modalRef.current.setModalVisibility(false);
    // props.navigation.goBack();
    setTimeout(() => {
      _handleAddCard();
    }, 500);
  };

  const getToken = async () => {
    const fcmToken = await messaging().getToken();

    setFcm(fcmToken);
  };

  useEffect(() => {
    let formatedMonth = "0" + cardDetails?.expiryMonth;

    let dateIs = `${
      ("" + cardDetails?.expiryMonth)?.length == 1
        ? formatedMonth
        : cardDetails?.expiryMonth
    }${cardDetails?.expiryYear}`;

    setDate(dateIs);
  }, [cardDetails]);

  useEffect(() => {
    if (isFocused) {
      getToken();
    }
  }, [isFocused]);
  const onReject = () => {
    modalRef.current.setModalVisibility(false);
  };
  const _checkCardValidations = () => {
    setIsSubmitted(true);
    if (!cardDetails?.complete) {
      Alert("Please enter valid card details");
      return;
    }

    // if (!validator.expirationMonth(date.split("/")[0]).isValid) {
    //   // Alert("Please Enter valid month");
    //   return;
    // }
    // if (!validator.expirationYear(date.split("/")[1], 2022).isValid) {
    //   // Alert("Please Enter valid year");
    //   return;
    // }
    // if (!validator.cvv(cvv).isValid) {
    //   // Alert("Please Enter valid cvv");
    //   return;
    // }
    _handleAddCard();
    // modalRef.current.setModalVisibility(true);
  };

  const _handleAddCard = () => {
    _createStripeToken();
  };

  const _createStripeToken = async () => {
    setIsLoading(true);
    if (props?.route?.params?.fromSubscription) {
      handleSubscriptionFlow();
      return;
    }
    const getBankToken = await createBankToken(
      token,
      payeeDetails?.id ?? null,
      payeeDetails?.teamId ?? null
    );

    let stripeConnectAccountId =
      getBankToken?.data?.data?.user?.stripeConnectedAccountId;

    const { token, error } = await createToken({
      type: "Card",
    });
    // { stripeAccount: stripeConnectAccountId }

    // return;
    if (error) {
      Alert(error?.localizedMessage ?? "Something went wrong");

      // Alert("Something went wrong");
      setIsLoading(false);
    } else {
      from == "guest"
        ? _makePaymentAsGuest(token)
        : _saveCard(token, stripeConnectAccountId);
    }

    // getStripeToken(
    //   card,
    //   date.split("/")[0],
    //   date.split("/")[1],
    //   cvv,
    //   cardHolderName
    // )
    //   .then((res) => {
    //     from == "guest"
    //       ? _makePaymentAsGuest(res)
    //       : props?.route?.params?.fromSubscription
    //       ? handleSubscriptionFlow(res)
    //       : _saveCard(res);
    //   })
    //   .catch((error) => {
    //     setIsLoading(false);
    //     console.log("error on get stripe Token ", error);
    //   });
  };

  const _saveCard = (cardDetails, stripeConnectAccountId) => {
    const paylaod = {
      address: "",
      brand: cardDetails?.card?.brand,
      email: user.email,
      last4: cardDetails?.card?.last4,
      name: cardHolderName,
      source: cardDetails.id,
      saveCard: isOn,
      stripeConnectAccountId,
      payeeId: props.route?.params?.payeeId,
      teamId: payeeDetails?.teamId ? payeeDetails?.teamId : null,
      fromTeamId: user?.userTeam?.teamId ? user?.userTeam?.teamId : null,
      toTeamId: payeeDetails?.teamId ? payeeDetails.teamId : null,
      userTeamId: payeeDetails?.userTeamId ? payeeDetails?.userTeamId : null,
    };
    setIsLoading(true);

    addCard(token, paylaod)
      .then((res) => {
        if (props.route?.params?.fromcalute === true) {
          confrimPayment(res?.data?.data?.id);
        } else confrimPayment(res?.data?.data?.id);
        // else if (isOn === false) {
        //   confrimPayment(res?.data?.data?.id);
        // } else {
        //   props.navigation.goBack();
        // }
      })
      .catch((error) => {
        Alert(error.response?.data?.data?.message);
        setIsLoading(false);
      });
  };

  const handleSubscriptionFlow = async (clientSecret) => {
    setIsLoading(false);
    let { error, paymentMethod } = await createPaymentMethod({
      paymentMethodType: "Card",
    });
    if (!error) createSubscription(paymentMethod);
    else {
      setIsLoading(false);
      Alert(error.message);
    }
  };

  const createSubscription = (tokenId) => {
    console.log("tokenId", tokenId);
    const data = {
      email: user?.email,
      name: user?.firstName,
      paymentMethod: tokenId.id,
    };

    setIsLoading(true);
    buySubscription(token, data)
      .then((res) => {
        console.log("response for subscription ", res);
        props.navigation.goBack();
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error on subscription purchase", error);
        Alert(
          error?.response?.data?.data?.message
            ? error?.response?.data?.data?.message
            : "Something went wrong!"
        );
        setIsLoading(false);
      });
  };

  const confrimPayment = (cardId) => {
    const data = {
      payerId: user.id,
      payeeId: props.route?.params?.payeeId,
      teamId: "",
      amount: Number(props.route?.params?.totalAmount),
      cardId: cardId,
      currency: user?.currency,

      teamId: payeeDetails?.teamId ? payeeDetails?.teamId : null,
      fromTeamId: user?.userTeam?.teamId ? user?.userTeam?.teamId : null,
      toTeamId: payeeDetails?.teamId ? payeeDetails.teamId : null,
      userTeamId: payeeDetails?.userTeamId ? payeeDetails?.userTeamId : null,
    };

    setIsLoading(true);
    createTranscation(token, data)
      .then((res) => {
        setTransactionDetails(res?.data?.data.transaction);
        setIsLoading(false);
        setInProgress(true);
        setTimeout(() => {
          feedbackModalRef.current.setModalVisibility(true);
        }, 300);
      })
      .catch((e) => {
        setIsLoading(false);
        console.log(e);
        Alert(e.response.data.data.message);
      });
  };

  const _makePaymentAsGuest = (cardDetails) => {
    const payload = {
      fcmToken: fcm,
      amount: Number(props.route?.params?.totalAmount),
      payeeId: props.route?.params?.payeeId,
      name: cardHolderName,
      email: "guestuser@gmail.com",
      address: "lhr",
      brand: cardDetails?.card?.brand,
      last4: cardDetails?.card?.last4,
      source: cardDetails.id,
      saveCard: false,
      currency: currency?.code,
      teamId: payeeDetails?.teamId ? payeeDetails?.teamId : null,
      fromTeamId: user?.userTeam?.teamId ? user?.userTeam?.teamId : null,
      toTeamId: payeeDetails?.teamId ? payeeDetails.teamId : null,
      userTeamId: payeeDetails?.userTeamId ? payeeDetails?.userTeamId : null,
    };
    setIsLoading(true);

    makePaymentAsGuest(payload)
      .then((res) => {
        console.log("error on error ", res);
        Alert(
          "Congratulations! Your payment transaction was successful.",
          "success"
        );
        setTransactionDetails(res?.data?.data.transaction);
        setIsLoading(false);
        setTimeout(() => {
          setInProgress(true);
          feedbackModalRef.current.setModalVisibility(true);
        }, 300);
      })
      .catch((error) => {
        setIsLoading(false);
        console.log("error on error ", error);
        Alert(error.response?.data?.data?.message);
      });
  };

  const onScanedCard = (scanResult) => {
    setIsSubmitted(true);
    const { cardNumber, expiryMonth, expiryYear, holderName } = scanResult;
    setCard(cardNumber);
    setCardHolderName(holderName);
    setDate(`${expiryMonth}/${expiryYear}`);
    setTimeout(() => {
      cardScannerRef.current.setModalVisibility(false);
    }, 300);
  };

  const onConfirmFeedBackModal = (comment, rating) => {
    feedbackModalRef.current.setModalVisibility(false);

    setTimeout(() => {
      setInProgress(false);
      setIsLoading(true);

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
          setIsLoading(false);
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
        })
        .catch((error) => {
          console.log("error for feedback", error);
          setIsLoading(false);
          setInProgress(false);
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
    setInProgress(false);
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

  const handleScanCard = () => {
    // ImagePickerFromGallery();
    // return;
    // cardScannerRef.current.setModalVisibility(true);
    // return;
    ImagePicker.openCamera({
      width: 300,
      height: 400,
      cropping: false,
    }).then(async (image) => {
      // console.log(image);
      const result = await TextRecognition.recognize(image?.path);

      // extractCardInfo(result.join(" "));

      const { cardNumber, expiry, name } = extractCardInfo(result.join(","));

      setCard(cardNumber ?? "");
      setCardHolderName(name ?? "");
      setDate(expiry ?? "");
    });
  };

  const extractCardInfo = (text) => {
    // const cardNumberRegex = /(\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4})|\d{16}/;

    const match = text.match(/(\d{4})\D*(\d{4})\D*(\d{4})\D*(\d{4})/);
    const cardNumberRegex =
      /(\d{4}[\s-]?\d{4}[\s-]?\d{4}[\s-]?\d{4})|\d{16}|\d{8}/;
    const expiryRegex = /(\d{2}\/\d{2})/;
    const nameRegex = /[A-Z\s]{4,}/; // Match // Match uppercase letters and spaces for the name
    const filteredText = text.replace(
      /\b(month|visa|master|valid|from|until|valid|year|end|Until|monthayear|MONTHYEAR|debit|credit|DEBIT)\b/gi,
      ""
    );
    const cardNumberRegex1 = /\d{16}/;

    // Remove single characters and all letters (uppercase and lowercase)
    const cleanedText = filteredText.replace(/\b\w{1,2}\b/g, "");

    const cardNumberMatches = text?.match(cardNumberRegex);
    const expiryMatches = text?.match(expiryRegex);
    const nameMatches = cleanedText.match(nameRegex);
    // const cardNumber = cardNumberMatches
    //   ? cardNumberMatches[0].replace(/\D/g, "")
    //   : null;

    const cardNumber = match
      ? cardNumberRegex?.test(match?.slice(1, 5)?.join(""))
        ? match.slice(1, 5)?.join("")
        : null
      : null;
    const expiry = expiryMatches ? expiryMatches[0] : null;
    const name = nameMatches
      ? nameMatches[0].trim().replace(/\s+/g, " ")
      : null;

    // const cardNumber = cardNumberMatches
    //   ? setCard(cardNumberMatches[0].replace(/\D/g, ""))
    //   : setCard("");
    // const expiry = expiryMatches ? setDate(expiryMatches[0]) : setDate("");
    // const name = nameMatches
    //   ? setCardHolderName(nameMatches[0].trim().replace(/\s+/g, " "))
    //   : setCardHolderName("");

    return {
      cardNumber,
      expiry,
      name,
    };
  };

  const ImagePickerFromGallery = () => {
    // launchImageLibrary(options, (res) => {
    //   if (res.didCancel) {
    //   } else if (res.errorMessage) {
    //   } else {
    //     console.log("image res", res);
    //     const image = {
    //       uri: res?.assets[0]?.uri,
    //       type: res?.assets[0]?.type,
    //       name: res?.assets[0]?.fileName,
    //     };
    //     props.selectImage(image);
    //   }
    // });

    ImagePicker.openPicker({
      width: 300,
      height: 400,
      cropping: false,
    })
      .then(async (image) => {
        const result = await TextRecognition.recognize(image?.path);

        const { cardNumber, expiry, name } = extractCardInfo(result.join(","));

        setCard(cardNumber ?? "");
        setCardHolderName(name ?? "");
        setDate(expiry ?? "");
      })
      .catch((error) => {
        console.log("error ", error);
      });
  };

  return (
    <Screen>
      {AppLoading(isLoading)}
      <View style={styles.container}>
        <Header
          title={t("Add Card")}
          isBackBtn={true}
          onPressBackIcon={() => props.navigation.goBack()}
        />

        <KeyboardAwareScrollView
          automaticallyAdjustContentInsets={false}
          enableOnAndroid={true}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ flexGrow: 1 }}
          bounces={false}
        >
          <View style={styles.cardPreview}>
            <FlipCard flip={isFlip}>
              <Image
                source={IMAGES.creditCardImage}
                style={styles.cardImage}
                // resizeMode="contain"
              />
              <Image
                source={IMAGES.creditCardBack}
                style={styles.cardImage}
                // resizeMode="contain"
              />
            </FlipCard>
            {isFlip ? (
              <View style={styles.showDetailsOnCard}>
                <Text style={styles.cvc} numberOfLines={1}>
                  {cvv.replace(/./g, "*")}
                </Text>
              </View>
            ) : (
              <View style={styles.showDetailsOnCard}>
                <MaskInput
                  value={cardDetails?.last4}
                  editable={false}
                  mask={creditCardMask}
                  placeholder="**** **** **** 0000"
                  placeholderTextColor={COLORS.white}
                  style={styles.cardNumber}
                  keyboardType="phone-pad"
                />
                <View style={styles.cardHolderNameAndExpiryDateContainer}>
                  <View
                    style={{
                      width: "55%",
                      marginTop: "-7%",
                    }}
                  >
                    <Text style={[styles.cardLabel, { marginTop: 2 }]}>
                      {t("Card Holder Name")}
                    </Text>
                    <Text
                      style={[styles.value, { marginTop: "5%" }]}
                      numberOfLines={1}
                    >
                      {cardHolderName}
                    </Text>
                  </View>
                  <View style={{ width: "30%" }}>
                    <Text style={[styles.cardLabel, { marginTop: "-2%" }]}>
                      {t("Expiry Date")}
                    </Text>
                    <MaskInput
                      value={date}
                      onChangeText={(masked, unmasked) => {
                        setCardHolderName(masked);
                      }}
                      mask={dataMask}
                      placeholder="23/25"
                      style={{
                        color: COLORS.white,
                        marginTop: -3,
                      }}
                      placeholderTextColor={COLORS.white}
                      keyboardType="phone-pad"
                    />
                  </View>
                </View>
              </View>
            )}
          </View>
          <Text style={styles.textInputLabel}>{t("Card Details")}</Text>
          <View
            style={{
              borderColor: COLORS.primary,
              borderWidth: 1.5,
              borderRadius: SIZES.radius,
            }}
          >
            <CardField
              postalCodeEnabled={false}
              accessibilityElementsHidden={true}
              placeholders={{
                number: "1234 1234 1234 1234",
                cvc: "CVV",
                expiry: "MM/YY",
              }}
              onFocus={(focusedField) => {
                console.log("focusField", focusedField);
              }}
              cardStyle={{
                backgroundColor: "#FFFFFF",
                textColor: COLORS.primary,
                borderColor: COLORS.primary,
                borderWidth: 0,
                placeholderColor: COLORS.placeholder,
                borderRadius: 5,
                fontSize: pixelPerfect(20),
              }}
              style={{
                width: "100%",
                height: 50,

                // backgroundColor: "red",
              }}
              onCardChange={(cardDet) => {
                setCardDetails(cardDet);
              }}
            />
          </View>

          <View style={styles.cardInputsContainer}>
            <Text style={styles.textInputLabel}>{t("Name")}</Text>
            <MaskInput
              value={cardHolderName}
              onChangeText={(masked, unmasked) => {
                setCardHolderName(masked);
              }}
              placeholder={t("Name")}
              style={[
                styles.textInput,
                { textAlign: i18n.language == "ar" ? "right" : "left" },
              ]}
              placeholderTextColor={"#bfbfbf"}
              onFocus={() => setIsFlip(false)}
            />
            {isSubmitted && !Validations.isValidName(cardHolderName) && (
              <Text style={styles.errorMessageStyle}>
                {t("Please enter valid name")}
              </Text>
            )}
          </View>

          {props?.route?.params?.from != "guest" &&
            !props?.route?.params?.fromSubscription && (
              <View style={styles.switchContiner}>
                <Text style={styles.saveCardTxt}>
                  {t("Save your card details")}
                </Text>
                <TouchableOpacity onPress={() => setIson(!isOn)}>
                  <Image
                    style={styles.offImg}
                    resizeMode={"contain"}
                    source={isOn ? IMAGES.onswitch : IMAGES.offswitch}
                  />
                </TouchableOpacity>
              </View>
            )}
          <View style={styles.btnContainer}>
            <Button
              disabled={isLoading || inProgress}
              btnText={t("Proceed")}
              onPress={() => {
                _checkCardValidations();
              }}
            />
          </View>
        </KeyboardAwareScrollView>
        <AppSecondaryModal
          onAccept={onAccept}
          onReject={onReject}
          ref={modalRef}
          title={t("Are you sure to want to save card?")}
          acceptTitle="Yes"
          rejectTitle="No"
        />
        <ScanCard
          ref={cardScannerRef}
          onCloseClick={() => cardScannerRef.current.setModalVisibility(false)}
          onScan={(e) => onScanedCard(e)}
        />
      </View>
      <AddFeedback
        ref={feedbackModalRef}
        onConfirm={onConfirmFeedBackModal}
        onCancel={onCancelfeedbackModal}
      />
    </Screen>
    // </StripeProvider>
  );
};
export default AddCard;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: pixelPerfect(29),
  },
  cardPreview: {
    width: "100%",
    height: pixelPerfect(210),
    marginTop: pixelPerfect(72),
    alignItems: "center",
    justifyContent: "center",
    marginBottom: pixelPerfect(70),
  },
  cardImage: {
    width: widthPercentageToDP("90%"),
    height: heightPercentageToDP("27%"),
    resizeMode: "contain",
    alignSelf: "center",
  },
  showDetailsOnCard: {
    width: pixelPerfect(332),
    height: pixelPerfect(210),
    position: "absolute",
    top: 0,
    bottom: 0,
    right: 0,
    left: 0,
  },
  cardInputsContainer: {
    // marginTop: pixelPerfect(72),
  },
  textInput: {
    borderWidth: 1.5,
    marginHorizontal: pixelPerfect(2),
    padding: pixelPerfect(5),
    borderColor: COLORS.primary,
    borderRadius: SIZES.radius,
    height: pixelPerfect(55),
    color: COLORS.primary,
    marginBottom: pixelPerfect(15),
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primary,
    fontFamily: fonts.robotoNormal,
    fontSize: pixelPerfect(22),

    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.3,
    // shadowRadius: 4.65,

    // elevation: 8,
  },
  btnContainer: {
    paddingHorizontal: pixelPerfect(2),
    // marginTop: pixelPerfect(15),
  },
  textInputLabel: {
    fontFamily: fonts.robotosemiBold,
    color: COLORS.primary,
    fontSize: pixelPerfect(22),
    textAlign: "left",
    marginTop: pixelPerfect(20),
  },
  cardNumber: {
    fontSize: pixelPerfect(18),
    fontFamily: fonts.robotoBold,
    color: COLORS.white,
    marginTop: "30%",
    alignSelf: "center",
  },
  cardHolderNameAndExpiryDateContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-evenly",
    marginTop: "6%",
    marginLeft: 20,
  },
  offImg: {
    width: widthPercentageToDP(10),
    height: heightPercentageToDP(5),
  },
  cardLabel: {
    fontFamily: fonts.robotoBold,
    fontSize: pixelPerfect(14),
    color: COLORS.white,
  },
  value: {
    color: COLORS.white,
  },
  cvc: {
    position: "absolute",
    right: 30,
    bottom: pixelPerfect(100),
    color: COLORS.black,
    backgroundColor: COLORS.white,
    padding: 5,
    minWidth: pixelPerfect(45),
    textAlign: "center",
  },
  saveCardTxt: {
    color: COLORS.primary,
    fontSize: RFValue(12),
    fontFamily: fonts.robotosemiBold,
  },
  switchContiner: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
  },
  errorMessageStyle: {
    fontFamily: fonts.robotoNormal,
    color: COLORS.error,
    fontSize: pixelPerfect(15),

    textAlign: "left",
    marginTop: -pixelPerfect(10),
  },
});
