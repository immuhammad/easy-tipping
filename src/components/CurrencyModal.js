import {
  Text,
  View,
  Image,
  FlatList,
  StyleSheet,
  TouchableOpacity,
  TextInput,
} from "react-native";
import React, { useState } from "react";
import { BlurView } from "@react-native-community/blur";

//================================ Local Imported Files ======================================//

import ReusableModal from "./Reuseable";
import { SIZES } from "../contants/sizes";
import { COLORS } from "../contants/colors";
import fonts from "../contants/fonts";
import pixelPerfect from "../utils/pixelPerfect";
import { useTranslation } from "react-i18next";
import { IMAGES } from "../contants/images";

const AppCurrencyModal = React.forwardRef((props, ref) => {
  const { data, onSelect, isCurrency, onCloseClick, selectedItem } = props;
  const { t, i18n } = useTranslation();
  const [searchTxt, setSearchTxt] = useState("");
  const _renderItem = (item) => {
    return (
      <TouchableOpacity
        style={[
          styles.itemView,
          {
            justifyContent: true ? "space-between" : "center",
          },
        ]}
        activeOpacity={0.8}
        onPress={() => onSelect(item)}
      >
        <View
          style={{
            width: "40%",
            alignItems: "flex-end",
          }}
        >
          {isCurrency ? (
            <Text style={styles.modalTitle}>{t(item?.code)}</Text>
          ) : (
            <Image source={item?.image} style={styles.imageStyle} />
          )}
        </View>
        <View
          style={{
            width: "40%",
            alignItems: "flex-start",
          }}
        >
          <Text
            style={[
              styles.modalTitle,
              { fontSize: isCurrency ? pixelPerfect(20) : pixelPerfect(20) },
              t(item.name) == t(selectedItem) && { color: COLORS.primary },
            ]}
          >
            {t(item?.name)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  const renderCurrencies = (item) => {
    return (
      <TouchableOpacity
        style={[
          styles.itemView,
          {
            width: "100%",

            justifyContent: "space-between",
            paddingHorizontal: pixelPerfect(20),
            height: "auto",
            marginTop: pixelPerfect(15),
            borderBottomColor: COLORS.primary,
            borderBottomWidth: 1,
            paddingBottom: 5,
          },
        ]}
        activeOpacity={0.8}
        onPress={() => {
          onSelect(item), setSearchTxt("");
        }}
      >
        <View
          style={{
            width: "70%",
            alignItems: "flex-start",
          }}
        >
          <Text
            style={[
              styles.modalTitle,
              item?.code == selectedItem && { color: COLORS.primary },
            ]}
          >
            {t(item?.code)}
          </Text>

          <Text
            style={[
              styles.currencyName,
              item?.code == selectedItem && { color: COLORS.primary },
            ]}
          >
            {item.name}
          </Text>
        </View>
        <View
          style={{
            width: "30%",
          }}
        >
          <Text
            style={[
              styles.modalTitle,
              { fontSize: isCurrency ? pixelPerfect(20) : pixelPerfect(20) },
            ]}
          >
            {t(item?.symbol)}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <ReusableModal ref={ref}>
      <View
        style={[styles.modalContainer, { backgroundColor: `rgba(0,0,0,0.7)` }]}
      >
        {!isCurrency && (
          <View style={styles.languageView}>
            <Text style={[styles.modalTitle, { color: COLORS.primary }]}>
              {t("Select Language")}
            </Text>
          </View>
        )}
        {isCurrency && (
          <View style={styles.languageView}>
            <Text style={[styles.modalTitle, { color: COLORS.primary }]}>
              {t("Select Currency")}
            </Text>
          </View>
        )}
        {isCurrency && (
          <TextInput
            placeholder="Search"
            placeholderTextColor={COLORS.grayLight}
            style={styles.searchBox}
            onChangeText={setSearchTxt}
            value={searchTxt}
          ></TextInput>
        )}
        <View
          style={{
            maxHeight: "80%",
          }}
        >
          <FlatList
            data={
              !isCurrency
                ? data
                : data.filter((data) =>
                    data.name.toLowerCase().includes(searchTxt.toLowerCase())
                  )
            }
            extraData={data}
            showsVerticalScrollIndicator={false}
            renderItem={({ item }) =>
              isCurrency ? renderCurrencies(item) : _renderItem(item)
            }
          />
        </View>
        <TouchableOpacity
          style={styles.closeBtn}
          onPress={() => {
            onCloseClick(), setSearchTxt("");
          }}
        >
          <Image source={IMAGES.closeIcon} style={styles.closeIcon} />
        </TouchableOpacity>
      </View>
    </ReusableModal>
  );
});

export default AppCurrencyModal;

const styles = StyleSheet.create({
  modalContainer: {
    width: "90%",
    alignSelf: "center",
    justifyContent: "center",
    minHeight: pixelPerfect(188),
    maxHeight: pixelPerfect(1000),
    maxHeight: "70%",
    borderRadius: SIZES.radius * 2,
    borderWidth: 2,
    borderColor: COLORS.modalBorder,
    width: "90%",
    alignSelf: "center",
    borderRadius: SIZES.radius * 2,
    borderWidth: 2,
    borderColor: COLORS.modalBorder,
    backgroundColor: `rgba(255, 255, 255, 0.01)`,
    padding: 0,
    paddingBottom: pixelPerfect(15),
  },
  itemView: {
    width: pixelPerfect(336),
    height: pixelPerfect(38),
    alignSelf: "center",
    paddingHorizontal: pixelPerfect(50),
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  languageView: {
    height: pixelPerfect(60),
    width: pixelPerfect(336),
    alignSelf: "center",
    justifyContent: "center",
    alignItems: "center",
    borderBottomWidth: 1,
    borderBottomColor: COLORS.border,
  },
  imageStyle: {
    height: pixelPerfect(19.5),
    width: pixelPerfect(35),
  },
  modalTitle: {
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(24),
    color: COLORS.white,
    textAlign: "center",
  },
  closeBtn: {
    position: "absolute",
    right: pixelPerfect(15),
    top: pixelPerfect(15),
  },
  closeIcon: {
    height: pixelPerfect(18),
    width: pixelPerfect(18),
    resizeMode: "contain",
    tintColor: COLORS.white,
  },
  currencyName: {
    fontFamily: fonts.robotoNormal,
    fontSize: pixelPerfect(14),
    color: COLORS.white,
  },
  searchBox: {
    height: pixelPerfect(50),
    width: "90%",
    alignSelf: "center",
    fontSize: pixelPerfect(22),
    color: COLORS.white,
  },
});
