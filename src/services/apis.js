import { Platform, PermissionsAndroid } from "react-native";
import ENDPOINTS from "../contants/apis";
import RNHTMLtoPDF from "react-native-html-to-pdf";
import { dispatch } from "../redux/store";
var RNFS = require("react-native-fs");
import RNFetchBlob from "rn-fetch-blob";
import Share from "react-native-share";
import FileViewer from "react-native-file-viewer";
import dateAndTime from "../utils/dateAndTime";

import moment from "moment";
import Alert from "../common/Alert";
import {
  updateTransactions,
  setLoading,
  setBalanceDetails,
  setIsFilterApplied,
  updateFilterFrom,
  updateFilterTo,
  updateTransaction,
} from "../redux/slices/transactionSlice";

import {
  doHttpPost,
  doHttpPostMultipart,
  doHttpDelete,
  doHttpPostWithAuth,
  doHttpGetWithAuth,
  doHttpGetWithoutAuth,
  doHttpPut,
  doHttpPutWithAuth,
} from "./HttpUtils";
export const loginUser = (data) => {
  return doHttpPost(data, ENDPOINTS.LOGIN);
};
export const getTeamDetails = (id) => {
  return doHttpGetWithoutAuth(ENDPOINTS.GETTEAMDETAILS + id);
};

export const joinTeamRequest = (token, data) => {
  return doHttpPostWithAuth(token, data, ENDPOINTS.JOIN_TEAM);
};
export const registerUser = (data) => {
  return doHttpPost(data, ENDPOINTS.REGISTERUSER);
};
export const registerSocialUser = (data) => {
  return doHttpPost(data, ENDPOINTS.REGISTER_SOCIAL_USER);
};
export const sendOtp = (data) => {
  return doHttpPost(data, ENDPOINTS.SENDOTP);
};
export const resendOTP = (data) => {
  return doHttpPost(data, ENDPOINTS.RESENDOTP);
};
export const verifyOTP = (data) => {
  return doHttpPost(data, ENDPOINTS.VERIFY_OTP);
};
export const forgotPassword = (data) => {
  return doHttpPost(data, ENDPOINTS.FORGOT_PASSWORD);
};
export const verifyForgotOTP = (data) => {
  return doHttpPost(data, ENDPOINTS.VERIFYFORGOTOTP);
};
export const resetForgotPassword = (data) => {
  return doHttpPost(data, ENDPOINTS.RESETFORGOTPASSWORD);
};
export const googleSign = (data) => {
  return doHttpPost(data, ENDPOINTS.GOOGLESIGNIN);
};
export const getUserDetails = (token, id) => {
  doHttpGetWithAuth(token, ENDPOINTS.GETSINGLEUSERDETAILS + id)
    .then((res) => {})
    .catch((error) => {
      console.log("error ", error);
    });
};

export const getTransactions = (token, query, id, callback) => {
  console.log("query ", query);
  dispatch(setLoading(true));
  doHttpGetWithAuth(token, "transactions" + query)
    .then((res) => {
      dispatch(updateTransactions(res?.data?.data?.transactions));
      dispatch(setLoading(false));
      dispatch(setIsFilterApplied(false));
      callback(res?.data?.data?.transactions);
    })
    .catch((error) => {
      console.log("get transactions error ", error);
      dispatch(updateTransactions([]));
      dispatch(setLoading(false));
    });
};

export const getBalanceDetails = (token, query) => {
  console.log("dddd ", query);
  dispatch(setLoading(true));
  doHttpGetWithAuth(token, ENDPOINTS.GETBALANCEDETAILS + query)
    .then((res) => {
      const { balance, tipsReceived, remainingBalance, todaysBalance } =
        res?.data?.data;

      dispatch(
        setBalanceDetails({
          totalBalance: tipsReceived,
          todaysBalance: todaysBalance,
          remainingBalance: tipsReceived,
        })
      );
      dispatch(setLoading(false));
    })
    .catch((error) => {
      console.log("error", error);
      dispatch(updateTransactions([]));
      dispatch(setLoading(false));
    });
};

export const applyFilters = (token, query, startDate, endDate) => {
  console.log("start filter ", startDate, "   end Date ", endDate);
  dispatch(setLoading(true));

  console.log("query filter  ", ENDPOINTS.APPLYFILTERS + query);

  doHttpGetWithAuth(token, ENDPOINTS.APPLYFILTERS + query)
    .then((res) => {
      console.log("filters transaction ", res?.data?.data?.transactions);
      dispatch(updateTransactions(res?.data?.data?.transactions));
      dispatch(setIsFilterApplied(true));
      dispatch(setLoading(false));
      dispatch(updateFilterFrom(startDate));
      dispatch(updateFilterTo(endDate));
    })
    .catch((error) => {
      console.log("error apply filters ", error);
    });
};

