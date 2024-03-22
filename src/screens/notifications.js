//================================ React Native Imported Files ======================================//

import React, { useRef, useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { useIsFocused } from "@react-navigation/native";

//================================ Local Imported Files ======================================//

import Screen from "../components/Screen";
import Header from "../components/Header";
import pixelPerfect from "../utils/pixelPerfect";
import NotificationCard from "../components/NotificationCard";
import { COLORS } from "../contants/colors";
import EmptyList from "../components/emptylist";
import { useSelector } from "../redux/store";
import { getNotifications } from "../services/apis";
import moment from "moment";
import dateAndTime from "../utils/dateAndTime";

const Notifications = () => {
  const isFocused = useIsFocused();
  const feedbackModalRef = useRef(null);
  const {
    user: { accountType, profileImg, userType, username },
    token,
    user,
  } = useSelector((state) => state.userReducer);
  const { t } = useTranslation();
  const [notifications, setNotifications] = useState([]);

  const chatThreads = [
    {
      id: 0,
      title: "Lorem ipsum dolor sit amet",
      amount: "7,000.00",
      description: "Description",
      isFeedback: false,
      date: "02-02-2020",
    },
    {
      id: 1,
      title: "Lorem ipsum dolor sit amet",
      amount: "7,000.00",
      description: "Description",
      isFeedback: true,
      date: "02-02-2020",
    },
    {
      id: 2,
      title: "Lorem ipsum dolor sit amet",
      amount: "7,000.00",
      description: "Description",
      isFeedback: true,
      date: "02-02-2020",
    },
    {
      id: 3,
      title: "Lorem ipsum dolor sit amet",
      amount: "7,000.00",
      description: "Description",
      isFeedback: false,
      date: "02-02-2020",
    },
    {
      id: 4,
      title: "Lorem ipsum dolor sit amet",
      amount: "7,000.00",
      description: "Description",
      isFeedback: true,
      date: "02-02-2020",
    },
    {
      id: 5,
      title: "Lorem ipsum dolor sit amet",
      amount: "7,000.00",
      description: "Description",
      isFeedback: true,
      date: "02-02-2020",
    },
  ];
  useEffect(() => {
    _getNotifications();
  }, [isFocused]);

  const _getNotifications = () => {
    getNotifications(token)
      .then((response) => {
        setNotifications(response.data.data.notifications);
      })
      .catch((error) => {
        console.log("error on get notifications ", error);
      });
  };

  const _renderAllNotifications = (item) => {
    return (
      <NotificationCard
        item={item}
        title={item?.title}
        amount={item?.amount}
        // date={moment(item?.createdAt).fromNow()}
        date={dateAndTime(item?.createdAt)}
        isFeedback={item?.isFeedback}
        description={item?.body}
        onPressFeedback={() => console.log("Feedback Pressed")}
      />
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Header title={t("Notifications")} isBackBtn={false} />
        <View style={{ alignSelf: "center", width: "100%" }}>
          <FlatList
            data={notifications}
            extraData={notifications}
            contentContainerStyle={{
              marginTop: pixelPerfect(30),
              paddingBottom: pixelPerfect(150),
            }}
            showsVerticalScrollIndicator={false}
            keyExtractor={(item, index) => item?.id + index}
            renderItem={({ item }) => _renderAllNotifications(item)}
            ListEmptyComponent={() => <EmptyList />}
            nestedScrollEnabled={true}
          />
        </View>
      </View>
    </Screen>
  );
};
export default Notifications;

const styles = StyleSheet.create({
  container: {
    flex: 1,

    // paddingHorizontal: pixelPerfect(29),
  },
});
