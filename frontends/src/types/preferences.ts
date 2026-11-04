export type VenuePreference = {
    id: string;
    userId: string;
    venueId: number;
    ranking: number;
};

export type VenuePreferenceBackend = {
    id: number;
    hirerId: number;
    venueId: number;
    ranking: number;
};

export const VENUE_PREFERENCES_STORAGE_KEY = "venuePreferences";

export const MIN_PREFERENCE_RANKING = 1;

export function isValidPreferenceRanking(ranking: number, maxRank: number): boolean {
    return Number.isInteger(ranking) && ranking >= MIN_PREFERENCE_RANKING && ranking <= maxRank;
}