export const getInbox = (token, id) => {
  doHttpGetWithAuth(token, ENDPOINTS.GETMESSAGEINBOX + id)
    .then((res) => {
      console.log("data  for inbox ", res);
    })
    .catch((error) => {
      console.log("error  for inbox ", error);
    });
};

export const getChatWithUser = (token, senderId, reciverId) => {
  doHttpGetWithAuth(
    token,
    ENDPOINTS.GETCHATWITHSINGLEUSER + senderId + "&receiverId=" + reciverId
  )
    .then((res) => {
      console.log("single user chat");
    })
    .catch((error) => {
      console.log("error on get single chat ", error);
    });
};

export const addFeedback = (token, data) => {
  return doHttpPost(token, data, ENDPOINTS.ADDFEEDBACK);
};
export const createStripeConnectLink = (token) => {
  return doHttpGetWithAuth(token, ENDPOINTS.CREATESTRIPELLINK);
};

export const getStripe = (token) => {
  return doHttpGetWithAuth(token, ENDPOINTS.GETSTRIPELINK);
};

export const getPayDetails = (token, payeeCode) => {
  return doHttpGetWithAuth(token, ENDPOINTS.GETPAYEEDETAILS + payeeCode); //have to update yet
};

export const getThreadList = (token, pageId) => {
  return doHttpGetWithAuth(token, ENDPOINTS.CHAT_THREADS + pageId);
};

export const getSignleThreadChat = (token, charRoomId) => {
  return doHttpGetWithAuth(
    token,
    ENDPOINTS.GET_SIGNLE_THREAD_CHAT + `chatRoomId=${charRoomId}`
  );
};
export const sendMessage = (token, data) => {
  return doHttpPostWithAuth(token, data, ENDPOINTS.SEND_MESSGAE);
};

export const addCard = (token, data) => {
  return doHttpPostWithAuth(token, data, ENDPOINTS.SAVECARD); //have to update yet
};

export const gePayeeDetail = (id) => {
  return doHttpGetWithAuth(token, ENDPOINTS.GETPAYDETAIL + id);
};

export const createTranscation = (token, data) => {
  console.log("payload for createTransaction ", data);

  return doHttpPostWithAuth(token, data, ENDPOINTS.CREATE_TRANCATION);
};

export const getStripeToken = async (number, month, year, cvc, name) => {
  const card = {
    "card[number]": number,
    "card[exp_month]": month,
    "card[exp_year]": year,
    "card[cvc]": cvc,
    "card[name]": name,
  };
  // pk_live_51N3G7KH3CgfJQbH9oOe2zba2yBt21edBEsNMaKSVtGZnv1IxzdiZ4Y8jtIpdA7ySgl4G7K9Dlufhn8awjkJAFfco00i7lpd1YF
  return await fetch(`https://api.stripe.com/v1/tokens`, {
    headers: {
      Accept: "application/json",
      "Content-Type": "application/x-www-form-urlencoded",
      Authorization: `Bearer pk_live_51N3G7KH3CgfJQbH9oOe2zba2yBt21edBEsNMaKSVtGZnv1IxzdiZ4Y8jtIpdA7ySgl4G7K9Dlufhn8awjkJAFfco00i7lpd1YF`,
    },
    method: "post",
    body: Object.keys(card)
      .map((key) => key + "=" + card[key])
      .join("&"),
  }).then((response) => response.json());
};

export const getCardList = (token, data) => {
  return doHttpPostWithAuth(token, data, ENDPOINTS.CARD_LISTING);
};

export const getTeamRequests = (token, teamCode) => {
  return doHttpGetWithAuth(token, ENDPOINTS.GETTEAMREQUESTS + teamCode); //end points for team requests
};
export const getTeamMembers = (token, id) => {
  return doHttpGetWithAuth(token, ENDPOINTS.GETTEAMMEMBERS + id);
};
export const sendInvite = (token, data) => {
  return doHttpPostWithAuth(token, data, ENDPOINTS.SENDINVITE);
};

export const getTeamMemeberWithCode = (token, teamCode) => {
  return doHttpGetWithAuth(token, ENDPOINTS.TEAMMEMBERWITHCODE + teamCode);
};

export const approveRejectRequests = (token, userId, data) => {
  return doHttpPutWithAuth(token, data, ENDPOINTS.CHANGESTATUSMEMBER + userId);
};

