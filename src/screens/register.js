import React, { useState, useRef } from "react";
import {
  Text,
  StyleSheet,
  View,
  Image,
  TouchableOpacity,
  Platform,
  Alert as AlertNative,
  TextInput as Input,
} from "react-native";
import { useTranslation } from "react-i18next";
import { KeyboardAwareScrollView } from "react-native-keyboard-aware-scroll-view";
import { CommonActions } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import fonts from "../contants/fonts";
import { COLORS } from "../contants/colors";
import Button from "../components/Button";
import { SCREEN } from "../contants/screens";
import TextInput from "../components/TextInput";
import Screen from "../components/Screen";
import pixelPerfect from "../utils/pixelPerfect";
import Header from "../components/Header";
import AppSecondaryModal from "../components/AppSecondaryModal";
import Validations from "../utils/Validations";
import { doHttpPost, doHttpPostNoAuthMultipart } from "../services/HttpUtils";
import ENDPOINTS from "../contants/apis";
import Alert from "../common/Alert";
import AppLoading from "../common/AppLoader";
import { IMAGES } from "../contants/images";
import { launchImageLibrary } from "react-native-image-picker";
import { getTeamDetails, registerSocialUser } from "../services/apis";
import DropDownPicker from "react-native-dropdown-picker";
import { sendOtp } from "../services/apis";
import CountryPicker from "react-native-country-picker-modal";
import { SIZES } from "../contants/sizes";
import { useDispatch } from "react-redux";
import { saveToken, saveUser } from "../redux/slices/userSlice";
//list of occupations
import { OCCUPATIONS } from "../contants/occupations";
import AlertMessage from "../components/AlertMessage";
import ALLCURRENCIES from "../contants/currencies";
import { useSelector } from "react-redux";
DropDownPicker.setListMode("SCROLLVIEW");
const Register = (props) => {
  const { currency } = useSelector((state) => state.netInfoReducer);
  const modalRef = useRef(null);
  const alertMessageRef = useRef(null);
  const addStripeRef = useRef(null);
  const { from, accountType, isSocailLogin, data, socailType } =
    props?.route?.params;

  const dispatch = useDispatch();
  const { t, i18n } = useTranslation();

  const [isFocus, setIsFocus] = useState(false);
  const [countryCode, setCountryCode] = useState("US");
  const [country, setCountry] = useState("1");
  const [isVisible, setVisible] = useState(false);
  const [fname, setFName] = useState(data?.user?.FName || "");
  const [lname, setLName] = useState(data?.user?.LName || "");
  const [userName, setUserName] = useState(data?.user?.name || "");
  const [phoneNumber, setPhoneNumber] = useState("");
  const [email, setEmail] = useState(data?.user?.email || "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [teamCode, setTeamCode] = useState("");
  const [bussinessName, setBussinessName] = useState("");
  const [businessLogo, setBusinessLogo] = useState("");
  const [teamName, setTeamName] = useState("");
  const [isSubmitted, setIsSubmitted] = useState(false);
  const [loading, setLoading] = useState(false);
  const [pickModal, setPickModal] = useState(false);
  const [teamDetais, setTeamDetails] = useState({});

  const [selectedOccupation, setSelectedOccupation] = useState(null);
  const [Occupation, setOccupation] = useState();
  const [Occuptions, setOccupations] = useState(OCCUPATIONS);
  const [isOccupationDropdown, setIsOccupationDropdown] = useState(false);
  const [isCurrencyDropdown, setIsCurrencyDropdown] = useState(false);
  const [selectedCurrency, setSelectedCurrency] = useState(
    currency ? currency?.code : "USD"
  );
  const [currencies, setCurrencies] = useState(
    ALLCURRENCIES.sort((a, b) => a.code - b.code)
  );
  const [selectedBusinessType, setSelectedBusinessType] = useState(null);
  const [businessType, setBusinessType] = useState();
  const [businessTypes, setBusinessTypes] = useState([
    { id: 0, label: "Corporation", value: "Teacher" },
    { id: 0, label: "General Partrnership", value: "General Partrnership" },
    { id: 0, label: "NPO", value: "NPO" },
  ]);
  const [isBusinessDropdown, setIsBusinessDropdown] = useState(false);

  const [selectedEstimatedRevenue, setSelectedEstimatedRevenue] =
    useState(null);
  const [estimatedRevenue, setEstimatedRevenue] = useState();
  const [estimatedRevenues, setEstimatedRevenues] = useState([
    { id: 0, label: "$10 - $100K", value: "10" },
    { id: 0, label: "$101K - $1000K", value: "20" },
    { id: 0, label: "$1001K - $20000K", value: "30" },
    { id: 0, label: "$20001K - $30000K", value: "50" },
    { id: 0, label: "$30001K - $40000K", value: "100" },
  ]);
  const [isEstimatedRevenue, setIsEstimatedRevenue] = useState(false);
  const [bussinessTypeFocus, setBussineTypeFocus] = useState(false);
  const [revenueFcosu, setRevenueFocus] = useState(false);
  const [ocuptionFcosu, setOccuptionFocus] = useState(false);
  const [currencyFocused, setCurrencyFocused] = useState(false);
  const [alertMessage, setAlertMessage] = useState("");

  const onSelect = (country) => {
    setCountryCode(country.cca2);
    setCountry(country.callingCode[0]);
  };

  const handleRegister = () => {
    setIsSubmitted(true);

    if (from === "payer" || (from == "payee" && accountType == "Indvidual")) {
      // if (
      //   !isSocailLogin &&
      //   Validations.isValidName(fname) &&
      //   Validations.isValidName(lname) &&
      //   Validations.isValidUserName(userName) &&
      //   Validations.isEmail(email) &&
      //   Validations.isValidPhone(phoneNumber) &&
      //   Validations.isValidPassword(password) &&
      //   password == confirmPassword
      // ) {
      //   let data = {
      //     username: userName,
      //     firstName: fname,
      //     lastName: lname,
      //     email: email,
      //     phone: country + phoneNumber,
      //     password: password,
      //     userType:
      //       from == "payee" && accountType == "Indvidual" ? "payee" : "payer",
      //     accountType: "individual",
      //   };
      //   _handleSendOtp(data);

      if (!isSocailLogin) {
        if (
          Validations.isValidName(fname) &&
          Validations.isValidName(lname) &&
          Validations.isValidUserName(userName) &&
          Validations.isEmail(email) &&
          Validations.isValidPhone(phoneNumber) &&
          Validations.isValidPassword(password) &&
          password == confirmPassword
        ) {
          {
            let data = {
              username: userName,
              firstName: fname,
              lastName: lname,
              email: email,
              phone: "+" + country + phoneNumber,
              password: password,
              userType:
                from == "payee" && accountType == "Indvidual"
                  ? "payee"
                  : "payer",
              accountType: "individual",
              currency: selectedCurrency,
            };
            _handleSendOtp(data);
          }
        }
      } else if (
        (from === "payer" || (from == "payee" && accountType == "Indvidual")) &&
        Validations.isValidName(fname) &&
        Validations.isValidName(lname) &&
        Validations.isValidUserName(userName) &&
        Validations.isEmail(email) &&
        Validations.isValidPhone(phoneNumber)
      ) {
        let data = {
          username: userName,
          firstName: fname,
          lastName: lname,
          email: email,
          phone: "+" + country + phoneNumber,
          password: null,
          userType:
            from == "payee" && accountType == "Indvidual" ? "payee" : "payer",
          accountType: "individual",
          socialType: socailType,
          isSocialLogin: true,
          currency: selectedCurrency,
        };
        handleSocialLogin(data);
      }
    } else if (accountType == "teamMember") {
      if (
        Validations.isValidName(fname) &&
        Validations.isValidName(lname) &&
        Validations.isValidUserName(userName) &&
        Validations.isEmail(email) &&
        Validations.isValidPhone(phoneNumber) &&
        Validations.isValidAmmount(teamCode) &&
        Validations.isValidPassword(password) &&
        password == confirmPassword
      ) {
        _handleTeamDetails();
      }
    } else if (from == "payee" && accountType == "team") {
      if (!isSocailLogin) {
        if (
          Validations.isValidName(fname) &&
          Validations.isValidName(lname) &&
          Validations.isValidUserName(userName) &&
          Validations.isEmail(email) &&
          Validations.isValidPhone(phoneNumber) &&
          Validations.isValidName(teamName) &&
          Validations.isValidPassword(password) &&
          password == confirmPassword
        ) {
          let data = {
            username: userName,
            firstName: fname,
            lastName: lname,
            email: email,
            phone: "+" + country + phoneNumber,
            teamName: teamName,
            password: password,
            userType: "payee",
            accountType: "team",
            currency: selectedCurrency,
          };
          _handleSendOtp(data);
        }
        // getRegister(data)
        // props.navigation.navigate(SCREEN.bottomTab);
      } else if (
        Validations.isValidName(fname) &&
        Validations.isValidName(lname) &&
        Validations.isValidUserName(userName) &&
        Validations.isEmail(email) &&
        Validations.isValidPhone(phoneNumber) &&
        Validations.isValidName(teamName)
      ) {
        let data = {
          username: userName,
          firstName: fname,
          lastName: lname,
          email: email,
          phone: "+" + country + phoneNumber,
          teamName: teamName,
          password: null,
          userType: "payee",
          accountType: "team",
          socialType: socailType,
          isSocialLogin: true,
          currency: selectedCurrency,
        };
        handleSocialLogin(data);
      }
    } else if (from == "payee" && accountType == "Bussiness") {
      if (!isSocailLogin) {
        if (
          Validations.isValidName(bussinessName) &&
          Validations.isValidName(fname) &&
          Validations.isValidName(lname) &&
          Validations.isValidUserName(userName) &&
          Validations.isEmail(email) &&
          Validations.isValidPhone(phoneNumber) &&
          Validations.isValidPassword(password) &&
          password == confirmPassword
        ) {
          if (businessLogo != "") {
            getUrl();
          } else {
            let data = {
              username: userName,
              firstName: fname,
              lastName: lname,
              email: email,
              phone: "+" + country + phoneNumber,
              teamName: teamName,
              password: password,
              userType: "payee",
              accountType: "business",
              businessName: bussinessName,
              businessLogo: "",
              currency: selectedCurrency,
            };
            // getRegister(data)
            _handleSendOtp(data);
            // props.navigation.navigate(SCREEN.bottomTab);
          }
        }
      } else if (
        Validations.isValidName(bussinessName) &&
        Validations.isValidName(bussinessName) &&
        Validations.isValidName(fname) &&
        Validations.isValidName(lname) &&
        Validations.isEmail(email) &&
        Validations.isValidPhone(phoneNumber)
      ) {
        if (businessLogo != "") {
          getUrl();
        } else {
          let data = {
            username: userName,
            firstName: fname,
            lastName: lname,
            email: email,
            phone: "+" + country + phoneNumber,
            teamName: teamName,
            userType: "payee",
            accountType: "business",
            businessName: bussinessName,
            businessLogo: "",
            socialType: socailType,
            isSocialLogin: true,
            currency: selectedCurrency,
          };

          handleSocialLogin(data);
        }
      }
    }
  };

  const handleSocialLogin = (val) => {
    console.log("payload for social ", val);

    setLoading(true);
    registerSocialUser(val)
      .then((res) => {
        if (
          res?.data?.data?.user?.accountType === "teamMember" &&
          res?.data?.data?.user?.userType != "payer" &&
          res?.data?.data?.user?.teamCode !== undefined
        ) {
          setLoading(false);
          onTeamJoin();
        } else if (res?.data?.data?.user?.userType == "payer") {
          setLoading(false);
          dispatch(saveToken(res?.data?.data?.accessToken));
          dispatch(saveUser(res?.data?.data?.user));
          props.navigation.dispatch(
            CommonActions.reset({
              index: 0,
              routes: [{ name: SCREEN.bottomTab }],
            })
          );
        } else {
          dispatch(saveToken(res?.data?.data?.accessToken));
          dispatch(saveUser(res?.data?.data?.user));
          setLoading(false);
          setTimeout(() => {
            addStripeRef.current.setModalVisibility(true);
          }, 300);
        }
      })
      .catch((error) => {
        console.log("error of register", error);
        setLoading(false);
        Alert(
          error?.response?.data?.data?.message
            ? error?.response?.data?.data?.message
            : "Something went wrong!"
        );
      });
  };

  const onTeamJoin = () => {
    setAlertMessage(
      t(
        "Your request has been sent to the team admin. Please wait for your request to be approved."
      )
    );
    alertMessageRef.current.setModalVisibility(true);
    // AlertNative.alert(
    //   "Signup Successful",
    //   "Your request has been sent to the team admin. Please wait for your request to be approved.",
    //   [
    //     {
    //       text: "OK",
    //       onPress: () => {
    //         props.navigation.dispatch(
    //           CommonActions.reset({
    //             index: 0,
    //             routes: [{ name: SCREEN.login }],
    //           })
    //         );
    //       },
    //     },
    //   ],
    //   { cancelable: false }
    // );
  };

  const onJoinRequestSent = () => {
    alertMessageRef.current.setModalVisibility(false);
    setTimeout(() => {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: SCREEN.login }],
        })
      );
    }, 300);
  };

  const getUrl = () => {
    setLoading(true);
    // let val = new FormData();
    // val.append("image", {
    //   uri: businessLogo.uri,
    //   type: businessLogo.type,
    //   name: businessLogo.name,
    // });

    var formdata = new FormData();
    formdata.append("image", {
      uri: businessLogo.uri,
      type: businessLogo.type,
      name: businessLogo.name,
    });

    doHttpPostNoAuthMultipart(formdata, ENDPOINTS.GET_URL)
      .then((resp) => {
        if (!isSocailLogin) {
          let data = {
            username: userName,
            firstName: fname,
            lastName: lname,
            email: email,
            phone: "+" + country + phoneNumber,
            teamName: teamName,
            password: password,
            userType: "payee",
            accountType: "business",
            businessName: bussinessName,
            businessLogoUrl: resp?.data?.imageUrl,
            currency: selectedCurrency,
          };
          _handleSendOtp(data);
        } else {
          let data = {
            username: userName,
            firstName: fname,
            lastName: lname,
            email: email,
            phone: "+" + country + phoneNumber,
            teamName: teamName,
            userType: "payee",
            accountType: "business",
            businessName: bussinessName,
            businessLogoUrl: resp?.data?.imageUrl,
            socialType: socailType,
            isSocialLogin: true,
            currency: selectedCurrency,
          };

          handleSocialLogin(data);
        }
      })
      .catch((err) => {
        console.log("error in iamge uplaod ", err);
        setLoading(false);
      });
  };

  const onAccept = () => {
    modalRef.current.setModalVisibility(false);
    setLoading(true);
    let data = {
      username: userName,
      firstName: fname,
      lastName: lname,
      email: email,
      phone: "+" + country + phoneNumber,
      password: password,
      userType: "payee",
      accountType: "teamMember",
      teamCode: teamCode,
    };
    _handleSendOtp(data);
  };

  const onReject = () => {
    modalRef.current.setModalVisibility(false);
  };

  const imagePickerFromGallery = () => {
    let options = {
      mediaType: "photo",
      selectionLimit: 1,
    };
    launchImageLibrary(options, (res) => {
      if (res.didCancel) {
      } else if (res.errorMessage) {
      } else {
        const image = {
          uri: res?.assets[0]?.uri,
          type: res?.assets[0]?.type,
          name: res?.assets[0]?.fileName,
        };
        setBusinessLogo(image);
      }
    });
  };

  const _handleTeamDetails = () => {
    setLoading(true);
    getTeamDetails(teamCode)
      .then((res) => {
        setLoading(false);
        setTeamDetails(res?.data?.data?.team);
        modalRef.current.setModalVisibility(true);
      })
      .catch((error) => {
        setLoading(false);
        Alert(
          error?.response?.data?.data?.message
            ? error?.response?.data?.data?.message
            : "Something went wrong!"
        );
      });
  };

  const _handleSendOtp = (data) => {
    setLoading(true);
    sendOtp({
      // email: data?.email,
      // username: userName,
      email: data?.email,
      username: userName,
      teamName: teamName,
      businessName: bussinessName,
      phoneNumber: "+" + country + phoneNumber,
    })
      .then((res) => {
        setLoading(false);
        props.navigation.navigate(SCREEN.otpVerification, {
          from: "register",
          data: data,
        });
      })
      .catch((error) => {
        Alert(
          error?.response?.data?.data?.message
            ? error?.response?.data?.data?.message
            : "Something went wrong!"
        );
        setLoading(false);
      });
  };

  const _handleCreateStripeLink = () => {
    addStripeRef.current.setModalVisibility(false);
    setTimeout(() => {
      props.navigation.navigate(SCREEN.STRIPESCREEN);
    }, 400);
  };

  const onLaterRegisterStripeAccount = () => {
    addStripeRef.current.setModalVisibility(false);
    setTimeout(() => {
      props.navigation.dispatch(
        CommonActions.reset({
          index: 0,
          routes: [{ name: SCREEN.bottomTab }],
        })
      );
    }, 700);
  };

  return (
    <Screen>
      <View style={styles.container}>
        {AppLoading(loading)}
        <Header
          title={t("Sign Up")}
          isBackBtn={true}
          onPressBackIcon={() => props.navigation.goBack()}
        />
        <KeyboardAwareScrollView
          showsHorizontalScrollIndicator={false}
          showsVerticalScrollIndicator={false}
        >
          <View
            style={[
              styles.txtInputContainer,
              {
                marginTop:
                  accountType == "Bussiness"
                    ? pixelPerfect(50)
                    : pixelPerfect(50),
              },
            ]}
          >
            {from == "payee" && accountType == "Bussiness" && (
              <>
                <TextInput
                  customInputContainer={styles.txtInput}
                  value={bussinessName}
                  onChangeText={setBussinessName}
                  placeholder={t("Business Name")}
                  errorMessage={
                    !isSubmitted
                      ? ""
                      : Validations.isValidName(bussinessName)
                      ? ""
                      : "Please Enter Valid Business Name"
                  }
                  isMandatory={true}
                />
              </>
            )}

            {from == "payee" && accountType == "teamMember" && (
              <>
                <TextInput
                  customInputContainer={styles.txtInput}
                  value={teamCode}
                  onChangeText={setTeamCode}
                  placeholder={t("Team Code")}
                  keyboardType={"numeric"}
                  errorMessage={
                    !isSubmitted
                      ? ""
                      : Validations.isValidAmmount(teamCode)
                      ? ""
                      : t("Please Enter Valid Team Code")
                  }
                  isMandatory={true}
                />
              </>
            )}

            <TextInput
              customInputContainer={styles.txtInput}
              value={fname}
              onChangeText={setFName}
              placeholder={t("First Name")}
              label={t("First Name")}
              errorMessage={
                !isSubmitted
                  ? ""
                  : Validations.isValidName(fname)
                  ? ""
                  : t("Please Enter Valid Name")
              }
              isMandatory={true}
            />

            <TextInput
              customInputContainer={styles.txtInput}
              value={lname}
              onChangeText={setLName}
              placeholder={t("Last Name")}
              label={t("Last Name")}
              errorMessage={
                !isSubmitted
                  ? ""
                  : Validations.isValidName(lname)
                  ? ""
                  : t("Please Enter Valid Name")
              }
              isMandatory={true}
            />
            <TextInput
              customInputContainer={styles.txtInput}
              value={userName}
              onChangeText={setUserName}
              placeholder={t("Username")}
              label={t("Username")}
              errorMessage={
                !isSubmitted
                  ? ""
                  : Validations.isValidUserName(userName)
                  ? ""
                  : t("Please Enter Valid User Name")
              }
              isMandatory={true}
            />

            <TextInput
              customInputContainer={styles.txtInput}
              value={email}
              onChangeText={setEmail}
              editable={!isSocailLogin}
              placeholder={t("Email Address")}
              label={t("Email")}
              keyboardType={"email-address"}
              errorMessage={
                !isSubmitted
                  ? ""
                  : Validations.isEmail(email)
                  ? ""
                  : t("Please Enter Valid Email")
              }
              isMandatory={true}
            />

            <Text style={styles.phoneNumberLabel}>
              {t("Phone Number") + "*"}
            </Text>
            <View
              style={[
                styles.phoneMainContainer,
                {
                  borderColor: isFocus
                    ? COLORS.activeBorder
                    : COLORS.inActiveBorder,
                },
              ]}
            >
              <TouchableOpacity
                activeOpacity={0.8}
                style={[
                  styles.mainCountryContainer,
                  {
                    height: "100%",
                    alignItems: "center",
                  },
                ]}
                onPress={() => setVisible(!isVisible)}
              >
                <CountryPicker
                  withCallingCode={true}
                  countryCode={countryCode}
                  withCallingCodeButton={false}
                  withFlagButton={true}
                  visible={isVisible}
                  containerButtonStyle={styles.pickerButtonStyle}
                  onSelect={(Country) => onSelect(Country)}
                  withFilter={true}
                  onClose={() => setVisible(false)}
                />
                {country ? (
                  <Text
                    style={[
                      styles.textInputLabel,
                      {
                        paddingRight: 5,
                        fontSize: pixelPerfect(22),
                        marginTop: 0,
                      },
                    ]}
                  >
                    +{country}
                  </Text>
                ) : null}
              </TouchableOpacity>
              <View style={styles.dividerStyle} />
              <Input
                style={[
                  styles.customInput,
                  {
                    textAlign: i18n?.language === "ar" ? "right" : "left",
                    color: isFocus ? COLORS.primary : COLORS.placeholder,
                  },
                ]}
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                placeholderTextColor={COLORS.placeholder}
                placeholder={t("Phone Number")}
                keyboardType={"phone-pad"}
                onFocus={() => setIsFocus(true)}
                onBlur={() => setIsFocus(false)}
                maxLength={12}
              />
            </View>

            {isSubmitted && !Validations.isValidPhone(phoneNumber) && (
              <Text style={styles.errorMessageStyle}>
                {t("Please Enter Valid Phone Number")}
              </Text>
            )}
            {accountType != "teamMember" && (
              <>
                <Text
                  style={[
                    styles.label,
                    {
                      textAlign: i18n?.language === "ar" ? "left" : "left",
                    },
                  ]}
                >
                  {t("Currency") + "*"}
                </Text>

                <View
                  style={{
                    ...Platform.select({
                      ios: {
                        zIndex: 3000,
                      },
                    }),
                  }}
                >
                  <DropDownPicker
                    schema={{
                      label: "name",
                      value: "code",
                      symbol: "symbol",
                      country: "country",
                    }}
                    searchable={true}
                    searchPlaceholder="Search..."
                    searchTextInputStyle={{
                      color: COLORS.primary,

                      borderWidth: 0,
                    }}
                    searchContainerStyle={{
                      borderBottomColor: COLORS.primary,
                    }}
                    searchPlaceholderTextColor={COLORS.placeholder}
                    open={isCurrencyDropdown}
                    value={selectedCurrency}
                    items={currencies}
                    setOpen={setIsCurrencyDropdown}
                    setValue={setSelectedCurrency}
                    setItems={setCurrencies}
                    dropDownDirection="BOTTOM"
                    onSelectItem={(item) => {
                      setSelectedCurrency(item);
                    }}
                    arrowIconStyle={{ tintColor: COLORS.primary }}
                    tickIconStyle={{
                      tintColor: COLORS.primary,
                    }}
                    placeholderStyle={{
                      fontFamily: fonts.robotosemiBold,
                      color: COLORS.placeholder,
                      fontSize: pixelPerfect(22),
                    }}
                    // textStyle={{
                    //   fontSize: 15,

                    //   color: ocuptionFcosu
                    //     ? COLORS.primary
                    //     : COLORS.placeholder,
                    //   fontFamily: fonts.robotosemiBold,
                    // }}
                    textStyle={{
                      fontSize: pixelPerfect(22),
                      color: currencyFocused
                        ? COLORS.primary
                        : "rgba(99, 173, 120, 0.5)",
                      fontFamily: fonts.robotosemiBold,
                    }}
                    dropDownContainerStyle={{
                      height: pixelPerfect(250),
                      zIndex: 3000,
                      borderColor: COLORS.primary,
                    }}
                    onPress={() => setCurrencyFocused(true)}
                    onClose={() => setCurrencyFocused(false)}
                    listItemLabelStyle={{
                      color: COLORS.primary,
                      fontFamily: fonts.robotoNormal,
                      borderColor: COLORS.primary,
                    }}
                    style={{
                      borderColor: currencyFocused
                        ? COLORS.primary
                        : "rgba(99, 173, 120, 0.5)",
                      borderWidth: 2,
                    }}
                    flatListProps={{ nestedScrollEnabled: true }}
                    placeholder={t("Search")}
                    listMode={"SCROLLVIEW"}
                    zIndex={3000}
                    zIndexInverse={1000}
                  />
                </View>
              </>
            )}
            {from == "payee" && accountType == "team" && (
              <>
                <TextInput
                  customInputContainer={styles.txtInput}
                  value={teamName}
                  onChangeText={setTeamName}
                  placeholder={t("Team Name")}
                  errorMessage={
                    !isSubmitted
                      ? ""
                      : Validations.isValidName(teamName)
                      ? ""
                      : t("Please Enter Valid Team Name")
                  }
                  isMandatory={true}
                />
              </>
            )}
            {from == "payee" &&
              (accountType == "team" ||
                accountType == "joinTeam" ||
                accountType == "Indvidual") && (
                <>
                  <Text
                    style={[
                      styles.label,
                      {
                        textAlign: i18n?.language === "ar" ? "left" : "left",
                      },
                    ]}
                  >
                    {t("Occupation") + "*"}
                  </Text>
                  <View style={styles.inputContainer}>
                    <DropDownPicker
                      open={isOccupationDropdown}
                      value={Occupation}
                      items={Occuptions}
                      dropDownDirection="BOTTOM"
                      setOpen={setIsOccupationDropdown}
                      setValue={setOccupation}
                      setItems={setOccupations}
                      onSelectItem={(item) => {
                        setSelectedOccupation(item);
                      }}
                      arrowIconStyle={{ tintColor: COLORS.primary }}
                      tickIconStyle={{
                        tintColor: COLORS.primary,
                      }}
                      placeholderStyle={{
                        fontFamily: fonts.robotosemiBold,
                        color: COLORS.placeholder,
                        fontSize: pixelPerfect(22),
                      }}
                      // textStyle={{
                      //   fontSize: 15,

                      //   color: ocuptionFcosu
                      //     ? COLORS.primary
                      //     : COLORS.placeholder,
                      //   fontFamily: fonts.robotosemiBold,
                      // }}
                      textStyle={{
                        fontSize: pixelPerfect(22),
                        color: ocuptionFcosu
                          ? COLORS.primary
                          : "rgba(99, 173, 120, 0.5)",
                        fontFamily: fonts.robotosemiBold,
                      }}
                      dropDownContainerStyle={{
                        height: pixelPerfect(150),
                        zIndex: 2000,
                        borderColor: COLORS.primary,
                      }}
                      onPress={() => setOccuptionFocus(true)}
                      onClose={() => setOccuptionFocus(false)}
                      listItemLabelStyle={{
                        color: COLORS.primary,
                        fontFamily: fonts.robotoNormal,
                        borderColor: COLORS.primary,
                      }}
                      style={{
                        borderColor: ocuptionFcosu
                          ? COLORS.primary
                          : "rgba(99, 173, 120, 0.5)",
                        borderWidth: 2,
                      }}
                      flatListProps={{ nestedScrollEnabled: true }}
                      placeholder={t("Select ...")}
                      listMode={"SCROLLVIEW"}
                    />
                  </View>
                </>
              )}

            {from == "payee" && accountType == "Bussiness" && (
              <>
                <Text
                  style={[
                    styles.label,
                    {
                      textAlign: i18n?.language === "ar" ? "left" : "left",
                    },
                  ]}
                >
                  {t("Business Type") + "*"}
                </Text>
                <View style={[styles.inputContainer, { zIndex: 2000 }]}>
                  <DropDownPicker
                    open={isBusinessDropdown}
                    value={businessType}
                    dropDownDirection="BOTTOM"
                    items={businessTypes}
                    setOpen={setIsBusinessDropdown}
                    setValue={setBusinessType}
                    setItems={setBusinessTypes}
                    onSelectItem={(item) => {
                      setSelectedBusinessType;
                    }}
                    arrowIconStyle={{ tintColor: COLORS.primary }}
                    tickIconStyle={{
                      tintColor: COLORS.primary,
                    }}
                    placeholderStyle={{
                      fontFamily: fonts.robotosemiBold,
                      color: bussinessTypeFocus
                        ? COLORS.primary
                        : '"rgba(99, 173, 120, 0.5)',
                      fontSize: pixelPerfect(22),
                    }}
                    textStyle={{
                      fontSize: pixelPerfect(22),
                      color: bussinessTypeFocus
                        ? COLORS.primary
                        : "rgba(99, 173, 120, 0.5)",
                      fontFamily: fonts.robotosemiBold,
                    }}
                    dropDownContainerStyle={{
                      height: pixelPerfect(150),
                      zIndex: 2000,
                      borderColor: COLORS.primary,
                    }}
                    listItemLabelStyle={{
                      color: COLORS.primary,
                      fontFamily: fonts.robotoNormal,
                      borderColor: COLORS.primary,
                    }}
                    onPress={() => setBussineTypeFocus(true)}
                    onClose={() => setBussineTypeFocus(false)}
                    style={{
                      borderColor: bussinessTypeFocus
                        ? COLORS.primary
                        : '"rgba(99, 173, 120, 0.5)',
                      borderWidth: 2,
                    }}
                    flatListProps={{ nestedScrollEnabled: true }}
                    placeholder={t("Select ...")}
                    listMode={"SCROLLVIEW"}
                    zIndex={2000}
                    zIndexInverse={1000}
                    dropDownDirection="BOTTOM"
                  />
                </View>
                <View style={{ zIndex: 100 }}>
                  <Text
                    style={[
                      styles.label,
                      {
                        textAlign: i18n?.language === "ar" ? "left" : "left",
                      },
                    ]}
                  >
                    {t("Estimated Revenue")}
                  </Text>
                  <View style={styles.inputContainer}>
                    <DropDownPicker
                      dropDownDirection="BOTTOM"
                      open={isEstimatedRevenue}
                      value={estimatedRevenue}
                      items={estimatedRevenues}
                      setOpen={setIsEstimatedRevenue}
                      setValue={setEstimatedRevenue}
                      setItems={setEstimatedRevenues}
                      onSelectItem={(item) => {
                        setSelectedEstimatedRevenue;
                      }}
                      textStyle={{
                        fontSize: pixelPerfect(22),
                        color: revenueFcosu
                          ? COLORS.primary
                          : "rgba(99, 173, 120, 0.5)",
                        fontFamily: fonts.robotosemiBold,
                      }}
                      placeholderStyle={{
                        fontFamily: fonts.robotosemiBold,

                        color: revenueFcosu
                          ? COLORS.primary
                          : "rgba(99, 173, 120, 0.5)",
                        fontSize: pixelPerfect(22),
                      }}
                      arrowIconStyle={{ tintColor: COLORS.primary }}
                      tickIconStyle={{
                        tintColor: COLORS.primary,
                      }}
                      dropDownContainerStyle={{
                        zIndex: 2000,
                        borderColor: COLORS.primary,
                      }}
                      onPress={() => setRevenueFocus(true)}
                      onClose={() => setRevenueFocus(false)}
                      listItemLabelStyle={{
                        color: COLORS.primary,
                        fontFamily: fonts.robotoNormal,
                        borderColor: COLORS.primary,
                      }}
                      style={{
                        borderColor: revenueFcosu
                          ? COLORS.primary
                          : "rgba(99, 173, 120, 0.5)",
                        borderWidth: 2,
                      }}
                      flatListProps={{ nestedScrollEnabled: true }}
                      placeholder={t("Select ...")}
                      listMode={"SCROLLVIEW"}
                      zIndex={1000}
                      zIndexInverse={2000}
                      dropDownDirection="BOTTOM"
                    />
                  </View>
                </View>
              </>
            )}

            {!isSocailLogin && (
              <>
                <TextInput
                  customInputContainer={styles.txtInput}
                  isPassword={true}
                  secureTextEntry={true}
                  value={password}
                  onChangeText={setPassword}
                  placeholder={t("Password")}
                  errorMessage={
                    !isSubmitted
                      ? ""
                      : Validations.isValidPassword(password)
                      ? ""
                      : t(
                          "Password must be 8 characters or more, contain 1 uppercase and lower case letter, 1 number, and 1 special character."
                        )
                  }
                  isMandatory={true}
                />
                <TextInput
                  customInputContainer={styles.txtInput}
                  isPassword={true}
                  secureTextEntry={true}
                  value={confirmPassword}
                  onChangeText={setConfirmPassword}
                  placeholder={t("Confirm Password")}
                  errorMessage={
                    !isSubmitted
                      ? ""
                      : password !== confirmPassword || confirmPassword == ""
                      ? t("Password Not Matched")
                      : ""
                  }
                  isMandatory={true}
                />
              </>
            )}
          </View>

          <View style={styles.btnContainer}>
            <Button
              btnText={t("Sign Up")}
              onPress={() => {
                handleRegister();
              }}
            />
          </View>
          <Text style={styles.signupTxt}>
            {t("Already have an Account? ")}
            <Text
              style={styles.underLine}
              onPress={() => props.navigation.navigate(SCREEN.login)}
            >
              {t("Sign In")}
            </Text>{" "}
          </Text>
          <AppSecondaryModal
            ref={addStripeRef}
            title={t("To receive tips, register for a Stripe account now.")}
            acceptTitle={t("Now")}
            rejectTitle={t("Later")}
            onAccept={_handleCreateStripeLink}
            onReject={onLaterRegisterStripeAccount}
          />
        </KeyboardAwareScrollView>
      </View>
      <AppSecondaryModal
        onAccept={onAccept}
        onReject={onReject}
        ref={modalRef}
        title={
          <Text>
            {t("Are you sure you want to join")}{" "}
            <Text style={{ color: COLORS.secondary }}>
              {teamDetais?.teamName}
            </Text>{" "}
            {t("team?")}
          </Text>
        }
        acceptTitle="Yes"
        rejectTitle="No"
      />
      <AlertMessage
        ref={alertMessageRef}
        title={alertMessage}
        acceptTitle={t("Ok")}
        onAccept={onJoinRequestSent}
      />
    </Screen>
  );
};
export default Register;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  txtInputContainer: {
    marginTop: pixelPerfect(119),
  },
  txtInput: {},
  btnContainer: {
    marginTop: pixelPerfect(25),
    zIndex: -1,
  },
  signupTxt: {
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(22),
    color: COLORS.secondary,
    alignSelf: "center",
    marginTop: pixelPerfect(15),
    zIndex: -1,
  },
  underLine: {
    textDecorationLine: "underline",
  },
  imageMainView: {
    height: pixelPerfect(139),
    width: pixelPerfect(139),
    alignSelf: "center",
  },
  imageStyle: {
    height: pixelPerfect(139),
    width: pixelPerfect(139),
    borderRadius: pixelPerfect(139),
    borderWidth: 1,
    borderColor: COLORS.primary,
    alignSelf: "center",
  },
  absoluteImage: {
    height: pixelPerfect(32),
    width: pixelPerfect(32),
    position: "absolute",
    bottom: 4,
    right: 4,
  },
  inputContainer: {
    ...Platform.select({
      ios: {
        zIndex: 1000,
      },
    }),
  },
  multilineCustomMainContainer: {
    backgroundColor: "transparent",
    marginTop: pixelPerfect(15),
    height: pixelPerfect(142),
  },
  multilineCustomInputContainer: {
    backgroundColor: "transparent",
    backgroundColor: COLORS.white,
    borderWidth: 1,
    height: pixelPerfect(142),
  },
  customeStyleTextInput: {
    fontSize: pixelPerfect(14),
    fontFamily: fonts.robotoNormal,
    color: COLORS.white,
    color: COLORS.black,
  },
  label: {
    fontFamily: fonts.robotosemiBold,
    color: COLORS.primary,
    fontSize: pixelPerfect(22),
    marginTop: pixelPerfect(10),
  },
  phoneMainContainer: {
    flexDirection: "row",
    width: "100%",
    paddingHorizontal: SIZES.padding / 4,
    borderWidth: 2,
    borderRadius: SIZES.radius,
    height: pixelPerfect(55),
    alignItem: "center",
    backgroundColor: COLORS.white,
    shadowColor: COLORS.primary,
  },
  mainCountryContainer: {
    flexDirection: "row",
    alignSelf: "center",
  },
  pickerButtonStyle: {
    alignItems: "center",
    justifyContent: "center",
    paddingLeft: 5,
    color: COLORS.primary,
  },
  textInputLabel: {
    fontFamily: fonts.robotosemiBold,
    color: COLORS.primary,
    fontSize: pixelPerfect(14),
    textAlign: "left",
    marginTop: pixelPerfect(10),
  },
  dividerStyle: {
    height: pixelPerfect(30),
    alignSelf: "center",
    width: pixelPerfect(1),
    backgroundColor: COLORS.primary,
  },
  customInput: {
    width: "70%",
    height: pixelPerfect(55) - SIZES.padding / 4,
    fontFamily: fonts.robotosemiBold,
    fontSize: pixelPerfect(22),
    paddingHorizontal: 10,
  },
  phoneNumberLabel: {
    fontFamily: fonts.robotosemiBold,
    color: COLORS.primary,
    fontSize: pixelPerfect(22),

    textAlign: "left",
    marginTop: pixelPerfect(10),
  },
  errorMessageStyle: {
    fontFamily: fonts.robotoNormal,
    color: COLORS.error,
    fontSize: pixelPerfect(12),

    textAlign: "left",
  },
});
