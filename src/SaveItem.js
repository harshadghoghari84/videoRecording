import React, { Component } from 'react'
import { Text, View, Image } from 'react-native'
import { TouchableOpacity } from 'react-native-gesture-handler'
import Ionicons from 'react-native-vector-icons/Ionicons'


export class SaveItem extends Component {
  render() {
    const { data } = this.props.route.params
    return (
      <View style={{ flex: 1 }}>
        <TouchableOpacity
          onPress={() => this.props.navigation.goBack()}
          style={{ height: 40, width: 40, alignItems: 'center', justifyContent: 'center', marginHorizontal: 10, backgroundColor: '#DDDDDD', borderRadius: 20, marginVertical: 20, }}>
          <Ionicons name="arrow-back" size={28} />
        </TouchableOpacity>
        <Image
          style={{ height: 200, width: '90%', alignSelf: 'center', margin: 5, borderRadius: 20, resizeMode: 'cover' }}
          source={{ uri: data }}
        />
      </View>
    )
  }
}

export default SaveItem
