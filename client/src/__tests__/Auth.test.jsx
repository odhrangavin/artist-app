import { render, screen } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import userEvent from '@testing-library/user-event';

import Login from '../pages/Auth/Login';





describe('Login', () => {
  
  it('render login fields and buttons', () => {
    render(<Login />);
    expect(screen.getByPlaceholderText(/Username/i)).toBeInTheDocument();
    expect(screen.getByPlaceholderText(/Password/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /Log in/i })).toBeInTheDocument();
  })
  
  
  it('write on input fields', async () => {
    
    render(<Login />)

    // Type on inputs
    const inputUser = screen.getByPlaceholderText(/Username/i);
    const inputPass = screen.getByPlaceholderText(/Password/i);

    await userEvent.type(inputUser, 'example');
    await userEvent.type(inputPass, '1234');

    expect(inputUser).toHaveValue('example');
    expect(inputPass).toHaveValue('1234');

  });

});