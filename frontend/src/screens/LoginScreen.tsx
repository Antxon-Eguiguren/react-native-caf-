import React, {useContext, useEffect} from 'react';
import {
  Platform,
  Text,
  TouchableOpacity,
  TextInput,
  View,
  Keyboard,
  ScrollView,
  Alert,
} from 'react-native';
import {StackScreenProps} from '@react-navigation/stack';
import {NavigatorStackParams} from '../navigator/Navigator';
import {Background} from '../components/Background';
import {WhiteLogo} from '../components/WhiteLogo';
import {useForm} from '../hooks/useForm';
import {FormStyles} from '../styles/FormStyles';
import {AuthContext} from '../context/AuthContext';

interface Props extends StackScreenProps<NavigatorStackParams, 'Login'> {}

export const LoginScreen = ({navigation}: Props) => {
  const {login, loginError, removeErrors} = useContext(AuthContext);

  const {email, password, onChange} = useForm({
    email: '',
    password: '',
  });

  const onLogin = () => {
    Keyboard.dismiss();
    login({correo: email, password});
  };

  useEffect(() => {
    if (loginError === null) {
      return;
    }

    Alert.alert('Wrong Login', loginError, [
      {
        text: 'Ok',
        onPress: removeErrors,
      },
    ]);
  }, [loginError, removeErrors]);

  return (
    <>
      <Background />

      <ScrollView style={{flex: 1}}>
        <View style={FormStyles.formContainer}>
          <WhiteLogo />

          <Text style={FormStyles.title}>Login</Text>

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
            onSubmitEditing={onLogin}
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
            onSubmitEditing={onLogin}
          />

          <View style={FormStyles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{...FormStyles.button, marginTop: 50}}
              onPress={onLogin}>
              <Text style={FormStyles.buttonText}>Login</Text>
            </TouchableOpacity>
          </View>

          <View style={FormStyles.buttonContainer}>
            <TouchableOpacity
              activeOpacity={0.8}
              style={{marginTop: 20}}
              onPress={() => navigation.navigate('SignUp')}>
              <Text style={FormStyles.buttonText}>Do not have an account?</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </>
  );
};
