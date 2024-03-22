//================================ React Native Imported Files ======================================//

import React, { useCallback, useState, useEffect } from "react";
import { ActivityIndicator, StyleSheet, View, Image } from "react-native";
import { useTranslation } from "react-i18next";
import {
  Bubble,
  GiftedChat,
  MessageText,
  Composer,
  InputToolbar,
  Send,
  Time,
} from "react-native-gifted-chat";

//================================ Local Imported Files ======================================//

import Screen from "../components/Screen";
import pixelPerfect from "../utils/pixelPerfect";
import AppHeader from "../components/AppHeader";
import { COLORS } from "../contants/colors";
import fonts from "../contants/fonts";
import { IMAGES } from "../contants/images";
import { getSignleThreadChat, sendMessage } from "../services/apis";
import { useSelector } from "react-redux";

const ChatScreen = (props) => {
  let item = props?.route?.params?.item;
  let chatRoomID = props?.route?.params?.chatRoomId;
  const {
    user: { accountType, profileImg, userType, username },
    token,
    user,
  } = useSelector((state) => state.userReducer);
  const { t } = useTranslation();
  const [loading, setLoading] = useState(false);
  const [messages, setMessages] = useState([]);
  const [chatRoomIdResponse, setChatRoomId] = useState("");
  const [key, setKey] = useState(1);

  useEffect(() => {
    getChatData();

    return () => setChatRoomId("");
  }, []);

  const getChatData = () => {
    getSignleThreadChat(token, item?.chatRoomId || chatRoomID)
      .then((res) => {
        if (res?.status === 200) {
          const messageData = res?.data?.data?.chat.map((message) => {
            let data = {
              _id: message?.id,
              text: message?.message,
              createdAt: message?.sentAt,
              user: {
                _id: message?.senderId,
              },
            };
            return data;
          });
          console.log("messages are ", messageData);
          // messageData = messageData.sort(
          //   (a, b) => new Date(a.createdAt) - new Date(b.createdAt)
          // );

          console.log("messages Data", messageData);

          setMessages((previousMessages) =>
            GiftedChat.append(previousMessages, messageData.reverse())
          );
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const renderMessage = (props) => {
    return (
      <MessageText
        {...props}
        textStyle={{
          left: styles.leftMessageText,
          right: styles.rightMessageText,
        }}
      />
    );
  };

  const InputChat = (props) => {
    return (
      <InputToolbar
        {...props}
        containerStyle={styles.toolBarView}
        renderSend={(props) => {
          return (
            <Send
              {...props}
              containerStyle={styles.sendContainer}
              disabled={loading}
            >
              {loading === false ? (
                <Image
                  source={IMAGES.sendIcon}
                  style={{ height: pixelPerfect(40), width: pixelPerfect(40) }}
                />
              ) : (
                <ActivityIndicator color={COLORS.primary} />
              )}
            </Send>
          );
        }}
        renderComposer={(props) => {
          return (
            <Composer
              {...props}
              placeholder="Type text"
              placeholderTextColor={"#49966280"}
              maxHeight={pixelPerfect(500)}
              textInputStyle={styles.composerView}
            />
          );
        }}
        textInputStyle={styles.textInputView}
      />
    );
  };

  const _chatRoomId = async () => {
    if (chatRoomID !== null && chatRoomID !== undefined) {
      return chatRoomID;
    }
    if (
      chatRoomIdResponse !== null &&
      chatRoomIdResponse !== undefined &&
      chatRoomIdResponse !== ""
    ) {
      return chatRoomIdResponse;
    }
    if (item?.chatRoomId !== null && item?.chatRoomId !== undefined) {
      return item?.chatRoomId;
    } else {
      return null;
    }
  };

  const onSendMessage = useCallback(async (messages = []) => {
    setMessages((previousMessages) =>
      GiftedChat.append(previousMessages, messages)
    );
    data();

    const messageData = {
      senderId: messages[0]?.user?._id,
      receiverId:
        props?.route?.params?.fromChat === true
          ? item?.id
          : messages[0]?.user?._id != user?.id
          ? item?.receiverId
          : item?.senderId,
      message: messages[0]?.text,
      chatRoomId: await _chatRoomId(),
    };

    sendMessage(token, messageData)
      .then((res) => {
        setChatRoomId(res?.data?.data?.message?.chatRoomId);
        setKey(key + 1);
      })
      .catch((e) => {});
  }, []);

  const data = async () => {
    console.log(await _chatRoomId(), chatRoomIdResponse);
  };

  return (
    <Screen>
      <View style={styles.container}>
        <AppHeader
          title={
            props?.route?.params?.fromChat === true
              ? item?.username
              : item?.receiverId === user?.id
              ? item?.sender?.username
              : item?.receiver?.username
          }
          rightIconTwoPath={
            props?.route?.params?.fromChat === true
              ? item?.profileImg
              : item?.receiverId === user?.id
              ? item?.sender?.profileImg
              : item?.receiver?.profileImg
          }
          rightIconSize={pixelPerfect(40)}
          leftIconPath={IMAGES.backIcon}
          onLeftIconPress={() => props.navigation.goBack()}
        />
        <GiftedChat
          messages={messages}
          onSend={(messages) => {
            const msg = {
              ...messages[0],
              image: "",
            };
            onSendMessage([msg], false);
          }}
          user={{
            _id: user?.id,
          }}
          renderUsernameOnMessage={false}
          renderTime={(props) => {
            return (
              <Time
                {...props}
                timeTextStyle={{
                  left: {
                    color: COLORS.black,
                  },
                  right: {
                    color: COLORS.black,
                  },
                }}
              />
            );
          }}
          renderAvatar={null}
          renderMessageText={renderMessage}
          renderBubble={(props) => {
            return (
              <View style={{}}>
                <Bubble
                  {...props}
                  wrapperStyle={{
                    right: styles.rightBubbleView,
                    left: styles.leftBubbleView,
                  }}
                />
              </View>
            );
          }}
          renderInputToolbar={InputChat}
        />
      </View>
    </Screen>
  );
};
export default ChatScreen;
const styles = StyleSheet.create({
  container: {
    flex: 1,
    // paddingHorizontal: pixelPerfect(29),
  },
  sendContainer: {
    alignItems: "flex-end",
    justifyContent: "center",
  },
  rightMessageText: {
    color: COLORS.white,
    fontFamily: fonts.robotoNormal,
    paddingTop: pixelPerfect(3),
    paddingBottom: pixelPerfect(3),
    paddingHorizontal: pixelPerfect(5),
  },
  leftMessageText: {
    color: COLORS.white,
    fontFamily: fonts.robotoNormal,
    paddingTop: pixelPerfect(3),
    paddingBottom: pixelPerfect(3),
    paddingHorizontal: pixelPerfect(5),
  },
  toolBarView: {
    backgroundColor: COLORS.white,
    borderColor: COLORS.primary,
    borderRadius: pixelPerfect(30),
    borderWidth: 2,
    borderTopWidth: 2,
    borderTopColor: COLORS.primary,
    paddingHorizontal: pixelPerfect(5),
  },
  composerView: {
    color: COLORS.primary,
    alignSelf: "center",
    fontFamily: fonts.robotoNormal,
    lineHeight: undefined,
    borderRadius: pixelPerfect(2),
  },
  textInputView: {
    color: COLORS.primary,
    fontFamily: fonts.robotoNormal,
    fontSize: pixelPerfect(15),
  },
  rightBubbleView: {
    backgroundColor: COLORS.primary,
    borderTopLeftRadius: pixelPerfect(30),
    borderTopRightRadius: pixelPerfect(30),
    borderBottomLeftRadius: pixelPerfect(30),
    borderBottomRightRadius: pixelPerfect(0),
    marginLeft: 0,
  },
  leftBubbleView: {
    backgroundColor: "#63AD78",
    marginRight: 0,
    borderTopLeftRadius: pixelPerfect(30),
    borderTopRightRadius: pixelPerfect(30),
    borderBottomLeftRadius: pixelPerfect(0),
    borderBottomRightRadius: pixelPerfect(30),
  },
});
