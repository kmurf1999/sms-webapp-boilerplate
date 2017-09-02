import React, { Component } from 'react';
import { Field, reduxForm } from 'redux-form';
import TextField from 'material-ui/TextField';
import RaisedButton from 'material-ui/RaisedButton';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import Paper from 'material-ui/Paper';
import { Link } from 'react-router-dom';

import Phone, { isValidPhoneNumber } from 'react-phone-number-input';
import './Phone.scss';

import '../../../styles/auth.scss';


const validate = values => {
  const errors = {}
  if (!values.phonenumber) {
    errors.phonenumber = 'Required';
  } else if (!isValidPhoneNumber(values.phonenumber)) {
    errors.phonenumber = 'Invalid phone number';
  }
  if (!values.username) {
    errors.username = 'Required';
  } else if (values.username.length > 15) {
    errors.username = 'Must be 15 characters or less';
  }
  if (!values.password) {
    errors.password = 'Required';
  } else if (values.password.length < 10) {
    errors.password = 'Password must be 10 characters long';
  } else if (values.password !== values.passwordAgain) {
    errors.password = 'Passwords do not match';
  }
  if (!values.passwordAgain) {
    errors.passwordAgain = 'Required';
  }
  return errors
}

const renderField = ({ input, label, type, meta: { touched, error } }) => (
  <TextField
    {...input}
    style={{width: "100%"}}
    floatingLabelText={label}
    errorText={touched && error ? error : null}
    type={type}
  />
);

class renderPhoneField extends Component {
  state = {
    value: '',
    focused: false
  };

  onBlur(event) {
    this.props.input.onBlur(event);
    this.setState({ focused: false })
  }

  render() {
    const { input, label, type, meta: { touched, error } } = this.props;
    return (
      <div className="phonenumber-field-container">
        <Phone
          {...this.props.input}
          country="US"
          onFocus={() => this.setState({ focused: true })}
          onBlur={(event) => this.onBlur(event)}
          value={this.state.value}
          onChange={ value => this.setState({ value }) }
          placeholder={label}
          style={{width: "100%"}}
        />
        <hr className="highlight-grey"/>
        { this.state.focused ? <hr className="highlight highlight-active"/> : <hr className="highlight highlight-inactive"/> }
        { touched && error ? <hr className="error-highlight"/> : null }
        { touched && error ? <p className="error-text">{error}</p> : null }
      </div>
    );
  }
};

const renderAsyncError = statusText => {
  if (statusText) {
    return (
      <div className="asyncError">{statusText}</div>
    );
  }
};

const Signup = props => {
  const { handleSubmit, pristine, submitting, username, password, statusText } = props;
  return (
    <MuiThemeProvider>
      <div>
        <Paper className="formContainer">
          <h4 className="form-banner">Signup</h4>
          <form className="form" onSubmit={e => handleSubmit(e, username, password)}>
            {renderAsyncError(statusText)}
            <Field name="phonenumber" type="tel" component={renderPhoneField} label="Phone number"/>
            <Field name="username" type="text" component={renderField} label="Username"/>
            <Field name="password" type="password" component={renderField} label="Password"/>
            <Field name="passwordAgain" type="password" component={renderField} label="Password (Again)"/>
            <RaisedButton className="formButton" type="submit" primary={true} label="Submit" disabled={pristine || submitting} />
          </form>
        </Paper>
        <p className="help-text">Already have an account? <Link to='/login'>Login</Link></p>
      </div>
    </MuiThemeProvider>
  );
}

// Decorate the form component
export default reduxForm({
  form: 'signup', // a unique name for this form
  validate
})(Signup);
