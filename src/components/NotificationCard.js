import React from "react";
import { View, Text, StyleSheet, Image } from "react-native";
import fonts from "../contants/fonts";
import { COLORS } from "../contants/colors";
import pixelPerfect from "../utils/pixelPerfect";
const NotificationCard = (props) => {
  return (
    <View style={styles.mainContainer}>
      <View
        style={{
          flexDirection: "row",
        }}
      >
        <Image
          source={{ uri: props?.item?.sender?.profileImg }}
          style={styles.senderImage}
        />
        <View style={styles.centerStyle}>
          <Text style={[styles.textStyle, { width: "80%" }]}>
            {props.title}
          </Text>
          <Text
            style={[
              styles.textStyle,
              {
                marginTop: pixelPerfect(5),
                fontSize: pixelPerfect(20),
                fontFamily: fonts.robotoNormal,
                color: COLORS.placeholder,
              },
            ]}
          >
            {props.description}
          </Text>
        </View>
      </View>

      <Text
        style={[
          styles.textStyle,
          {
            marginTop: pixelPerfect(16),
            fontFamily: fonts.robotosemiBold,
            fontSize: pixelPerfect(18),
            color: COLORS.placeholder,

            textAlign: "right",
          },
        ]}
      >
        {props.date}
      </Text>
    </View>
  );
};

const styles = StyleSheet.create({
  mainContainer: {
    minHeight: pixelPerfect(77),

    marginBottom: pixelPerfect(12),
    borderRadius: pixelPerfect(10),
    borderBottomWidth: 1,
    borderColor: COLORS.placeholder,
    backgroundColor: COLORS.white,
    justifyContent: "center",
    width: "100%",
    paddingBottom: 10,
  },
  centerStyle: {
    // height: pixelPerfect(72),
    width: pixelPerfect(228),
    justifyContent: "center",
    paddingHorizontal: pixelPerfect(12),
    width: "80%",
  },

  textStyle: {
    fontSize: pixelPerfect(22),
    marginTop: pixelPerfect(1),
    fontFamily: fonts.robotosemiBold,
    color: COLORS.primary,
  },

  senderImage: {
    width: pixelPerfect(52),
    height: pixelPerfect(52),
    borderRadius: pixelPerfect(52),
    marginLeft: pixelPerfect(5),
    justifyContent: "center",
    alignItems: "center",
    resizeMode: "cover",
  },
});

export default NotificationCard;
