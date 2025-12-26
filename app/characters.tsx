import CharAvatar from '@/components/CharAvatar';
import { supabase } from '@/utils';
import { useEffect, useState } from 'react';
import { FlatList, View } from 'react-native';

export default function Characters(){

    const [ allChars, setAllChars ] = useState<any>([]);

    useEffect(() => {
        getAllChars();
    },[]);

    const getAllChars = async () => {
        
       const { data, error } = await supabase
        .from('characters')
        .select('*')

        if(error) {
            console.log(error);
            return error;
        }

        //console.log(data);
        setAllChars(data);
    }

    const showChars = () => {
        console.log(allChars)
    }

    return (
        <View style={{ flex: 1, backgroundColor: '#25292e' }}>
            <FlatList
                data={allChars}
                numColumns={3}
                contentContainerStyle={{ 
                    paddingHorizontal: 10, 
                    paddingBottom: 30,
                    width: '80%', 
                }}
                columnWrapperStyle={{ 
                    gap: 16, 
                    justifyContent: 'space-between' 
                }}
                ItemSeparatorComponent={() => <View style={{ height: 20 }} />}
                renderItem={({item}) => {
                    return (
                        <CharAvatar name={item.name} item={item}/>
                    )
                }}
                keyExtractor={(item) => item.charid}
            />
        </View>
    )
}

