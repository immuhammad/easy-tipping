import React from "react";
const Validations = {
  isEmail: (val) => {
    let reg = /^\w+([\.]?\w+)*@\w+([\.]?\w+)*(\.\w{2,3})+$/;

    return reg.test(val);
  },
  isValidPassword: (val) => {
    let reg =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[#$@!%&*?])[A-Za-z\d#$@!%&*?]{8,30}$/;
    return reg.test(val);
  },
  isValidName: (val) => {
    let reg = /[a-zA-Z][a-zA-Z ]+$/;
    return reg.test(val);
  },
  comparePassword: (val1, val2) => {
    return val1 === val2;
  },
  isValidUserName: (val) => {
    let reg = /^[a-zA-Z0-9]+([_-]?[a-zA-Z0-9])*$/;

    return reg.test(val);
  },
  isValidPhone: (val) => {
    let reg = /^(\d{2})?\d{10}$/;

    return reg.test(val);
  },
  isValidAmmount: (val) => {
    let reg = /^[.]?[0-9]+[.]?[0-9]*$/;
    return reg.test(val);
  },
};
export default Validations;