export const changeTeamMemberStatus = (token, userId, data) => {
  return doHttpPutWithAuth(token, data, ENDPOINTS.CHANGE_TEAM_STATUS);
};

export const makeTeamAdmin = (token, data) => {
  return doHttpPostWithAuth(token, data, ENDPOINTS.MAKE_TEAM_ADMIN);
};

export const updateUserName = (token, data, id) => {
  return doHttpPostWithAuth(token, data, ENDPOINTS.UPDATE_USERNAME + id);
};

export const makePaymentAsGuest = (data) => {
  return doHttpPost(data, ENDPOINTS.MAKE_PAYMENT_GUEST);
}; //have to update yet
export const teamMemberDetail = (token, teamId, userId, teamCode) => {
  console.log(
    "endpoint ",
    ENDPOINTS.TEAM_MEMEBER_DETAIL +
      `?page=1&toTeamId=${teamId}&userId=${userId}&teamCode=${teamCode}`
  );
  return doHttpGetWithAuth(
    token,
    ENDPOINTS.TEAM_MEMEBER_DETAIL +
      `?page=1&toTeamId=${teamId}&userId=${userId}&teamCode=${teamCode}`
  );
};

export const createBankToken = (token, userId, teamId) => {
  console.log("payeeDetails id ", userId, "payee details ", teamId);
  return doHttpGetWithAuth(
    token,
    ENDPOINTS.GETBANKTOKEN + `?userId=${userId}&toTeamId=${teamId}`
  );
};

export const getNotifications = (token) => {
  return doHttpGetWithAuth(token, ENDPOINTS.NOTIFICATIONS);
};
export const addFeedBack = (token, data) => {
  dispatch(setLoading(true));
  doHttpPostWithAuth(token, data, ENDPOINTS.FEEDBACK_API)
    .then((res) => {
      dispatch(
        updateTransaction({
          response: res.data.data.transactionFeedback,
        })
      );
      dispatch(setLoading(false));
    })
    .catch((error) => {
      console.log("error of send feedback or acknowlegement ", error);
      dispatch(setLoading(false));
    });
};

