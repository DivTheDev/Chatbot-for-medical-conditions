import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ChatBubble from '../../components/chat_bubble';
import { getSymptom } from '_services';

const DOCTOR_NAME = 'Dr Costa';
const STARTING_MESSAGE = `Hello, ${DOCTOR_NAME} here, what seems to be the problem?`;
const LOADING_MESSAGE = `Thanks, ${DOCTOR_NAME} is going to take a look...`;
const MEDICAL_CONDITION_FOUND_MESSAGE = `It seems like you may have $MEDICAL_CONDITION, reply yes if you would like to inform your doctor.`;
const INFORM_DOCTOR_MESSAGE = `Thanks, your doctor has been informed.`

const STRING_VARIABLES = {
  MEDICAL_CONDITION: '$MEDICAL_CONDITION',
};

const CHAT_ORDER = [
  STARTING_MESSAGE,
  LOADING_MESSAGE,
  MEDICAL_CONDITION_FOUND_MESSAGE,
  INFORM_DOCTOR_MESSAGE
];

const CHAT_SENDER = { User: 'user', System: 'system' };

export default class SymptomsChecker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      conversation: [],
      enableTextInput: false,
      chatIndex: 0,
    };

    this.submitText = this.submitText.bind(this);
    this.clearUserInput = this.clearUserInput.bind(this);
    this.renderConversation = this.renderConversation.bind(this);
    this.startConversation = this.startConversation.bind(this);
    this.appendToConversation = this.appendToConversation.bind(this);
    this.respondToUser = this.respondToUser.bind(this);
    this.getMedicalCondition = this.getMedicalCondition.bind(this);
    this.getLastUserInput = this.getLastUserInput.bind(this);
  }

  async submitText(e) {
    this.clearUserInput();
    if (e.nativeEvent.text.length > 0) {
      await this.appendToConversation(e.nativeEvent.text, CHAT_SENDER.User);
      setTimeout(() => {
        this.respondToUser();
      }, 1250);
    }
  }

  componentDidMount() {
    this.startConversation();
  }

  clearUserInput() {
    this.setState({ text: '' });
  }

  startConversation() {
    setTimeout(() => {
      this.appendToConversation(STARTING_MESSAGE, CHAT_SENDER.System);
    }, 1250);
  }

  async appendToConversation(text, from, enableUserInput = true) {
    let conversationObj = {
      text: text,
      from: from
    };

    let newConversation = this.state.conversation.concat(conversationObj);
    let newChatIndex = this.state.chatIndex + 1;
    await this.setState({
      conversation: newConversation,
      enableTextInput: enableUserInput,
      chatIndex: newChatIndex,
    });

    if (newChatIndex === 3) {
      this.getMedicalCondition();
    }

    if (newChatIndex === 5) {
      this.informDoctor();
    }
  }

  respondToUser(text, userCanReply) {
    if (typeof text !== 'undefined' && text !== null && text.length > 0) {
      this.appendToConversation(text, CHAT_SENDER.System, userCanReply);
    } else {
      this.appendToConversation(CHAT_ORDER[this.state.chatIndex - 1], CHAT_SENDER.System, userCanReply);
    }
  }

  getMedicalCondition() {
    getSymptom(this.getLastUserInput()).then(response => {
      const text = MEDICAL_CONDITION_FOUND_MESSAGE.replace(STRING_VARIABLES.MEDICAL_CONDITION, response.data.condition);
      setTimeout(() => {
        this.respondToUser(text, true);
      }, 1250);
    }).catch(err => {
      console.log(err);
    });
  }

  informDoctor() {
    let userResponse = this.getLastUserInput().toLowerCase();
    if (userResponse === 'yes' || userResponse === 'y') {
      
    }
  }

  getLastUserInput() {
    const reversedConversation = this.state.conversation.reverse();
    let lastUserInput = '';
    reversedConversation.forEach(element => {
      if (element.from === CHAT_SENDER.User) {
        lastUserInput = element.text;
      }
    });
    return lastUserInput;
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
          {this.renderConversation()}
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