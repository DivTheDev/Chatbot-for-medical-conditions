import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ChatBubble from '../../components/chat_bubble';

export default class SymptomsChecker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      conversation: [
        {
          text: 'Hello, Dr Costa here, what seems to be the problem?',
          from: 'system',
        },
      ],
      enableTextInput: true,
    };

    this.submitText = this.submitText.bind(this);
    this.clearUserInput = this.clearUserInput.bind(this);
    this.renderConversation = this.renderConversation.bind(this);
  }

  async submitText(e) {
    this.clearUserInput();

    let conversationObj = {
      text: e.nativeEvent.text,
      from: 'user',
    };

    let newConversation = this.state.conversation.concat(conversationObj);
    await this.setState({ 
      conversation: newConversation,
      enableTextInput: false,
    });

    setTimeout(() => {
      if (this.state.conversation.length === 2) {
        let conversationObj = {
          text: 'Thanks, Dr Costa is going to take a look...',
          from: 'system',
        };
  
        let newConversation = this.state.conversation.concat(conversationObj);
        this.setState({ 
          conversation: newConversation,
          enableTextInput: false,
        });
      }
    }, 1250);
  }

  clearUserInput() {
    this.setState({ text: '' });
  }

  renderConversation() {
    return this.state.conversation.map((item, i) => {
      return (
        <View style={item.from === 'user' ? styles.chatBubbleRight : styles.chatBubbleLeft} key={i}>
          <ChatBubble
            key={i}
            text={item.text}
          />
        </View>
      );
    });
  }

  render() {
    return (
        <KeyboardAwareScrollView contentContainerStyle={styles.scrollView} enableOnAndroid={true}>
          <SafeAreaView style={styles.container}>
            { this.renderConversation() }
            <TextInput
              placeholder={'Please enter your main symptom'}
              style={styles.input}
              keyboardType={'default'}
              returnKeyType={'send'}
              onChangeText={text => this.setState({ text })}
              value={this.state.text}
              onSubmitEditing={this.submitText}
              editable={this.state.enableTextInput}
            />
          </SafeAreaView>
        </KeyboardAwareScrollView>
    );
  }
}

const styles = StyleSheet.create({
  scrollView: {
    flexGrow: 1,
    justifyContent: 'space-between',
    flexDirection: 'column',
  },
  container: {
    flex: 1,
    backgroundColor: '#ecf0f1',
    alignItems: 'center',
    justifyContent: 'flex-end',
  },
  input: {
    width: 350,
    height: 44,
    padding: 10,
    borderWidth: 1,
    borderColor: 'black',
    backgroundColor: 'white',
    marginBottom: 24,
    bottom: 0,
  },
  chatBubbleRight: {
    margin: 12,
    alignSelf: 'flex-end',
  },
  chatBubbleLeft: {
    margin: 12,
    alignSelf: 'flex-start',
  }
});