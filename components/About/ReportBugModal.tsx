
import useAppConstants from '@/hooks/useAppConstants';
import { Octokit } from "@octokit/core";
import * as Application from 'expo-application';
import Constants from 'expo-constants';
import * as Device from 'expo-device';
import { useState } from 'react';
import { Modal, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';


const octokit = new Octokit({ 
  auth: Constants?.expoConfig?.extra?.githubKey
});

// App Details
const appVersion = Application.nativeApplicationVersion;
const buildNumber = Application.nativeBuildVersion;
const bundleId = Application.applicationId;

// Device Details
const modelName = Device.modelName;
const osName = Device.osName;
// 3. Device Type classification
// 1 (PHONE), 2 (TABLET), 3 (DESKTOP), 4 (TV), 0 (UNKNOWN)
const deviceType = Device.deviceType;

export default function ReportBugModal({modalVisible, setVisible}: {modalVisible:any, setVisible: any}) {

    const { SCREEN_WIDTH, SCREEN_HEIGHT } = useAppConstants(); 

    const [ reportForm, setReportForm ] = useState({
        title: '',
        description: '',
    })

    const handleChangeReport = (key: string, value: string) => {
        setReportForm((prev) => ({
            ...prev,
            [key]: value,
        }));
    }

    const handleSend = async () => {

        let deviceDetails = `App Version - ${appVersion}\nBuild Number - ${buildNumber}\nBundle ID - ${bundleId}\nModel Name - ${modelName}\nOS Name - ${osName}`;

        let respBody = reportForm.description + "\n\n\n" + deviceDetails;

        try {
            const response = await octokit.request('POST /repos/{owner}/{repo}/issues', {
                owner: 'RichardJeanBaptiste',
                repo: 'dailyanime_mobile',
                title: reportForm.title,
                body: respBody,
                labels: ['bug', 'user-reported'],
                headers: {
                    'X-GitHub-Api-Version': '2022-11-28' // Standard GitHub API pinning header
                }
            });

            if (response.status === 201) {
                console.log("Issue successfully logged! URL:", response.data.html_url);
                return true;
            }
        } catch (error) {
            console.error("Octokit transmission failure:", error)
            return false;
        }
        // console.log(appVersion, " ", buildNumber, " ", bundleId, " ", modelName, " ", osName, " ", deviceType)

        // console.log(reportForm)
    }
   
    return (
        <>
            <Modal
                animationType="slide"
                transparent={true}
                visible={modalVisible}
                onRequestClose={() => {
                    setVisible();
                }}
            >
                <View style={[styles.centeredView]}>
                    <View style={[styles.modalView, {width: SCREEN_WIDTH * .8 , height: SCREEN_HEIGHT * .7, position: 'relative' }]}>
                        <Text style={[styles.modalText, {fontWeight: 'bold', fontSize: 20, textDecorationLine: 'underline' }]}>Report Bug</Text>

                        <View style={{ width: '100%' , alignItems: 'flex-start', gap: 10 }}>
                            <TextInput style={styles.inputField} placeholder="Title" value={reportForm.title} onChangeText={(text) => handleChangeReport('title', text)}/>

                            <TextInput 
                                editable
                                multiline
                                numberOfLines={7}
                                maxLength={350}
                                placeholder="Description" value={reportForm.description} 
                                onChangeText={(text) => handleChangeReport('description', text)}
                                style={[styles.inputField, {height: '50%'}]}
                            />
                            
                            
                            {/** 
                             *  <TextInput placeholder="App Version" value={reportForm.appVersion} onChangeText={(text) => handleChangeReport('appVersion', text)}/>
                                <TextInput placeholder="Build Number" value={reportForm.buildNumber} onChangeText={(text) => handleChangeReport('buildNumber', text)}/>
                                <TextInput placeholder="Device Modal" value={reportForm.deviceModal} onChangeText={(text) => handleChangeReport('deviceModal', text)}/>
                                <TextInput placeholder="Locale" value={reportForm.locale} onChangeText={(text) => handleChangeReport('locale', text)}/>  
                             * 
                            */}
                              
                        </View>
                        
                        <View style={{ display: 'flex', flexDirection: 'row', gap: 15,  position: 'absolute', bottom: 30, width: '100%', justifyContent: 'space-between', paddingHorizontal: 10}}>
                            <Pressable
                                style={[styles.button, styles.buttonClose]}
                                onPress={() => setVisible()}>
                                <Text style={styles.textStyle}>Close </Text>
                            </Pressable>

                            <Pressable
                                style={[styles.button, styles.buttonSend]}
                                onPress={handleSend}
                            >
                                <Text>Send</Text>
                            </Pressable>
                        </View>       

                    </View>
                </View>
            </Modal>
        </>
    )
}

const styles = StyleSheet.create({
  centeredView: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  modalView: {
    margin: 20,
    backgroundColor: '#25292e',
    borderRadius: 20,
    padding: 35,
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.25,
    shadowRadius: 4,
    elevation: 5,
  },
  button: {
    borderRadius: 20,
    padding: 10,
    elevation: 2,
  },
  buttonClose: {
    backgroundColor: 'red',
  },
  buttonSend: {
    backgroundColor: '#2196F3',
  },
  textStyle: {
    color: 'white',
    fontWeight: 'bold',
    textAlign: 'center',
  },
  modalText: {
    marginBottom: 15,
    color: 'white'
  },
  inputField : {
    borderColor: 'white', 
    borderWidth: 1, 
    width: '97%',
    color: 'white'
  }

});