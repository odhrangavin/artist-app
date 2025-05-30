import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';
import axios from 'axios';

import renderWithRouter from './testUtils.jsx';

// == Mock ==
vi.mock("axios", () => {
  const instance = {
      get: vi.fn(() => Promise.resolve({ data: {
          // Data not necessary
        }
      })),
      post: vi.fn(() => Promise.resolve({ data: {
        token: 'fake-jwt-token'
        }
      })),
      interceptors: {
        request: { use: vi.fn() },
        response: { use: vi.fn() },
      },
    };
  
  return {
    default: {
      create: vi.fn(() => instance),
    }
  }

});


// == Tests ==
describe('Login', () => {
  
  function getLoginElements() {
    
    const inputUser = screen.getByPlaceholderText(/Username/i);
    const inputPass = screen.getByPlaceholderText(/Password/i);
    const buttonLogin = screen.getByRole('button', { name: /Log in/i });
    const errorMessage = screen.getByTestId('error-message');
    return [inputUser, inputPass, buttonLogin, errorMessage];
  }
  
  it('render login fields and buttons', () => {
    renderWithRouter('/login');

    const [ inputUser, inputPass, buttonLogin, errorMessage ] = getLoginElements()
    const forgottenLink = screen.getByRole('link', { name: /click here/i})

    expect(inputUser).toBeInTheDocument();
    expect(inputPass).toBeInTheDocument();
    expect(buttonLogin).toBeInTheDocument();
    expect(errorMessage).toBeInTheDocument(); // It's visible, but empty
    expect(forgottenLink).toBeInTheDocument();
  })

  it('initial values of login fields should be empty and button disabled', () => {
    renderWithRouter('/login');

    const [ inputUser, inputPass, buttonLogin, errorMessage ] = getLoginElements()

    expect(inputUser).toHaveValue('');
    expect(inputPass).toHaveValue('');
    expect(errorMessage).toHaveTextContent('');
    expect(buttonLogin).toBeDisabled();
  })
  
  it('write on input fields and success login', async () => {
    
    renderWithRouter('/login');

    const [ inputUser, inputPass, buttonLogin, errorMessage ] = getLoginElements()

    // Type on fields
    await userEvent.type(inputUser, 'testuser');
    await userEvent.type(inputPass, '1234');
    // Check updates
    expect(inputUser).toHaveValue('testuser');
    expect(inputPass).toHaveValue('1234');
    expect(errorMessage).toHaveTextContent('');
    expect(buttonLogin).toBeEnabled();
    // Click on login button
    await userEvent.click(buttonLogin);
    // If answer is successfull
    const dashboardTitle = await screen.findByText('Welcome to your Dashboard');
    expect(dashboardTitle).toBeInTheDocument();
  });

  it('write on input fields and fail login', async () => {
    // Set up rejection mock
    const axiosInstance = axios.create();
    axiosInstance.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: { message:'Incorrect username or password.'}
      }
    });

    
    renderWithRouter('/login');

    const [ inputUser, inputPass, buttonLogin, errorMessage ] = getLoginElements()

    // Type on fields
    await userEvent.type(inputUser, 'example');
    await userEvent.type(inputPass, '1234');
    
    // Values checked in previous test

    // Click on login button
    await userEvent.click(buttonLogin);
    // If mock returns failure

    expect(errorMessage).toHaveTextContent('Incorrect username or password.');
  });

  it('redirect to forgot your password', async () => {
    renderWithRouter('/login');

    const forgottenLink = screen.getByRole('link', { name: /click here/i});
    await userEvent.click(forgottenLink);

    // Check if redirected
    expect(await screen.findByText('Forgot Your Password?')).toBeInTheDocument();
  });


});

