import service01 from "../assets/service01.jpg";
import service02 from "../assets/service02.jpg";
import service03 from "../assets/service03.jpg";
import service04 from "../assets/service04.jpg";

export const CONTACT = {
  phones: ["517-489-2729", "810-360-8672"],
  fax: "517-220-2103",
  emails: ["magnifyservicesinc@gmail.com"],
  licenseName: "Magnify Services Inc",
  hours: "Open 24/7 for your convenience",
  socials: {
    facebook: "https://www.facebook.com/p/Magnify-Services-Inc-61571672866196/",
    linkedin: "https://www.linkedin.com/company/magnify-services-inc/",
    tiktok: "https://www.tiktok.com/@magnify.services",
  },
  locations: [
    { name: "Magnify AFC", address: "1726 Teel Ave, Lansing MI 48920", lat: 42.7145, lng: -84.5565 },
    { name: "Glorify AFC", address: "1726 Teel Ave, Lansing MI 48910", lat: 42.7145, lng: -84.5565 },
    { name: "Mercy AFC", address: "832 Pierce Rd, Lansing MI 48910", lat: 42.7080, lng: -84.5230 },
    { name: "Uplift AFC", address: "4632 Hughes Rd, Lansing MI 48910", lat: 42.6920, lng: -84.5150 },
  ],
  address: "1726 Teel Ave, Lansing MI 48910",
};

export const NAV_LINKS = [
  { label: "Home", href: "/" },
  { label: "About", href: "/about" },
  { label: "Services", href: "/services" },
  { label: "Projects", href: "/projects" },
  { label: "Gallery", href: "/gallery" },
  { label: "Contact", href: "/contact" },
];

export const SERVICES = [
  {
    id: "developmental",
    title: "Support for Developmentally Disabled Adults",
    shortTitle: "Developmentally Disabled Adults",
    description: "Personalized daily living assistance, skills training, and community integration programs designed to empower individuals with developmental disabilities to lead fulfilling lives.",
    features: [
      "Individualized daily living skills training",
      "Community integration and social engagement",
      "Behavioral support and positive reinforcement",
      "Recreational and therapeutic activities",
      "Family coordination and progress reporting",
    ],
    image: service01,
  },
  {
    id: "mental-health",
    title: "Care for Individuals with Mental Health Challenges",
    shortTitle: "Mental Health Support",
    description: "A therapeutic, supportive environment with medication management, emotional support programs, and structured routines to help individuals manage mental health conditions with dignity.",
    features: [
      "Therapeutic environment with trained staff",
      "Medication management and monitoring",
      "Emotional and psychological support programs",
      "Structured daily routines and activities",
      "Crisis intervention and de-escalation",
    ],
    image: service02,
  },
  {
    id: "aging",
    title: "Assistance for Aging Adults",
    shortTitle: "Aging Adult Care",
    description: "Comprehensive support for aging adults including mobility assistance, health monitoring, companionship, and nutritional care — ensuring comfort and well-being in a homelike setting.",
    features: [
      "Mobility support and fall prevention",
      "Health monitoring and wellness checks",
      "Companionship and social engagement",
      "Nutritional meal planning and preparation",
      "Coordination with healthcare providers",
    ],
    image: service03,
  },
  {
    id: "physical",
    title: "Support for Physically Handicapped Individuals",
    shortTitle: "Physical Disability Assistance",
    description: "Accessibility-focused living environments with adaptive equipment, physical therapy coordination, and personalized assistance to maximize independence and quality of life.",
    features: [
      "Adaptive equipment and assistive technology",
      "Physical therapy coordination",
      "Accessibility-focused living environments",
      "Personal care and daily living support",
      "Transportation and mobility assistance",
    ],
    image: service04,
  },
];
