import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import App from './App';

// Mock components to avoid actual API calls
jest.mock('./pages/Dashboard', () => () => <div data-testid="dashboard">Dashboard</div>);
jest.mock('./pages/Login', () => () => <div data-testid="login">Login</div>);
jest.mock('./components/Layout', () => ({ children }: { children: React.ReactNode }) => (
  <div data-testid="layout">{children}</div>
));

describe('App Component', () => {
  test('renders without crashing', () => {
    console.log('Testing App component rendering');
    render(
      <BrowserRouter>
        <App />
      </BrowserRouter>
    );
    console.log('App component rendered successfully');
  });
});