export const addFeedBackAsGuest = (token, data) => {
  return doHttpPostWithAuth(token, data, ENDPOINTS.FEEDBACK_API);
};
export const initalSocialLogin = (data) => {
  return doHttpPost(data, ENDPOINTS.INITAL_SOCIAL);
};
export const saveReports = async (
  currentSymbol,
  user,
  transactions,
  filterTxt,
  t
) => {
  let teamDetail = null;
  if (user?.accountType == "teamMember") {
    let { success, data } = await getTeamDetails(user?.userTeam?.teamCode);

    if (data?.success) {
      teamDetail = data?.data?.team;
    } else teamDetail = null;
    console.log("team details ", data);
  }

  var transactionRows = transactions.map(function (transaction) {
    // <td style="text-align:center;">$${transaction?.plateFormFee || ""}</td>
    console.log("transacrion in ", transaction);
    return `
      <tr style='text-align:center;'>
        <td style="text-align:center;">${transaction.id}</td>
        <td style="text-align:center;width:160px;">${dateAndTime(
          transaction.createdAt
        )}</td>
        <td style="text-align:center;">${currentSymbol}${user?.id == transaction?.payerId ? parseFloat(transaction?.payerAmount).toFixed(2) : parseFloat(transaction?.payeeAmount).toFixed(2)}</td>

        <td style="text-align:center;">${
          transaction?.referpayee
            ? transaction?.referpayee?.firstName +
              " " +
              transaction?.referpayee?.lastName +
              " " +
              "@" +
              transaction?.referpayee?.username
            : transaction?.payee?.username
        }</td>
        <td style="text-align:center;">${
          transaction?.payer?.username ? transaction?.payer?.username : "Guest"
        }</td>
        <td style="text-align:center;">${
          transaction?.payerRating ? transaction?.payerRating : ""
        }</td>
        <td style="text-align:left;">${
          transaction?.feedback ? transaction?.feedback?.feedbackText : ""
        }</td>
      
      </tr>
    `;
  });
  let dataAndTime = moment(new Date()).format("lll");
  dataAndTime = dataAndTime.replace(", ", " ");
  dataAndTime = dataAndTime.replace(/[: ]/g, "_");
  dataAndTime = dataAndTime.replace(/[,]/g, "");
  // let teamName = teamDetail ? teamDetail?.teamName : "";

  let teamName = user?.teamName ? user?.teamName : "";

  let teamDetails =
    user.accountType == "teamMember"
      ? "Team Details:" + teamName + " (" + user?.userTeam?.teamCode + ")"
      : "Team Details:" +
        user?.team?.teamName +
        " (" +
        user?.team?.teamCode +
        ")";
  let options = {
    html: `<html>
    <head>
      <meta charset="UTF-8">
      <title>EasyTipping</title>
      <style>
        body {
          font-family: Montserrat, sans-serif;
          color: #000000;
        }
        table {
          border: #36c755 solid 1px;
          width: 100%;
          max-width: 800px;
          margin: auto;
          font-family: Arial, sans-serif;
          font-size: 16px;
          color: #444;
          padding-top: 20px;
          padding-left: 20px;
          padding-right: 20px;
          padding-right:  0px;
        }
        th {
          color: white;
          background-color: #499662;
          padding: 10px;
        }
      </style>
    </head>
    <body>
      <!-- Top banner section -->
      <table style="width: 100%;">
        <tr>
          <td>
            <h2 style="color: #499662;">EasyTipping</h2>
          </td>
        </tr>

        <tr>
        <td style="margin:0px;">
            <h4 style="color: #499662;margin:0px;">${t(
              "Transaction History"
            )}: ${user?.username} ${
      user?.rating ? " (" + user?.rating + " " + `${t("Star Rating")}` : ""
    }</h4>
          
          </td>
          
        </tr>
        <tr>
        <tr>
        <td style="margin:0px;">
            <h4 style="color: #499662;margin:0px;"> ${
              user?.accountType == "team" || user?.accountType == "teamMember"
                ? teamDetails
                : ""
            }</h4>
          
          </td>
          
        </tr>
        <tr>
    
        <tr>
          <td style="margin:0px;">
            <h4 style="color: #499662;margin:0px;">${t(
              "From"
            )}: ${filterTxt}</h4>
          </td>
          <td style="text-align: right;">
            <p><span style="border-bottom:#499662 dotted 2px; width: 123px;"><span style="font-weight: bold;">${t(
              "Date"
            )}:</span> ${dateAndTime(new Date())}</span></p>
          </td>
        </tr>
        <tr>
            
        <table style="width: 100%; padding: 0px ;">
            <tr style="text-align: center;">
                <th>${t("Transaction ID")}</th>
                <th >${t("Transaction Date")}</th>
                <th>${t("Amount")}</th>
               
                <th>${t("Tip Receiver")}</th>
                <th>${t("Tip Giver")}</th>
                <th>${t("Rating")}</th>
                <th>${t("Feedback")}</th>
               
               
            </tr>
            <tr>
                <td> ${transactionRows.join("")}</td>
            </tr>
            
            </table>
           
        </tr>
      </table>
      <br><br><br><br>
    
    </body>
    </html>`,
    fileName: "reports",
    directory: "Documents",
  };
  let file = await RNHTMLtoPDF.convert(options);

  const downloadPath = `${
    Platform.OS == "ios"
      ? RNFS.DocumentDirectoryPath
      : RNFS.DownloadDirectoryPath
  }/${dataAndTime + "Reports.pdf"}`;

  if (Platform.OS == "android") {
    openFile(file.filePath, downloadPath);
  } else {
    try {
      openFile(file.filePath, downloadPath);
    } catch (error) {
      console.log("Error saving PDF file:", error);
    }
  }
};

export const deleteAccount = (token, id) => {
  return doHttpDelete(token, ENDPOINTS.DELETE_ACCOUNT + id);
};
export const sendMessageToSupport = (token, data) => {
  return doHttpPostWithAuth(token, data, ENDPOINTS.CONTACT_US);
};

export const updateBusinessDetails = (token, data, id) => {
  return doHttpPutWithAuth(token, data, ENDPOINTS.UPDATE_BUSINESS_DETAILS + id);
};
export const changeDefaultCurrency = (token, data) => {
  return doHttpPostWithAuth(token, data, ENDPOINTS.CHANGE_CURRENCY);
};
export const getMyDetails = (token, params) => {
  return doHttpGetWithAuth(token, ENDPOINTS.GET_MY_DETAILS + params);
};
export const createPaymentIntent = (token, data) => {
  return doHttpPostWithAuth(token, data, ENDPOINTS.CREATE_PAYMENT_INTENT);
};
export const verifyPaymentIntent = (token, data) => {
  return doHttpPostWithAuth(token, data, ENDPOINTS.VERIFY_PAYMENT_INTENT);
};

export const getGeoLocationBasedCurrency = (token, data) => {
  return doHttpPostWithAuth(token, data, ENDPOINTS.GET_GEO_LOCATION_CURRENCY);
};

