import { StatusBar } from 'expo-status-bar';

import React, { useEffect, useState } from 'react';
import * as SQLite from 'expo-sqlite';
import { createTheme, ThemeProvider,ListItem,Input,Button,Icon,Header } from "@rneui/themed";
import Component from "./components/MyComponent";
import { View,FlatList} from "react-native";


const db = SQLite.openDatabase('tyyliteltyostoslista.db');

const theme = createTheme({
  lightColors: {},
  darkColors: {},
});

export default function App() {
  interface MyItem{
    id:number,
    product:string,
    amount:string,
  }
  const [product, setProduct] = useState('');
  const [amount, setAmount] = useState('');
  const [items, setItems] = useState<MyItem[]>([]);

  useEffect(() => {
    db.transaction(tx => {
      tx.executeSql('CREATE TABLE IF NOT EXISTS items (id INTEGER PRIMARY KEY AUTOINCREMENT, product TEXT, amount INTEGER);');
    }, (error) => console.error("Error creating table", error), updateList);
  }, []);

  const updateList = () => {
    db.transaction(tx => {
      tx.executeSql('SELECT * FROM items;', [], (_, { rows }) => {
        setItems(rows._array as MyItem[]);
      });
    });
  };
  const addItem = () => {
    db.transaction(tx => {
      tx.executeSql('INSERT INTO items (product, amount) VALUES (?, ?);', [product, amount]);
    }, (error) => console.error("Error adding item", error), updateList);

    setProduct('');
    setAmount('');
  };

  const deleteItem = (id:number) => {
    db.transaction(tx => {
      tx.executeSql('DELETE FROM items WHERE id = ?;', [id]);
    }, (error) => console.error("Error deleting item", error), updateList);
  };

  const renderItem =({ item }: { item: MyItem }) => (
    <ListItem bottomDivider>
    <ListItem.Content>
    <ListItem.Title>{item.product}</ListItem.Title>
    <ListItem.Subtitle>{item.amount}</ListItem.Subtitle>
    </ListItem.Content>
    <ListItem.Chevron 
      name="delete" 
      color="red" 
      size={30}
      onPress={() => deleteItem(item.id)} 
    />
    </ListItem>
    )
    
  
    
  return (
    <ThemeProvider theme={theme}>
     <Header
        leftComponent={{ icon: 'menu', color: '#fff' }}
        centerComponent={{ text: 'SHOPPING LIST', style: { color: '#fff' } }}
        rightComponent={{ icon: 'home', color: '#fff' }}
        />
      <Input
          placeholder='Product'
          value={product}
          onChangeText={text => setProduct(text)} />
        <Input
          placeholder='Amount'
          value={amount}
          onChangeText={text => setAmount(text)} />
        <Button raised icon={{name: 'save'}} onPress={addItem} title="SAVE" />
        <FlatList
          data={items}
          renderItem={renderItem}
          keyExtractor={(item) => item.id.toString()}
          />


    </ThemeProvider>
  );
}
