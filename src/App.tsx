import { NavigationContainer } from "@react-navigation/native"
import AppNavigator from "./navigation"

const App =()=>{
    return (
        <NavigationContainer>
            <AppNavigator/>
        </NavigationContainer>
    )
}



export default App