import "@testing-library/jest-dom";
import { vi } from "vitest";

// Mocking mapbox-gl
vi.mock("mapbox-gl", () => {
  const mapboxGlMock = {
    Map: class {
      on = vi.fn();
    },
    LngLat: class {
      constructor(lng: number, lat: number) {
        this.lng = lng;
        this.lat = lat;
      }
      lng: number;
      lat: number;
    },
    Popup: class {
      // Mock methods for Popup
      setText = vi.fn().mockReturnThis();
    },
    Marker: class {
      setLngLat = vi.fn().mockReturnThis();
      setPopup = vi.fn().mockReturnThis();
      addTo = vi.fn().mockReturnThis();
      remove = vi.fn().mockReturnThis();
      togglePopup = vi.fn().mockReturnThis();
    },
    // Add other components you need to mock
  };
  return {
    __esModule: true,
    default: mapboxGlMock,
  };
});
