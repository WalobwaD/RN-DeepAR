<h1 align="center"> React Native + DeepAR</h1>

<h2>Cloning and running the Project</h2>

```bash
# Clone this repository
$ git clone

# Go into the repository
$ cd react-native-deepar

```

- Before running the project, you need to adjust some native files. Follow the instructions below:

> <h2>Android Devices</h2>

- Go to the file: `android/app/src/main/AndroidManifest.xml` and add the following lines:

```xml
<uses-permission android:name="android.permission.CAMERA" />
<!--Optional if you also want to record the audio-->
<uses-permission android:name="android.permission.RECORD_AUDIO" />
```

- Inside your `android/build.gradle` file, make sure you have the following configuration:

```gradle

buildscript {
    ext {
        buildToolsVersion = "33.0.0"
        minSdkVersion = 23
        compileSdkVersion = 33
        targetSdkVersion = 33
    }
}
   
```   

- Install all dependencies using the command:

```bash
$ yarn
```
- Make sure you are connected to a physical device before running the project.
- Run this command to check for connected devices.
```bash
$ adb devices
```

- Run the project using the command:

```bash
$ yarn android
```

> <h2>iOS Devices</h2>
- Go to the file: `ios/{YourProjectName}/Info.plist` and add the following lines:

```xml

<key>NSCameraUsageDescription</key>
<string>$(PRODUCT_NAME) needs access to your Camera.</string>

<!-- optionally, if you want to record audio: -->
<key>NSMicrophoneUsageDescription</key>
<string>$(PRODUCT_NAME) needs access to your Microphone.</string>
   
```


- Open your `ios/YourProject.xcworkspace` file in Xcode and update your iOS version to `11.0` minimum, like below:
  
| Setting iOS Version from Xcode                                                                                                  |
| ------------------------------------------------------------------------------------------------------------------------------- |
| ![Xcode Setting iOS Version](https://github.com/ridvanaltun/react-native-deepar/raw/master/docs/images/setting-ios-version.png) |
| Follow steps in the picture.                                                                                                    |

    - Add `DeepAR.xcframework` to Build Phases:
| Add DeepAR to Build Phases (1)                                                                                                              | Add DeepAR to Build Phases (2)                                                                                                              |
| ------------------------------------------------------------------------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------- |
| ![Add DeepAR to Build Phases in Xcode](https://github.com/ridvanaltun/react-native-deepar/raw/master/docs/images/setting-ios-library-1.png) | ![Add DeepAR to Build Phases in Xcode](https://github.com/ridvanaltun/react-native-deepar/raw/master/docs/images/setting-ios-library-2.png) |
| Follow steps in the picture.                                                                                                                | Follow steps in the picture.                                                                                                                |


- Navigate to your ios folder and install the bundler and pods using the commands:

```bash
$ cd ios 

$ bundle install

$ bundle exec pod install
```
- Make sure you are connected to a physical device via usb before running the project.
- Run this command to check for connected devices.
```bash
$ xcrun simctl list devices
```
- Make sure you're in the root folder of the project and run the command below to start the bundler

```bash
$ yarn ios
```

