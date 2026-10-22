export type Mission = {
  id: number;
  /** Short exhibit-label title, e.g. "The Stone That Spoke Three Times" */
  title: string;
  /** The object the label belongs to */
  object: string;
  /** Small kicker above the question, e.g. "Gallery 1 · Stone" */
  kicker: string;
  question: string;
  options: [string, string, string, string];
  correctIndex: 0 | 1 | 2 | 3;
  /** Teaching explanation shown when the player answers correctly */
  explanationCorrect: string;
  /** Teaching explanation shown when the player answers incorrectly */
  explanationWrong: string;
  /** One-line fact used in the completion recap */
  learned: string;
  sourceName: string;
  sourceUrl: string;
  /** Optional second source shown alongside the primary one */
  extraSource?: { name: string; url: string };
  /** key into the inline SVG icon set */
  icon: "stone" | "gears" | "ice";
};

export const MISSIONS: Mission[] = [
  {
    id: 1,
    title: "The Stone That Spoke Three Times",
    object: "The Rosetta Stone",
    kicker: "Gallery I · Stone",
    icon: "stone",
    question:
      "What does the Rosetta Stone's decree mainly help scholars do?",
    options: [
      "Decode Egyptian hieroglyphs, because the same text appears in three scripts",
      "Measure the exact weight of Egyptian temple offerings",
      "Record the family tree of the pharaohs' architects",
      "Map the trade routes of the ancient Mediterranean",
    ],
    correctIndex: 0,
    explanationCorrect:
      "Exactly right. The Rosetta Stone carries one decree in three scripts — hieroglyphic, Demotic and Ancient Greek — so the known Greek could be used to unlock the hieroglyphs. It was carved in 196 BC, a decree from the priests of Memphis honouring King Ptolemy V. Jean-François Champollion worked out the hieroglyphic decipherment in 1822, and the stone has been in the British Museum since 1802.",
    explanationWrong:
      "Not quite — the stone is a key to a language, not a ledger. Its decree is written three times over: in hieroglyphic, Demotic and Ancient Greek. Because scholars could still read Greek, the parallel text let them crack the hieroglyphs. The stone was carved in 196 BC as a decree of the priests of Memphis honouring King Ptolemy V; Champollion's decipherment came in 1822, and it has been in the British Museum since 1802.",
    learned:
      "The Rosetta Stone's parallel decree in hieroglyphic, Demotic and Ancient Greek is what let scholars decode Egyptian hieroglyphs (Champollion, 1822).",
    sourceName: "The British Museum — “The Rosetta Stone” (EA24)",
    sourceUrl: "https://www.britishmuseum.org/collection/object/Y_EA24",
  },
  {
    id: 2,
    title: "The Bronze Computer in the Sea",
    object: "The Antikythera Mechanism",
    kicker: "Gallery II · Bronze",
    icon: "gears",
    question: "What was the Antikythera Mechanism used for?",
    options: [
      "Navigating ships by magnetic compass",
      "Predicting astronomical positions and eclipses with interlocking gears",
      "Weighing and stamping silver coinage",
      "Pumping water out of a harbour basin",
    ],
    correctIndex: 1,
    explanationCorrect:
      "Correct. It is a geared bronze device that modelled the movements of the heavens — predicting astronomical positions and eclipses — and it is often described as an ancient analogue computer. It was recovered in 1901 from a shipwreck off the Greek island of Antikythera, dates to roughly the 2nd century BC, and CT imaging in the 2000s revealed at least 30 interlocking bronze gears. It is housed in the National Archaeological Museum, Athens.",
    explanationWrong:
      "Not quite. The Antikythera Mechanism is an astronomical calculator: its interlocking bronze gears modelled the heavens to predict astronomical positions and eclipses, which is why it is often called an ancient analogue computer. It came up in 1901 from a shipwreck off the Greek island of Antikythera, dates to roughly the 2nd century BC, and CT imaging in the 2000s revealed at least 30 gears. It is housed in the National Archaeological Museum, Athens.",
    learned:
      "The Antikythera Mechanism (2nd century BC, found in a shipwreck in 1901) used at least 30 bronze gears to predict astronomical positions and eclipses.",
    sourceName:
      "National Archaeological Museum, Athens — Collection",
    sourceUrl: "https://www.namuseum.gr/en/collection/",
    extraSource: {
      name: "Freeth et al., “Decoding the ancient Greek astronomical calculator known as the Antikythera Mechanism”, Nature 444 (2006)",
      url: "https://www.nature.com/articles/nature05357",
    },
  },
  {
    id: 3,
    title: "The Traveller in the Ice",
    object: "Ötzi the Iceman",
    kicker: "Gallery III · Ice",
    icon: "ice",
    question: "Roughly how old is Ötzi the Iceman, and where was he found?",
    options: [
      "About 5,300 years old, in the Ötztal Alps on the Austrian–Italian border",
      "About 800 years old, in a glacier in Norway",
      "About 20,000 years old, in a cave in southern France",
      "About 300 years old, on a mountain pass in Switzerland",
    ],
    correctIndex: 0,
    explanationCorrect:
      "That's it. Ötzi is roughly 5,300 years old — radiocarbon dating places him around 3300 BC. Hikers found him in September 1991 at the Tisenjoch pass in the Ötztal Alps, on the Austrian–Italian border. His body, clothing and equipment are studied and displayed by the South Tyrol Museum of Archaeology in Bolzano, Italy.",
    explanationWrong:
      "Not quite. Ötzi is roughly 5,300 years old — radiocarbon dating places him around 3300 BC — and hikers found him in September 1991 at the Tisenjoch pass in the Ötztal Alps, on the Austrian–Italian border. His body, clothing and equipment are studied and displayed by the South Tyrol Museum of Archaeology in Bolzano, Italy.",
    learned:
      "Ötzi the Iceman is roughly 5,300 years old (c. 3300 BC) and was found in September 1991 at the Tisenjoch pass in the Ötztal Alps, on the Austrian–Italian border.",
    sourceName: "South Tyrol Museum of Archaeology, Bolzano — Ötzi",
    sourceUrl: "https://www.iceman.it/en/",
  },
];
