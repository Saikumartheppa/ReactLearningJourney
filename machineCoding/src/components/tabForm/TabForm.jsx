import { useState } from "react";
import styles from "./style.module.scss";
import { TABS as tabs } from "../../components";
const TabForm = () => {
  const [activeTab , setActiveTab] = useState(0);
  const [data , setData] = useState({
  });
  const ActiveTabComponent = tabs[activeTab].component;
  const handlePrevClick = () => {
    setActiveTab((prev) => prev - 1)
  };
  const handleNextClick = () => {
    setActiveTab((prev) => {
       return prev + 1;
    })
  };
  const handleSubmitClick = () => {
    console.log("Submit Data");
  };
  return (
    <div className={styles["tabform"]}>
      <div className={styles["tabform__container"]}>
        {tabs.map((t , index) => (
          <div key={t.name} className={`${styles["tabform__heading"]} ${index === activeTab ? styles["tabform__heading--activetab"] : ""}`} onClick={() => setActiveTab(index)}>{t.name}</div>
        ))}
      </div>
      <div className={styles["tabform__body"]}>
        <ActiveTabComponent data={data} setData={setData}/>
      </div>
      <div className={styles["tabform__btn-container"]}>
        <button className={styles["tabform__btn"]} disabled={activeTab === 0} onClick={handlePrevClick}>Prev</button>
        <button className={styles["tabform__btn"]} disabled={activeTab === tabs.length - 1} onClick={handleNextClick}>Next</button>
        <button className={styles["tabform__btn"]} disabled={activeTab !==  tabs.length - 1} onClick={handleSubmitClick} >Submit</button>
      </div>
    </div>
  );
};
export default TabForm;
