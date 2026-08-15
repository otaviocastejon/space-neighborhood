const STORAGE_KEY = "space-neighborhood-lang";

const en = {
  brand: "Space Neighborhood",
  htmlLang: "en",
  menu: "Menu",
  hide: "Hide",
  looking: "looking around",
  watching: "watching {name}",
  time: "{y}y {d}d",
  hint: "click the Sun, a planet, the Moon, or the asteroid belt",
  didYouKnow: "Did you know? ",
  pause: "Pause",
  speed: "Speed",
  out: "out",
  home: "home",
  sunCue: "Sun",
  toast: {
    copied: "link copied",
    copyFail: "could not copy",
    reset: "back to the usual planets",
  },
  views: {
    earth: "Moon",
    inner: "Nearby",
    system: "Planets",
    outer: "Far out",
  },
  speeds: {
    1: { label: "Normal", hint: "days" },
    2: { label: "Fast", hint: "weeks" },
    3: { label: "Ultra", hint: "years" },
  },
  ui: {
    learn: "Learn",
    learnLede: "Shadows and the best nights to look up.",
    worlds: "Go to a world",
    look: "Look",
    lookLede: "Zoom to a neighborhood.",
    show: "Show",
    showLede: "Turn labels and extra details on or off.",
    names: "Names",
    namesLede: "Labels on planets",
    orbits: "Orbits",
    orbitsLede: "The paths planets follow",
    belt: "Asteroid belt",
    beltLede: "Rocks between Mars and Jupiter",
    trails: "Trails",
    trailsLede: "Glow behind a spaceship",
    startOver: "Start over",
    reset: "Reset",
    share: "Share",
    png: "PNG",
    happening: "What's happening",
  },
  learn: {
    "eclipse-solar": {
      title: "Total solar eclipse",
      lede: "The Moon covers the Sun. Day turns dark for a few minutes",
    },
    "eclipse-annular": {
      title: "Ring of fire",
      lede: "The Moon is a little too far away to cover the whole Sun",
    },
    "eclipse-lunar": {
      title: "Blood Moon",
      lede: "Earth’s shadow makes the Moon look copper-red",
    },
    mercury: {
      title: "Find Mercury",
      lede: "The evening star — low, fast, and close to the Sun",
    },
    venus: {
      title: "Find Venus at dawn",
      lede: "The morning star — the brightest thing after Sun and Moon",
    },
    mars: {
      title: "Mars all night",
      lede: "Opposition: Mars rises at sunset and stays up till morning",
    },
    jupiter: {
      title: "Jupiter all night",
      lede: "Opposition: the giant planet is easy to spot after dark",
    },
    saturn: {
      title: "Saturn all night",
      lede: "Opposition: the best time to look at the rings",
    },
  },
  facts: {
    speed: "Speed",
    fromSun: "From the Sun",
    fromEarth: "From Earth",
    lightTime: "Light-time from Earth",
    jet: "If you flew like a jet",
    year: "Year",
    yearEarth: "365.25 days to go around the Sun",
    lightSun: "Light from the Sun",
    lightSunVal: "8.3 minutes",
    orbitSun: "Time to orbit the Sun",
    realDist: "Real distance",
    realDistMoon: "384,000 km  ·  1.3 light-seconds",
    onMap: "On this map",
    onMapMoon: "the Moon is shown {n}× farther so you can see it next to Earth",
    live: "Could we live there?",
    phase: "Phase",
    distance: "Distance",
    flight: "Flight time",
    lightEarth: "Light-time to Earth",
    millionKm: "{n} million km",
    lightSeconds: "{n} light-seconds",
    lightMinutes: "{n} light-minutes",
    lightHours: "{n} light-hours",
    hours: "{n} hours",
    days: "{n} days",
    months: "{n} months",
    years: "{n} years",
  },
  guide: {
    system: {
      name: "The Solar System",
      role: "Our neighborhood in space",
      blurb:
        "A star, eight planets, one famous dwarf planet, moons, and a belt of leftover rocks. Everything here goes around the Sun. Click anything you see to learn about it.",
      didYouKnow:
        "The Sun is so big that about one million Earths could fit inside it. Planets look big on this map so you can see them — in real life they are tiny compared to the empty space between them.",
      facts: [
        ["Star", "1 · the Sun"],
        ["Planets", "8"],
        ["Dwarf planet on the map", "Pluto"],
        ["What to do", "Click the Sun, a planet, the Moon, or the asteroid belt"],
      ],
    },
    belt: {
      name: "Asteroid Belt",
      role: "Leftover rocks",
      blurb:
        "A ring of rocky leftovers between Mars and Jupiter. They never became a planet. Most are the size of a hill or a mountain. A few are as wide as a country.",
      didYouKnow:
        "Movies show asteroid belts as crowded obstacle courses. In real life the rocks are usually millions of kilometers apart. A spaceship can fly through with room to spare.",
      facts: [
        ["Where", "Between Mars and Jupiter"],
        ["Distance from the Sun", "about 2.2 to 3.2 AU"],
        ["Could we live there?", "No. No air, no water you can drink, and almost no gravity."],
      ],
    },
  },
  bodies: {
    sun: {
      name: "Sun",
      role: "Star",
      blurb:
        "A giant ball of hot glowing gas. It is not on fire like a campfire — it shines because atoms in its core squeeze together and make light. That light takes about 8 minutes to reach Earth.",
      didYouKnow:
        "The Sun is a star, just like the tiny ones in the night sky. Those look small because they are much, much farther away.",
      live: "No. It is millions of degrees in the core. Never look straight at it without a real solar filter.",
    },
    mercury: {
      name: "Mercury",
      role: "Rocky planet",
      blurb:
        "The closest planet to the Sun. Days are scorching and nights are freezing because it has almost no air to hold heat.",
      didYouKnow: "A year on Mercury is only 88 Earth days — it races around the Sun faster than any other planet.",
      live: "No. There is no air to breathe, and it can be hotter than an oven or colder than Antarctica.",
    },
    venus: {
      name: "Venus",
      role: "Rocky planet",
      blurb:
        "Almost the same size as Earth, but wrapped in thick yellow clouds of acid. It is the hottest planet — even hotter than Mercury.",
      didYouKnow: "Venus spins the wrong way. On Venus, the Sun would rise in the west.",
      live: "No. The air is poisonous and the ground is hot enough to melt lead.",
    },
    earth: {
      name: "Earth",
      role: "Rocky planet · our home",
      blurb:
        "The only world we know with liquid oceans, breathable air, and life. That blue is water. That white is clouds. That is us.",
      didYouKnow: "If Earth were a classroom globe, the atmosphere we breathe would be thinner than a coat of paint.",
      live: "Yes — this is the one. Everything alive we know lives here.",
    },
    mars: {
      name: "Mars",
      role: "Rocky planet",
      blurb:
        "The red planet. Iron rust in the dust makes it look orange-red. It has giant volcanoes, polar ice, and the biggest canyon in the solar system.",
      didYouKnow: "A day on Mars is 24 hours 37 minutes — almost like Earth. A year is almost twice as long.",
      live: "Not yet. The air is too thin to breathe, and it is very cold. Robots live there now. Maybe people later.",
    },
    jupiter: {
      name: "Jupiter",
      role: "Gas giant",
      blurb:
        "The king of the planets. You could fit more than 1,000 Earths inside it. It is a ball of gas and storms, not a place to stand.",
      didYouKnow: "The Great Red Spot is a storm bigger than Earth, and it has been raging for hundreds of years.",
      live: "No. There is no solid ground — a spaceship would just fall into endless clouds.",
    },
    saturn: {
      name: "Saturn",
      role: "Gas giant",
      blurb:
        "Famous for its rings: billions of ice and rock chunks orbiting like a racetrack. Saturn is a gas giant, like Jupiter, only paler.",
      didYouKnow: "Saturn could float in a giant bathtub. It is less dense than water.",
      live: "No. Like Jupiter, there is no ground to walk on. The rings would be a spectacular view from a spaceship.",
    },
    uranus: {
      name: "Uranus",
      role: "Ice giant",
      blurb:
        "A cold blue-green world far from the Sun. It is tipped on its side, so it rolls around its orbit like a ball.",
      didYouKnow: "A season on Uranus lasts about 21 Earth years. Summer and winter are very, very long.",
      live: "No. It is bitterly cold, and the ‘air’ is not something we can breathe.",
    },
    neptune: {
      name: "Neptune",
      role: "Ice giant",
      blurb:
        "The farthest planet. Deep blue, with the fastest winds in the solar system — over 1,000 miles per hour.",
      didYouKnow:
        "Neptune has completed only one trip around the Sun since it was discovered in 1846. Its first birthday (one Neptune year) was in 2011.",
      live: "No. It is dark, frozen, and wildly windy.",
    },
    pluto: {
      name: "Pluto",
      role: "Dwarf planet",
      blurb:
        "A small icy world at the edge of the neighborhood. It is called a dwarf planet now, but it is still a real world with mountains of ice and a thin sky.",
      didYouKnow: "A spacecraft called New Horizons flew past Pluto in 2015. It found a bright heart-shaped ice plain.",
      live: "No. It is farther and colder than you can easily imagine — sunlight there is very weak.",
    },
    moon: {
      name: "Moon",
      role: "Earth’s moon",
      blurb:
        "The only other world humans have walked on. It makes the tides, lights up the night, and has no air — footprints last millions of years.",
      didYouKnow:
        "The Moon is slowly drifting away from Earth, about 4 centimeters per year — as fast as your fingernails grow.",
      live: "People have visited, but you need a spacesuit. There is no air, and days are boiling while nights are freezing.",
    },
    asteroid: { name: "Asteroid" },
  },
  flight: {
    happening: "What's happening",
  },
  eclipse: {
    squish:
      "The Sun is really much farther away. We scooted Earth closer so you can see the Sun, the Moon, and Earth in one picture.",
    solar: {
      name: "Total solar eclipse",
      blurb:
        "Look left to right: Sun, then Moon, then Earth. The Moon is sitting in the way, so its shadow falls on Earth. That is why daytime can turn dark for a few minutes.",
      facts: [
        ["Lineup", "Sun → Moon → Earth"],
        ["What the Moon does", "Blocks sunlight"],
        ["What Earth sees", "Day turns dark on a thin path"],
      ],
    },
    annular: {
      name: "Ring of fire",
      blurb:
        "Same idea as a total eclipse — Moon between Sun and Earth — but the Moon is a little farther from Earth, so it looks too small to cover the whole Sun. You get a bright ring.",
      facts: [
        ["Lineup", "Sun → Moon → Earth"],
        ["Why a ring?", "The Moon is a bit too far away to cover the whole Sun"],
      ],
    },
    lunar: {
      name: "Blood Moon",
      blurb:
        "Now Earth is in the middle. Sunlight hits Earth, and Earth casts a shadow into space. The Moon has flown into that shadow, so it goes dark and copper-red. Safe to look at.",
      facts: [
        ["Lineup", "Sun → Earth → Moon"],
        ["What Earth does", "Blocks sunlight and casts a shadow"],
        ["What the Moon does", "Glows red from sunlight bent through Earth’s sunsets"],
      ],
    },
  },
  sky: {
    oppositionKnow:
      "When a planet is opposite the Sun, you can see it from sunset to sunrise. That is called opposition.",
    mars: {
      name: "Mars all night",
      blurb:
        "Sun, Earth, and Mars are in a straight line, with Mars on the outside. From Earth, Mars is opposite the Sun — so it rises at sunset and stays up till morning. Closest and brightest.",
      facts: [
        ["Lineup", "Sun → Earth → Mars"],
        ["In the sky", "Up all night"],
        ["How often", "about every 26 months"],
      ],
    },
    jupiter: {
      name: "Jupiter all night",
      blurb:
        "Sun, Earth, and Jupiter line up. Jupiter is opposite the Sun in our sky, so darkness and a bright giant planet arrive together. A great night to look up.",
      facts: [
        ["Lineup", "Sun → Earth → Jupiter"],
        ["In the sky", "Up all night"],
      ],
    },
    saturn: {
      name: "Saturn all night",
      blurb:
        "Sun, Earth, and Saturn line up. Saturn is opposite the Sun, so it is up all night — the best time to look at the rings.",
      facts: [
        ["Lineup", "Sun → Earth → Saturn"],
        ["In the sky", "Up all night"],
      ],
    },
    mercury: {
      name: "Find Mercury",
      blurb:
        "Mercury never strays far from the Sun. Here it is as far to the side as it can get — the evening star, low in the west after sunset. Look near the Sun, not high in the sky.",
      didYouKnow: "Mercury is fast. If you miss it this week, it may already be gone next week.",
      facts: [
        ["Where to look", "Low, near the Sun, after sunset"],
        ["Why it’s tricky", "It stays close to the Sun’s glare"],
      ],
    },
    venus: {
      name: "Venus at dawn",
      blurb:
        "Venus is as far from the Sun as it gets before sunrise — the morning star. After the Moon and the Sun, it is the brightest thing in the sky.",
      didYouKnow: "Venus is our cloudy neighbor. It is not a landing light, and it is not a UFO.",
      facts: [
        ["Where to look", "Low, near the Sun, before sunrise"],
        ["Brightness", "Brightest after Sun and Moon"],
      ],
    },
  },
};

