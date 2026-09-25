export interface RouteResponse {
  type: string;
  features: Array<{
    type: string;
    geometry: {
      type: string;
      coordinates: number[][];
    };
    properties: {
      distance: number;
      time: number;
    };
  }>;
}
