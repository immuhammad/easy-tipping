import React, { useState, useEffect, useRef } from "react";
import { StyleSheet, View, FlatList, Image } from "react-native";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";
import Card from "../components/card";
import Screen from "../components/Screen";
import pixelPerfect from "../utils/pixelPerfect";
import Header from "../components/Header";
import { SCREEN } from "../contants/screens";
import {
  createTranscation,
  getCardList,
  addFeedBackAsGuest,
  removeCard,
} from "../services/apis";
import { useSelector } from "react-redux";
import AppLoading from "../common/AppLoader";
import { useIsFocused } from "@react-navigation/native";
import CardEncryptedModal from "../components/cardEncryptedModal";
import Alert from "../common/Alert";
import { IMAGES } from "../contants/images";
import AppSecondaryModal from "../components/AppSecondaryModal";
import AddFeedback from "../components/addFeedback";

const SavedCards = (props) => {
  const modalRef = useRef(null);
  const { from, payeeDetails } = props.route.params;
  const feedbackModalRef = useRef(null);
  const encryptionModal = useRef(null);
  const { t } = useTranslation();
  const isFocused = useIsFocused();
  const ref_CardEncryptedModal = useRef(null);
  const { token, user } = useSelector((state) => state.userReducer);
  const [isLoading, setIsLoading] = useState(false);
  const [cards, setCards] = useState([]);
  const [transactionDetails, setTransactionDetails] = useState({});
  const [selectedCard, setSelectedCard] = useState();
  const [isInprogress, setIsInProgress] = useState(false);

  useEffect(() => {
    if (isFocused) {
      getTranscationList();
    }
  }, [isFocused]);

  const getTranscationList = () => {
    getCardList(token, {
      payeeId: props?.route?.params?.payeeId,
      teamId: payeeDetails?.teamId ? payeeDetails?.teamId : null,
      fromTeamId: user?.userTeam?.teamId ? user?.userTeam?.teamId : null,
      toTeamId: payeeDetails?.teamId ? payeeDetails.teamId : null,
      userTeamId: payeeDetails?.userTeamId ? payeeDetails?.userTeamId : null,
    })
      .then((res) => {
        if (res?.data?.success) {
          const tempCard = res?.data?.data?.cards.map((card) => {
            let tempCard = {
              id: card?.id,
              cardNumber: "**** **** **** " + card?.lastFourDigits,
              cardName: card?.name,
              isDefault: card?.isDefault === "true" ? true : false,
              cardType: card?.brand,
            };
            return tempCard;
          });
          setCards(tempCard);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const confrimPayment = () => {
    let val = cards.filter((item) => item?.isDefault === true);

    if (val.length === 0) {
      alert("Kindly select card first before proceed!");
      return;
    } else {
      setIsLoading(true);
      setIsInProgress(true);
      const data = {
        payerId: user?.id,
        payeeId: props.route?.params?.payeeId,
        teamId: "",
        amount: Number(props.route?.params?.totalAmount),
        cardId: val?.length > 0 ? val[0].id : "",
        currency: user?.currency,

        teamId: payeeDetails?.teamId ? payeeDetails?.teamId : null,
        fromTeamId: user?.userTeam?.teamId ? user?.userTeam?.teamId : null,
        toTeamId: payeeDetails?.teamId ? payeeDetails.teamId : null,
        userTeamId: payeeDetails?.userTeamId ? payeeDetails?.userTeamId : null,
      };

      createTranscation(token, data)
        .then((res) => {
          setIsLoading(false);
          setTransactionDetails(res?.data?.data.transaction);
          setTimeout(() => {
            feedbackModalRef.current.setModalVisibility(true);
          }, 300);
        })
        .catch((e) => {
          setIsLoading(false);
          setIsInProgress(false);
          console.log(e);
          Alert(e.response.data.data.message);
        });
    }
  };

  const onPressOk = () => {
    encryptionModal.current.setModalVisibility(false);
    setTimeout(() => {
      props.navigation.navigate(SCREEN.addCard, {
        totalAmount: props.route?.params?.totalAmount,
        payeeId: props.route?.params?.payeeId,
        payeeDetails: payeeDetails,
      });
    }, 300);
  };

  const onPressCard = (id) => {
    setCards(
      cards.map((data) => {
        if (data.id == id) {
          data["isDefault"] = true;
        } else {
          data["isDefault"] = false;
        }
        return data;
      })
    );
  };

  const onConfirmFeedBackModal = (comment, rating) => {
    feedbackModalRef.current.setModalVisibility(false);

    setTimeout(() => {
      setIsLoading(true);

      let payload = {
        payerId: transactionDetails?.payerId,
        payeeId: transactionDetails.payeeId,
        feedbackText: comment,
        type: "feedback",
        transactionId: transactionDetails?.id,
        rating: rating,
      };

      addFeedBackAsGuest(token, payload)
        .then((res) => {
          setIsLoading(false);
          setIsInProgress(false);
          setTimeout(() => {
            props.navigation.navigate(SCREEN.bottomTab);
          }, 700);
        })
        .catch((error) => {
          console.log("error for feedback", error);
          setIsLoading(false);
          setIsInProgress(false);
          setTimeout(() => {
            props.navigation.navigate(SCREEN.bottomTab);
          }, 700);
        });
    }, 400);
  };

  const onCancelfeedbackModal = () => {
    feedbackModalRef.current.setModalVisibility(false);
    setTimeout(() => {
      setIsInProgress(false);
      props.navigation.navigate(SCREEN.bottomTab);
    }, 700);
  };

  const renderCards = ({ item }, index) => {
    const { id, cardName, cardNumber, cardType, isDefault } = item;

    console.log("card number ", cardNumber);
    return (
      <Card
        cardNumber={cardNumber}
        cardName={cardName}
        isDefault={isDefault}
        cardType={cardType}
        onPress={onPressCard}
        id={id}
        onLongPress={(card) => {
          setSelectedCard(card);
          modalRef.current.setModalVisibility(true);
        }}
      />
    );
  };

  const onAccept = () => {
    modalRef.current.setModalVisibility(false);
    setIsLoading(true);
    removeCard(token, selectedCard)
      .then((res) => {
        getTranscationList();
        setIsLoading(false);
      })
      .catch((error) => {
        console.log("error", error);
        setIsLoading(false);
      });
  };
  const onCancel = () => {
    modalRef.current.setModalVisibility(false);
  };

  return (
    <Screen>
      <View style={styles.container}>
        {AppLoading(isLoading)}
        <Header
          title={t("Add Credit Card")}
          isBackBtn={true}
          onPressBackIcon={() => props.navigation.goBack()}
        />
        <View style={styles.cardsContainer}>
          <FlatList
            showsHorizontalScrollIndicator={false}
            showsVerticalScrollIndicator={false}
            data={cards}
            keyExtractor={(item, index) => index + item.id}
            renderItem={renderCards}
          />
        </View>
        <View style={styles.btnContainer}>
          <Button
            customeStyle={styles.btn}
            btnText={t("Add Card")}
            onPress={() => encryptionModal.current.setModalVisibility(true)}
          />
          {cards.length > 0 && (
            <Button
              onPress={() => confrimPayment()}
              customeStyle={styles.btn}
              btnText={t("Confirm")}
              disabled={isInprogress}
            />
          )}
        </View>

        <AppSecondaryModal
          ref={encryptionModal}
          title={t(
            "We take the security and privacy of your information very seriously. When you choose to save your credit card details within our app for future transactions, we want to assure you that your data is encrypted and in safe hands. "
          )}
          acceptTitle={t("Confirm")}
          rejectTitle={t("Cancel")}
          onAccept={onPressOk}
          onReject={() => encryptionModal.current.setModalVisibility(false)}
        />
      </View>
      <AddFeedback
        ref={feedbackModalRef}
        onConfirm={onConfirmFeedBackModal}
        onCancel={onCancelfeedbackModal}
      />

      <AppSecondaryModal
        ref={modalRef}
        title={t("Are you sure you want to delete this card?")}
        acceptTitle={t("Yes")}
        rejectTitle={t("No")}
        onAccept={onAccept}
        onReject={onCancel}
      />
    </Screen>
  );
};
export default SavedCards;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  cardsContainer: {
    marginTop: pixelPerfect(20),
    flex: 0.8,
  },
  btnContainer: {},
  btn: {
    marginTop: pixelPerfect(15),
  },
  emptyImgStyle: {
    width: pixelPerfect(220),
    height: pixelPerfect(220),
  },
  emptyContiner: {
    alignItems: "center",
    justifyContent: "center",
    marginTop: pixelPerfect(100),
  },
});
