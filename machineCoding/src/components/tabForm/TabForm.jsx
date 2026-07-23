import { useState } from "react";
import styles from "./style.module.scss";
import { TABS as tabs } from "../../components";
const TabForm = () => {
  const [activeTab , setActiveTab] = useState(0);
  const [data , setData] = useState({
  });
  const ActiveTabComponent = tabs[activeTab].component;
  const [errors, setErrors] = useState({});
  const allTabsValid = tabs.every((tab) => Object.keys(tab.validate(data)).length === 0);
  const validate = () => {
     const error =  tabs[activeTab].validate(data);
     setErrors(error);
    return Object.keys(error).length === 0; 
  }
  const handlePrevClick = () => {
    validate() && setActiveTab((prev) => prev - 1)
  };
  const handleNextClick = () => {
   validate() && setActiveTab((prev) => {
       return prev + 1;
    })
  };
  const handleSubmitClick = () => {
    if(validate()){
      console.log("Submit Data");
    }
  };
  return (
    <div className={styles["tabform"]}>
      <div className={styles["tabform__container"]}>
        {tabs.map((t , index) => (
          <div key={t.name} className={`${styles["tabform__heading"]} ${index === activeTab ? styles["tabform__heading--activetab"] : ""}`} onClick={() => validate() && setActiveTab(index)}>{t.name}</div>
        ))}
      </div>
      <div className={styles["tabform__body"]}>
        <ActiveTabComponent data={data} setData={setData} errors={errors}/>
      </div>
      <div className={styles["tabform__btn-container"]}>
        <button className={styles["tabform__btn"]} disabled={activeTab === 0} onClick={handlePrevClick}>Prev</button>
        <button className={styles["tabform__btn"]} disabled={activeTab === tabs.length - 1} onClick={handleNextClick}>Next</button>
        <button className={styles["tabform__btn"]} disabled={activeTab !==  tabs.length - 1 || !allTabsValid} onClick={handleSubmitClick} >Submit</button>
      </div>
    </div>
  );
};
export default TabForm;
