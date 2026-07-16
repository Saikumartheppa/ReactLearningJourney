import { useState } from "react";
import styles from "./style.module.scss";
import { TABS as tabs } from "../../components";
const TabForm = () => {
  const [activeTab , setActiveTab] = useState(0);
  const [data , setData] = useState({
  });
  const ActiveTabComponent = tabs[activeTab].component;
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
    </div>
  );
};
export default TabForm;
