import { render, screen } from '@testing-library/react';
import App from './App';

test('renders calorie tracker title', () => {
  render(<App />);
  const linkElement = screen.getByText(/Calorie Tracker/i);
  expect(linkElement).toBeInTheDocument();
});