function splitAndJoinString(inputString, chunkSize) {
  const words = inputString.split(" "); // Split the input string into words.

  const chunkedArray = [];
  for (let i = 0; i < words.length; i += chunkSize) {
    const chunk = words.slice(i, i + chunkSize).join(" ");
    chunkedArray.push(chunk);
  }

  const resultString = chunkedArray.join(" \x0D "); // Join the chunks back together with spaces.
  return resultString;
}

export const createCSVReports = (
  currentSymbol,
  user,
  transactions,
  filterTxt,
  t
) => {
  const headerString = `${t("Transaction ID")},${t("Transaction Date")},${t(
    "Amount"
  )}(${currentSymbol}),${t("Tip Receiver")},${t("Tip Giver")},${t(
    "Rating"
  )},${t("Feedback")},\n`;
  const rows = transactions
    .map((data) => {
      return `"${data.id}","${dateAndTime(data.createdAt)}",${
        user?.id == data?.payerId ? data?.payerAmount : data?.payeeAmount
      },"${
        data?.referpayee
          ? data?.referpayee?.firstName +
            " " +
            data?.referpayee?.lastName +
            " " +
            "@" +
            data?.referpayee?.username
          : data?.payee?.username
      }","${data?.payer?.username ? data?.payer?.username : "Guest"}","${
        data?.payerRating ? data?.payerRating : ""
      }","${
        data?.feedback
          ? splitAndJoinString(data?.feedback?.feedbackText, 5)
          : ""
      }",\n`;
    })

    .join("");
  const CSVString = `${headerString}${rows}`;
  let dataAndTime = moment(new Date()).format("lll");
  dataAndTime = dataAndTime.replace(", ", " ");
  dataAndTime = dataAndTime.replace(/[: ]/g, "_");
  dataAndTime = dataAndTime.replace(/[,]/g, "");
  const downloadPath = `${
    Platform.OS == "ios"
      ? RNFetchBlob.fs.dirs.DocumentDir
      : RNFetchBlob.fs.dirs.DownloadDir
  }/${dataAndTime + "Reports.csv"}`;

  RNFetchBlob.fs
    .writeFile(downloadPath, CSVString, "utf8")
    .then((success) => {
      openFile(downloadPath, downloadPath);
      console.log("FILE WRITTEN!", success);
    })
    .catch((err) => {
      console.log(err.message);
    });

  console.log("final string si ", CSVString);
};

async function requestWritePermission() {
  try {
    const granted = await PermissionsAndroid.request(
      PermissionsAndroid.PERMISSIONS.WRITE_EXTERNAL_STORAGE,
      {
        title: "Write Permission",
        message: "Your app needs write permission to save files.",
        buttonPositive: "OK",
      }
    );
    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
      return true;
      // You can perform write operations here
    } else {
      console.log("Write permission denied.");
      return false;
    }
  } catch (error) {
    console.log("Error while requesting write permission:", error);
    return true;
  }
}

const openFile = (localPath, downloadPath) => {
  const path = FileViewer.open(localPath) // absolute-path-to-my-local-file.
    .then(() => {
      // success
    })
    .catch(async (error) => {
      Alert("There is no application available to open this document.");
      if (await requestWritePermission()) {
        try {
          console.log("data is ", localPath, downloadPath);
          await RNFS.copyFile(localPath, downloadPath);
          setTimeout(() => {
            Alert("Reports downloaded successfully.", "success");
          }, 500);
        } catch (error) {
          console.log("Error saving PDF file:", error);
        }
      }
      console.log("error while opening file ", error);
      // error
    });
};

export const buySubscription = (token, data) => {
  return doHttpPostWithAuth(token, data, ENDPOINTS.BUY_SUBSCRIPTION);
};
export const cancelSubscription = (token, data) => {
  return doHttpPostWithAuth(token, data, ENDPOINTS.CANCEL_SUBSCRIPTION);
};

export const getSubscriptionPayment = (token) => {
  return doHttpGetWithAuth(token, ENDPOINTS.GET_PAYMENT_FOR_SUBSCRIPTION);
};
export const getSubscriptionPaymentMethod = (token) => {
  return doHttpGetWithAuth(token, ENDPOINTS.GET_PAYMENT_METHOD);
};

export const getMyTeams = (token, id) => {
  return doHttpGetWithAuth(token, ENDPOINTS.MY_TEAMS + id); //have to update yet
};

export const removeCard = (token, id) => {
  return doHttpDelete(token, ENDPOINTS.REMOVECARD + id);
};

export const getCurrentVersion = () => {
  return doHttpGetWithoutAuth(ENDPOINTS.GET_CURRENT_VERSION);
};
