import { useEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
const OTPInput = ({ otpDigits }) => {
  const [inputArr, setInputArr] = useState(new Array(otpDigits).fill(""));
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [otpValidationError, setOtpValidationError] = useState("");
  const refArr = useRef([]);
  const clearOTP = () => {
    setInputArr(new Array(otpDigits).fill(""));
  };
  const handleOTPComplete = async (otp) => {
    try {
      setIsSubmitting(true);
      setOtpValidationError("");
      const response = await fetch("https://dummyjson.com/tests");
      if (!response.ok) {
        throw new Error("OTP validation failed");
      }
      const data = await response.json();
      return data;
    } catch (error) {
      setOtpValidationError(error.message);
      clearOTP();
    } finally {
      setIsSubmitting(false);
    }
  };
  const checkOTPComplete = (otpInputArr) => {
    if (otpInputArr.every((input) => input !== "")) {
      handleOTPComplete?.(otpInputArr.join(""));
    }
  };
  const isDigit = (char) => {
    return char >= "0" && char <= "9";
  };
  const filterOnlyDigits = (unfilteredText) => {
    const filteredText = Array.from(unfilteredText)
      .filter((char) => isDigit(char))
      .join("");
    return filteredText;
  };
  const handleOnChange = (value, index) => {
    if (value && !isDigit(value)) {
      return;
    }
    const newArr = [...inputArr];
    newArr[index] = value.slice(-1);
    setInputArr(newArr);
    checkOTPComplete(newArr);
    value && refArr.current[index + 1]?.focus();
  };
  const handleOnKeyDown = (e, index) => {
    if (!e.target.value && e.key === "Backspace") {
      refArr.current[index - 1]?.focus();
    }
  };
  const handleOnPaste = (e, startIndex) => {
    e.preventDefault();
    const pastedText = e.clipboardData.getData("text").trim();
    const digits = filterOnlyDigits(pastedText);
    if (!digits) return;
    const newArr = [...inputArr];
    const availableSlots = inputArr.length - startIndex;
    const digitsToPaste = digits.slice(0, availableSlots);
    digitsToPaste.split("").forEach((digit, index) => {
      newArr[startIndex + index] = digit;
    });
    setInputArr(newArr);
    checkOTPComplete(newArr);
    const nextIndex = startIndex + digitsToPaste.length;
    if (nextIndex < inputArr.length) {
      refArr.current[nextIndex]?.focus();
    } else {
      refArr.current[inputArr.length - 1]?.focus();
    }
  };
  useEffect(() => {
    if (!isSubmitting && otpValidationError) {
      refArr.current[0]?.focus();
    }
  }, [isSubmitting, otpValidationError]);
  useEffect(() => {
    refArr.current[0]?.focus();
  }, []);
  return (
    <div className={styles["otp-container"]}>
      <h2 className={styles["otp-container__heading"]}>Validate OTP</h2>
      {inputArr.map((input, index) => {
        return (
          <input
            className={`${styles["otp-container__input"]} ${isSubmitting ? styles["otp-container__input--disable"] : ""}`}
            key={index}
            type="text"
            inputMode="numeric"
            maxLength={1}
            disabled={isSubmitting}
            value={input}
            ref={(input) => (refArr.current[index] = input)}
            onChange={(e) => handleOnChange(e.target.value, index)}
            onKeyDown={(e) => handleOnKeyDown(e, index)}
            onPaste={(e) => handleOnPaste(e, index)}
          />
        );
      })}
      {otpValidationError && (
        <p className={styles["otp-container__error"]}>{otpValidationError}</p>
      )}
    </div>
  );
};
export default OTPInput;