describe('Register', () => {
  
  function getRegisterElements() {
    
    const inputEmail = screen.getByPlaceholderText(/@example/i);
    const inputUser = screen.getByPlaceholderText(/Username/i);
    const inputPass = screen.getByPlaceholderText(/create a password/i);
    const inputConfirm = screen.getByPlaceholderText(/repeat the password/i);
    const buttonArtist = screen.getByRole('button', { name: /artist/i });
    const buttonAudience = screen.getByRole('button', { name: /audience/i });
    const buttonRegister = screen.getByRole('button', { name: /register/i });
    const errorMessage = screen.getByTestId('error-message');
    return [buttonArtist, buttonAudience, buttonRegister, errorMessage, inputEmail, 
      inputUser, inputPass, inputConfirm];
  }
  
  it('render register fields and buttons', () => {
    renderWithRouter('/register');

    const registerElements = getRegisterElements();

    registerElements.map(regElement => expect(regElement).toBeInTheDocument());

  })

  it('initial values of register fields should be empty and button disabled', () => {
    renderWithRouter('/register');

    const [ buttonArtist, buttonAudience, buttonRegister, errorMessage, 
      ...inputElements ] = getRegisterElements();

    inputElements.map(inputElement => expect(inputElement).toHaveValue(''));
    expect(buttonArtist).toHaveValue('artist');
    expect(buttonAudience).toHaveValue('audience');
    expect(errorMessage).toHaveTextContent('');
    expect(buttonRegister).toBeDisabled();
  })

  it('write on input fields and success register', async () => {
    
    renderWithRouter('/register');

    const [ buttonArtist, buttonAudience, buttonRegister, errorMessage, inputEmail, 
      inputUser, inputPass, inputConfirm ] = getRegisterElements()

    // Type on fields  
    await userEvent.type(inputEmail, 'testuser@gmail.com');
    await userEvent.type(inputUser, 'testuser');
    await userEvent.type(inputPass, '1234');
    await userEvent.type(inputConfirm, '1234');
    await userEvent.click(buttonArtist);

    // Check updates
    expect(inputEmail).toHaveValue('testuser@gmail.com');
    expect(inputUser).toHaveValue('testuser');
    expect(inputPass).toHaveValue('1234');
    expect(inputConfirm).toHaveValue('1234');
    expect(errorMessage).toHaveTextContent('');
    expect(buttonRegister).toBeEnabled();
    
    // Click on register button
    await userEvent.click(buttonRegister);
    // If answer is successfull
    const dashboardTitle = await screen.findByText('Welcome to your Dashboard');
    expect(dashboardTitle).toBeInTheDocument();
  });

  it('write on input fields and fail register', async () => {
    // Set up rejection mock
    const axiosInstance = axios.create();
    axiosInstance.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: { message:'Some random error.'}
      }
    });

    
    renderWithRouter('/register');

    const [ buttonArtist, buttonAudience, buttonRegister, errorMessage, inputEmail, 
      inputUser, inputPass, inputConfirm ] = getRegisterElements()

    // Type on fields  
    await userEvent.type(inputEmail, 'testuser@gmail.com');
    await userEvent.type(inputUser, 'testuser');
    await userEvent.type(inputPass, '1234');
    await userEvent.type(inputConfirm, '1234');
    await userEvent.click(buttonAudience);

    // Check relevant updates (this time I clicked on audience button) 
    expect(errorMessage).toHaveTextContent('');
    expect(buttonRegister).toBeEnabled();

    // Click on register button
    await userEvent.click(buttonRegister);
    // If mock returns failure

    expect(errorMessage).toHaveTextContent('Sign-up error');
  });

  it('write on input fields and missmatch passwords', async () => {

    renderWithRouter('/register');

    const [ buttonArtist, buttonAudience, buttonRegister, errorMessage, inputEmail, 
      inputUser, inputPass, inputConfirm ] = getRegisterElements()

    // Type on fields  
    await userEvent.type(inputEmail, 'testuser@gmail.com');
    await userEvent.type(inputUser, 'testuser');
    await userEvent.type(inputPass, '1234');
    await userEvent.type(inputConfirm, '134');
    await userEvent.click(buttonAudience);

    // No need to check updates

    // Click on register button
    await userEvent.click(buttonRegister);

    expect(errorMessage).toHaveTextContent('Passwords do not match');
  });
 
});

describe('Forgot Password', () => {
  
  function getForgotPassElements() {
    
    const inputEmail = screen.getByPlaceholderText(/email/i);
    const buttonRequest = screen.getByRole('button', { name: /request reset/i });
    const errorMessage = screen.getByTestId('error-message');
    return [inputEmail, buttonRequest, errorMessage];
  }
  
  it('render register fields and buttons', () => {
    renderWithRouter('/forgot-password');

    const forgotPassElements = getForgotPassElements();

    forgotPassElements.map(fpElement => expect(fpElement).toBeInTheDocument());

  })

  it('initial values of meail input should be empty and button disabled', () => {
    renderWithRouter('/forgot-password');

    const [ inputEmail, buttonRequest, errorMessage ] = getForgotPassElements();

    expect(inputEmail).toHaveValue('');
    expect(errorMessage).toHaveTextContent('');
    expect(buttonRequest).toBeDisabled();

  })

  it('write on email field and redirect to reset password page', async () => {
    
    renderWithRouter('/forgot-password');

    const [ inputEmail, buttonRequest, errorMessage ] = getForgotPassElements()

    // Type on fields  
    await userEvent.type(inputEmail, 'testuser@gmail.com');

    // Check updates
    expect(inputEmail).toHaveValue('testuser@gmail.com');
    expect(errorMessage).toHaveTextContent('');
    expect(buttonRequest).toBeEnabled();
    
    // Click on request reset button
    await userEvent.click(buttonRequest);
    // If answer is successfull
    const resetPassTitle = await screen.findByText('Reset Your Password');
    expect(resetPassTitle).toBeInTheDocument();
  });

  it('write on input fields and fail register', async () => {
    // Set up rejection mock
    const axiosInstance = axios.create();
    axiosInstance.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: { message:'Some random error.'}
      }
    });
    
    renderWithRouter('/forgot-password');

    const [ inputEmail, buttonRequest, errorMessage ] = getForgotPassElements()

    // Type on fields  
    await userEvent.type(inputEmail, 'testuser@gmail.com');

    // No need for check updates

    // Click on register Request Reset
    await userEvent.click(buttonRequest);
    // If mock returns failure

    expect(errorMessage).toHaveTextContent(/Wrong email or server error/i);
  });
 
});

