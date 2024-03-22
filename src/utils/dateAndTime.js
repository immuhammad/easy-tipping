import moment from "moment";
const dateAndTime = (date, format) => {
  const formattedDate = moment(date).local().format("MMM D YYYY"); // Format the date part
  const formattedTime = moment(date).local().format("HH:mm");
  return format
    ? moment(date).local().format(format)
    : `${formattedDate}/${formattedTime}`;
};
export default dateAndTime;
