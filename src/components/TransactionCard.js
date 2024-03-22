//================================ React Native Imported Files ======================================//

import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TouchableOpacity,
  ActivityIndicator,
  StyleSheet,
  ImageBackground,
  Image,
} from "react-native";

//================================ Local Imported Files ======================================//

import fonts from "../contants/fonts";
import { IMAGES } from "../contants/images";
import { COLORS } from "../contants/colors";
import pixelPerfect from "../utils/pixelPerfect";
import H1 from "../common/H1";

import { useTranslation } from "react-i18next";
import StarRating from "react-native-star-rating";
import { useSelector } from "../redux/store";
import roundWithSuffix from "../utils/roundNumber";
const TransactionCard = (props) => {
  const { t } = useTranslation();
  const [isLoaded, setIsLoaded] = useState(false);
  const [isError, setIsError] = useState(false);
  const {
    user: { accountType },
  } = useSelector((state) => state.userReducer);
  return (
    <View key={props.key} style={styles.mainContainer}>
      <TouchableOpacity
        activeOpacity={0.7}
        onPress={props.onPressCard}
        style={{ flexDirection: "row" }}
      >
        {accountType !== "team" && (
          <ImageBackground
            source={props?.image ? { uri: props.image } : IMAGES.placeholder}
            style={styles.imageStyle}
            imageStyle={styles.imageStyle}
            borderWidth={1}
            borderColor={COLORS.primary}
            onLoadEnd={() => setIsLoaded(true)}
            onError={() => setIsError(true)}
          >
            {isLoaded && !isError
              ? null
              : !isError && (
                  <ActivityIndicator size={"small"} color={COLORS.primary} />
                )}
          </ImageBackground>
        )}

        {props.hideReceiver && (
          <ImageBackground
            source={props?.image ? { uri: props.image } : IMAGES.placeholder}
            style={styles.imageStyle}
            imageStyle={styles.imageStyle}
            borderWidth={1}
            borderColor={COLORS.primary}
            onLoadEnd={() => setIsLoaded(true)}
            onError={() => setIsError(true)}
          >
            {isLoaded && !isError
              ? null
              : !isError && (
                  <ActivityIndicator size={"small"} color={COLORS.primary} />
                )}
          </ImageBackground>
        )}

        <View
          style={[
            styles.centerStyle,
            accountType == "team" && { width: "70%" },
            props.hideReceiver && { width: "50%" },
          ]}
        >
          <Text style={styles.textStyle} numberOfLines={1}>
            {props.name}
          </Text>

          {props.rating != null && (
            <View
              style={{
                flexDirection: "row",
                alignItems: "center",
                marginTop: pixelPerfect(5),
              }}
            >
              <StarRating
                disabled={true}
                maxStars={5}
                rating={props.rating}
                starSize={pixelPerfect(20)}
                emptyStarColor={COLORS.white}
                fullStarColor={"#FFB33E"}
                containerStyle={{ marginTop: 10 }}
              />
            </View>
          )}
          {accountType == "team" &&
            !props.hideReceiver &&
            props?.refPayee?.firstName && (
              <>
                <Text style={styles.textStyle} numberOfLines={1}>
                  <Text style={{ color: COLORS.text }}>Received by: </Text>
                  {props?.refPayee?.firstName + " " + props?.refPayee?.lastName}
                </Text>
                <Text style={styles.textStyle} numberOfLines={1}>
                  @{props?.refPayee?.username}
                </Text>
              </>
            )}
          <Text
            style={[
              styles.textStyle,
              {
                marginTop: pixelPerfect(5),
                fontSize: pixelPerfect(12),
                fontFamily: fonts.robotoNormal,
              },
            ]}
            numberOfLines={1}
          >
            {props.fromChat ? props.lastMessage : props.businessName}
          </Text>
        </View>
        <View style={styles.rightView}>
          {!props.fromChat && (
            <View style={styles.row}>
              <Image
                source={IMAGES.arrowUp}
                style={props?.added ? styles.arrowDown : styles.arrow}
              />
              <Text
                numberOfLines={1}
                style={[
                  styles.textStyle,
                  {
                    fontFamily: fonts.robotoBold,
                    color: props?.added ? COLORS.primary : COLORS.secondary,
                  },
                ]}
              >
                {props?.currentSymbol}{" "}
                {roundWithSuffix(parseFloat(props.amount).toFixed(2))}
              </Text>
            </View>
          )}
          <Text
            style={[
              styles.textStyle,
              {
                marginTop: pixelPerfect(11),
                fontFamily: fonts.robotoNormal,
                fontSize: pixelPerfect(12),
                color: COLORS.placeholder,
              },
            ]}
          >
            {props.date}
          </Text>
        </View>
      </TouchableOpacity>
      {props.showActionBtn && (
        <View style={styles.feedbackButtonView}>
          <TouchableOpacity
            activeOpacity={0.8}
            style={styles.feedbackButton}
            onPress={props.feedBackBtn}
          >
            <H1
              text={props.feedBackBtnTxt}
              customStyle={{
                fontSize: pixelPerfect(15),
                color: COLORS.white,
              }}
            />
          </TouchableOpacity>
        </View>
      )}
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    minHeight: pixelPerfect(72),
    width: "100%",
    marginBottom: pixelPerfect(12),
    borderRadius: pixelPerfect(10),
    borderWidth: 0,
    borderBottomWidth: 1,
    borderColor: COLORS.placeholder,
    // flexDirection: "row",
    alignItems: "flex-end",
    // justifyContent: "space-between",
    paddingVertical: 10,
    marginTop: 15,
  },
  imageStyle: {
    width: pixelPerfect(52),
    height: pixelPerfect(52),
    borderRadius: pixelPerfect(52),
    marginLeft: pixelPerfect(5),
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
  },
  feedbackButton: {
    backgroundColor: COLORS.secondary,
    height: pixelPerfect(35),
    // width: pixelPerfect(92),
    paddingHorizontal: 10,
    borderRadius: pixelPerfect(15),
    justifyContent: "center",
    alignItems: "center",
  },
  feedbackButtonView: {
    height: pixelPerfect(50),
    justifyContent: "center",
    alignItems: "flex-end",
    paddingHorizontal: pixelPerfect(0),
  },
  centerStyle: {
    height: pixelPerfect(72),
    // width: pixelPerfect(171),
    width: "50%",
    justifyContent: "center",
    paddingHorizontal: pixelPerfect(12),
  },
  rightView: {
    height: pixelPerfect(72),
    width: pixelPerfect(100),
    paddingTop: pixelPerfect(3),
    alignItems: "center",
    justifyContent: "center",
    width: "33%",
  },
  ratingStyle: {
    height: pixelPerfect(18.5),
    width: pixelPerfect(18.5),
  },
  textStyle: {
    fontSize: pixelPerfect(18),
    marginTop: pixelPerfect(1),
    fontFamily: fonts.robotosemiBold,
    color: COLORS.primary,
  },
  row: {
    flexDirection: "row",
    alignItems: "center",
  },
  arrow: {
    height: pixelPerfect(15),
    width: pixelPerfect(15),
    marginRight: 5,
    tintColor: COLORS.secondary,
  },
  arrowDown: {
    height: pixelPerfect(15),
    width: pixelPerfect(15),
    marginRight: 5,
    tintColor: COLORS.primary,
    transform: [{ rotate: "180deg" }],
  },
});

export default TransactionCard;
