import CharAvatar from '@/components/CharAvatar';
import { QuoteProvider, useSearchContext } from '@/components/QuoteContext';
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

        setAllChars(data);
    }

    const GetChars = () => {

        const { charJson, isCharLoading } = useSearchContext();

        const [ chars, setChars ] = useState<any>([]);

        useEffect(() => {

            if(!isCharLoading) {
                setChars(charJson);
            }

        },[charJson, isCharLoading]);


        return (
            <FlatList
                data={chars}
                numColumns={3}
                contentContainerStyle={{ 
                    paddingHorizontal: 10, 
                    paddingBottom: 30,
                    width: '100%', 
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
        )
    }


    return (
        <QuoteProvider>
            <View style={{ flex: 1, backgroundColor: '#25292e' }}>
                <GetChars />
            </View>
        </QuoteProvider> 
    )
}

/**
 * <FlatList
                    data={allChars}
                    numColumns={3}
                    contentContainerStyle={{ 
                        paddingHorizontal: 10, 
                        paddingBottom: 30,
                        width: '100%', 
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
 */

