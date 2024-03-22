import React, { useState, useRef } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ReusableModal from "./Reuseable";
import { SIZES } from "../contants/sizes";
import { COLORS } from "../contants/colors";
import { BlurView, VibrancyView } from "@react-native-community/blur";
import fonts from "../contants/fonts";
import pixelPerfect from "../utils/pixelPerfect";
import { useTranslation } from "react-i18next";

import ScrollPicker from "react-native-wheel-scrollview-picker";
const WheelScroller = React.forwardRef((props, ref) => {
  const { onConfirm, onCancel } = props;
  const { t } = useTranslation();
  const pickerRef = useRef(null);
  const [selected, setSelected] = useState(5);
  const [indexSelected, setIndexSelected] = useState(0);

  const opacities = {
    0: 1,
    1: 1,
    2: 0.8,
    3: 0.6,
    4: 0.3,
  };
  const sizeText = {
    0: pixelPerfect(25),
    1: pixelPerfect(18),
    2: pixelPerfect(13),
  };

  const Item = React.memo(({ opacity, selected, fontSize, name }) => {
    return (
      <View
        style={[
          styles.OptionWrapper,
          {
            opacity,
            borderColor: selected ? "#ABC9AF" : "transparent",

            width: 150,
            alignItems: "center",
          },
        ]}
      >
        <Text style={{ fontSize, color: COLORS.white, marginVertical: 2 }}>
          {name}%
        </Text>
      </View>
    );
  });

  const ItemToRender = ({ data, index, isSelected }) => {
    const gap = Math.abs(index - indexSelected);
    let opacity = opacities[gap];
    if (gap > 3) {
      opacity = opacities[4];
    }
    let fontSize = sizeText[gap];
    if (gap > 1) {
      fontSize = sizeText[2];
    }
    return (
      <Item
        opacity={opacity}
        selected={isSelected}
        fontSize={fontSize}
        name={data}
      />
    );
  };
  return (
    <ReusableModal ref={ref}>
      <View style={styles.modalContainer}>
        <View style={styles.container}>
          <Text style={styles.label}>{t("Select % to Tip")}</Text>
          <View
            style={{
              width: 250,
              height: 262.5,
              justifyContent: "center",
              alignItems: "center",
              margin: "auto",
              color: "black",
              backgroundColor: "transparent",
            }}
          >
            <View style={{ height: 262.5 }}>
              <ScrollPicker
                ref={(sp) => {
                  this.sp = sp;
                }}
                dataSource={Array.from(
                  Array(40),
                  (_, index) => (index + 1) * 5
                )}
                selectedIndex={indexSelected}
                itemHeight={35}
                wrapperHeight={262.5}
                wrapperColor={"transparent"}
                style={{ backgroundColor: "transparent" }}
                highlightColor={COLORS.white}
                renderItem={(data, index, isSelected) => {
                  return (
                    <ItemToRender
                      data={data}
                      index={index}
                      isSelected={isSelected}
                    />
                  );
                }}
                // renderItem={ItemToRender}
                onValueChange={(data, selectedIndex) => {
                  setIndexSelected(selectedIndex);
                  setSelected(data);
                  //
                }}
              />
            </View>
          </View>
        </View>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            onPress={() => onConfirm(selected)}
            style={styles.coverBtn}
          >
            <Text style={styles.btnTxt}>{t("Confirm")}</Text>
          </TouchableOpacity>
          <View style={styles.verticalLine} />
          <TouchableOpacity onPress={onCancel} style={styles.coverBtn}>
            <Text style={styles.btnTxt}>{t("Cancel")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ReusableModal>
  );
});
export default WheelScroller;
const styles = StyleSheet.create({
  modalContainer: {
    width: "90%",
    alignSelf: "center",
    borderRadius: SIZES.radius * 2,
    borderWidth: 2,
    borderColor: COLORS.modalBorder,
    width: "90%",
    alignSelf: "center",
    borderRadius: SIZES.radius * 2,
    borderWidth: 2,
    borderColor: COLORS.modalBorder,
    backgroundColor: `rgba(0,0,0,0.7)`,
    padding: 0,
  },
  label: {
    fontFamily: fonts.robotosemiBold,
    color: COLORS.white,
    fontSize: pixelPerfect(20),
    marginBottom: pixelPerfect(10),
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
    width: "100%",
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
  coverBtn: {
    padding: 10,
    width: "45%",
    alignItems: "center",
  },
});
