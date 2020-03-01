import React, {Component} from 'react';
import PropTypes from 'prop-types';
import {getSymptom} from '_services';

export default class MedicalCondition extends Component {
  constructor(props) {
    super(props);

    this.state = {
      stepIndex: this.props.stepIndex,
      loading: true,
      value: '',
      trigger: false,
      steps: this.props.steps,
      waitAction: this.props.step.waitAction
    };

  }

  componentDidMount() {
    getSymptom(this.props.steps[this.state.stepIndex].value)
      .then(response => {
        this.setState({loading: false, value: response.data.condition, trigger: this.props.step.trigger}, () => {
          this.props.triggerNextStep(this.state);
        });
      })
      .catch(err => {
        this.setState({
          loading: false,
          value: 'We seems to be experiencing an issue.',
        });
        console.log(err);
      });
  }

  render() {
    return null;
  }
}

MedicalCondition.propTypes = {
  steps: PropTypes.object,
  triggerNextStep: PropTypes.func,
  step: PropTypes.object,
  previousStep: PropTypes.object,
}

MedicalCondition.defaultProps = {
  steps: undefined,
  triggerNextStep: undefined,
  step: undefined,
  previousStep: undefined,
}
