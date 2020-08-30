import React, { Component } from 'react'
import { Text, View } from 'react-native'
import { NavigationContainer } from '@react-navigation/native'
import { createStackNavigator } from '@react-navigation/stack'
//screen
import CameraScreen from './src/CameraScreen'
import SaveItem from './src/SaveItem'


const Stack = createStackNavigator();
export class App extends Component {
  render() {
    return (
      <NavigationContainer>
        <Stack.Navigator headerMode="none" >
          <Stack.Screen name="CameraScreen" component={CameraScreen} />
          <Stack.Screen name="SaveItem" component={SaveItem} />
        </Stack.Navigator>
      </NavigationContainer>
    )
  }
}

export default App
