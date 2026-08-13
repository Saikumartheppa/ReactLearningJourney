import { useState } from "react";
import styles from "./style.module.scss";
import {OTP_INPUT_DIGITS as otpInputDigits} from "../constants"
const OTPInput = ()=> {
    const [inputArr , setInputArr] = useState(new Array(otpInputDigits).fill(1));
    return <div className={styles["otp-container"]}>
        <h2 className={styles["otp-container__heading"]}>Validate OTP</h2>
        {inputArr.map((input , index) => {
            return <input className={styles["otp-container__input"]} key={index} type='number' aria-controls="none"/>
        })}
    </div>
}
export default OTPInput;