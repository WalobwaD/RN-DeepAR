import {useEffect, useRef, useState} from 'react';
import {
  Dimensions,
  Linking,
  StyleSheet,
  Text,
  TouchableOpacity,
  View,
} from 'react-native';
import DeepARView, {
  IDeepARHandle,
  Camera,
  CameraPermissionRequestResult,
  ErrorTypes,
  CameraPositions,
} from 'react-native-deepar';
import RNFetchBlob from 'rn-fetch-blob';

const CameraScreen = ({navigation}: {navigation: any}) => {
  const deepARRef = useRef<IDeepARHandle>(null);

  const [permsGranted, setPermsGranted] = useState(false);

  const getPermissions = async () => {
    const cameraPermission = await Camera.requestCameraPermission();
    const microphonePermission = await Camera.requestMicrophonePermission();

    const isCameraAllowed =
      cameraPermission === CameraPermissionRequestResult.AUTHORIZED;
    const isMicAllowed =
      microphonePermission === CameraPermissionRequestResult.AUTHORIZED;

    if (isCameraAllowed && isMicAllowed) {
      setPermsGranted(true);
    } else {
      Linking.openSettings();
    }
  };

  useEffect(() => {
    getPermissions();
  }, []);

  const loadEffect = () => {
    RNFetchBlob.config({
      fileCache: true,
    })
      .fetch(
        'GET',
        'https://stzplxvphnymrsyuyyvy.supabase.co/storage/v1/object/public/Deepar/FaceMask.deepar',
      )
      .then(res => {
        deepARRef?.current?.switchEffectWithPath({
          path: res.path(),
          slot: 'mask',
        });
      });
  };

  const renderPhotoButton = () => {
    return (
      <>
        <View style={styles.button}>
          <TouchableOpacity onPress={loadEffect} style={styles.effectButton}>
            <Text style={styles.effectText}>Load Effect</Text>
          </TouchableOpacity>
        </View>
      </>
    );
  };

  const renderDeepARView = () => {
    if (permsGranted === false) {
      return null;
    }
    return (
      <>
        <DeepARView
          ref={deepARRef}
          apiKey="c0e4496ca7de43e377da6d839b2ca50060ce1bb95bfa530ec5e4370906080180f22b296a64a5e035"
          videoWarmup={false}
          position={CameraPositions.FRONT}
          style={styles.deepARView}
          onError={(text: String, type: ErrorTypes) => {
            console.log('onError =>', text, 'type =>', type);
          }}
        />
        {renderPhotoButton()}
      </>
    );
  };

  return <View style={styles.container}>{renderDeepARView()}</View>;
};

const styles = StyleSheet.create({
  deepARView: {
    width: Dimensions.get('window').width,
    height: '100%',
  },
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  button: {
    position: 'absolute',
    top: 20,
    left: 20,
  },
  effectButton: {
    flex: 1,
    alignItems: 'center',
  },

  effectText: {
    textAlign: 'center',
    fontSize: 20,
    color: '#000',
    borderRadius: 4,
    backgroundColor: '#FFF',
    padding: 5,
  },
});

export default CameraScreen;
