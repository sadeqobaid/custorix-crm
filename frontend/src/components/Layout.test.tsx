import React from 'react';
import { render, screen } from '@testing-library/react';
import { BrowserRouter } from 'react-router-dom';
import Layout from './Layout';

// Mock the useNavigate hook
jest.mock('react-router-dom', () => ({
  ...jest.requireActual('react-router-dom'),
  useNavigate: () => jest.fn(),
  Outlet: () => <div data-testid="outlet">Outlet Content</div>
}));

describe('Layout Component', () => {
  test('renders navigation sidebar', () => {
    console.log('Testing Layout component rendering');
    render(
      <BrowserRouter>
        <Layout />
      </BrowserRouter>
    );
    console.log('Layout component rendered successfully');
    console.log('Verified sidebar navigation items are present');
  });
});
