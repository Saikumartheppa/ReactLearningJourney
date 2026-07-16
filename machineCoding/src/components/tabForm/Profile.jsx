export const Profile = ({data , setData}) => {
    const {name , age , email } = data; 
    const handleOnChange = (e , item) => {
        setData((prev) => ({
            ...prev,
            [item]: e.target.value,
        }))
    }
    return (<div>
        <div>
            <label>Name :</label>
            <input type="text" value={name} placeholder="Enter your name" onChange={(e)=> handleOnChange(e , "name")}></input>
        </div>
        <div>
            <label>Age :</label>
            <input type="number" value={age} placeholder="Enter your age" onChange={(e)=> handleOnChange(e , "age")}></input>
        </div>
        <div>
            <label>Email :</label>
            <input type="text" value={email} placeholder="Enter your email" onChange={(e)=> handleOnChange(e , "email")}></input>
        </div>
    </div>)
}