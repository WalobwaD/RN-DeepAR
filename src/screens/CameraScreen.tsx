import {useEffect, useState, useRef, useMemo} from 'react';
import {Image, Linking, Platform, StyleSheet, Text, View} from 'react-native';
import DeepARView, {
  Camera,
  CameraPermissionRequestResult,
  CameraPositions,
  ErrorTypes,
  IDeepARHandle,
} from 'react-native-deepar';

import {Computed, Effects} from '../constants/index';
import {Button} from '../components';
import Images from '../constants/Images';
import RNFetchBlob from 'rn-fetch-blob';

const CameraScreen = ({navigation}: {navigation: any}) => {
  const deepArRef = useRef<IDeepARHandle>(null);

  const [permsGranted, setPermsGranted] = useState(false);
  const [currEffectIndex, setCurrEffectIndex] = useState(0);
  const [videoMode, setVideoMode] = useState(false);
  const [switchCameraInProgress, setSwitchCameraInProgress] = useState(false);
  const [cameraPosition, setCameraPosition] = useState(CameraPositions.FRONT);

  const getPermissions = async () => {
    const cameraPermission = await Camera.requestCameraPermission();
    const microphonePermission = await Camera.requestCameraPermission();

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

  const isCurrentEffectSupported = useMemo(
    () => Effects[currEffectIndex as number]?.platforms.includes(Platform.OS),
    [currEffectIndex],
  );

  const changeEffect = (direction: number) => {
    if (!deepArRef) {
      return;
    }
    let newIndex = direction > 0 ? currEffectIndex + 1 : currEffectIndex - 1;

    if (newIndex >= Effects.length) {
      newIndex = 0;
    }

    if (newIndex < 0) {
      newIndex = Effects.length - 1;
    }

    const newEffect = Effects[newIndex];
    if (newEffect?.platforms.includes(Platform.OS)) {
      deepArRef?.current?.switchEffect({
        mask: newEffect?.name as string,
        slot: 'effect',
      });
    } else {
      deepArRef?.current?.switchEffect({
        mask: Effects[0]?.name as string,
        slot: 'effect',
      });
    }
    setCurrEffectIndex(newIndex);
  };

  const takeScreenShot = () => {
    if (deepArRef) {
      deepArRef?.current?.takeScreenshot();
    }
  };

  const switchCamera = () => {
    if (deepArRef && switchCameraInProgress === false) {
      setCameraPosition(
        cameraPosition === CameraPositions.FRONT
          ? CameraPositions.BACK
          : CameraPositions.FRONT,
      );
      setSwitchCameraInProgress(true);
    }
  };

  const renderPhotoViewButtons = () => {
    if (videoMode) {
      return null;
    }
    return (
      <>
        <View style={styles.upLeftButtons}>
        <Button
            style={styles.upLeftButton}
            text="Load Effect on Fly"
            onPress={() => {
                // console.log('Loading effect')
                // deepArRef?.current?.switchEffectWithPath({
                //     path: '../assets/effects/FirstHelmetFilter.deeparproj',
                //     slot: 'mask'
                // })
              RNFetchBlob.config({})
                .fetch('GET', '../assets/effects/FirstHelmetFilter.deeparproj/project.dprm')
                .then((res) => {
                    console.log(res)
                //   deepArRef?.current?.switchEffectWithPath({
                //     path: res,
                //     slot: 'mask',
                //   });
                });
            }}
          />
        </View>
        <Button
          style={styles.switchCameraButton}
          image={() => (
            <Image style={styles.cameraIcon} source={Images.CAMERA} />
          )}
          onPress={switchCamera}
        />
        <View style={styles.bottomButtonContainer}>
          <Button text="Previous" onPress={() => changeEffect(-1)} />

          <Button
            image={() => (
              <Image style={styles.screenshotIcon} source={Images.SCREENSHOT} />
            )}
            onPress={takeScreenShot}
          />

          <Button text="Next" onPress={() => changeEffect(1)} />
        </View>
      </>
    );
  };
  const renderDeepArView = () => {
    if (permsGranted === false) {
      return null;
    }
    return (
      <>
        <DeepARView
          ref={deepArRef}
          apiKey="c0e4496ca7de43e377da6d839b2ca50060ce1bb95bfa530ec5e4370906080180f22b296a64a5e035"
          videoWarmup={false}
          position={cameraPosition}
          onCameraSwitched={() => {
            setSwitchCameraInProgress(false);
          }}
          onScreenshotTaken={(screenshotPath: String)=>{
            const path = 'file://' + screenshotPath
            navigation.navigate('Home', {
                path,
            })
          }}
          style={styles.deepARView}
          onError={(text: String, type: ErrorTypes) => {
            console.log('onError =>', text, 'type =>', type);
          }}
        />
        {renderPhotoViewButtons()}
      </>
    );
  };

  return <View style={styles.container}>{renderDeepArView()}</View>;
};

const styles = StyleSheet.create({
  deepARView: {
    width: Computed.SCREEN_WIDTH,
    height: '100%',
  },
  container: {
    flex: 1,
    alignItems: 'center',
    justifyContent: 'center',
  },
  screenshotIcon: {
    width: 70,
    height: 70,
  },
  switchCameraButton: {
    position: 'absolute',
    top: 40,
    right: 40,
  },
  cameraIcon: {
    width: 50,
    height: 40,
  },
  bottomButtonContainer: {
    position: 'absolute',
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    width: '100%',
    bottom: 60,
    height: 50,
  },
  upLeftButtons: {
    position: 'absolute',
    alignItems: 'flex-start',
    left: 20,
    top: 40,
  },
  upLeftButton: {
    marginBottom: 10,
  },
});

export default CameraScreen;
