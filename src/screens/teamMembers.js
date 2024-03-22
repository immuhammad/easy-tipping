import React, { useRef, useState, useEffect } from "react";
import { StyleSheet, View, FlatList } from "react-native";
import { useTranslation } from "react-i18next";
import Button from "../components/Button";
import { SCREEN } from "../contants/screens";
import Screen from "../components/Screen";
import pixelPerfect from "../utils/pixelPerfect";
import Header from "../components/Header";
import TeamMember from "../components/TeamMember";
import InviteMember from "../components/InviteMember";
import AppSecondaryModal from "../components/AppSecondaryModal";
import { useSelector } from "../redux/store";
import {
  getTeamRequests,
  getTeamMembers,
  sendInvite,
  getTeamMemeberWithCode,
  approveRejectRequests,
  makeTeamAdmin,
  changeTeamMemberStatus,
} from "../services/apis";
import Alert from "../common/Alert";
import ButtonHeaderTeam from "../components/ButtonHeaderTeam/ButtonHeaderTeam";
import EmptyList from "../components/emptylist";

const TeamMembers = (props) => {
  const { t } = useTranslation();
  const modalDeleteRef = useRef(null);
  const inviteMemberRef = useRef(null);
  const { token, user } = useSelector((state) => state.userReducer);

  const [actionOnMember, setActionOnMember] = useState("remove");
  const [selectedMember, setSelectedMember] = useState({});
  const [teamRequest, setTeamRequests] = useState([]);
  const [teamMembers, setTeamMembers] = useState([]);
  const [activeTab, setActiveTab] = useState(1);

  useEffect(() => {
    _handleTeamRequests();
    // _handleGetTeammebers();
    _handleGetTeamMemeberWithTeamCode();
  }, []);

  const _handleGetTeamMemeberWithTeamCode = async () => {
    await getTeamMemeberWithCode(
      token,
      user?.userTeam ? user?.userTeam?.teamCode : user?.teamCode
    )
      .then((res) => {
        if (res?.data?.success === true) {
          setTeamMembers(res?.data?.data?.teamMembers);
        }
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const _handleSendInvite = (email) => {
    onConfirm();
    const payload = {
      email: email,
      teamCode: user?.userTeam ? user?.userTeam?.teamCode : user?.teamCode,
    };
    sendInvite(token, payload)
      .then((res) => {
        Alert("The invitations have been sent successfully.", "success");
      })
      .catch((error) => {
        console.log("error on rend Invite ", error);
      });
  };

  const _handleTeamRequests = () => {
    getTeamRequests(
      token,
      user?.userTeam ? user?.userTeam?.teamCode : user?.teamCode
    )
      .then((res) => {
        setTeamRequests(res.data.data.teamMembers);
      })
      .catch((error) => {
        console.log("error on getting team requests ", error);
      });
  };

  const onConfirm = () => {
    inviteMemberRef.current.setModalVisibility(false);
  };

  const onCancel = () => {
    inviteMemberRef.current.setModalVisibility(false);
  };

  const _handleOnAccept = () => {
    modalDeleteRef.current.setModalVisibility(false);

    const acceptData = {
      teamCode: user?.teamCode,
      id: selectedMember?.id,
      status:
        actionOnMember === "reject" || actionOnMember === "remove"
          ? false
          : true,
    };
    changeTeamMemberStatus(token, selectedMember?.id, acceptData)
      .then((res) => {
        _handleTeamRequests();
        _handleGetTeamMemeberWithTeamCode();
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const _handleOnReject = () => {
    modalDeleteRef.current.setModalVisibility(false);
  };

  const remove = (item) => {
    setActionOnMember("remove");
    modalDeleteRef.current.setModalVisibility(true);
    setSelectedMember(item);
  };

  const onAccept = (item) => {
    setActionOnMember("accept");
    modalDeleteRef.current.setModalVisibility(true);
    setSelectedMember(item);
  };

  const onReject = (item) => {
    setActionOnMember("reject");
    modalDeleteRef.current.setModalVisibility(true);
    setSelectedMember(item);
  };

  const _makeTeamAdmin = (data) => {
    const userId = {
      id: data?.id,
      teamCode: user?.teamCode,
    };

    makeTeamAdmin(token, userId)
      .then((res) => {
        _handleTeamRequests();

        _handleGetTeamMemeberWithTeamCode();
        Alert(`${user.username} is successfully make an admin`, "success");
      })
      .catch((e) => {
        console.log(e);
      });
  };

  const _renderMembers = (item) => {
    return (
      <TeamMember
        image={item?.profileImg}
        name={item?.username ?? item?.firstName}
        rating={item?.rating}
        date={item?.date}
        isRequest={activeTab === 2 && true}
        fromChat={false}
        businessName={item?.businessName}
        amount={item?.amount}
        onPressCard={() =>
          props.navigation.navigate(SCREEN.teamMemberProfile, { item: item })
        }
        isAdmin={item?.isTeamAdmin}
        makeAdmin={_makeTeamAdmin}
        onRemove={remove}
        onAccept={onAccept}
        onReject={onReject}
        item={item}
      />
    );
  };

  return (
    <Screen>
      <View style={styles.container}>
        <Header
          title={t("Team Members")}
          isBackBtn={true}
          onPressBackIcon={() => props.navigation.goBack()}
        />
        <ButtonHeaderTeam active={(e) => setActiveTab(e)} />

        <View style={styles.membersContainer}>
          {activeTab === 1 && (
            <FlatList
              data={teamMembers}
              ListEmptyComponent={() => <EmptyList />}
              contentContainerStyle={{ paddingBottom: pixelPerfect(80) }}
              showsVerticalScrollIndicator={false}
              // keyExtractor={(item, index) => item?.id + index}
              renderItem={({ item }) => _renderMembers(item)}
            />
          )}
          {activeTab === 2 && (
            <FlatList
              data={teamRequest}
              ListEmptyComponent={() => <EmptyList />}
              contentContainerStyle={{ paddingBottom: pixelPerfect(80) }}
              showsVerticalScrollIndicator={false}
              // keyExtractor={(item, index) => item?.id + index}
              renderItem={({ item }) => _renderMembers(item)}
            />
          )}
        </View>
        <View style={styles.btnContainer}>
          <Button
            btnText={t("Invite Team Member")}
            customeStyle={styles.btn}
            onPress={() => inviteMemberRef.current.setModalVisibility(true)}
          />
        </View>
      </View>
      <AppSecondaryModal
        ref={modalDeleteRef}
        title={
          actionOnMember == "reject"
            ? t("Are you sure you want to reject this Team member?")
            : actionOnMember == "remove"
            ? t("Are you sure you want to remove this Team member?")
            : t("Are you sure you want to accept this Team member?")
        }
        acceptTitle="Yes"
        rejectTitle="No"
        onAccept={_handleOnAccept}
        onReject={_handleOnReject}
      />
      <InviteMember
        ref={inviteMemberRef}
        onConfirm={_handleSendInvite}
        onCancel={onCancel}
      />
    </Screen>
  );
};
export default TeamMembers;
const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  btnContainer: {
    marginTop: pixelPerfect(15),
    position: "absolute",
    bottom: pixelPerfect(15),
    width: "100%",
  },
  btn: {
    marginTop: pixelPerfect(15),
  },
  membersContainer: {
    marginTop: pixelPerfect(15),
    flex: 1,
  },
});
