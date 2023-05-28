import { useState } from 'react';
import { View } from 'react-native';
import { TextInput } from 'react-native-paper';
import { styles } from '.';

export function SearchBar() {
  const [query, setQuery] = useState('');
  return (
    <View>
      <TextInput
        style={styles.searchInput}
        placeholder="Enter Search"
        onChangeText={(text) => setQuery(text)}
        value={query} />
    </View>
  );
}
