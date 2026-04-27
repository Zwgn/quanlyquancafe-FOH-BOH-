import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders dashboard heading', () => {
  render(<App />);
  const headingElement = screen.getByText(/bảng điều khiển tổng quan/i);
  expect(headingElement).toBeInTheDocument();
});
