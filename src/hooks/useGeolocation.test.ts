import { renderHook, act } from '@testing-library/react';
import { vi } from 'vitest';
import useGeolocation from './useGeolocation';

describe('useGeolocation', () => {
  const mockGeolocation = {
    watchPosition: vi.fn(),
    clearWatch: vi.fn(),
  };

  beforeEach(() => {
    Object.defineProperty(window, 'navigator', {
      value: {
        geolocation: {
          watchPosition: mockGeolocation.watchPosition,
          clearWatch: mockGeolocation.clearWatch,
        },
      },
      writable: true,
    });
  });

  afterEach(() => {
    vi.clearAllMocks();
  });

  it("returns the user's location when the browser's geolocation API is available", () => {
    const { result } = renderHook(() => useGeolocation());
    const successCallback = mockGeolocation.watchPosition.mock.calls[0][0];
    act(() => {
      successCallback({ coords: { latitude: 12.34, longitude: 56.78 } });
    });
    expect(result.current.userLocation).toEqual({
      latitude: 12.34,
      longitude: 56.78,
    });
  });

  it("returns an error when the browser's geolocation API is not available", () => {
    vi.spyOn(navigator, 'geolocation', 'get').mockReturnValueOnce(null as any);
    const { result } = renderHook(() => useGeolocation());
    expect(result.current.error).toBe(
      'Geolocation is not supported by your browser',
    );
  });

  it('returns an error when the user denies permission to access their location', () => {
    const { result } = renderHook(() => useGeolocation());
    const errorCallback = mockGeolocation.watchPosition.mock.calls[0][1];
    act(() => {
      errorCallback({ message: 'User denied Geolocation' });
    });
    expect(result.current.error).toBe('User denied Geolocation');
  });
});
