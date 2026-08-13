import { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import { OTP_INPUT_DIGITS as otpInputDigits } from "../constants";
const OTPInput = () => {
  const [inputArr, setInputArr] = useState(new Array(otpInputDigits).fill(""));
  const refArr = useRef([]);
  const handleOnChange = (value, index) => {
    if (isNaN(value)) {
      return;
    }
    const newArr = [...inputArr];
    newArr[index] = value.slice(-1);
    setInputArr(newArr);
    value.trim() && refArr.current[index + 1]?.focus();
  };
  const handleOnKeyDown = (e , index) => {
    if(!e.target.value && e.key === 'Backspace'){
        refArr.current[index - 1]?.focus();
    }
  }
  useEffect(() => {
    refArr.current[0]?.focus();
  }, []);
  return (
    <div className={styles["otp-container"]}>
      <h2 className={styles["otp-container__heading"]}>Validate OTP</h2>
      {inputArr.map((input, index) => {
        return (
          <input
            className={styles["otp-container__input"]}
            key={index}
            type="text"
            value={input}
            ref={(input) => (refArr.current[index] = input)}
            onChange={(e) => handleOnChange(e.target.value, index)}
            onKeyDown={(e) => handleOnKeyDown(e , index)}
          />
        );
      })}
    </div>
  );
};
export default OTPInput;