describe('Reset-Password', () => {
  
  function getResetPassElements() {
    
    const inputPass = screen.getByPlaceholderText('New Password'); // Literal as it included in confirm placeholder
    const inputConfirm = screen.getByPlaceholderText(/confirm new password/i);
    const inputToken = screen.getByPlaceholderText(/token/i);
    const buttonReset = screen.getByRole('button', { name: /confirm reset/i });
    const errorMessage = screen.getByTestId('error-message');
    return [inputPass, inputConfirm, inputToken, errorMessage, buttonReset];
  }
  
  it('render reset-password fields and buttons', () => {
    renderWithRouter('/reset-password');

    const resetPassElements = getResetPassElements();

    resetPassElements.map(rpElement => expect(rpElement).toBeInTheDocument());

  })

  it('initial values of reset-password fields should be empty and button disabled', () => {
    renderWithRouter('/reset-password');

    const [inputPass, inputConfirm, inputToken, errorMessage, buttonReset] = getResetPassElements();

    expect(inputPass).toHaveValue('');
    expect(inputConfirm).toHaveValue('');
    expect(inputToken).toHaveValue('');
    expect(errorMessage).toHaveTextContent('');
    expect(buttonReset).toBeDisabled();
  })

  it('write on input fields and success reset', async () => {
    
    renderWithRouter('/reset-password');

    const [ inputPass, inputConfirm, inputToken, errorMessage, 
      buttonReset ] = getResetPassElements();

    // Type on fields  
    await userEvent.type(inputPass, '12345');
    await userEvent.type(inputConfirm, '12345');
    await userEvent.type(inputToken, 'randomToken');

    // Check updates
    expect(inputPass).toHaveValue('12345');
    expect(inputConfirm).toHaveValue('12345');
    expect(inputToken).toHaveValue('randomToken');
    expect(errorMessage).toHaveTextContent('');
    expect(buttonReset).toBeEnabled();
    
    // Click on reset button
    await userEvent.click(buttonReset);
    // If answer is successfull
    const button = screen.getByRole('button', { name:/log in/i });
    expect(button).toBeInTheDocument();
  });

  it('write on input fields and fail to reset password', async () => {
    // Set up rejection mock
    const axiosInstance = axios.create();
    axiosInstance.post.mockRejectedValueOnce({
      response: {
        status: 400,
        data: { message:'Some random error.'}
      }
    });
  
    renderWithRouter('/reset-password');

    const [ inputPass, inputConfirm, inputToken, errorMessage, 
    buttonReset ] = getResetPassElements();

    // Type on fields  
    await userEvent.type(inputPass, '12345');
    await userEvent.type(inputConfirm, '12345');
    await userEvent.type(inputToken, 'randomToken');

    // No need to check updates

    // Click on reset button
    await userEvent.click(buttonReset);

    expect(errorMessage).toHaveTextContent(`Couldn't reset the password`);
  });

  it('write on input fields and missmatch passwords', async () => {

    renderWithRouter('/reset-password');
    
    const [ inputPass, inputConfirm, inputToken, errorMessage, 
    buttonReset ] = getResetPassElements();

    // Type on fields  
    await userEvent.type(inputPass, '12345');
    await userEvent.type(inputConfirm, 'abcde');
    await userEvent.type(inputToken, 'randomToken');

    // No need to check updates

    // Click on register button
    await userEvent.click(buttonReset);

    expect(errorMessage).toHaveTextContent('Passwords do not match');
  });
 
});