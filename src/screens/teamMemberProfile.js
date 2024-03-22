import React, { useEffect, useRef, useState } from "react";
import { StyleSheet, View, FlatList, Image, Text } from "react-native";
import { useTranslation } from "react-i18next";
import Screen from "../components/Screen";
import pixelPerfect from "../utils/pixelPerfect";
import Header from "../components/Header";
import TransactionCard from "../components/TransactionCard";
import { IMAGES } from "../contants/images";
import fonts from "../contants/fonts";
import { COLORS } from "../contants/colors";
import TransactionDetails from "../components/transactionDetails";
import { teamMemberDetail } from "../services/apis";
import { useSelector } from "react-redux";
import moment from "moment";
import EmptyList from "../components/emptylist";
import dateAndTime from "../utils/dateAndTime";
import ALLCURRENCIES from "../contants/currencies";
const TeamMemberProfile = (props) => {
  const { item } = props.route.params;

  const transationDetailsRef = useRef(null);
  const { t } = useTranslation();
  const { token, user } = useSelector((state) => state.userReducer);
  const [userDetail, setUserDetail] = useState(item);
  let currentCurrency = ALLCURRENCIES.filter(
    (data) => data.code == user?.currency
  );
  let currentSymbol = currentCurrency.length ? currentCurrency[0].symbol : "$";

  useEffect(() => {
    teamMemberDetail(
      token,
      user?.team?.id,
      item?.id,
      user?.userTeam ? user?.userTeam?.teamCode : user.teamCode
    )
      .then((res) => {
        console.log("profile ", res?.data?.data?.profileData);
        if (res?.data?.success === true && res?.data?.data?.profileData) {
          setUserDetail(res?.data?.data?.profileData);
        }
      })
      .catch((e) => console.log("error on getting member details", e));
  }, []);

  const onConfirm = () => {
    transationDetailsRef.current.setModalVisibility(false);
  };
  const onCancel = () => {
    transationDetailsRef.current.setModalVisibility(false);
  };
  const _renderAllTransactions = (item) => {
    console.log("item ", item);
    return (
      <TransactionCard
        image={item?.payer?.profileImg}
        name={item?.payer?.username ?? "Guest"}
        rating={item?.payerRating}
        added={true}
        date={dateAndTime(item?.createdAt)}
        fromChat={false}
        businessName={item?.businessName}
        amount={item?.payeeAmount}
        plateFormFee={item?.plateFormFee}
        hideReceiver={true}
        currentSymbol={currentSymbol}
        // onPressCard={() =>
        //   transationDetailsRef.current.setModalVisibility(true)
        // }
      />
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Header
          title={t("Team Members Profile")}
          isBackBtn={true}
          onPressBackIcon={() => props.navigation.goBack()}
        />
        <View style={styles.userDetailsContainer}>
          <Image
            source={{ uri: userDetail?.profileImg }}
            style={styles.teamMemberProfile}
          />
          <Text style={styles.teamMemberName}>{userDetail?.username}</Text>
          {item?.rating && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: pixelPerfect(5),
              }}
            >
              <Image source={IMAGES.ratingStart} style={styles.ratingStyle} />
              <Text
                style={[styles.textStyle, { fontFamily: fonts.robotosemiBold }]}
              >
                {item?.rating}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.historyView}>
          <FlatList
            data={userDetail?.payeeTransactions}
            contentContainerStyle={{ paddingBottom: pixelPerfect(80) }}
            showsVerticalScrollIndicator={false}
            // keyExtractor={(item, index) => item?.id + index}
            renderItem={({ item }) => _renderAllTransactions(item)}
            ListEmptyComponent={() => <EmptyList />}
          />
        </View>
      </View>
      <TransactionDetails
        ref={transationDetailsRef}
        onConfirm={onConfirm}
        onCancel={onCancel}
      />
    </Screen>
  );
};
export default TeamMemberProfile;
const styles = StyleSheet.create({
  container: {
    flex: 1,

    // paddingHorizontal: pixelPerfect(29),
  },
  userDetailsContainer: {
    marginTop: pixelPerfect(35),
    alignItems: "center",
    justifyContent: "center",
  },
  teamMemberProfile: {
    height: pixelPerfect(139),
    width: pixelPerfect(139),
    borderRadius: pixelPerfect(278),
    borderWidth: 1,
    borderColor: COLORS.primary,
  },
  teamMemberName: {
    fontFamily: fonts.robotoBold,
    fontSize: pixelPerfect(30),
    color: COLORS.primary,
    marginTop: pixelPerfect(5),
  },
  historyView: {
    marginTop: pixelPerfect(15),
  },
  ratingStyle: {
    height: pixelPerfect(16.5),
    width: pixelPerfect(16.5),
    tintColor: "#FFB33E",
  },
  textStyle: {
    fontSize: pixelPerfect(14),
    marginTop: pixelPerfect(1),
    fontFamily: fonts.robotosemiBold,
    color: COLORS.primary,
  },
});