const pt = {
  brand: "Vizinhança Espacial",
  htmlLang: "pt-BR",
  menu: "Menu",
  hide: "Ocultar",
  looking: "olhando em volta",
  watching: "acompanhando {name}",
  time: "{y}a {d}d",
  hint: "clique no Sol, num planeta, na Lua ou no cinturão de asteroides",
  didYouKnow: "Você sabia? ",
  pause: "Pausar",
  speed: "Velocidade",
  out: "ida",
  home: "volta",
  sunCue: "Sol",
  toast: {
    copied: "link copiado",
    copyFail: "não deu para copiar",
    reset: "de volta aos planetas de sempre",
  },
  views: {
    earth: "Lua",
    inner: "Perto",
    system: "Planetas",
    outer: "Lá longe",
  },
  speeds: {
    1: { label: "Normal", hint: "dias" },
    2: { label: "Rápido", hint: "semanas" },
    3: { label: "Ultra", hint: "anos" },
  },
  ui: {
    learn: "Aprender",
    learnLede: "Sombras e as melhores noites para olhar o céu.",
    worlds: "Ir para um mundo",
    look: "Olhar",
    lookLede: "Aproxime o zoom de um pedaço da vizinhança.",
    show: "Mostrar",
    showLede: "Ligue ou desligue nomes e detalhes extras.",
    names: "Nomes",
    namesLede: "Legendas nos planetas",
    orbits: "Órbitas",
    orbitsLede: "Os caminhos que os planetas seguem",
    belt: "Cinturão de asteroides",
    beltLede: "Pedras entre Marte e Júpiter",
    trails: "Rastros",
    trailsLede: "O brilho atrás da nave",
    startOver: "Recomeçar",
    reset: "Resetar",
    share: "Compartilhar",
    png: "PNG",
    happening: "O que está acontecendo",
  },
  learn: {
    "eclipse-solar": {
      title: "Eclipse solar total",
      lede: "A Lua tapa o Sol. O dia fica escuro por alguns minutos",
    },
    "eclipse-annular": {
      title: "Anel de fogo",
      lede: "A Lua está um pouquinho longe demais para cobrir o Sol inteiro",
    },
    "eclipse-lunar": {
      title: "Lua de sangue",
      lede: "A sombra da Terra deixa a Lua cobre-avermelhada",
    },
    mercury: {
      title: "Encontrar Mercúrio",
      lede: "A estrela da tarde — baixa, rápida e perto do Sol",
    },
    venus: {
      title: "Encontrar Vênus ao amanhecer",
      lede: "A estrela da manhã — o brilho mais forte depois do Sol e da Lua",
    },
    mars: {
      title: "Marte a noite toda",
      lede: "Oposição: Marte nasce no pôr do sol e fica até de manhã",
    },
    jupiter: {
      title: "Júpiter a noite toda",
      lede: "Oposição: o planeta gigante fica fácil de ver depois que escurece",
    },
    saturn: {
      title: "Saturno a noite toda",
      lede: "Oposição: a melhor hora para olhar os anéis",
    },
  },
  facts: {
    speed: "Velocidade",
    fromSun: "Do Sol",
    fromEarth: "Da Terra",
    lightTime: "Tempo da luz até a Terra",
    jet: "Se você voasse como um avião",
    year: "Ano",
    yearEarth: "365,25 dias para dar a volta no Sol",
    lightSun: "Luz do Sol",
    lightSunVal: "8,3 minutos",
    orbitSun: "Tempo para orbitar o Sol",
    realDist: "Distância de verdade",
    realDistMoon: "384.000 km  ·  1,3 segundos-luz",
    onMap: "Neste mapa",
    onMapMoon: "a Lua aparece {n}× mais longe para você enxergar ela ao lado da Terra",
    live: "Dá para morar lá?",
    phase: "Fase",
    distance: "Distância",
    flight: "Tempo de voo",
    lightEarth: "Tempo da luz até a Terra",
    millionKm: "{n} milhões de km",
    lightSeconds: "{n} segundos-luz",
    lightMinutes: "{n} minutos-luz",
    lightHours: "{n} horas-luz",
    hours: "{n} horas",
    days: "{n} dias",
    months: "{n} meses",
    years: "{n} anos",
  },
  guide: {
    system: {
      name: "O Sistema Solar",
      role: "Nossa vizinhança no espaço",
      blurb:
        "Uma estrela, oito planetas, um planeta anão famoso, luas e um cinturão de pedras sobrando. Tudo aqui gira em volta do Sol. Clique no que você ver para aprender.",
      didYouKnow:
        "O Sol é tão grande que caberiam cerca de um milhão de Terras dentro dele. Os planetas estão grandes neste mapa para você enxergar — na vida real eles são minúsculos perto do vazio entre eles.",
      facts: [
        ["Estrela", "1 · o Sol"],
        ["Planetas", "8"],
        ["Planeta anão no mapa", "Plutão"],
        ["O que fazer", "Clique no Sol, num planeta, na Lua ou no cinturão de asteroides"],
      ],
    },
    belt: {
      name: "Cinturão de Asteroides",
      role: "Pedras que sobraram",
      blurb:
        "Um anel de pedras entre Marte e Júpiter. Elas nunca viraram planeta. A maioria tem tamanho de morro ou montanha. Algumas são largas como um país.",
      didYouKnow:
        "Nos filmes o cinturão parece uma pista de obstáculos lotada. Na vida real as pedras costumam ficar a milhões de quilômetros uma da outra. Uma nave passa folgada.",
      facts: [
        ["Onde", "Entre Marte e Júpiter"],
        ["Distância do Sol", "cerca de 2,2 a 3,2 UA"],
        ["Dá para morar lá?", "Não. Sem ar, sem água para beber e quase sem gravidade."],
      ],
    },
  },
  bodies: {
    sun: {
      name: "Sol",
      role: "Estrela",
      blurb:
        "Uma bola gigante de gás quente e brilhante. Não é fogo de fogueira — ele brilha porque átomos no núcleo se espremem e viram luz. Essa luz leva cerca de 8 minutos para chegar à Terra.",
      didYouKnow:
        "O Sol é uma estrela, igualzinha às pequenininhas no céu de noite. Elas parecem pequenas porque estão muito, muito mais longe.",
      live: "Não. O núcleo tem milhões de graus. Nunca olhe direto para ele sem um filtro solar de verdade.",
    },
    mercury: {
      name: "Mercúrio",
      role: "Planeta rochoso",
      blurb:
        "O planeta mais perto do Sol. Os dias são um forno e as noites um freezer, porque quase não tem ar para guardar o calor.",
      didYouKnow: "Um ano em Mercúrio tem só 88 dias terrestres — ele corre em volta do Sol mais rápido que todo mundo.",
      live: "Não. Não tem ar para respirar, e pode ser mais quente que um forno ou mais frio que a Antártida.",
    },
    venus: {
      name: "Vênus",
      role: "Planeta rochoso",
      blurb:
        "Quase do tamanho da Terra, mas envolto em nuvens amarelas de ácido. É o planeta mais quente — mais quente até que Mercúrio.",
      didYouKnow: "Vênus gira para o lado errado. Em Vênus, o Sol nasceria no oeste.",
      live: "Não. O ar é venenoso e o chão é quente o bastante para derreter chumbo.",
    },
    earth: {
      name: "Terra",
      role: "Planeta rochoso · nossa casa",
      blurb:
        "O único mundo que conhecemos com oceanos líquidos, ar para respirar e vida. Aquele azul é água. Aquele branco é nuvem. Aquilo somos nós.",
      didYouKnow: "Se a Terra fosse um globo de sala de aula, a atmosfera que respiramos seria mais fina que uma tinta.",
      live: "Sim — é este. Tudo que está vivo, que a gente conhece, mora aqui.",
    },
    mars: {
      name: "Marte",
      role: "Planeta rochoso",
      blurb:
        "O planeta vermelho. Ferrugem na poeira deixa ele alaranjado. Tem vulcões gigantes, gelo nos polos e o maior cânion do Sistema Solar.",
      didYouKnow: "Um dia em Marte tem 24 horas e 37 minutos — quase como a Terra. Um ano dura quase o dobro.",
      live: "Ainda não. O ar é fino demais para respirar, e faz muito frio. Robôs moram lá agora. Quem sabe pessoas depois.",
    },
    jupiter: {
      name: "Júpiter",
      role: "Gigante gasoso",
      blurb:
        "O rei dos planetas. Caberiam mais de 1.000 Terras dentro dele. É uma bola de gás e tempestades, não um chão para pisar.",
      didYouKnow: "A Grande Mancha Vermelha é uma tempestade maior que a Terra, e já dura centenas de anos.",
      live: "Não. Não tem chão sólido — a nave cairia em nuvens sem fim.",
    },
    saturn: {
      name: "Saturno",
      role: "Gigante gasoso",
      blurb:
        "Famoso pelos anéis: bilhões de pedaços de gelo e rocha girando como uma pista de corrida. Saturno é um gigante de gás, como Júpiter, só que mais pálido.",
      didYouKnow: "Saturno flutuaria numa banheira gigante. Ele é menos denso que a água.",
      live: "Não. Como Júpiter, não tem chão. Os anéis seriam um espetáculo vistos de uma nave.",
    },
    uranus: {
      name: "Urano",
      role: "Gigante de gelo",
      blurb:
        "Um mundo frio azul-esverdeado, longe do Sol. Ele está deitado de lado, então rola na órbita como uma bola.",
      didYouKnow: "Uma estação em Urano dura cerca de 21 anos terrestres. Verão e inverno são muito, muito longos.",
      live: "Não. É um frio danado, e o “ar” não é nada que a gente possa respirar.",
    },
    neptune: {
      name: "Netuno",
      role: "Gigante de gelo",
      blurb:
        "O planeta mais distante. Azul profundo, com os ventos mais rápidos do Sistema Solar — mais de 1.600 km/h.",
      didYouKnow:
        "Netuno só completou uma volta no Sol desde que foi descoberto em 1846. O primeiro aniversário (um ano de Netuno) foi em 2011.",
      live: "Não. É escuro, congelado e com um vento bravo.",
    },
    pluto: {
      name: "Plutão",
      role: "Planeta anão",
      blurb:
        "Um mundinho gelado na beira da vizinhança. Hoje ele é chamado de planeta anão, mas continua sendo um mundo de verdade, com montanhas de gelo e um céuzinho fino.",
      didYouKnow:
        "A nave New Horizons passou por Plutão em 2015. Encontrou uma planície de gelo brilhante em forma de coração.",
      live: "Não. É mais longe e mais frio do que dá para imaginar — a luz do Sol lá é bem fraquinha.",
    },
    moon: {
      name: "Lua",
      role: "A lua da Terra",
      blurb:
        "O único outro mundo em que humanos já caminharam. Ela faz as marés, clareia a noite e não tem ar — pegadas duram milhões de anos.",
      didYouKnow:
        "A Lua está se afastando da Terra bem devagar, uns 4 centímetros por ano — na velocidade que a unha cresce.",
      live: "Gente já visitou, mas precisa de um traje espacial. Não tem ar, o dia ferve e a noite congela.",
    },
    asteroid: { name: "Asteroide" },
  },
  flight: {
    happening: "O que está acontecendo",
  },
  eclipse: {
    squish:
      "O Sol fica bem mais longe na vida real. Aproximamos a Terra neste mapa para caber o Sol, a Lua e a Terra na mesma figura.",
    solar: {
      name: "Eclipse solar total",
      blurb:
        "Olhe da esquerda para a direita: Sol, depois Lua, depois Terra. A Lua está no caminho, então a sombra dela cai na Terra. Por isso o dia pode ficar escuro por alguns minutos.",
      facts: [
        ["Alinhamento", "Sol → Lua → Terra"],
        ["O que a Lua faz", "Bloqueia a luz do Sol"],
        ["O que a Terra vê", "O dia escurece numa faixa fininha"],
      ],
    },
    annular: {
      name: "Anel de fogo",
      blurb:
        "A mesma ideia do eclipse total — Lua entre o Sol e a Terra — mas a Lua está um pouco mais longe da Terra, então parece pequena demais para tapar o Sol inteiro. Sobram um anel brilhante.",
      facts: [
        ["Alinhamento", "Sol → Lua → Terra"],
        ["Por que um anel?", "A Lua está um pouco longe demais para cobrir o Sol todo"],
      ],
    },
    lunar: {
      name: "Lua de sangue",
      blurb:
        "Agora a Terra está no meio. A luz do Sol bate na Terra, e a Terra joga uma sombra no espaço. A Lua entrou nessa sombra, então fica escura e cobre-avermelhada. Pode olhar sem medo.",
      facts: [
        ["Alinhamento", "Sol → Terra → Lua"],
        ["O que a Terra faz", "Bloqueia a luz do Sol e faz sombra"],
        ["O que a Lua faz", "Fica vermelha com a luz que atravessa os pores do sol da Terra"],
      ],
    },
  },
  sky: {
    oppositionKnow:
      "Quando um planeta fica do lado oposto ao Sol, você pode vê-lo do pôr do sol até o nascer do sol. Isso se chama oposição.",
    mars: {
      name: "Marte a noite toda",
      blurb:
        "Sol, Terra e Marte estão numa linha reta, com Marte do lado de fora. Da Terra, Marte fica oposto ao Sol — então nasce no pôr do sol e fica até de manhã. Mais perto e mais brilhante.",
      facts: [
        ["Alinhamento", "Sol → Terra → Marte"],
        ["No céu", "A noite toda"],
        ["De quanto em quanto", "cerca de a cada 26 meses"],
      ],
    },
    jupiter: {
      name: "Júpiter a noite toda",
      blurb:
        "Sol, Terra e Júpiter se alinham. Júpiter fica oposto ao Sol no nosso céu, então a escuridão e um planeta gigante brilhante chegam juntos. Uma ótima noite para olhar para cima.",
      facts: [
        ["Alinhamento", "Sol → Terra → Júpiter"],
        ["No céu", "A noite toda"],
      ],
    },
    saturn: {
      name: "Saturno a noite toda",
      blurb:
        "Sol, Terra e Saturno se alinham. Saturno fica oposto ao Sol, então fica visível a noite toda — a melhor hora para olhar os anéis.",
      facts: [
        ["Alinhamento", "Sol → Terra → Saturno"],
        ["No céu", "A noite toda"],
      ],
    },
    mercury: {
      name: "Encontrar Mercúrio",
      blurb:
        "Mercúrio nunca se afasta muito do Sol. Aqui ele está o mais para o lado que consegue — a estrela da tarde, baixa no oeste depois do pôr do sol. Olhe perto do Sol, não no alto do céu.",
      didYouKnow: "Mercúrio é rápido. Se você perder esta semana, na próxima ele já pode ter sumido.",
      facts: [
        ["Onde olhar", "Baixo, perto do Sol, depois do pôr do sol"],
        ["Por que é difícil", "Ele fica colado no clarão do Sol"],
      ],
    },
    venus: {
      name: "Vênus ao amanhecer",
      blurb:
        "Vênus está o mais longe do Sol que chega antes do nascer do sol — a estrela da manhã. Depois da Lua e do Sol, é a coisa mais brilhante no céu.",
      didYouKnow: "Vênus é nossa vizinha nublada. Não é luz de pista e não é OVNI.",
      facts: [
        ["Onde olhar", "Baixo, perto do Sol, antes do nascer do sol"],
        ["Brilho", "O mais forte depois do Sol e da Lua"],
      ],
    },
  },
};

