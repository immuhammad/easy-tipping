//================================ React Native Imported Files ======================================//

import React, { useState, useRef, useEffect, useCallback } from "react";
import {
  Text,
  StyleSheet,
  View,
  FlatList,
  Image,
  TouchableOpacity,
  Dimensions,
  ScrollView,
  Platform,
} from "react-native";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { useTranslation } from "react-i18next";

import FastImage from "react-native-fast-image";
//================================ Local Imported Files ======================================//

import { IMAGES } from "../contants/images";

import TransactionCard from "../components/TransactionCard";
import fonts from "../contants/fonts";
import { COLORS } from "../contants/colors";
import Button from "../components/Button";
import Screen from "../components/Screen";
import pixelPerfect from "../utils/pixelPerfect";
import PickDate from "../components/pickDate";
import { SCREEN } from "../contants/screens";
import TransactionDetails from "../components/transactionDetails";
import WalletOption from "../components/walletOption";

import { useSelector } from "../redux/store";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { SIZES } from "../contants/sizes";

import {
  getTransactions,
  getUserDetails,
  applyFilters,
  getBalanceDetails,
  addFeedBack,
  saveReports,
  getGeoLocationBasedCurrency,
  changeDefaultCurrency,
  getMyDetails,
  createCSVReports,
  getStripe,
} from "../services/apis";
import AppLoading from "../common/AppLoader";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import AddFeedback from "../components/addFeedback";

import { hasProxies } from "immer/dist/internal";
import CustomeMessage from "./FirstTimeMesssage";
import { RFValue } from "react-native-responsive-fontsize";

import Acknowledgment from "../components/Acknowledgment";
import EmptyList from "../components/emptylist";
import Geolocation from "@react-native-community/geolocation";
import { saveUser } from "../redux/slices/userSlice";
import { dispatch } from "../redux/store";
import ALLCURRENCIES from "../contants/currencies";
import Alert from "../common/Alert";

