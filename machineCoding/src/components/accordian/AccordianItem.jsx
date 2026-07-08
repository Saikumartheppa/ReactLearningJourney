import styles from "./style.module.scss";
import DOWNARROW_ICON from "../../assets/downArrow.svg";
// Basic
const AccordianItem = ({item , showItem , onToggle }) => {
    return ( <div className={styles.accordian__item}>
            <button
              className={styles.accordian__title}
              onClick={onToggle}
            >
              {item?.title}+
              <img
                className={`${styles["arrow"]} ${showItem ? styles["upArrow"] : styles["downArrow"]}`}
                src={DOWNARROW_ICON}
                alt="arrow"
              />
            </button>
            {showItem && (
              <p className={styles["accordian__content"]}>{item?.content}</p>
            )}
          </div>);
}

// To show all items by default

// const AccordianItem = ({ item, showItem, onToggle }) => {
//   return (
//     <div className={styles.accordian__item}>
//       <button
//         className={styles.accordian__title}
//         onClick={onToggle}
//       >
//         {item.title}
//         <img
//           className={`${styles.arrow} ${
//             showItem ? styles.upArrow : styles.downArrow
//           }`}
//           src={DOWNARROW_ICON}
//           alt="arrow"
//         />
//       </button>

//       {showItem && (
//         <p className={styles.accordian__content}>
//           {item.content}
//         </p>
//       )}
//     </div>
//   );
// };

export default AccordianItem;

