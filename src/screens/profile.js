import React, { useRef, useEffect, useState } from "react";
import {
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  FlatList,
  I18nManager,
  ScrollView,
  Text,
  Share,
  Platform,
  Linking,
} from "react-native";
import { useTranslation } from "react-i18next";
import { CommonActions } from "@react-navigation/native";
import H1 from "../common/H1";
import Screen from "../components/Screen";
import fonts from "../contants/fonts";
import { IMAGES } from "../contants/images";
import { COLORS } from "../contants/colors";
import { SCREEN } from "../contants/screens";
import MainHeader from "../components/AppHeader";
import pixelPerfect from "../utils/pixelPerfect";
import OptionsComponent from "../components/OptionsComponent";
import AppSecondaryModal from "../components/AppSecondaryModal";
import AppCurrencyModal from "../components/CurrencyModal";

import AsyncStorage from "@react-native-async-storage/async-storage";
import RNRestart from "react-native-restart";
import { dispatch } from "../redux/store";
import { removeUser } from "../redux/slices/userSlice";
import { useSelector } from "../redux/store";
import AppLoading from "../common/AppLoader";
import {
  getStripe,
  createStripeConnectLink,
  deleteAccount,
  changeDefaultCurrency,
  getMyDetails,
} from "../services/apis";
import Alert from "../common/Alert";

import { resetTransactionSlice } from "../redux/slices/transactionSlice";
import Header from "../components/Header";
import Clipboard from "@react-native-clipboard/clipboard";
import ALLCURRENCIES from "../contants/currencies";
import LinearGradient from "react-native-linear-gradient";
import { saveUser } from "../redux/slices/userSlice";
import { useIsFocused } from "@react-navigation/native";
import AlertMessage from "../components/AlertMessage";
import StarRating from "react-native-star-rating";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { SIZES } from "../contants/sizes";
import DeleteAccountAlert from "../components/deleteAccountAlert";

