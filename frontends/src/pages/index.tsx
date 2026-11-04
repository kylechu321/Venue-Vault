import { LayOut } from "@/components/layout/layOut";

export default function Home() {
  return (
    <LayOut>
      <div className="min-h-[70vh] flex flex-col items-center justify-center text-center px-4">
        <h1 id="heading" className="mb-6">Welcome to Venue Vendors</h1>

        <p className="max-w-4xl mb-4">
          Venue Vendors is a web system dedicated to the selection and hiring
          of venues for events. Based in Melbourne, our private company aims to
          make finding and hiring venues quick and seamless. Browse through our
          curated venue listings, read reviews from past clients, and book the
          perfect venue for your event with just a few clicks. The system is thoughtfully designed to streamline the venue-hiring
          workflow by facilitating robust interactions between two primary user
          groups: hirers (applicants) and vendors (venue owners/managers).
          Vendors can review applications, evaluate applicant credibility, and
          leave detailed comments on profiles to help inform future decisions.
          Applicants complete comprehensive application forms that capture
          essential event details, hiring history and reputation, and any
          required compliance documents — making it easier for vendors to assess
          suitability.
          
        </p>

     
      </div>
    </LayOut>
  );
}
