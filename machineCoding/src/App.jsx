import { Accordian , ACCORDIAN_ITEMS } from "./components";
function App() {
  return (
    <Accordian items={ACCORDIAN_ITEMS} allowMultipleItemsOpen={true} defaultOpenItems={[1,2]}/>
  )
}
export default App;
