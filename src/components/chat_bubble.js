import React, { Component } from 'react';
import { Text, StyleSheet, View } from 'react-native';

export default class ChatBubble extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    return (
      <View style={styles.rectangle} key={ this.props.i } >
        <Text style={styles.text}>
          { this.props.text }
        </Text>
      </View>
    )
  }
}

const styles = StyleSheet.create({
  rectangle: {
    backgroundColor: 'steelblue',
  },

  text: {
    color: 'white', 
    marginTop: 14,
    marginLeft: 10,
    marginRight: 10,
    marginBottom: 14,
  }
});

