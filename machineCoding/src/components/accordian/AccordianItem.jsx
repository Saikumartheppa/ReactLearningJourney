import { useLayoutEffect, useRef, useState } from "react";
import styles from "./style.module.scss";
import DOWNARROW_ICON from "../../assets/downArrow.svg";
// Basic
// const AccordianItem = ({item , showItem , onToggle }) => {
//     return ( <div className={styles.accordian__item}>
//             <button
//               className={styles.accordian__title}
//               onClick={onToggle}
//             >
//               {item?.title}+
//               <img
//                 className={`${styles["arrow"]} ${showItem ? styles["upArrow"] : styles["downArrow"]}`}
//                 src={DOWNARROW_ICON}
//                 alt="arrow"
//               />
//             </button>
//             {showItem && (
//               <p className={styles["accordian__content"]}>{item?.content}</p>
//             )}
//           </div>);
// }

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

// with Animation 
const AccordianItem = ({ item, showItem, onToggle }) => {
  const contentRef = useRef(null);
  const [height, setHeight] = useState(showItem ? "auto" : 0);

  useLayoutEffect(() => {
    const node = contentRef.current;
    console.log(node);

    if (!node) return;

    if (showItem) {
      // Expand
      const scrollHeight = node.scrollHeight;

      setHeight(scrollHeight);

      const timeout = setTimeout(() => {
        setHeight("auto");
      }, 300); // Match CSS transition duration

      return () => clearTimeout(timeout);
    } else {
      // Collapse

      // First fix the height
      const scrollHeight = node.scrollHeight;
      setHeight(scrollHeight);

      // Then animate to 0
      requestAnimationFrame(() => {
        setHeight(0);
      });
    }
  }, [showItem]);

  return (
    <div className={styles.accordian__item}>
      <button
        className={styles.accordian__title}
        onClick={onToggle}
      >
        {item.title}

        <img
          className={`${styles.arrow} ${
            showItem ? styles.upArrow : styles.downArrow
          }`}
          src={DOWNARROW_ICON}
          alt=""
        />
      </button>

      <div
        ref={contentRef}
        className={styles.accordian__body}
        style={{
          height: typeof height === "number" ? `${height}px` : height,
        }}
      >
        <div className={styles.accordian__content}>
          {item.content}
        </div>
      </div>
    </div>
  );
};

export default AccordianItem;

