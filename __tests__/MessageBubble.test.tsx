import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import MessageBubble from '../components/MessageBubble';
import { Role, Message } from '../types';

describe('MessageBubble', () => {
  it('renders user message correctly', () => {
    const message: Message = {
      id: '1',
      role: Role.USER,
      text: 'Hello, AI!',
      timestamp: Date.now(),
    };

    render(<MessageBubble message={message} />);
    expect(screen.getByText('You')).toBeInTheDocument();
    expect(screen.getByText('Hello, AI!')).toBeInTheDocument();
  });

  it('renders model message correctly', () => {
    const message: Message = {
      id: '2',
      role: Role.MODEL,
      text: 'Hello, human!',
      timestamp: Date.now(),
    };

    render(<MessageBubble message={message} />);
    expect(screen.getByText('Gemini')).toBeInTheDocument();
    expect(screen.getByText('Hello, human!')).toBeInTheDocument();
  });

  it('displays error state', () => {
    const message: Message = {
      id: '3',
      role: Role.MODEL,
      text: 'An error occurred.',
      timestamp: Date.now(),
      isError: true,
    };

    render(<MessageBubble message={message} />);
    expect(screen.getByText(/Error processing request/i)).toBeInTheDocument();
  });

  it('renders attachments', () => {
    const message: Message = {
      id: '4',
      role: Role.USER,
      text: 'Check this image',
      timestamp: Date.now(),
      attachments: [
        {
          file: new File([''], 'test.png'),
          previewUrl: 'data:image/png;base64,test',
          base64: 'data:image/png;base64,test',
          mimeType: 'image/png',
        },
      ],
    };

    render(<MessageBubble message={message} />);
    const images = screen.getAllByRole('img');
    expect(images.length).toBeGreaterThan(0);
  });
});
