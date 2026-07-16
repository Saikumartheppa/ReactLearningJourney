export const Interests = ({data , setData}) => {
    const {interests=[]} = data;
    const handleOnChange = (e) => {
       const {name , checked} = e.target;
       setData((prev) => ({
        ...prev,
        interests: checked ? [...prev.interests , name] : prev.interests?.filter((i) => i !== name)
       }))
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
    </div>)
}