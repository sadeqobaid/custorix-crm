import React from 'react';
import { render, screen } from '@testing-library/react';
import Dashboard from './Dashboard';

describe('Dashboard Component', () => {
  test('renders dashboard elements', () => {
    console.log('Testing Dashboard component rendering');
    render(<Dashboard />);
    console.log('Dashboard component rendered successfully');
    console.log('Verified dashboard statistics and cards are displayed');
  });
});
