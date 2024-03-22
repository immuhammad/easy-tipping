//================================ React Native Imported Files ======================================//

import React, { useRef, useState } from "react";
import {
  StyleSheet,
  View,
  FlatList,
  Text,
  TouchableOpacity,
  Image,
} from "react-native";
import { useTranslation } from "react-i18next";

//================================ Local Imported Files ======================================//

import Screen from "../components/Screen";
import pixelPerfect from "../utils/pixelPerfect";
import Header from "../components/Header";
import { IMAGES } from "../contants/images";
import TransactionDetails from "../components/transactionDetails";
import PickDate from "../components/pickDate";
import AppInput from "../components/AppInput";
import fonts from "../contants/fonts";
import { COLORS } from "../contants/colors";
import TransactionCard from "../components/TransactionCard";
import {
  Menu,
  MenuOptions,
  MenuOption,
  MenuTrigger,
} from "react-native-popup-menu";
import { SIZES } from "../contants/sizes";
import AddFeedback from "../components/addFeedback";
import Acknowledgment from "../components/Acknowledgment";
import { useSelector } from "react-redux";
import moment from "moment";
import {
  addFeedBack,
  applyFilters,
  saveReports,
  createCSVReports,
} from "../services/apis";
import AppLoading from "../common/AppLoader";
import EmptyList from "../components/emptylist";
import Alert from "../common/Alert";
import { SCREEN } from "../contants/screens";
import dateAndTime from "../utils/dateAndTime";
import ALLCURRENCIES from "../contants/currencies";
import roundWithSuffix from "../utils/roundNumber";
const SearchHistory = (props) => {
  const pickDateRef = useRef(null);
  const feedbackModalRef = useRef(null);
  const transationDetailsRef = useRef(null);
  const acknowledgmentModalRef = useRef(null);
  const [search, setSearch] = useState("");
  const [transcationDetail, setTranscationDetail] = useState("");
  const {
    user: { isAllowedToChat },
    token,
    user,
  } = useSelector((state) => state.userReducer);
  let currentCurrency = ALLCURRENCIES.filter(
    (data) => data.code == user?.currency
  );
  let currentSymbol = currentCurrency.length ? currentCurrency[0].symbol : "$";

  const { isLoading, transactions, filterFrom, filterTo, isFilterApplied } =
    useSelector((state) => state.transactionReducer);

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

  const closeDatePicker = () => {
    pickDateRef.current.setModalVisibility(false);
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
  const { t } = useTranslation();

  const _handleGenerateReports = async (transactions) => {
    saveReports(
      user,
      transactions,
      isFilterApplied
        ? `${dateAndTime(filterFrom, "MMM D YYYY")} ${t("To")} ${dateAndTime(
            filterTo,
            "MMM D YYYY"
          )}`
        : t("Last 30 days transactions")
    );
  };
  const _handleGenerateCSVReports = (transactions) => {
    createCSVReports(
      user,
      transactions,
      isFilterApplied
        ? `${dateAndTime(filterFrom, "MMM D YYYY")} ${t("To")} ${dateAndTime(
            filterTo,
            "MMM D YYYY"
          )}`
        : t("Last 30 days transactions")
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
    props.navigation.navigate(SCREEN.chatScreen, {
      item:
        transcationDetail?.payeeId === user?.id
          ? transcationDetail?.payer
          : transcationDetail?.payee,
      fromChat: true,
      chatRoomId: transcationDetail?.chatRoomId,
    });
  };

  const _renderAllTransactions = ({ item, index }) => {
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
        rating={item?.payerRating}
        refPayee={item?.referpayee}
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
          item?.isGuestTransaction
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

  let filteredTransaction =
    user?.userType === "payer"
      ? transactions
      : user?.userType === "payee" && user?.accountType == "individual"
      ? transactions?.filter((data) =>
          data?.toTeamId != null && data?.payeeId == user?.id ? false : true
        )
      : user?.userType === "payee" && user?.isTeamOwner
      ? transactions
      : transactions;

  const searchedHisotry = filteredTransaction.filter((data) =>
    user?.id == data?.payerId
      ? data?.payee?.username?.toLowerCase()?.includes(search?.toLowerCase())
      : data?.payer?.username?.toLowerCase()?.includes(search?.toLowerCase()) ||
        data?.payerName?.toLowerCase()?.includes(search?.toLowerCase())
  );

  return (
    <Screen>
      {AppLoading(isLoading)}
      <View style={styles.container}>
        <Header
          title={t("Search")}
          isBackBtn={true}
          onPressBackIcon={() => props.navigation.goBack()}
          isRightIcon={true}
          RightIcon={IMAGES.filterIcon}
          onRightIconPress={() => pickDateRef.current.setModalVisibility(true)}
          customContainer={{ alignItems: "center" }}
        />
        <View style={{ width: "100%", marginTop: 20 }}>
          <AppInput
            leftIconPath={IMAGES.searchIcon}
            placeholder={t("Search")}
            borderWidth={0.5}
            onChangeText={(val) => setSearch(val)}
            value={search}
            width={"100%"}
            textInputStyle={{ fontSize: pixelPerfect(22) }}
          />
        </View>
        <View style={styles.moreTextView}>
          <Text style={styles.monthText}>
            {isFilterApplied
              ? ` ${dateAndTime(filterFrom, "MMM D YYYY")} ${t(
                  "To"
                )} ${dateAndTime(filterTo, "MMM D YYYY")}`
              : t("Last 30 days transactions")}
          </Text>
          <Menu>
            <MenuTrigger
              style={{ padding: 3 }}
              disabled={searchedHisotry?.length == 0}
            >
              <Image source={IMAGES.menuIcon} style={styles.menuIcon} />
            </MenuTrigger>
            <MenuOptions
              customStyles={{
                optionsContainer: styles.menuPopupContainer,
              }}
            >
              <MenuOption
                onSelect={() => _handleGenerateReports(searchedHisotry)}
              >
                <Text style={styles.popUpMenuItem}>{t("PDF")}</Text>
              </MenuOption>
              <MenuOption
                onSelect={() => _handleGenerateCSVReports(searchedHisotry)}
              >
                <Text style={styles.popUpMenuItem}>{t("CSV")}</Text>
              </MenuOption>
            </MenuOptions>
          </Menu>
        </View>
        <View style={styles.historyView}>
          <FlatList
            data={searchedHisotry}
            // extraData={searchedHisotry}
            contentContainerStyle={{ paddingBottom: pixelPerfect(80) }}
            showsVerticalScrollIndicator={false}
            renderItem={_renderAllTransactions}
            ListEmptyComponent={() => <EmptyList />}
          />
        </View>
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
    </Screen>
  );
};
export default SearchHistory;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },

  btnContainer: {
    marginTop: pixelPerfect(15),
    position: "absolute",
    bottom: pixelPerfect(15),
    width: "100%",
  },
  moreTextView: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    marginTop: pixelPerfect(15),
  },
  menuIcon: {
    width: pixelPerfect(4),
    height: pixelPerfect(16),
  },
  monthText: {
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(18),
    color: COLORS.primary,
    alignSelf: "center",
  },
  historyView: {
    marginTop: pixelPerfect(5),
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
});
