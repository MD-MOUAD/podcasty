import { DiscoverIcon, HomeIcon, MicrophoneIcon } from "@/constants/icons";

export const sidebarLinks = [
  {
    route: "/",
    label: "Home",
    icon: HomeIcon,
  },
  {
    route: "/discover",
    label: "Discover",
    icon: DiscoverIcon,
  },
  {
    route: "/create-podcast",
    label: "Create Podcast",
    icon: MicrophoneIcon,
  },
];

export const trendingPodcast = [
  {
    id: 1,
    title: "Waveform",
    description: "Join Michelle Obama in conversation",
    imgURL: "/images/waveform.jpg",
  },
  {
    id: 2,
    title: "The Joe Rogan Experience",
    description: "A long form, in-depth conversation",
    imgURL: "/images/joe-rogan.jpg",
  },
  {
    id: 3,
    title: "GaryVee Audio Experience",
    description: "A long form, in-depth conversation",
    imgURL: "/images/gv-audio.jpg",
  },

  {
    id: 4,
    title: "IMPAULSIVE",
    description: "A long form, in-depth conversation",
    imgURL: "/images/impaulsive.jpg",
  },
];
