import { createNativeStackNavigator } from "@react-navigation/native-stack"
import Screens from "../screens"

const Stack = createNativeStackNavigator()
export default ()=>{
    return (
        <Stack.Navigator
            screenOptions={{
                headerShown: false
            }}
        >   
            <Stack.Screen name="Home" component={Screens.HomeScreen}></Stack.Screen>
            <Stack.Screen name="Camera" component={Screens.CameraScreen}></Stack.Screen>
        </Stack.Navigator>
    )
}