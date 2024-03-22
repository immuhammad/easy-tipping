import React, { useEffect, useState } from "react";
import { FlatList, StyleSheet, View, Text } from "react-native";
import { useTranslation } from "react-i18next";
import { SCREEN } from "../contants/screens";
import Screen from "../components/Screen";
import Header from "../components/Header";
import pixelPerfect from "../utils/pixelPerfect";
import TransactionCard from "../components/TransactionCard";
import { COLORS } from "../contants/colors";
import { getThreadList } from "../services/apis";

import { useSelector } from "react-redux";
import moment from "moment";
import { useIsFocused } from "@react-navigation/native";
import EmptyList from "../components/emptylist";
import dateAndTime from "../utils/dateAndTime";
const Chat = (props) => {
  const { t } = useTranslation();
  let focused = useIsFocused();
  const { token, user } = useSelector((state) => state.userReducer);
  const [threadsList, setThreadsList] = useState([]);

  useEffect(() => {
    if (focused) {
      getThreads();
    }
  }, [focused]);

  const getThreads = async () => {
    await getThreadList(token, 1)
      .then((res) => {
        console.log("response get threads");
        if (res?.status === 200) {
          setThreadsList(res?.data?.data?.threads);
        }
      })
      .catch((e) => {
        console.log("error on get thread ", e);
      });
  };

  const _renderAllThreads = (item) => {
    return (
      <TransactionCard
        image={
          item?.receiver?.id == user?.id
            ? item?.sender?.profileImg
            : item?.receiver?.profileImg
        }
        name={
          item?.receiver?.id == user?.id
            ? item?.sender?.username
            : item?.receiver?.username
        }
        rating={item?.rating}
        // date={moment(item?.lastMessageTime).fromNow(true)}
        date={dateAndTime(item?.lastMessageTime)}
        fromChat={true}
        lastMessage={item?.lastMessage}
        onPressCard={() =>
          props.navigation.navigate(SCREEN.chatScreen, { item })
        }
      />
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Header title={t("Messages")} isBackBtn={false} />
        <View style={{ alignSelf: "center", width: "100%" }}>
          <FlatList
            data={threadsList}
            contentContainerStyle={{
              marginTop: pixelPerfect(30),
              paddingBottom: pixelPerfect(150),
            }}
            showsVerticalScrollIndicator={false}
            ListEmptyComponent={() => <EmptyList />}
            keyExtractor={(item, index) => item?.id + index}
            renderItem={({ item }) => _renderAllThreads(item)}
          />
        </View>
      </View>
    </Screen>
  );
};
export default Chat;

const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: pixelPerfect(29),
  },
});
