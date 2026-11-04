import { gql } from "@apollo/client";
import { client } from "./graphql";
import { CreateVenueArgs, UpdateVenueArgs, Venue } from "@/types/venues";
import { PopularVenueReport, ActiveApplicantReport } from "@/types/applications";

const GET_VENUES = gql`
    query GetVenues {
        venues {
            id vendorId venueName description location capacity suitability featured
        }
    }
`;

const GET_VENUE = gql`
    query GetVenue($id: Int!) {
        venue(id: $id) {
            id vendorId venueName description location capacity suitability featured
        }
    }
`;

const GET_VENDORS = gql`
    query GetVendors {
        vendors { id userID }
    }
`;

const CREATE_VENUE = gql`
    mutation CreateVenue(
        $vendorId: Int! $venueName: String! $description: String!
        $location: String! $capacity: Int! $suitability: String! $featured: Int!
    ) {
        createVenue(
            vendorId: $vendorId venueName: $venueName description: $description
            location: $location capacity: $capacity suitability: $suitability featured: $featured
        ) {
            id vendorId venueName description location capacity suitability featured
        }
    }
`;

const UPDATE_VENUE = gql`
    mutation UpdateVenue(
        $id: Int! $vendorId: Int $venueName: String $description: String
        $location: String $capacity: Int $suitability: String $featured: Int
    ) {
        updateVenue(
            id: $id vendorId: $vendorId venueName: $venueName description: $description
            location: $location capacity: $capacity suitability: $suitability featured: $featured
        ) {
            id vendorId venueName description location capacity suitability featured
        }
    }
`;

const DELETE_VENUE = gql`
    mutation DeleteVenue($id: Int!) { deleteVenue(id: $id) }
`;

const TOGGLE_FEATURED = gql`
    mutation ToggleFeaturedVenue($id: Int!) {
        toggleFeaturedVenue(id: $id) {
            id vendorId venueName description location capacity suitability featured
        }
    }
`;

const ASSIGN_VENDOR = gql`
    mutation AssignVendorToVenue($venueId: Int!, $vendorId: Int!) {
        assignVendorToVenue(venueId: $venueId, vendorId: $vendorId) {
            id vendorId venueName description location capacity suitability featured
        }
    }
`;

const TOP_POPULAR_VENUES = gql`
    query TopPopularVenues {
        topPopularVenues {
            rank totalBookings mostPopularDay mostPopularTimeSlot
            venue { id venueName location capacity suitability featured vendorId description }
        }
    }
`;

const TOP_ACTIVE_APPLICANTS = gql`
    query TopActiveApplicants {
        topActiveApplicants {
            rank successfulBookings totalApplications successRate
            hirer { id firstName lastName email }
        }
    }
`;

export const venueManagementServices = {
  getVenues: async (): Promise<Venue[]> => {
    const { data } = await client.query<{ venues: Venue[] }>({
      query: GET_VENUES,
      fetchPolicy: "network-only",
    });
    if (!data || !data.venues) {
      throw new Error("Failed to fetch venues");
    }
    return data.venues;
  },

  getVenue: async (id: number): Promise<Venue> => {
    const { data } = await client.query<{ venue: Venue }>({
      query: GET_VENUE,
      variables: { id },
    });
    if (!data || !data.venue) {
      throw new Error(`Failed to fetch venue with id ${id}`);
    }
    return data.venue;
  },

  getVendors: async (): Promise<{ id: number; userID: number }[]> => {
    const { data } = await client.query<{ vendors: { id: number; userID: number }[] }>({
      query: GET_VENDORS,
      fetchPolicy: "network-only",
    });
    if (!data || !data.vendors) {
      throw new Error("Failed to fetch vendors");
    }
    return data.vendors;
  },

  createVenue: async (venue: CreateVenueArgs): Promise<Venue> => {
    const { data } = await client.mutate<{ createVenue: Venue }>({
      mutation: CREATE_VENUE,
      variables: venue,
    });
    if (!data || !data.createVenue) {
      throw new Error("Failed to create venue");
    }
    return data.createVenue;
  },

  updateVenue: async (payload: UpdateVenueArgs): Promise<Venue> => {
    const { data } = await client.mutate<{ updateVenue: Venue }>({
      mutation: UPDATE_VENUE,
      variables: payload,
    });
    if (!data || !data.updateVenue) {
      throw new Error("Failed to update venue");
    }
    return data.updateVenue;
  },

  deleteVenue: async (id: number): Promise<boolean> => {
    const { data } = await client.mutate<{ deleteVenue: boolean }>({
      mutation: DELETE_VENUE,
      variables: { id },
    });
    return Boolean(data?.deleteVenue);
  },

  toggleFeatured: async (id: number): Promise<Venue> => {
    const { data } = await client.mutate<{ toggleFeaturedVenue: Venue }>({
      mutation: TOGGLE_FEATURED,
      variables: { id },
    });
    if (!data || !data.toggleFeaturedVenue) {
      throw new Error("Failed to toggle featured status");
    }
    return data.toggleFeaturedVenue;
  },

  assignVendorToVenue: async (venueId: number, vendorId: number): Promise<Venue> => {
    const { data } = await client.mutate<{ assignVendorToVenue: Venue }>({
      mutation: ASSIGN_VENDOR,
      variables: { venueId, vendorId },
    });
    if (!data || !data.assignVendorToVenue){
      throw new Error("Failed to assign vendor to venue");
    }
    return data.assignVendorToVenue;
  },

  getTopPopularVenues: async (): Promise<PopularVenueReport[]> => {
    const { data } = await client.query<{ topPopularVenues: PopularVenueReport[] }>({
      query: TOP_POPULAR_VENUES,
      fetchPolicy: "network-only",
    });
    if (!data || !data.topPopularVenues) {
      throw new Error("Failed to fetch top popular venues");
    }
    return data.topPopularVenues;
  },

  getTopActiveApplicants: async (): Promise<ActiveApplicantReport[]> => {
    const { data } = await client.query<{ topActiveApplicants: ActiveApplicantReport[] }>({
      query: TOP_ACTIVE_APPLICANTS,
      fetchPolicy: "network-only",
    });
    if (!data || !data.topActiveApplicants) {
      throw new Error("Failed to fetch top active applicants");
    }
    return data.topActiveApplicants;
  },
};