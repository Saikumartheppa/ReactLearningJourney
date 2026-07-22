import styles from "./style.module.scss";
export const validateInterests = (data) => {
  const errors = {};
  if (!data.interests?.length) {
    errors.interests = "Select at least one interest";
  }
  return errors;
};
export const Interests = ({data , setData , errors}) => {
    const {interests=[]} = data;
    const handleOnChange = (e) => {
       const {name , checked} = e.target;
       setData((prev) => {
       const currentInterests = prev.interests || [];
       return {
        ...prev,
        interests: checked ? [...currentInterests, name] : currentInterests.filter((i) => i !== name)
       }
    })
    }
    return (<div>
        <div>
            <label>
                <input type="checkbox" name="coding" checked={interests?.includes("coding")} onChange={handleOnChange}/>
                Coding
            </label>
        </div>
        <div>
            <label>
                <input type="checkbox" name="music" checked={interests?.includes("music")} onChange={handleOnChange}/>
                Music
            </label>
        </div>
        <div>
            <label>
                <input type="checkbox" name="dance" checked={interests?.includes("dance")} onChange={handleOnChange}/>
                Dance
            </label>
        </div>
         {errors.interests && <p className={styles.tabform__showError}>{errors.interests}</p>}
    </div>)
}