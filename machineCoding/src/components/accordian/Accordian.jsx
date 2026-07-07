import { useState } from "react";
import styles from "./style.module.scss";
import DOWNARROW_ICON from "../../assets/downArrow.svg";
const Accordian = (props) => {
  const { items } = props;
  const [showIndex, setShowIndex] = useState(null);
  const handleToggle = (index) => {
    setShowIndex(showIndex == index ? null : index);
  };
  return (!items || !items.length) ? "No Available Items" :  (
    <div className={styles.accordian}>
      {items?.map((item, index) => {
        return (
          <div key={item.title} className={styles.accordian__item}>
            <button
              className={styles.accordian__title}
              onClick={() => handleToggle(index)}
            >
              {item?.title}
              <img
                className={`${styles["arrow"]} ${showIndex === index ? styles["upArrow"] : styles["downArrow"]}`}
                src={DOWNARROW_ICON}
                alt="arrow"
              />
            </button>
            {showIndex === index && (
              <p className={styles["accordian__content"]}>{item?.content}</p>
            )}
          </div>
        );
      })}
    </div>
  );
};
export default Accordian;
