import React, { Component } from 'react';
import { SafeAreaView, StyleSheet, TextInput, View } from 'react-native';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import ChatBubble from '../../components/chat_bubble';
import { getSymptom } from '_services';

const DOCTOR_NAME = 'Dr Costa';
const STARTING_MESSAGE = `Hello, ${DOCTOR_NAME} here, what seems to be the problem?`;
const LOADING_MESSAGE = `Thanks, ${DOCTOR_NAME} is going to take a look...`;
const MEDICAL_CONDITION_FOUND_MESSAGE = `It seems like you may have $MEDICAL_CONDITION, reply yes if you would like to inform your doctor.`;
const INFORM_DOCTOR_MESSAGE_YES = `Thanks, your doctor has been informed.`
const NEXT_SYMPTOM_MESSAGE = `Would you like to inform us of any other symptoms?`
const NEW_SYMPTOM = `Please describe your symptom.`

const STRING_VARIABLES = {
  MEDICAL_CONDITION: '$MEDICAL_CONDITION',
};

const CHAT_ORDER = [
  { text: STARTING_MESSAGE, userCanReply: true },
  { text: LOADING_MESSAGE, userCanReply: false },
  { text: MEDICAL_CONDITION_FOUND_MESSAGE, userCanReply: true },
  { text: INFORM_DOCTOR_MESSAGE_YES, userCanReply: false },
  { text: NEXT_SYMPTOM_MESSAGE, userCanReply: true },
  { text: NEW_SYMPTOM, userCanReply: true },
  { text: LOADING_MESSAGE, userCanReply: false },
  { text: MEDICAL_CONDITION_FOUND_MESSAGE, userCanReply: true },
];

const CHAT_SENDER = { User: 'user', System: 'system' };

export default class SymptomsChecker extends Component {
  constructor(props) {
    super(props);

    this.state = {
      text: '',
      lastUserInput: '',
      conversation: [],
      enableTextInput: false,
      chatIndex: 0,
      symptoms: [],
    };

    this.submitText = this.submitText.bind(this);
    this.clearUserInput = this.clearUserInput.bind(this);
    this.renderConversation = this.renderConversation.bind(this);
    this.startConversation = this.getSymptomFromUser.bind(this);
    this.appendToConversation = this.appendToConversation.bind(this);
    this.respondToUser = this.respondToUser.bind(this);
    this.getMedicalCondition = this.getMedicalCondition.bind(this);
  }

  async submitText(e) {
    const input = e.nativeEvent.text;
    if (input.length > 0) {
      this.clearUserInput();
      await this.appendToConversation(e.nativeEvent.text, CHAT_SENDER.User);
      setTimeout(() => {
        this.respondToUser();
      }, 1250);
    }
  }

  componentDidMount() {
    this.getSymptomFromUser();
  }

  async clearUserInput(fully = false) {
    this.setState({ 
      lastUserInput: fully ? '' : this.state.text,
      text: '' 
    });
  }

  getSymptomFromUser() {
    setTimeout(() => {
      const chat = CHAT_ORDER[this.state.chatIndex];
      this.appendToConversation(chat.text, CHAT_SENDER.System, chat.userCanReply);
    }, 1250);
  }

  async appendToConversation(text, from, enableUserInput = true) {
    if (typeof text !== 'undefined' && text.length > 0) {
      let conversationObj = {
        text: text,
        from: from
      };

      let newConversation = this.state.conversation.concat(conversationObj);
      let newChatIndex = this.state.chatIndex;
      if (conversationObj.from === CHAT_SENDER.System) {
        newChatIndex = this.state.chatIndex + 1;
      }

      await this.setState({
        conversation: newConversation,
        enableTextInput: enableUserInput,
        chatIndex: newChatIndex,
      });
    
      if (CHAT_ORDER[newChatIndex - 1].text === LOADING_MESSAGE) {
        this.getMedicalCondition();
      } else if (CHAT_ORDER[newChatIndex].text === NEW_SYMPTOM) {
        console.log('NEW SHIT');
        await this.clearUserInput(true);
      } else if (CHAT_ORDER[newChatIndex].userCanReply === true) {
        console.log('HERE2')
        await this.getUserResponse();
      }
    }
  }

  respondToUser(text, userCanReply = false) {
    if (typeof text !== 'undefined' && text !== null && text.length > 0) {
      setTimeout(() => {
        this.appendToConversation(text, CHAT_SENDER.System, userCanReply);
      }, 1250);
    } else {
      setTimeout(() => {
        this.appendToConversation(CHAT_ORDER[this.state.chatIndex].text, CHAT_SENDER.System, CHAT_ORDER[this.state.chatIndex].userCanReply);
      }, 1250);
    }
  }

  getMedicalCondition() {
    console.log('GET MEDICAL CONDITIONS')
    getSymptom(this.state.lastUserInput).then(response => {
      const text = CHAT_ORDER[this.state.chatIndex].text.replace(STRING_VARIABLES.MEDICAL_CONDITION, response.data.condition);
      this.state.symptoms = this.state.symptoms.concat(response.data.condition);
      this.respondToUser(text, CHAT_ORDER[this.state.chatIndex].userCanReply);
    }).catch(err => {
      console.log(err);
    });
  }

  async getUserResponse() {
    console.log('getUserResponse');
    console.log(this.state);
    let userResponse = this.state.lastUserInput.toLowerCase();
    await this.clearUserInput(true);
    console.log(userResponse === 'yes' || userResponse === 'y');
    if (userResponse === 'yes' || userResponse === 'y') {
      this.respondToUser();
    }
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