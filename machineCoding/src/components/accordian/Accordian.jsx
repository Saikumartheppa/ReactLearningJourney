import { useState } from "react";
import AccordianItem from "./AccordianItem";
import styles from "./style.module.scss";

// Basic 

// const Accordian = (props) => {
//   const { items } = props;
//   const [showIndex, setShowIndex] = useState(0);
//   const handleToggle = (index) => {
//     setShowIndex(prev => prev == index ? null : index)
//   }
//   return (!items || !items.length) ? "No Available Items" :  (
//     <div className={styles.accordian}>
//       {items.map((item, index) => {
//         return <AccordianItem key={item?.index} item={item} showItem={showIndex == index} setShowIndex={()=> handleToggle(index)} />
//       })}
//     </div>
//   );
// };



// To show all items by default
// const Accordian = ({ items }) => {
  //   const [openIndexes, setOpenIndexes] = useState(
    //     items?.map((_, index) => index) || []
    //   );

    //   const handleToggle = (index) => {
//     setOpenIndexes((prev) => {
  //       if (prev.includes(index)) {
//         return prev.filter((i) => i !== index);
//       }

//       return [...prev, index];
//     });
//   };

//   if (!items?.length) {
  //     return <p>No Available Items</p>;
  //   }
  
  //   return (
    //     <div className={styles.accordian}>
    //       {items.map((item, index) => (
//         <AccordianItem
//           key={item.id ?? index}
//           item={item}
//           showItem={openIndexes.includes(index)}
//           onToggle={() => handleToggle(index)}
//         />
//       ))}
//     </div>
//   );
// };

const Accordian = (props) => {
  const { items , allowMultipleItemsOpen , defaultOpenItems} = props;
  console.log(defaultOpenItems);
  const [openIndexes, setOpenIndexes] = useState((defaultOpenItems || []).filter(
        index => index >= 0 && index < items.length
    ));
  const handleToggle = (index) => {
    setOpenIndexes((prev) => {
    if (allowMultipleItemsOpen) {
      return prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index];
    }
     return prev.includes(index)
            ? []
            : [index];
  });
  }
  return (!items || !items.length) ? "No Available Items" :  (
    <div className={styles.accordian}>
      {items.map((item, index) => {
        return <AccordianItem key={item?.id} item={item} showItem={openIndexes.includes(index)} onToggle={()=> handleToggle(index)} />
      })}
    </div>
  );
};
 
export default Accordian;
