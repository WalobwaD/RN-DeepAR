import { useEffect, useState, useRef, useMemo } from "react"
import { Linking, StyleSheet, View } from "react-native"
import {Computed} from "../constants/index"
import DeepARView, { Camera, CameraPermissionRequestResult, ErrorTypes, IDeepARHandle } from "react-native-deepar"

const CameraScreen = ({navigation}: {navigation: any})=>{

    const deepArRef = useRef<IDeepARHandle>(null)
    const [permsGranted, setPermsGranted] = useState(false)

    const getPermissions = async ()=>{
        const cameraPermission = await Camera.requestCameraPermission()
        const microphonePermission = await Camera.requestCameraPermission()
        
        const isCameraAllowed = cameraPermission === CameraPermissionRequestResult.AUTHORIZED
        const isMicAllowed = microphonePermission === CameraPermissionRequestResult.AUTHORIZED

        if (isCameraAllowed && isMicAllowed) {
            setPermsGranted(true)
        } else {
            Linking.openSettings()
        }
    }
    useEffect(()=>{
        getPermissions()
    }, [])


    const renderDeepArView = ()=>{
        if (permsGranted === false) {
            return null
        }
        return (
            <DeepARView
                ref={deepArRef}
                apiKey="c0e4496ca7de43e377da6d839b2ca50060ce1bb95bfa530ec5e4370906080180f22b296a64a5e035"
                videoWarmup = {false}
                style = {styles.deepARView}
                onError={(text: String, type: ErrorTypes) => {
                    console.log('onError =>', text, 'type =>', type);
                  }}
            />
        )
    }

    return <View style={styles.container}>{renderDeepArView()}</View>

}

const styles = StyleSheet.create({
    deepARView: {
        width: Computed.SCREEN_WIDTH,
        height: '100%'
    },
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center'
    }
})

export default CameraScreen