const MESSAGES = { en, pt };

let locale = detectLocale();
const listeners = new Set();

function detectLocale() {
  try {
    const saved = localStorage.getItem(STORAGE_KEY);
    if (saved === "en" || saved === "pt") return saved;
  } catch {
    /* ignore */
  }
  const nav = (navigator.language || "en").toLowerCase();
  return nav.startsWith("pt") ? "pt" : "en";
}

function lookup(dict, path) {
  return path.split(".").reduce((o, k) => (o == null ? o : o[k]), dict);
}

export function t(path, vars) {
  let value = lookup(MESSAGES[locale], path);
  if (value == null) value = lookup(MESSAGES.en, path);
  if (value == null) return path;
  if (typeof value !== "string") return value;
  if (!vars) return value;
  return value.replace(/\{(\w+)\}/g, (_, k) => (vars[k] == null ? `{${k}}` : String(vars[k])));
}

export function getLocale() {
  return locale;
}

export function localeTag() {
  return locale === "pt" ? "pt-BR" : "en-US";
}

export function setLocale(next) {
  const lang = next === "pt" ? "pt" : "en";
  if (lang === locale) return;
  locale = lang;
  try {
    localStorage.setItem(STORAGE_KEY, locale);
  } catch {
    /* ignore */
  }
  applyDocumentLang();
  for (const fn of listeners) fn(locale);
}

