import React, { useState, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Platform,
} from "react-native";
import ReusableModal from "./Reuseable";
import { SIZES } from "../contants/sizes";
import { COLORS } from "../contants/colors";
import { BlurView, VibrancyView } from "@react-native-community/blur";
import fonts from "../contants/fonts";
import pixelPerfect from "../utils/pixelPerfect";
import { useTranslation } from "react-i18next";
import StarRating from "react-native-star-rating";
import { Rating, AirbnbRating } from "react-native-ratings";
import { IMAGES } from "../contants/images";
import TextInput from "./TextInput";
import DropDownPicker from "react-native-dropdown-picker";
DropDownPicker.setListMode("SCROLLVIEW");
const Acknowledgment = React.forwardRef((props, ref) => {
  const { onConfirm, onCancel } = props;
  const messages = [
    "Thank you!",
    "Thank you so much for your generous tip, I truly appreciate it!",
    "I’m grateful for your thoughtfulness, thank you for the tip!",
    "Thank you for recognizing my hard work, your tip means a lot to me!",
    "I want to express my sincere gratitude for the tip you gave me. It’s very much appreciated!",
    "Your team is a great motivation for me to continue delivering excellent service. Thank you!",
    "Thanks for choosing my services and for the tip. I’m glad I could assist you!",
    "Custom Message",
  ];
  const [selectedTxt, setSelectedTxt] = useState("");
  const [customTxt, setCustomTxt] = useState("");
  const [starRating, setStarRating] = useState(2);
  const [selectedValue, setSelectedValue] = useState({
    id: 0,
    label: messages[0],
    value: messages[0],
  });
  const { t } = useTranslation();
  const [value, setValue] = useState(null);
  const [items, setItems] = useState([
    { id: 0, label: t(messages[0]), value: messages[0] },
    { id: 1, label: t(messages[1]), value: messages[1] },
    { id: 2, label: t(messages[2]), value: messages[2] },
    { id: 3, label: t(messages[3]), value: messages[3] },
    { id: 4, label: t(messages[4]), value: messages[4] },
    { id: 5, label: t(messages[5]), value: messages[5] },
    { id: 6, label: t(messages[6]), value: messages[6] },
    { id: 7, label: t(messages[7]), value: messages[7] },
    { id: 8, label: t(messages[8]), value: messages[8] },
  ]);
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const _handleConfirm = () => {
    onConfirm(value == "Custom Message" ? customTxt : value);
    resetValues();
  };
  const _handleCancel = () => {
    onCancel();
    resetValues();
  };

  const resetValues = () => {
    setCustomTxt("");
    setSelectedValue({
      id: 0,
      label: messages[0],
      value: messages[0],
    });
    setValue(null);
  };

  return (
    <ReusableModal ref={ref}>
      <View style={[styles.modalContainer]}>
        <View style={styles.feedbackContainer}>
          <Text style={styles.label}>{t("Acknowledgment")}</Text>
          <View style={styles.inputContainer}>
            <DropDownPicker
              open={isDropdownOpen}
              value={value}
              items={items}
              setOpen={setDropdownOpen}
              setValue={setValue}
              setItems={setItems}
              onSelectItem={(item) => {
                setSelectedValue(item);
              }}
              textStyle={{
                fontSize: 15,
                color: COLORS.primary,
              }}
              // listItemContainerStyle={{
              //   height: "auto",
              //   borderColor: COLORS.inActiveBorder,
              //   borderBottomWidth: 1,
              //   paddingVertical: 5,
              //   marginBottom: 5,
              // }}
              dropDownContainerStyle={{
                height: pixelPerfect(150),
                zIndex: 2000,
              }}
              listItemLabelStyle={{
                color: COLORS.primary,
                fontFamily: fonts.robotoNormal,
              }}
              flatListProps={{ nestedScrollEnabled: true }}
              placeholder={t("Select ...")}
              listMode={"SCROLLVIEW"}
            />
            {selectedValue?.id == messages.length - 1 && (
              <TextInput
                customMainContainer={styles.multilineCustomMainContainer}
                customInputContainer={styles.multilineCustomInputContainer}
                isBackroundTransparent={true}
                placeholderTextColor={COLORS.placeholder}
                multiline={true}
                customeStyleTextInput={styles.customeStyleTextInput}
                placeholder={t("Type your message here")}
                onChangeText={setCustomTxt}
                value={customTxt}
                textAlignVertical="top"
                label={t("Type Message")}
                customLabelStyle={{ color: COLORS.white }}
              />
            )}
          </View>
        </View>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            onPress={_handleConfirm}
            style={styles.coverBtn}
            disabled={
              value == null || (value == "Custom Message" && customTxt == "")
            }
          >
            <Text
              style={[
                styles.btnTxt,
                (value == null ||
                  (value == "Custom Message" && customTxt == "")) && {
                  color: COLORS.grayLight,
                },
              ]}
            >
              {t("Confirm")}
            </Text>
          </TouchableOpacity>
          <View style={styles.verticalLine} />
          <TouchableOpacity onPress={_handleCancel} style={styles.coverBtn}>
            <Text style={styles.btnTxt}>{t("Cancel")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ReusableModal>
  );
});
export default Acknowledgment;
const styles = StyleSheet.create({
  blurView: {
    width: pixelPerfect(350),
    backgroundColor: "blue",
  },

  modalContainer: {
    width: "90%",
    alignSelf: "center",
    borderRadius: SIZES.radius * 2,
    borderWidth: 2,
    borderColor: COLORS.modalBorder,
    backgroundColor: `rgba(0,0,0,0.7)`,
    padding: 0,

    // width: 300,
  },
  label: {
    fontFamily: fonts.robotosemiBold,
    color: COLORS.white,
    fontSize: pixelPerfect(18),
    // marginBottom: pixelPerfect(10),
  },
  container: {
    padding: pixelPerfect(20),
    alignItems: "center",
  },
  optionsContainer: {
    borderTopWidth: 2,
    borderColor: COLORS.modalBorder,
    justifyContent: "space-evenly",
    alignItems: "center",
    flexDirection: "row",
    borderBottomRightRadius: SIZES.radius * 2,
    borderBottomLeftRadius: SIZES.radius * 2,
    backgroundColor: COLORS.primary,
    height: pixelPerfect(50),
    width: "100%",
    zIndex: -5,
  },
  verticalLine: {
    width: 2,
    backgroundColor: COLORS.modalBorder,
    height: pixelPerfect(50),
  },
  btnTxt: {
    fontSize: pixelPerfect(15),
    fontFamily: fonts.robotosemiBold,
    color: COLORS.white,
  },
  feedbackContainer: {
    padding: pixelPerfect(15),
    alignItems: "center",
    justifyContent: "center",
    // backgroundColor: 'red',
    width: "100%",
  },
  ratingStarLable: {
    fontFamily: fonts.robotoNormal,
    fontSize: pixelPerfect(15),
    color: COLORS.white,
    marginTop: pixelPerfect(30),
  },
  customMainContainer: {
    backgroundColor: "transparent",
    marginTop: pixelPerfect(15),
  },
  customInputContainer: {
    backgroundColor: "transparent",
    borderWidth: 1,
  },
  multilineCustomMainContainer: {
    backgroundColor: "transparent",

    marginTop: pixelPerfect(15),
    height: pixelPerfect(142),
    marginBottom: pixelPerfect(20),
  },
  multilineCustomInputContainer: {
    backgroundColor: "transparent",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    height: pixelPerfect(142),
  },
  customeStyleTextInput: {
    fontSize: pixelPerfect(22),
    fontFamily: fonts.robotoNormal,
    color: COLORS.white,
    color: COLORS.black,
  },
  coverBtn: {
    padding: 10,
    width: "45%",
    alignItems: "center",
  },
  inputContainer: {
    ...Platform.select({
      ios: {
        zIndex: 1000,
      },
    }),
  },
});
