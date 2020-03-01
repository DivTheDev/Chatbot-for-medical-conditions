import React, {Component} from 'react';
import {View, StyleSheet} from 'react-native';
import ChatBot from 'react-native-chatbot';
import MedicalCondition from './medical_condition';
import {postSymptoms} from '_services';

const DOCTOR_NAME = 'Dr Costa';
export default class SymptomsBot extends Component {
  constructor(props) {
    super(props);

    console.disableYellowBox = true;
    const config = {
      handleEnd: ({renderedSteps, steps, values }) => {
        if (this.state.symptoms.length > 0) {
          postSymptoms(this.state.symptoms)
            .then(response => {
              console.log(response);
            })
            .catch(err => {
              console.log(err);
            });
        }
      },
      botBubbleColor: '#0085a5',
      userBubbleColor: '#45c8da',
      optionBubbleColor: '#0085a5',
      userFontColor: 'white',
    };

    let steps = [
      {
        id: '0',
        message: `Hello, ${DOCTOR_NAME} here, what seems to be the problem?`,
        trigger: '1',
      },
      {
        id: '1',
        user: true,
        inputAttributes: {
          keyboardType: 'default',
        },
        trigger: '2',
        validator: value => {
          if (!value) return 'Please try again!';
          else {
            return true;
          }
        },
      },
      {
        id: '2',
        trigger: '3',
        message: `Thanks, let me take a look for you...`,
      },
      {
        id: '3',
        component: <MedicalCondition stepIndex={1} />,
        replace: false,
        waitAction: true,
        asMessage: true,
        trigger: '4',
      },
      {
        id: '4',
        message: ({steps}) =>
          `It seems like you may have ${steps[3].value}. Would like to inform your doctor?`,
        trigger: '5',
      },
      {
        id: '5',
        options: [
          {
            value: 1,
            label: 'Yes',
            trigger: ({steps}) => {
              this.setState({symptoms: this.state.symptoms.concat(steps[3].value)});
              return '6'
            },
          },
          {value: 2, label: 'No', trigger: '15'},
          {value: 3, label: 'Try again', trigger: '1'},
        ],
      },
      {
        id: '6',
        message: `Thanks, your doctor has been informed.`,
        trigger: '7',
      },
      {
        id: '7',
        message: `Would you like to inform us of any other symptoms?`,
        trigger: '8',
      },
      {
        id: '8',
        options: [
          {value: 1, label: 'Yes', trigger: '9'},
          {value: 2, label: 'No', trigger: '15'},
        ],
      },
      {
        id: '9',
        message: `Please describe your symptom.`,
        trigger: '10',
      },
      {
        id: '10',
        user: true,
        inputAttributes: {
          keyboardType: 'default',
        },
        trigger: '11',
        validator: value => {
          if (!value) return 'Please try again!';
          else {
            return true;
          }
        },
      },
      {
        id: '11',
        component: <MedicalCondition stepIndex={10} />,
        replace: false,
        waitAction: true,
        asMessage: true,
        trigger: '12',
      },
      {
        id: '12',
        message: ({steps}) =>
          `It seems like you may have ${steps[11].value}. Would like to inform your doctor?`,
        trigger: '13',
      },
      {
        id: '13',
        options: [
          {
            value: 1,
            label: 'Yes',
            trigger: ({steps}) => {
              this.setState({symptoms: this.state.symptoms.concat(steps[11].value)});
              return '14'
            },
          },
          {value: 2, label: 'No', trigger: '15'},
          {value: 3, label: 'Try again', trigger: '10'},
        ],
      },
      {
        id: '14',
        message: `Thanks, your doctor has been informed.`,
        trigger: '15',
      },
      {
        id: '15',
        message: `Thanks for using our virtual chatbot, we hope your have a great day! 👋`,
        end: true,
      },
    ];

    this.state = {
      config: config,
      steps: steps,
      symptoms: [],
    };
  }

  render() {
    return <View><ChatBot steps={this.state.steps} {...this.state.config} /></View>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    marginTop: 12,
  },
});
