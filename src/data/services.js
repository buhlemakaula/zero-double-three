// Exact catalog data — do not invent or alter. Mirrors the `services` table.
// `price` is in ZAR rand (integer). `duration_min` is null where the artist
// did not publish a fixed duration.
export const SERVICES = [
  {
    id: 'makeup-looks',
    category: 'makeup',
    name: 'Makeup looks',
    price: 650,
    duration_min: 60,
    photo: '/photos/glam-curly.jpg',
    description:
      'All looks include foundation, contour and highlight, eyebrow fill-in, any eyeshadow look of your choice, eyeliner (black or white) and a lip of your choice.',
    highlight: 'Lashes are included.',
  },
  {
    id: 'hair-and-makeup',
    category: 'makeup',
    name: 'Hair and makeup',
    price: 1000,
    duration_min: 150,
    photo: '/photos/hero-leather.jpg',
    description:
      'This package includes both basic wig install and a face beat of your choice.',
  },
  {
    id: 'basic-wig-installation',
    category: 'hair',
    name: 'Basic wig installation',
    price: 400,
    duration_min: 60,
    photo: '/photos/glam-blue.jpg',
    description:
      'Your wig needs to be customised and clean. Middle or side parting. Does not include snoopy.',
    highlight: 'Customised & clean units only.',
  },
  {
    id: 'install-styling',
    category: 'hair',
    name: 'Install + styling',
    price: 550,
    duration_min: null,
    photo: '/photos/glam-white.jpg',
    description: 'Wig installation with a styled finish.',
  },
  {
    id: 'customisation',
    category: 'hair',
    name: 'Customisation',
    price: 250,
    duration_min: null,
    photo: '/photos/glam-blue.jpg',
    description:
      'Drop off and collection dates need to be specified. Includes bleaching knots and plucking.',
    caption: 'My units come customised 💋',
  },
  {
    id: 'house-call',
    category: 'callout',
    name: 'House call / Call out',
    price: 500,
    duration_min: null,
    photo: '/photos/hero-leather.jpg',
    description:
      'Minimum of 3 people. Client is responsible for transportation to and from — I do organise my own (Bolt rates). Arrival time depends on the start time of the event.',
    highlight: 'Minimum 3 people.',
  },
]

export const SERVICE_TABS = [
  { id: 'makeup', label: 'Makeup' },
  { id: 'hair', label: 'Hair' },
]

export const getService = (id) => SERVICES.find((s) => s.id === id)
export const makeupServices = () => SERVICES.filter((s) => s.category === 'makeup')
export const hairServices = () => SERVICES.filter((s) => s.category === 'hair')
export const calloutServices = () => SERVICES.filter((s) => s.category === 'callout')
