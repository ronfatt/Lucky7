// ==========================================================
// 紫微时空数字预测系统 (ZWTSP) Retailer & Map Provider Abstraction
// File: lib/directions/retailer-provider.ts
// ==========================================================

import { CompassDirection } from '@/types/zwtsp';

export interface Coordinates {
  latitude: number;
  longitude: number;
}

export interface RetailerSpot {
  id: string;
  name: string;
  address: string;
  location: Coordinates;
  distanceMeters: number;
  bearingDegrees: number;
  direction: CompassDirection;
}

export interface RetailerProvider {
  searchNearby(coords: Coordinates, radiusMeters: number): Promise<RetailerSpot[]>;
  searchByDirection(coords: Coordinates, direction: CompassDirection, radiusMeters: number): Promise<RetailerSpot[]>;
  calculateDistance(from: Coordinates, to: Coordinates): number;
  calculateBearing(from: Coordinates, to: Coordinates): number;
  convertBearingToDirection(bearing: number): CompassDirection;
}

/**
 * Clean reference implementation that does not track or store precise GPS history
 */
export class OfflineMockRetailerProvider implements RetailerProvider {
  public calculateDistance(from: Coordinates, to: Coordinates): number {
    // Haversine formula
    const R = 6371e3; // meters
    const φ1 = (from.latitude * Math.PI) / 180;
    const φ2 = (to.latitude * Math.PI) / 180;
    const Δφ = ((to.latitude - from.latitude) * Math.PI) / 180;
    const Δλ = ((to.longitude - from.longitude) * Math.PI) / 180;

    const a =
      Math.sin(Δφ / 2) * Math.sin(Δφ / 2) +
      Math.cos(φ1) * Math.cos(φ2) * Math.sin(Δλ / 2) * Math.sin(Δλ / 2);
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

    return Math.round(R * c);
  }

  public calculateBearing(from: Coordinates, to: Coordinates): number {
    const φ1 = (from.latitude * Math.PI) / 180;
    const φ2 = (to.latitude * Math.PI) / 180;
    const Δλ = ((to.longitude - from.longitude) * Math.PI) / 180;

    const y = Math.sin(Δλ) * Math.cos(φ2);
    const x =
      Math.cos(φ1) * Math.sin(φ2) -
      Math.sin(φ1) * Math.cos(φ2) * Math.cos(Δλ);
    const θ = Math.atan2(y, x);
    const bearing = ((θ * 180) / Math.PI + 360) % 360;

    return Math.round(bearing);
  }

  public convertBearingToDirection(bearing: number): CompassDirection {
    const directions: CompassDirection[] = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    const index = Math.round(bearing / 45) % 8;
    return directions[index];
  }

  public async searchNearby(coords: Coordinates, radiusMeters: number): Promise<RetailerSpot[]> {
    // Deterministic mock generation without leaking user identity or persisting coordinates
    const angles = [45, 120, 200, 315];
    return angles.map((bearing, idx) => {
      const distance = 400 + idx * 250;
      const direction = this.convertBearingToDirection(bearing);
      return {
        id: `mock-spot-${idx + 1}`,
        name: `中国福利彩票 / 体育彩票服务点 (${direction}向)`,
        address: `时空方位探索点 ${direction}向 约${distance}米`,
        location: {
          latitude: coords.latitude + 0.002 * (idx + 1),
          longitude: coords.longitude + 0.002 * (idx + 1),
        },
        distanceMeters: distance,
        bearingDegrees: bearing,
        direction,
      };
    });
  }

  public async searchByDirection(
    coords: Coordinates,
    targetDirection: CompassDirection,
    radiusMeters: number
  ): Promise<RetailerSpot[]> {
    const all = await this.searchNearby(coords, radiusMeters);
    return all.filter(s => s.direction === targetDirection);
  }
}

export const defaultRetailerProvider: RetailerProvider = new OfflineMockRetailerProvider();
