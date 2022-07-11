import { render, screen } from '@testing-library/react';
import App from './App';

test('main image exists', () => {
  render(<App />);
  const mainImage = document.getElementById('main-image');
  expect(mainImage).toBeInTheDocument();
});