const Profile = (props) => {
  const { t, i18n } = useTranslation();

  const {
    user: {
      accountType,
      email,
      isTeamOwner,
      payeeCode,
      profileImg,
      userType,
      username,
      isTeamAdmin,
      teamCode,
    },
    token,
    user,
  } = useSelector((state) => state.userReducer);
  console.log("user ", user);

  const isRtl = I18nManager.isRTL;
  const modalRef = useRef(null);
  const modalDeleteRef = useRef(null);
  const currencyModal = useRef(null);
  const languageModal = useRef(null);
  const addStripeRef = useRef(null);
  const alertMessageRef = useRef(null);
  const [from, setFrom] = useState("payer");
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const [isStripeConnected, setIsStripeConnected] = useState(false);
  const [checkingStringConnection, setCheckingStripeConnection] =
    useState(false); //this is to check stripe integration for team owner
  // const [accountType, setAccountType] = useState("Individual");
  const options = [
    {
      id: 0,
      image: IMAGES.language,
      title: "Change Language",
    },
    // {
    //   id: 1,
    //   image: IMAGES.currency,
    //   title: "Change Currency",
    // },
    {
      id: 2,
      image: IMAGES.terms,
      title: "Terms and Conditions",
    },
    {
      id: 3,
      image: IMAGES.contact,
      title: "Contact Us",
    },
    {
      id: 4,
      image: IMAGES.share,
      title: "Share App",
    },
    {
      id: 7,
      image: IMAGES.ratingIcon,
      title: "Rate App",
    },
    {
      id: 5,
      image: IMAGES.delete,
      title: "Delete Account",
    },
    {
      id: 6,
      image: IMAGES.logout,
      title: "Logout",
    },
  ];

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
  const _handleCopyText = async () => {
    const text = Clipboard.setString(teamCode);
    Alert(t("Team Code Copied"), "success");
  };

  const isFocused = useIsFocused();
  useEffect(() => {
    if (isFocused) {
      _handleGetMyDetails();

      if (user?.accountType == "team") {
        _checkStripeConnection();
      }
    }
  }, [isFocused]);

  // useEffect(() => {
  //   getAccountDetails();
  // }, []);

  // const getAccountDetails = async () => {
  //   const accouType = await AsyncStorage.getItem("accountType");
  //   const fromAccount = await AsyncStorage.getItem("from");
  //   console.log("accounttype", accouType, "fromAccount", fromAccount);
  //   if (fromAccount) {
  //     setFrom(fromAccount);
  //   } else {
  //     setFrom("payer");
  //   }
  //   if (accouType) {
  //     setAccountType(accouType);
  //   } else {
  //     setAccountType("Bussiness");
  //   }
  // };

  const _handleCreateStripeLink = () => {
    addStripeRef.current.setModalVisibility(false);
    setTimeout(() => {
      props.navigation.navigate(SCREEN.STRIPESCREEN);
    }, 400);
  };
  const onRegisterStipeAccount = (link) => {
    addStripeRef.current.setModalVisibility(false);
    props.navigation.navigate(SCREEN.webView, {
      from: "profile",
      user: user,
      link: link,
      showHeader: false,
    });
  };

  const _renderItems = (item) => {
    return (
      <OptionsComponent
        title={t(item?.title)}
        image={item?.image}
        onPressCard={() => navigateSwitch(item?.id)}
      />
    );
  };

  const navigateSwitch = (id) => {
    switch (id) {
      case 0:
        return languageModal.current.setModalVisibility(true);
      case 1:
        return currencyModal.current.setModalVisibility(true);
      case 2:
        return navigateToBrowser("https://easytipping.com/PrivacyPolicy");
      // return props.navigation.navigate(SCREEN.webView, {
      //   from: "profile",
      //   user: user,
      //   link: "https://easytipping.com/PrivacyPolicy",
      //   showHeader: true,
      // });
      case 3:
        return props.navigation.navigate(SCREEN.contactUs);
      case 4:
        return onShare();
      case 5:
        return modalDeleteRef.current.setModalVisibility(true);
      case 6:
        return modalRef.current.setModalVisibility(true);
      case 7:
        return _handleRateApp();
      case 8:
        return props.navigation.navigate(SCREEN.teamMember);
      default:
        return console.log("Default");
    }
  };

  const _handleRateApp = () => {
    if (Platform.OS == "android") {
      navigateToBrowser(
        "https://play.google.com/store/apps/details?id=com.org.ObonApp.Fintech"
      );
    } else {
      navigateToBrowser(
        "https://apps.apple.com/us/app/easy-tipping-app/id6449997064"
      );
    }
  };

  const navigateToBrowser = async (link) => {
    const supported = await Linking.canOpenURL(link);
    if (supported) {
      await Linking.openURL(link);
    }
  };

  const onAccept = () => {
    modalRef.current.setModalVisibility(false);

    setTimeout(() => {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: SCREEN.welcome }],
        })
      );
    }, 700);
    dispatch(resetTransactionSlice());
    setTimeout(() => {
      dispatch(removeUser());
    }, 1000);
  };

  const onLaterRegisterStripeAccount = () => {
    addStripeRef.current.setModalVisibility(false);
  };

  const _checkStripeConnection = () => {
    setCheckingStripeConnection(true);
    getStripe(token)
      .then((res) => {
        if (
          res.data.data.user.charges_enabled &&
          res.data.data.user.details_submitted
        ) {
          setIsStripeConnected(true);
        }
        setCheckingStripeConnection(false);
      })
      .catch((error) => {
        setCheckingStripeConnection(false);
      });
  };

  const _handlegetStripe = (isTeam) => {
    if (userType == "payer") {
      setAlertMessage(
        t(
          "You will have to delete this account and re-register as a Tip Receiver. The Tip Receiver account provides the functionality to receive and give tips. Before you delete your account, we recommend that you download and save your transaction history."
        )
      );
      alertMessageRef.current.setModalVisibility(true);

      return;
    }
    // props.navigation.navigate(SCREEN.recieveTips);
    // return;
    setLoading(true);

    getStripe(token)
      .then((res) => {
        setLoading(false);
        if (
          !res.data.data.user.charges_enabled &&
          !res.data.data.user.details_submitted
        ) {
          // setTimeout(() => {
          //   addStripeRef.current.setModalVisibility(true);
          // }, 700);
          addStripeRef.current.setModalVisibility(true);
        } else if (
          res.data.data.user.charges_enabled &&
          res.data.data.user.details_submitted
        ) {
          if (isTeam) {
            setAlertMessage(t("You have already connected your stripe."));
            alertMessageRef.current.setModalVisibility(true);
          } else props.navigation.navigate(SCREEN.recieveTips);
        } else if (
          !res.data.data.user.charges_enabled &&
          res.data.data.user.details_submitted
        ) {
          setAlertMessage(
            t(
              "Your account is currently being reviewed. We'll notify you when you can start receiving tips."
            )
          );
          alertMessageRef.current.setModalVisibility(true);
        } else {
          Alert(
            t(
              "There is something wrong with the creation of your stripe account."
            )
          );
        }
      })
      .catch((error) => {
        console.log("error on get stripe ", error);
        setLoading(false);
      });

    // props.navigation.navigate(SCREEN.recieveTips)
  };
  const onReject = () => {
    modalRef.current.setModalVisibility(false);
    modalDeleteRef.current.setModalVisibility(false);
  };

  const onDelete = () => {
    modalDeleteRef.current.setModalVisibility(false);
    setTimeout(() => {
      setLoading(true);
      deleteAccount(token, user?.id)
        .then((res) => {
          setLoading(false);
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: SCREEN.welcome }],
            })
          );
        })
        .catch((error) => {
          console.log("error on delete account", error);
        });
    }, 500);
  };

  const onShare = async () => {
    // try {
    //   const androidUrl =
    //     "https://play.google.com/store/apps/details?id=your.package.name"; // Replace with your Android app's Play Store URL
    //   const iosUrl = "https://apps.apple.com/us/app/your-app-name/id1234567890"; // Replace with your iOS app's App Store URL

    //   const options = {
    //     title: "Share App",
    //     message: "Check out this awesome app!",
    //     urls: [androidUrl, iosUrl], // Provide both URLs in an array
    //   };

    //   Share.open(options)
    //     .then((res) => {
    //       console.log(res);
    //     })
    //     .catch((err) => {
    //       err && console.log(err);
    //     });
    // } catch (error) {
    //   console.error("Error sharing:", error.message);
    // }

    try {
      const result = await Share.share({
        message:
          "IOS : https://apps.apple.com/us/app/easy-tipping-app/id6449997064" +
          "\n" +
          "Android : https://play.google.com/store/apps/details?id=com.org.ObonApp.Fintech",
      });
      if (result.action === Share.sharedAction) {
        if (result.activityType) {
          // shared with activity type of result.activityType
        } else {
          // shared
        }
      } else if (result.action === Share.dismissedAction) {
        // dismissed
      }
    } catch (error) {
      Alert.alert(error.message);
    }
  };

  const onSelectCurrency = (item) => {
    currencyModal.current.setModalVisibility(false);
    setTimeout(() => {
      setLoading(true);
      changeDefaultCurrency(token, { currency: item.code })
        .then((res) => {
          Alert(res.data?.message, "success");
          setLoading(false);
          _handleGetMyDetails();
        })
        .catch((error) => {
          setLoading(false);
          Alert(
            error?.response?.data?.data?.message
              ? error?.response?.data?.data?.message
              : "Something went wrong!"
          );
        });
    }, 300);
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

        // dispatch(saveUser(res?.data?.data?.user));
      })
      .catch((error) => {
        console.log("error on get my details  ", error);
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

  function roundToNearestHalf(value) {
    const decimalPart = value - Math.floor(value); // Get the decimal part
    if (decimalPart < 0.5) {
      return Math.floor(value); // Round down to the nearest 0.5
    } else {
      return Math.floor(value) + 0.5; // Round up to the nearest 0.5
    }
  }

  return (
    <Screen>
      {AppLoading(loading)}
      <View style={styles.container}>
        <Header title={t("My Profile")} isBackBtn={false} />
        <View
          style={{
            width: "100%",
          }}
        >
          <LinearGradient
            colors={["#499662", "#1C6748", "#35764A"]}
            // start={{ x: 0, y: 1 }}
            // end={{ x: 1, y: 0 }}

            locations={[0.23, 0.51, 0.74]}
            useAngle={true}
            angle={125.9}
            style={styles.card}
          >
            <View style={styles.cardView}>
              <View>
                <Image
                  source={
                    profileImg !== null && profileImg !== undefined
                      ? { uri: profileImg }
                      : IMAGES.placeholder
                  }
                  style={styles.imageStyle}
                />
              </View>
              <View style={{ width: pixelPerfect(200) }}>
                <H1
                  text={username}
                  customStyle={{
                    color: COLORS.white,
                    fontSize: pixelPerfect(24),
                  }}
                  numberOfLines={1}
                />
                <H1
                  text={email}
                  customStyle={{
                    color: COLORS.white,
                    marginTop: pixelPerfect(2),
                    fontFamily: fonts.robotoNormal,
                    fontSize: pixelPerfect(16),
                  }}
                  numberOfLines={1}
                />
              </View>
              <TouchableOpacity
                style={styles.editIconStyle}
                activeOpacity={0.8}
                onPress={() => props.navigation.navigate(SCREEN.editProfile)}
              >
                <Image source={IMAGES.editProfile} style={styles.editIcon} />
              </TouchableOpacity>
            </View>
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
                width: "90%",
                marginBottom:
                  userType != "payer" ||
                  user.accountType == "team" ||
                  user.accountType == "teamMember"
                    ? pixelPerfect(19)
                    : pixelPerfect(0),
              }}
            >
              {userType != "payer" && (
                <View style={styles.ratingContainer}>
                  {user?.reviewsCount > 4 ? (
                    <View
                      style={{ flexDirection: "row", alignItems: "center" }}
                    >
                      <StarRating
                        disabled={true}
                        maxStars={5}
                        rating={roundToNearestHalf(user?.rating)}
                        starSize={pixelPerfect(15)}
                        emptyStarColor={COLORS.white}
                        fullStarColor={"#FFB33E"}
                        // containerStyle={{ marginTop: pixelPerfect(10) }}
                      />
                      <Text style={{ color: COLORS.white, marginLeft: 5 }}>
                        ({user?.rating})
                      </Text>
                    </View>
                  ) : (
                    <Menu>
                      <MenuTrigger
                        style={{ padding: 3, marginLeft: pixelPerfect(15) }}
                        hitSlop={{
                          top: 25,
                          bottom: 25,
                          left: 15,
                          right: 15,
                        }}
                      >
                        <Image
                          source={IMAGES.noRatingIcon}
                          style={styles.menuIcon}
                        />
                      </MenuTrigger>
                      <MenuOptions
                        customStyles={{
                          optionsContainer: styles.menuPopupContainer,
                        }}
                      >
                        <MenuOption>
                          <Text style={styles.popUpMenuItem}>
                            {t(
                              "You need to receive 5 reviews to see your rating."
                            )}
                          </Text>
                        </MenuOption>
                      </MenuOptions>
                    </Menu>
                  )}
                </View>
              )}

              {(user.accountType == "team" && user?.teamCode) ||
              (user.accountType == "teamMember" && user?.userTeam?.teamCode) ? (
                <View style={styles.teamDetailsRow}>
                  {user.accountType == "teamMember" ? (
                    <H1
                      text={t("Team Code") + " : " + user?.userTeam?.teamCode}
                      customStyle={{
                        color: COLORS.white,

                        fontFamily: fonts.robotoNormal,
                        fontSize: pixelPerfect(16),
                      }}
                      numberOfLines={1}
                    />
                  ) : (
                    <H1
                      text={t("Team Code") + " : " + user?.teamCode}
                      customStyle={{
                        color: COLORS.white,

                        fontFamily: fonts.robotoNormal,
                        fontSize: pixelPerfect(16),
                      }}
                      numberOfLines={1}
                    />
                  )}

                  <TouchableOpacity onPress={_handleCopyText}>
                    <Image
                      source={IMAGES.copyIcon}
                      style={styles.copyIcon}
                      resizeMode="contain"
                    />
                  </TouchableOpacity>
                </View>
              ) : (
                <Text></Text>
              )}
            </View>
          </LinearGradient>
        </View>

        <View
          style={{
            marginTop: pixelPerfect(33),
            flex: 1,
          }}
        >
          <ScrollView
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
          >
            {(accountType == "teamMember" ||
              (accountType == "individual" && user?.userType == "payee")) && (
              <OptionsComponent
                title={t("My Teams")}
                image={IMAGES.manageTeam}
                onPressCard={() => props.navigation.navigate(SCREEN.myTeams)}
              />
            )}

            {userType == "payee" &&
              ((accountType == "team" && isTeamOwner) ||
                (accountType == "teamMember" &&
                  user?.userTeam?.isteamAdmin)) && (
                <OptionsComponent
                  title={t("Manage Team")}
                  image={IMAGES.manageTeam}
                  onPressCard={() =>
                    props.navigation.navigate(SCREEN.teamMember)
                  }
                />
              )}

            {user?.accountType != "team" && (
              <OptionsComponent
                title={t("Receive Tips")}
                image={IMAGES.recieveTip}
                onPressCard={() =>
                  user?.accountType == "teamMember"
                    ? props.navigation.navigate(SCREEN.recieveTips)
                    : _handlegetStripe(false)
                }
              />
            )}

            {user?.accountType == "team" &&
              !isStripeConnected &&
              !checkingStringConnection && (
                <OptionsComponent
                  title={t("Integrate Stripe")}
                  image={IMAGES.recieveTip}
                  onPressCard={() => _handlegetStripe(true)}
                />
              )}

            {user?.accountType !== "teamMember" && (
              <OptionsComponent
                title={t("Give Tip")}
                image={IMAGES.giveTip}
                onPressCard={() =>
                  props.navigation.navigate(SCREEN.paymentOptions, {
                    from: "user",
                  })
                }
              />
            )}

            {userType == "payee" && accountType == "business" && (
              <>
                <OptionsComponent
                  title={t("Subscription")}
                  image={IMAGES.subscriptionIcon}
                  onPressCard={() =>
                    props.navigation.navigate(SCREEN.subscription)
                  }
                />
                <OptionsComponent
                  title={t("Business Details")}
                  image={IMAGES.businessIcon}
                  onPressCard={() => {
                    if (user?.currentPeriodEndDate) {
                      props.navigation.navigate(SCREEN.businessDetails);
                    } else {
                      setAlertMessage(
                        t(
                          "Please purchase a valid subscription to activate this feature"
                        )
                      );
                      alertMessageRef.current.setModalVisibility(true);
                    }
                  }}
                />
              </>
            )}

            <FlatList
              data={options}
              extraData={options}
              scrollEnabled={false}
              showsVerticalScrollIndicator={false}
              keyExtractor={(item) => item?.id}
              renderItem={({ item }) => _renderItems(item)}
            />
            <View style={{ height: pixelPerfect(130) }} />
          </ScrollView>
        </View>

        <AppSecondaryModal
          ref={modalRef}
          title={t("Are you sure you want to log out of your account?")}
          acceptTitle={t("Yes")}
          rejectTitle={t("No")}
          onAccept={onAccept}
          onReject={onReject}
        />
        <DeleteAccountAlert
          ref={modalDeleteRef}
          title={t("Are you sure you want to delete your account?")}
          acceptTitle={t("Yes")}
          rejectTitle={t("No")}
          onAccept={onDelete}
          onReject={onReject}
          username={username}
        />
        <AppCurrencyModal
          ref={currencyModal}
          data={ALLCURRENCIES.sort((a, b) => a.code - b.code)}
          isCurrency={true}
          onSelect={(item) => onSelectCurrency(item)}
          onCloseClick={() => currencyModal.current.setModalVisibility(false)}
          selectedItem={user?.currency}
        />
        <AppCurrencyModal
          ref={languageModal}
          data={Languages}
          isCurrency={false}
          onSelect={(item) => onSelectLanguage(item)}
          onCloseClick={() => languageModal.current.setModalVisibility(false)}
          selectedItem={currentLang(i18n.language)}
        />
      </View>
      <AppSecondaryModal
        ref={addStripeRef}
        title={t("To receive tips, register for a Stripe account now.")}
        acceptTitle={t("Now")}
        rejectTitle={t("Later")}
        onAccept={_handleCreateStripeLink}
        onReject={onLaterRegisterStripeAccount}
      />
      <AlertMessage
        ref={alertMessageRef}
        title={alertMessage}
        acceptTitle={t("Ok")}
        onAccept={() => alertMessageRef.current.setModalVisibility(false)}
      />
    </Screen>
  );
};
export default Profile;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  card: {
    width: "100%",
    borderRadius: pixelPerfect(15),
    alignItems: "center",
    backgroundColor: COLORS.primary,
    marginTop: pixelPerfect(30),
  },
  cardView: {
    // height: pixelPerfect(95),
    // width: pixelPerfect(350),
    width: "100%",
    borderRadius: pixelPerfect(15),
    alignItems: "center",
    flexDirection: "row",
    // backgroundColor: COLORS.primary,
    justifyContent: "space-between",
  },
  imageStyle: {
    height: pixelPerfect(61),
    width: pixelPerfect(61),
    borderRadius: pixelPerfect(61),
    borderWidth: 1,
    borderColor: COLORS.primary,
    margin: pixelPerfect(17),
  },
  editIcon: {
    height: pixelPerfect(30),
    width: pixelPerfect(34),
  },
  editIconStyle: {
    width: pixelPerfect(38),
    borderRadius: pixelPerfect(19),
    height: pixelPerfect(38),
    justifyContent: "center",
    alignItems: "center",
    marginRight: 5,
  },
  teamDetailsRow: {
    flexDirection: "row",
    // marginBottom: pixelPerfect(19),
    alignItems: "center",
    // width: "80%",
    justifyContent: "center",
  },
  copyIcon: {
    height: pixelPerfect(20),
    width: pixelPerfect(20),
    resizeMode: "contain",
    // tintColor: COLORS.secondary,
    marginLeft: 15,
  },
  ratingContainer: {
    alignItems: "center",
    justifyContent: "center",
    // marginBottom: 10,
  },
  menuIcon: {
    width: pixelPerfect(20),
    height: pixelPerfect(20),
    // tintColor: COLORS.secondary,
  },
  menuPopupContainer: {
    width: pixelPerfect(150),
    borderRadius: SIZES.radius,
    padding: pixelPerfect(10),
    borderColor: COLORS.primary,
    borderWidth: 1,
    marginLeft: -10,
    marginTop: 10,
  },
});
