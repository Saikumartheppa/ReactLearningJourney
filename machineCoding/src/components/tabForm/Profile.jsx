import styles from "./style.module.scss";
export const validateProfile = (data)=> {
    const err = {};
    if(!data.name || data.name.length < 3){
        err.name = "Name is not Valid";
    }
    if(!data.age || data.age < 18){
        err.age = "Age is not Valid";
    }
    if(!data.email || data.email.length < 3){
        err.email = "Email is not Valid";
    }
    return err;
}
export const Profile = ({data , setData , errors}) => {
    const {name , age , email } = data; 
    const handleOnChange = (e , item ) => {
        setData((prev) => ({
            ...prev,
            [item]: e.target.value,
        }))
    }
    return (<div>
        <div>
            <label>Name :</label>
            <input type="text" value={name} placeholder="Enter your name" onChange={(e)=> handleOnChange(e , "name")}></input>
           {errors.name && <p className={styles.tabform__showError}>{errors.name}</p>}
        </div>
        <div>
            <label>Age :</label>
            <input type="number" value={age} placeholder="Enter your age" onChange={(e)=> handleOnChange(e , "age")}></input>
           {errors.age && <p className={styles.tabform__showError}>{errors.age}</p>}
        </div>
        <div>
            <label>Email :</label>
            <input type="text" value={email} placeholder="Enter your email" onChange={(e)=> handleOnChange(e , "email")}></input>
           {errors.email && <p className={styles.tabform__showError}>{errors.email}</p>}
        </div>
    </div>)
}