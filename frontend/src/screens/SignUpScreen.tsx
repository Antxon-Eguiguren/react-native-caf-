import React, {useContext, useEffect} from 'react';
import {
  Keyboard,
  Platform,
  Text,
  View,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {NavigatorStackParams} from '../navigator/Navigator';
import {Background} from '../components/Background';
import {WhiteLogo} from '../components/WhiteLogo';
import {useForm} from '../hooks/useForm';
import {AuthContext} from '../context/AuthContext';
import {FormStyles} from '../styles/FormStyles';

interface Props extends StackScreenProps<NavigatorStackParams, 'SignUp'> {}

export const SignUpScreen = ({navigation}: Props) => {
  const {signUp, signUpError, removeErrors} = useContext(AuthContext);
  const {email, password, name, onChange} = useForm({
    email: '',
    password: '',
    name: '',
  });

  const onSignUp = () => {
    Keyboard.dismiss();
    signUp({nombre: name, correo: email, password});
  };

  useEffect(() => {
    if (signUpError === null) {
      return;
    }

    Alert.alert('Wrong Signup', signUpError, [
      {
        text: 'Ok',
        onPress: removeErrors,
      },
    ]);
  }, [signUpError, removeErrors]);

  return (
    <>
      <Background />

      <ScrollView style={{flex: 1}}>
        <View style={FormStyles.formContainer}>
          <WhiteLogo />

          <Text style={FormStyles.title}>Sign Up</Text>

          <Text style={FormStyles.label}>Name</Text>
          <TextInput
            style={[
              FormStyles.inputField,
              Platform.OS === 'ios' && FormStyles.inputFieldIOS,
            ]}
            placeholder="Name"
            placeholderTextColor="rgba(255,255,255,0.4)"
            keyboardType="email-address"
            underlineColorAndroid="white"
            selectionColor="salmon"
            autoCapitalize="words"
            autoCorrect={false}
            onChangeText={value => onChange(value, 'name')}
            value={name}
            onSubmitEditing={onSignUp}
          />

          <Text style={FormStyles.label}>Email</Text>
          <TextInput
            style={[
              FormStyles.inputField,
              Platform.OS === 'ios' && FormStyles.inputFieldIOS,
            ]}
            placeholder="Email"
            placeholderTextColor="rgba(255,255,255,0.4)"
            keyboardType="email-address"
            underlineColorAndroid="white"
            selectionColor="salmon"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={value => onChange(value, 'email')}
            value={email}
            onSubmitEditing={onSignUp}
          />

          <Text style={FormStyles.label}>Password</Text>
          <TextInput
            style={[
              FormStyles.inputField,
              Platform.OS === 'ios' && FormStyles.inputFieldIOS,
            ]}
            placeholder="Password"
            secureTextEntry
            placeholderTextColor="rgba(255,255,255,0.4)"
            keyboardType="default"
            underlineColorAndroid="white"
            selectionColor="salmon"
            autoCapitalize="none"
            autoCorrect={false}
            onChangeText={value => onChange(value, 'password')}
            value={password}
            onSubmitEditing={onSignUp}
          />

          <View style={FormStyles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{...FormStyles.button, marginTop: 50}}
              onPress={onSignUp}>
              <Text style={FormStyles.buttonText}>Create account</Text>
            </TouchableOpacity>
          </View>

          <View style={FormStyles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{marginTop: 20}}
              onPress={() => navigation.navigate('Login')}>
              <Text style={FormStyles.buttonText}>Go to Login Page</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};
