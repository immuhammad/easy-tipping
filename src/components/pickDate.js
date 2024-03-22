import React, { useState, useRef, useEffect } from "react";
import { View, Text, StyleSheet, TouchableOpacity } from "react-native";
import ReusableModal from "./Reuseable";
import { SIZES } from "../contants/sizes";
import { COLORS } from "../contants/colors";
import { BlurView, VibrancyView } from "@react-native-community/blur";
import fonts from "../contants/fonts";
import pixelPerfect from "../utils/pixelPerfect";
import { useTranslation } from "react-i18next";
import CalendarPicker from "react-native-calendar-picker";
import DatePicker from "react-native-date-picker";
import dateAndTime from "../utils/dateAndTime";
import moment from "moment";
const PickDate = React.forwardRef((props, ref) => {
  const { t } = useTranslation();
  const { onConfirm, onCancel } = props;
  const [startDate, setStartDate] = useState(null);
  const [endDate, setEndDate] = useState(null);
  const [isOpen, setIsOpen] = useState(false);
  const [showCalendar, setShowCalendar] = useState(true);
  const [selectedCalendar, setSelectedCalendar] = useState("from");
  const onSelectDate = (date, type) => {
    if (type == "START_DATE") setStartDate(date);
    if (type == "END_DATE") setEndDate(date);
  };

  useEffect(() => {
    setTimeout(() => {
      setIsOpen(true);
    }, 1500);
  }, []);

  const _handleOnConfirm = (startDate, endDate) => {
    onConfirm(startDate || new Date(), endDate || new Date());
    setStartDate(null);
    setEndDate(null);
    setSelectedCalendar("from");
  };
  const _handleOnCancel = () => {
    onCancel();
    setStartDate(null);
    setEndDate(null);
    setSelectedCalendar("from");
  };
  return (
    <ReusableModal ref={ref}>
      <View style={styles.modalContainer}>
        <View style={styles.pickCalendar}>
          <Text style={styles.heading}>{t("Select Dates")}</Text>
          <View style={styles.datesContainer}>
            <View>
              <Text style={styles.datesTxt}>{t("From")}</Text>
              <TouchableOpacity
                style={[
                  styles.dateBtn,
                  selectedCalendar == "from" && {
                    borderWidth: pixelPerfect(3),
                  },
                ]}
                onPress={() => {
                  setShowCalendar(true);
                  setSelectedCalendar("from");
                }}
              >
                <Text style={styles.datesTxt}>
                  {dateAndTime(startDate || new Date(), "MMM D YYYY")}
                </Text>
              </TouchableOpacity>
            </View>
            <Text
              style={[
                styles.datesTxt,
                { fontSize: pixelPerfect(30), marginTop: pixelPerfect(20) },
              ]}
            >
              /
            </Text>
            <View>
              <Text style={styles.datesTxt}>{t("To")}</Text>
              <TouchableOpacity
                style={[
                  styles.dateBtn,
                  selectedCalendar == "to" && {
                    borderWidth: pixelPerfect(3),
                  },
                ]}
                onPress={() => {
                  setShowCalendar(true);
                  setSelectedCalendar("to");
                }}
              >
                <Text
                  style={[
                    styles.datesTxt,
                    startDate == null && { color: COLORS.grayLight },
                  ]}
                >
                  {dateAndTime(endDate || new Date(), "MMM D YYYY")}
                </Text>
              </TouchableOpacity>
            </View>
          </View>
          {/* <CalendarPicker
            onDateChange={onSelectDate}
            width={pixelPerfect(290)}
            nextTitle={t("Next")}
            previousTitle={t("Previous")}
            nextTitleStyle={styles.nextTitleStyle}
            previousTitleStyle={styles.nextTitleStyle}
            monthTitleStyle={styles.nextTitleStyle}
            yearTitleStyle={styles.nextTitleStyle}
            textStyle={styles.nextTitleStyle}
            allowRangeSelection={true}
            maxDate={new Date()}
            selectedRangeStartTextStyle={styles.selectedRangeStartTextStyle}
            selectedRangeEndTextStyle={styles.selectedRangeStartTextStyle}
            selectedRangeStyle={styles.selectedRangeStyle}
            selectedDayTextStyle={styles.selectedDayTextStyle}
            selectedStartDate={startDate}
            selectedEndDate={endDate}
          /> */}
          {showCalendar && (
            <DatePicker
              date={
                selectedCalendar == "from"
                  ? startDate || new Date()
                  : endDate || new Date()
              }
              onDateChange={(e) =>
                selectedCalendar == "from" ? setStartDate(e) : setEndDate(e)
              }
              onConfirm={(e) => console.log("data ", e)}
              mode="date"
              textColor={COLORS.white}
              open={isOpen}
              onCancel={setIsOpen}
              maximumDate={new Date()}
              minimumDate={
                selectedCalendar == "to"
                  ? startDate || new Date()
                  : new Date(moment("2023-01-01").format("YYYY-MM-DD"))
              }
              style={{ marginTop: 50 }}
              theme="light"
              androidVariant="nativeAndroid"
            />
          )}
        </View>
        <View style={styles.optionsContainer}>
          <TouchableOpacity
            onPress={() => _handleOnConfirm(startDate, endDate)}
            style={styles.coverBtn}
            // disabled={startDate == null || endDate == null}
          >
            <Text
              style={[
                styles.btnTxt,
                // (startDate == null || endDate == null) && {
                //   color: COLORS.grayLight,
                // },
              ]}
            >
              {t("Confirm")}
            </Text>
          </TouchableOpacity>
          <View style={styles.verticalLine} />
          <TouchableOpacity onPress={_handleOnCancel} style={styles.coverBtn}>
            <Text style={styles.btnTxt}>{t("Cancel")}</Text>
          </TouchableOpacity>
        </View>
      </View>
    </ReusableModal>
  );
});
export default PickDate;
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
  pickCalendar: {
    padding: pixelPerfect(15),
    paddingHorizontal: pixelPerfect(15),
    alignItems: "center",
    justifyContent: "center",
  },
  nextTitleStyle: {
    fontFamily: fonts.robotoNormal,
    fontSize: pixelPerfect(14),
    color: COLORS.white,
  },
  datesTxt: {
    fontFamily: fonts.robotoNormal,
    fontSize: pixelPerfect(18),
    color: COLORS.white,
  },
  selectedRangeStartTextStyle: {},
  selectedRangeEndTextStyle: {},
  selectedRangeStyle: { backgroundColor: COLORS.primary },
  selectedDayTextStyle: { color: COLORS.white },
  coverBtn: {
    padding: 10,
    width: "45%",
    alignItems: "center",
  },

  datesContainer: {
    flexDirection: "row",
    justifyContent: "space-evenly",
    alignItems: "center",
    width: "100%",
    marginTop: 20,
  },

  dateBtn: {
    borderRadius: SIZES.radius,
    borderWidth: pixelPerfect(1),
    padding: pixelPerfect(5),
    paddingHorizontal: pixelPerfect(15),
    borderColor: COLORS.primary,
  },
  heading: {
    color: COLORS.white,
    marginTop: pixelPerfect(10),
    fontFamily: fonts.robotoBold,
    fontSize: pixelPerfect(22),
  },
});