import GoogleAds from "../components/GoogleAds";
import AppSecondaryModal from "../components/AppSecondaryModal";
import AlertMessage from "../components/AlertMessage";
import dateAndTime from "../utils/dateAndTime";
import roundWithSuffix from "../utils/roundNumber";
// import crashlytics from "@react-native-firebase/crashlytics";
const { width } = Dimensions.get("window");
const Home = (props) => {
  const {
    user: {
      accountType,
      profileImg,
      userType,
      username,
      isAllowedToChat,
      currency,
    },
    token,
    user,
  } = useSelector((state) => state.userReducer);
  let currentCurrency = ALLCURRENCIES.filter(
    (data) => data.code == user?.currency
  );
  let currentSymbol = currentCurrency.length ? currentCurrency[0].symbol : "$";

  const { isTooltipViewed } = useSelector((state) => state.userReducer);

  const isFocused = useIsFocused();
  const {
    transactions,
    isLoading,
    totalBalance,
    todaysBalance,
    remainingBalance,
    filterFrom,
    filterTo,
    isFilterApplied,
  } = useSelector((state) => state.transactionReducer);
  const pickDateRef = useRef(null);
  const transationDetailsRef = useRef(null);
  const { t } = useTranslation();
  const feedbackModalRef = useRef(null);
  const addStripeRef = useRef(null);
  const acknowledgmentModalRef = useRef(null);
  const alertMessageRef = useRef(null);
  const [from, setFrom] = useState("payer");
  const [transcationDetail, setTranscationDetail] = useState("");
  const [activeBtn, setActiveBtn] = useState(3);
  const [loading, setLoading] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");
  //remove this function afterwards

  //testing crashAnalytics
  // useEffect(() => {
  //   crashlytics().log("Updating user count.");
  // }, []);

  useEffect(() => {
    if (isFocused) {
      getBalanceDetails(
        token,
        user?.userTeam
          ? `?toTeamId=${user?.userTeam?.teamId}&userTeamId=${user?.userTeam?.id}`
          : user?.team
          ? `?toTeamId=${user?.team?.id}&userTeamId=${user?.userTeam?.id}`
          : `?toTeamId=${null}&userTeamId=${null}`
      );
      _handleGetMyDetails();
      // const query = `?type=${
      //   user?.userType == "payer" ? "All" : "All"
      // }&search=${""}&startDate=${null}&endDate=${null}&teamId=${
      //   activeBtn == 2 ? null : user?.userTeam ? user?.userTeam?.teamId : null
      // }&userTeamId=${user?.userTeam ? user?.userTeam?.id : null}&userType=${
      //   user?.userType == "payer" ? "payer" : null
      // }&toTeamId=${
      //   user?.userTeam?.teamId ? user?.userTeam?.teamId : null
      // }&fromTeamId=${
      //   user?.userTeam?.teamId ? user?.userTeam?.teamId : null
      // }&teamLogin=${user?.userTeam ? true : false}`;
      // getTransactions(token, query, user?.id, (resp) => {});

      // activeBtn == 2 ? null : user?.userTeam ? user?.userTeam?.teamId : null
      const query1 = `?type=${
        user?.userType == "payer"
          ? "All"
          : user?.isTeamOwner
          ? "Received"
          : "All"
      }&search=${""}&startDate=${undefined}&endDate=${undefined}&teamId=${
        user?.isTeamOwner ? user?.team?.id : null
      }&userTeamId=${
        user?.userTeam
          ? user?.userTeam?.id
          : user?.isTeamOwner
          ? user?.team?.id
          : null
      }&userType=${user?.userType == "payer" ? "payer" : null}&toTeamId=${
        user?.userTeam?.teamId
          ? user?.userTeam?.teamId
          : user?.isTeamOwner
          ? user?.team?.id
          : null
      }&fromTeamId=${
        user?.userTeam?.teamId ? user?.userTeam?.teamId : undefined
      }&teamLogin=${user?.userTeam || user?.isTeamOwner ? true : false}`;

      getTransactions(token, query1, user?.id, (resp) => {});
    }
    getUserDetails(token, user?.id);
  }, [isFocused]);

  useEffect(() => {
    // getCurrentLocation();
  }, []);
  // const getCurrentLocation = () => {
  //   if (Platform.OS == "ios") Geolocation.requestAuthorization();
  //   Geolocation.getCurrentPosition((info) => {
  //     if (isTooltipViewed)
  //       _handleGeoBasedCurrency(info.coords.latitude, info.coords.longitude);
  //   });
  // };
  // const _handleGeoBasedCurrency = (lat, lng) => {
  //   getGeoLocationBasedCurrency(token, { lat: lat, long: lng })
  //     .then((res) => {
  //       //check if stripe supports
  //       if (
  //         ALLCURRENCIES.filter(
  //           (data) => data.code == res.data.data.currencyCode
  //         ).length > 0
  //       )
  //         _handleSetDefaultCurrency(res.data.data.currencyCode);
  //     })
  //     .catch((error) => {
  //       console.log("error on get currency ", error);
  //     });
  // };
  // const _handleSetDefaultCurrency = (code) => {
  //   changeDefaultCurrency(token, { currency: code })
  //     .then((res) => {
  //       _handleGetMyDetails();
  //     })
  //     .catch((error) => {});
  // };
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

  const closeDatePicker = () => {
    pickDateRef.current.setModalVisibility(false);
  };
  const onConfirmFeedBackModal = (comment, rating) => {
    feedbackModalRef.current.setModalVisibility(false);
    setTimeout(() => {
      let payload = {
        payerId: transcationDetail?.payer?.id,
        payeeId: transcationDetail?.payee?.id,
        feedbackText: comment,
        type: "feedback",
        transactionId: transcationDetail?.id,
        rating: rating,
      };
      addFeedBack(token, payload);
    }, 400);
  };

  const onCancelfeedbackModal = () => {
    feedbackModalRef.current.setModalVisibility(false);
  };

  const onConfirmacknowledgmentModal = (comment) => {
    acknowledgmentModalRef.current.setModalVisibility(false);
    setTimeout(() => {
      let payload = {
        payerId: transcationDetail?.payer?.id,
        payeeId: transcationDetail?.payee?.id,
        feedbackText: comment,
        type: "acknowledgment",
        transactionId: transcationDetail?.id,
      };
      addFeedBack(token, payload);
    }, 400);
  };

  const onCancelacknowledgmentModal = () => {
    acknowledgmentModalRef.current.setModalVisibility(false);
  };

  const onPickDate = (startDate, endDate) => {
    pickDateRef.current.setModalVisibility(false);
    const query1 = `?type=${
      user?.userType == "payer" ? "All" : "All"
    }&search=${""}&startDate=${new Date(startDate)}&endDate=${new Date(
      endDate
    )}&teamId=${null}&userTeamId=${
      user?.userTeam ? user?.userTeam?.id : null
    }&userType=${user?.userType == "payer" ? "payer" : null}&toTeamId=${
      user?.userTeam?.teamId ? user?.userTeam?.teamId : null
    }&fromTeamId=${
      user?.userTeam?.teamId ? user?.userTeam?.teamId : null
    }&teamLogin=${user?.userTeam ? true : false}`;
    applyFilters(token, query1, new Date(startDate), new Date(endDate));
  };
  const onConfirm = () => {
    transationDetailsRef.current.setModalVisibility(false);
  };
  const onCancel = () => {
    transationDetailsRef.current.setModalVisibility(false);
  };

  const _renderAllTransactions = (item, index) => {
    let amount = item?.amount
      ?.toFixed(2)
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, "$1,");

    return (
      <TransactionCard
        key={index}
        item={item}
        image={item?.payer?.profileImg}
        name={
          item?.isGuestTransaction
            ? item?.payerName
            : user?.id == item?.payerId
            ? item?.payee?.username
            : item?.payer?.username
            ? item?.payer?.username
            : item?.payerName
        }
        refPayee={item?.referpayee}
        rating={item?.payerRating}
        feedBackBtnTxt={
          user?.id === item?.payee?.id ? t("Acknowledgment") : t("Feedback")
        }
        feedBackBtn={() => {
          setTranscationDetail(item);
          user?.id === item?.payee?.id
            ? acknowledgmentModalRef.current.setModalVisibility(true)
            : feedbackModalRef.current.setModalVisibility(true);
        }}
        date={dateAndTime(item?.createdAt)}
        added={user?.id === item?.payee?.id}
        fromChat={false}
        businessName={item?.businessName}
        amount={
          user?.id == item?.payerId ? item?.payerAmount : item?.payeeAmount
        }
        feedback={item?.feedbacks}
        onPressCard={() => {
          transationDetailsRef.current.setModalVisibility(true);
          setTranscationDetail(item);
        }}
        showActionBtn={
          item?.isGuestTransaction ||
          (user?.userType === "payee" && user?.accountType == "team")
            ? false
            : user?.userType === "payer"
            ? item.feedback == null
            : item.payerId == user.id
            ? item.feedback == null
            : item.acknowledgment == null
        }
        plateFormFee={item?.plateFormFee}
        currentSymbol={currentSymbol}
      />
    );
  };

  const _handleChat = (item) => {
    transationDetailsRef.current.setModalVisibility(false);
    if (!isAllowedToChat) {
      Alert(
        t(
          "You are not allowed to chat. You have been disabled by an administrator. Please contact support."
        )
      );
      return;
    }

    console.log("chat thread ", transcationDetail);

    props.navigation.navigate(SCREEN.chatScreen, {
      item:
        transcationDetail?.payeeId === user?.id
          ? transcationDetail?.payer
          : transcationDetail?.payee,
      fromChat: true,
      chatRoomId: transcationDetail?.chatRoomId,
    });
  };

  const _handleGenerateReports = async (transactions) => {
    saveReports(
      currentSymbol,
      user,
      transactions,
      isFilterApplied
        ? `${dateAndTime(filterFrom, "MMM D YYYY")} ${t("To")} ${dateAndTime(
            filterTo,
            "MMM D YYYY"
          )}`
        : t("Last 30 days transactions"),
      t
    );
  };

  const _handleGenerateCSVReports = (transactions) => {
    createCSVReports(
      currentSymbol,
      user,
      transactions,
      isFilterApplied
        ? `${dateAndTime(filterFrom, "MMM D YYYY")} ${t("To")} ${dateAndTime(
            filterTo,
            "MMM D YYYY"
          )}`
        : t("Last 30 days transactions"),
      t
    );
  };

  const _handlegetStripe = () => {
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
          props.navigation.navigate(SCREEN.recieveTips);
        } else if (
          !res?.data?.data?.user?.charges_enabled &&
          res?.data?.data?.user?.details_submitted
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
  const _handleCreateStripeLink = () => {
    addStripeRef.current.setModalVisibility(false);
    setTimeout(() => {
      props.navigation.navigate(SCREEN.STRIPESCREEN);
    }, 400);
  };
  const onLaterRegisterStripeAccount = () => {
    addStripeRef.current.setModalVisibility(false);
  };

  const filterTransactions =
    activeBtn == 1
      ? transactions
      : transactions.filter((data) =>
          activeBtn == 2
            ? data?.payer?.id == user.id
            : data?.payee?.id == user.id
        );

  return (
    <>
      <CustomeMessage />

      <Screen>
        {AppLoading(isLoading)}
        {AppLoading(loading)}
        <View style={styles.container}>
          <View style={styles.homeheadingContainer}>
            <View style={styles.makePaymentBtn}>
              {user?.userType === "payer" ? (
                <Button
                  btnText={t("Give Tip")}
                  onPress={() =>
                    props.navigation.navigate(SCREEN.paymentOptions, {
                      from: "user",
                    })
                  }
                />
              ) : user?.accountType == "team" ? (
                <></>
              ) : (
                <Button
                  btnText={t("Receive Tips")}
                  onPress={() =>
                    user?.accountType == "teamMember"
                      ? props.navigation.navigate(SCREEN.recieveTips)
                      : _handlegetStripe(false)
                  }
                />
              )}
            </View>

            <TouchableOpacity
              onPress={() =>
                props.navigation.navigate(SCREEN.searchHistory, {
                  transactions: transactions,
                })
              }
            >
              <Image source={IMAGES.searchIcon} style={styles.icon} />
            </TouchableOpacity>
            <TouchableOpacity
              onPress={() => pickDateRef.current.setModalVisibility(true)}
            >
              <Image source={IMAGES.filterIcon} style={styles.icon} />
            </TouchableOpacity>
          </View>

          <View style={styles.historyView}>
            <FlatList
              scrollEnabled={true}
              data={
                user?.userType === "payer"
                  ? transactions
                  : user?.userType === "payee" &&
                    user?.accountType == "individual"
                  ? filterTransactions?.filter((data) =>
                      data?.toTeamId != null && data?.payeeId == user?.id
                        ? false
                        : true
                    )
                  : user?.userType === "payee" && user?.isTeamOwner
                  ? transactions
                  : filterTransactions
              }
              extraData={filterTransactions}
              contentContainerStyle={{ paddingBottom: pixelPerfect(80) }}
              showsVerticalScrollIndicator={false}
              renderItem={({ item, index }) =>
                _renderAllTransactions(item, index)
              }
              ListHeaderComponent={() => {
                return (
                  <>
                    {userType != "payer" && (
                      <>
                        <View style={styles.trasactionsDetails}>
                          {[
                            {
                              title: t("Received Today"),
                              amount: todaysBalance,
                            },
                            {
                              title: t("Total Received"),
                              amount: remainingBalance,
                            },

                            {
                              title: t("Available Balance"),
                              amount: remainingBalance,
                            },
                          ].map((data) => {
                            return (
                              <WalletOption
                                title={data.title}
                                amount={data.amount}
                                currentSymbol={currentSymbol}
                              />
                            );
                          })}
                        </View>
                      </>
                    )}
                    <View style={{ height: 20 }} />

                    <View>
                      {!user?.isSubscriptionPurchased &&
                        user.userType == "payee" &&
                        user?.currentPeriodEndDate == null && <GoogleAds />}

                      <View style={styles.moreTextView}>
                        {userType == "payer" ||
                        user.accountType == "teamMember" ||
                        user.accountType == "team" ? (
                          <View
                            style={{
                              width: "90%",
                              marginVertical: pixelPerfect(15),
                            }}
                          >
                            <Text style={styles.monthText}>
                              {isFilterApplied
                                ? ` ${dateAndTime(
                                    filterFrom,
                                    "MMM D YYYY"
                                  )} ${t("To")} ${dateAndTime(
                                    filterTo,
                                    "MMM D YYYY"
                                  )}`
                                : t("Last 30 days transactions")}
                            </Text>
                          </View>
                        ) : (
                          <View style={styles.filterTransactionContainer}>
                            <TouchableOpacity
                              style={[
                                styles.transactionBtn,
                                activeBtn == 3 && styles.activeBtn,
                              ]}
                              onPress={() => setActiveBtn(3)}
                            >
                              <Text
                                style={[
                                  styles.transactionBtnTxt,
                                  activeBtn == 3 && styles.activeTxt,
                                ]}
                              >
                                {t("Received")}
                              </Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                              style={[
                                styles.transactionBtn,
                                activeBtn == 2 && styles.activeBtn,
                              ]}
                              onPress={() => setActiveBtn(2)}
                            >
                              <Text
                                style={[
                                  styles.transactionBtnTxt,
                                  activeBtn == 2 && styles.activeTxt,
                                ]}
                              >
                                {t("Sent")}
                              </Text>
                            </TouchableOpacity>

                            <TouchableOpacity
                              style={[
                                styles.transactionBtn,
                                activeBtn == 1 && styles.activeBtn,
                              ]}
                              onPress={() => setActiveBtn(1)}
                            >
                              <Text
                                style={[
                                  styles.transactionBtnTxt,
                                  activeBtn == 1 && styles.activeTxt,
                                ]}
                              >
                                {t("All")}
                              </Text>
                            </TouchableOpacity>
                          </View>
                        )}

                        <Menu>
                          <MenuTrigger
                            style={{ padding: 3 }}
                            hitSlop={{
                              top: 25,
                              bottom: 25,
                              left: 15,
                              right: 15,
                            }}
                            // disabled={
                            //   (user?.userType === "payer"
                            //     ? transactions
                            //     : user?.userType === "payee" &&
                            //       user?.accountType == "individual"
                            //     ? filterTransactions?.filter(
                            //         (data) => data.toTeamId == null
                            //       )
                            //     : user?.userType === "payee" &&
                            //       user?.isTeamOwner
                            //     ? transactions
                            //     : filterTransactions
                            //   ).length == 0
                            // }
                          >
                            <Image
                              source={IMAGES.menuIcon}
                              style={styles.menuIcon}
                            />
                          </MenuTrigger>
                          <MenuOptions
                            customStyles={{
                              optionsContainer: styles.menuPopupContainer,
                            }}
                          >
                            <MenuOption
                              onSelect={() =>
                                _handleGenerateReports(
                                  user?.userType === "payer"
                                    ? transactions
                                    : user?.userType === "payee" &&
                                      user?.accountType == "individual"
                                    ? filterTransactions?.filter(
                                        (data) => (data) =>
                                          data?.toTeamId != null &&
                                          data?.payeeId == user?.id
                                            ? false
                                            : true
                                      )
                                    : user?.userType === "payee" &&
                                      user?.isTeamOwner
                                    ? transactions
                                    : filterTransactions
                                )
                              }
                            >
                              <Text style={styles.popUpMenuItem}>
                                {t("PDF")}
                              </Text>
                            </MenuOption>
                            <MenuOption
                              onSelect={() =>
                                _handleGenerateCSVReports(
                                  user?.userType === "payer"
                                    ? transactions
                                    : user?.userType === "payee" &&
                                      user?.accountType == "individual"
                                    ? filterTransactions?.filter((data) =>
                                        data?.toTeamId != null &&
                                        data?.payeeId == user?.id
                                          ? false
                                          : true
                                      )
                                    : user?.userType === "payee" &&
                                      user?.isTeamOwner
                                    ? transactions
                                    : filterTransactions
                                )
                              }
                            >
                              <Text style={styles.popUpMenuItem}>
                                {t("CSV")}
                              </Text>
                            </MenuOption>
                          </MenuOptions>
                        </Menu>
                      </View>
                    </View>
                    {userType !== "payer" &&
                      userType == "payee" &&
                      user.accountType != "teamMember" &&
                      user.accountType != "team" && (
                        <View
                          style={{
                            width: "100%",
                            marginVertical: pixelPerfect(15),
                          }}
                        >
                          <Text style={styles.monthText}>
                            {isFilterApplied
                              ? ` ${dateAndTime(filterFrom, "MMM D YYYY")} ${t(
                                  "To"
                                )} ${dateAndTime(filterTo, "MMM D YYYY")}`
                              : t("Last 30 days transactions")}
                          </Text>
                        </View>
                      )}
                  </>
                );
              }}
              ListEmptyComponent={() => <EmptyList />}
            />
          </View>

          <PickDate
            ref={pickDateRef}
            onCancel={closeDatePicker}
            onConfirm={onPickDate}
          />
          <TransactionDetails
            ref={transationDetailsRef}
            onConfirm={onConfirm}
            onPressChat={() => _handleChat()}
            name={
              user?.userType === "payer"
                ? transcationDetail?.payee?.username
                : transcationDetail?.payer?.username
            }
            cardType={transcationDetail?.payment_type}
            amount={
              user?.id == transcationDetail?.payerId
                ? currentSymbol +
                  roundWithSuffix(
                    parseFloat(transcationDetail?.payerAmount).toFixed(2)
                  )
                : currentSymbol +
                  roundWithSuffix(
                    parseFloat(transcationDetail?.payeeAmount).toFixed(2)
                  )
            }
            isGuestTransaction={transcationDetail?.isGuestTransaction}
            transactionFeedback={transcationDetail?.feedback}
            transactionAcknowledgment={transcationDetail?.acknowledgment}
            plateFormFee={transcationDetail?.plateFormFee}
          />
          <AddFeedback
            ref={feedbackModalRef}
            onConfirm={onConfirmFeedBackModal}
            onCancel={onCancelfeedbackModal}
          />
          <Acknowledgment
            ref={acknowledgmentModalRef}
            onConfirm={onConfirmacknowledgmentModal}
            onCancel={onCancelacknowledgmentModal}
          />
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
        </View>
      </Screen>
    </>
  );
};
export default Home;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: COLORS.white,
    paddingTop: pixelPerfect(20),

    // paddingHorizontal: pixelPerfect(29),
  },
  txtInputContainer: {
    marginTop: pixelPerfect(30),
    justifyContent: "space-between",
    alignItems: "center",
    flexDirection: "row",
  },
  btnContainer: {
    marginTop: pixelPerfect(15),
  },
  moreTextView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: pixelPerfect(5),
  },
  menuIcon: {
    width: pixelPerfect(4),
    height: pixelPerfect(16),
  },
  monthText: {
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(18),
    color: COLORS.primary,
    // alignSelf: "center",
  },
  historyView: {
    marginTop: pixelPerfect(5),
    // height: pixelPerfect(550),

    flex: 1,
  },
  trasactionsDetails: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    justifyContent: "space-between",
    marginTop: pixelPerfect(15),
  },
  adsImage: {
    height: pixelPerfect(160),
    resizeMode: "contain",
    width: "100%",
    marginTop: pixelPerfect(5),
  },
  homeheadingContainer: {
    width: "100%",
    alignItems: "center",
    justifyContent: "space-between",
    flexDirection: "row",
  },
  makePaymentBtn: {
    width: "70%",
  },
  icon: {
    height: pixelPerfect(22),
    width: pixelPerfect(22),
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
  popUpMenuItem: {
    fontFamily: fonts.robotosemiBold,
    color: COLORS.primary,
    fontSize: pixelPerfect(22),
  },
  noDataTxt: {
    fontFamily: fonts.sourceSansSemiBold,
    color: "rgba(73, 150, 98, 0.5)",
    fontSize: RFValue(20),
  },
  filterTransactionContainer: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    width: "90%",
    alignSelf: "center",
  },
  transactionBtn: {
    borderBottomWidth: 2,
    borderBottomColor: COLORS.primary,
    alignItems: "center",
    justifyContent: "center",
    width: "30%",
  },
  activeBtn: {
    borderBottomColor: COLORS.secondary,
  },
  activeTxt: {
    color: COLORS.secondary,
  },
  arrowUpIcon: {
    height: pixelPerfect(25),
    width: pixelPerfect(25),
    tintColor: COLORS.white,
  },
  transactionBtnTxt: {
    fontSize: pixelPerfect(22),
    fontWeight: "700",
    color: COLORS.primary,
  },
});