export function onLocaleChange(fn) {
  listeners.add(fn);
  return () => listeners.delete(fn);
}

export function bodyCopy(id) {
  return t(`bodies.${id}`) || {};
}

export function applyBodyCopy(body) {
  const key = body.kind === "asteroid" ? "asteroid" : body.id;
  const copy = bodyCopy(key);
  if (!copy || typeof copy !== "object") return body;
  if (copy.name) body.name = copy.name;
  if (copy.role) body.role = copy.role;
  if (copy.blurb) body.blurb = copy.blurb;
  if (copy.didYouKnow) body.didYouKnow = copy.didYouKnow;
  if (copy.live) body.live = copy.live;
  return body;
}

export function localizeState(state) {
  if (!state) return;
  for (const b of state.bodies || []) applyBodyCopy(b);
  for (const tr of state.tracers || []) applyBodyCopy(tr);
}

export function applyStaticI18n() {
  applyDocumentLang();
  document.title = t("brand");
  const desc = document.querySelector('meta[name="description"]');
  if (desc) {
    desc.setAttribute(
      "content",
      locale === "pt"
        ? "Um Sistema Solar para crianças curiosas. Clique num planeta para aprender."
        : "A solar system for curious kids. Click a planet to learn about it."
    );
  }
  document.documentElement.style.setProperty("--did-you-know", JSON.stringify(t("didYouKnow")));
  for (const el of document.querySelectorAll("[data-i18n]")) {
    const value = t(el.dataset.i18n);
    if (typeof value === "string") el.textContent = value;
  }
  for (const el of document.querySelectorAll("[data-i18n-aria]")) {
    el.setAttribute("aria-label", t(el.dataset.i18nAria));
  }
  for (const el of document.querySelectorAll("[data-i18n-title]")) {
    el.setAttribute("title", t(el.dataset.i18nTitle));
  }
  for (const btn of document.querySelectorAll("[data-lang]")) {
    btn.classList.toggle("active", btn.dataset.lang === locale);
  }
}

function applyDocumentLang() {
  document.documentElement.lang = t("htmlLang");
}

export { locale as currentLocale };
