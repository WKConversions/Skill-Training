// The sample app follows GoHere's own demo on gohere.app: a branded homepage of tiles, a map, a tip page
// and a bucket list, set in Rome (their demo bucket list is in Rome). "Your favourite restaurant" is their
// demo's placeholder tip, kept so no real business is given invented details. The four client skins use
// each client's real app icon and colours (VVV Terschelling's header is from their real app screen).

export type Skin = {
  id: string; name: string; header: string; headerPos?: string; logo?: string; accent: string; tile: string; tileInk: string; welcome: string;
};
export const SKINS: Record<string, Skin> = {
  brand: { id: "brand", name: "Your brand", header: "photos/rome-skyline", headerPos: "50% 60%", accent: "#141430", tile: "linear-gradient(160deg, #2B3A78 0%, #141430 100%)", tileInk: "#FFFFFF", welcome: "Welcome to Rome!" },
  terschelling: { id: "terschelling", name: "Terschelling Tips", header: "img/vvv-tegels", headerPos: "50% 4%", logo: "img/logo-terschelling-tips.png", accent: "#1F5BC4", tile: "#E8416F", tileInk: "#FFFFFF", welcome: "Hi, looking for inspiration?" },
  transavia: { id: "transavia", name: "Transavia Tips", header: "photos/wing", headerPos: "50% 40%", logo: "img/logo-transavia-tips.png", accent: "#2800A1", tile: "linear-gradient(160deg, #3A10C8 0%, #2800A1 100%)", tileInk: "#FFFFFF", welcome: "Tips from our crew" },
  ciaotutti: { id: "ciaotutti", name: "Ciao Tutti", header: "photos/rome-view", headerPos: "50% 50%", logo: "img/logo-ciao-tutti.png", accent: "#E53336", tile: "#3E9B4F", tileInk: "#FFFFFF", welcome: "Italy's best tips" },
  barcelona: { id: "barcelona", name: "BarcelonaTips", header: "photos/barcelona", headerPos: "50% 50%", logo: "img/logo-barcelonatips.png", accent: "#F74F4F", tile: "#F74F4F", tileInk: "#FFFFFF", welcome: "Annebeth's Barcelona" },
};
export const CLIENTS = ["terschelling", "transavia", "ciaotutti", "barcelona"] as const;

export type Tile = { id: string; label: string; photo?: string; type: string };
// the homepage, as it starts; tile types are the portal's own
export const TILES: Tile[] = [
  { id: "rest", label: "Restaurants", photo: "photos/ristorante", type: "List behind tile" },
  { id: "near", label: "Top tips near you", type: "Tips nearby" },
  { id: "add", label: "Add a tip", type: "Add review" },
  { id: "gems", label: "Hidden gems", photo: "photos/alley", type: "List behind tile" },
  { id: "sights", label: "Sights", photo: "photos/navona", type: "List behind tile" },
  { id: "contact", label: "Contact", type: "Article behind tile" },
];
// the tile the viewer adds in "You choose what appears on the homepage"
export const NEW_TILE: Tile = { id: "pasta", label: "Best pasta in town", photo: "photos/pasta", type: "List behind tile" };
export const TILE_TYPES = ["List behind tile", "Tips nearby", "Article behind tile", "Add review", "External url behind tile"];

export const BUCKET = [
  { name: "Colosseum", photo: "photos/colosseum" },
  { name: "Pantheon", photo: "photos/pantheon" },
  { name: "Trevi Fountain", photo: "photos/trevi" },
  { name: "Piazza Navona", photo: "photos/navona-fountain" },
];
export const PORTAL_NAV = ["Dashboard", "Home", "Advertorials", "Reviews", "Top tips", "Articles", "Lists"];
