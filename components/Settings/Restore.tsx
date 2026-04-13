import { useState } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';
import BackupModel from './BackupModel';
import ResetModel from './ResetModal';
import RestoreModel from './RestoreModal';

export default function Restore() {

    const [ backupModal, setBackupModal ] = useState(false);

    const [ restoreModal, setRestoreModal ] = useState(false);

    const [ resetModal, setResetModal ] = useState(false);

    const setBModal = () => {
        setBackupModal(!backupModal);
    }

    const setRModal = () => {
        setRestoreModal(!restoreModal);
    }

    const setResetModalState = () => {
        setResetModal(!resetModal);
    }


    return (
        <View style={{ flex: 1, gap: 20, marginTop: '3%'}}> 

            <BackupModel modalVisible={backupModal} setVisible={setBModal}/>

            <RestoreModel modalVisible={restoreModal} setVisible={setRModal}/>

            <ResetModel modalVisible={resetModal} setVisible={setResetModalState}/>    
            
            <Text style={{ color: 'orange', fontSize: 18, marginLeft: '3%'}}>Backup & Restore</Text>

            <Pressable style={styles.itemContainer} onPress={setBModal}>
                <Text style={{ color: 'white' , fontSize: 16 }}>Backup</Text>
                <Text style={{ color: 'white' , fontSize: 13 }}>Backup your bookmarks</Text>
            </Pressable>

            <Pressable style={styles.itemContainer} onPress={setRModal}>
                <Text style={{ color: 'white' , fontSize: 16 }}>Restore</Text>
                <Text style={{ color: 'white' , fontSize: 13 }}>Restore bookmarks</Text>
            </Pressable>

            <Pressable style={styles.itemContainer} onPress={setResetModalState}>
                <Text style={{ color: 'white' , fontSize: 16 }}>Reset</Text>
                <Text style={{ color: 'white' , fontSize: 13 }}>Reset to the default app settings</Text>
            </Pressable>
        </View>
    )
}

const styles = StyleSheet.create({
    sContainer: {
        marginTop: '2%',
        marginLeft: '7%', 
    },
    sText: {
        color : 'white'
    },
    centeredView: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
    },
    modalView: {
        margin: 20,
        backgroundColor: 'white',
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
    buttonOpen: {
        backgroundColor: '#F194FF',
    },
    buttonClose: {
        backgroundColor: '#2196F3',
    },
    textStyle: {
        color: 'white',
        fontWeight: 'bold',
        textAlign: 'center',
    },
    modalText: {
        marginBottom: 15,
        textAlign: 'center',
    },
    itemContainer: {
        display: 'flex', 
        flexDirection: 'column', 
        marginLeft: '7%', 
        gap: 3
    }
})
