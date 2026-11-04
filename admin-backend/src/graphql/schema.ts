import { buildSchema, GraphQLSchema } from 'graphql';

const schema: GraphQLSchema = buildSchema(`
  type Admin {
    id: Int!
    username: String!
    role: String!
  }

  type Vendor {
    id: Int!
    userID: Int!
  }

  type Venue {
    id: Int!
    vendorId: Int!
    venueName: String!
    description: String!
    location: String!
    capacity: Int!
    suitability: String!
    featured: Int!
  }

  type HirerInfo {
    id: Int!
    firstName: String!
    lastName: String!
    email: String!
  }

  type PopularVenueReport {
    rank: Int!
    venue: Venue!
    totalBookings: Int!
    mostPopularDay: String!
    mostPopularTimeSlot: String!
  }

  type ActiveApplicantReport {
    rank: Int!
    hirer: HirerInfo!
    successfulBookings: Int!
    totalApplications: Int!
    successRate: String!
  }

  type Query {
    adminLogin(username: String!, password: String!): Admin
    vendors: [Vendor]
    vendor(id: Int!): Vendor
    venues: [Venue]
    venue(id: Int!): Venue
    topPopularVenues: [PopularVenueReport]
    topActiveApplicants: [ActiveApplicantReport]
  }

  type Mutation {
    createVenue(
      vendorId: Int!
      venueName: String!
      description: String!
      location: String!
      capacity: Int!
      suitability: String!
      featured: Int!
    ): Venue
    updateVenue(
      id: Int!
      vendorId: Int
      venueName: String
      description: String
      location: String
      capacity: Int
      suitability: String
      featured: Int
    ): Venue
    deleteVenue(id: Int!): Boolean
    toggleFeaturedVenue(id: Int!): Venue
    assignVendorToVenue(venueId: Int!, vendorId: Int!): Venue
  }
`);

export default schema;