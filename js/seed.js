import { db, collection, addDoc, doc, setDoc } from './firebase-config.js';

export async function seedDatabase() {
  await setDoc(doc(db, 'settings', 'general'), {
    siteName: 'F&F HUB', heroTitle: 'FAST AND FURIOUS',
    heroSubtitle: 'The definitive hub for Fast & Furious fans. Movies, characters, legendary rides, and the quotes that built a family — one quarter mile at a time.',
    heroCta1: 'EXPLORE MOVIES', heroCta2: 'THE RIDES',
    statsMovies: '10', statsCharacters: '08', statsCars: '06', statsQuotes: '07',
    footerQuote: "FAMILY IS NOT AN IMPORTANT THING – IT'S EVERYTHING.", footerQuoteAuthor: '— DOMINIC TORETTO',
    footerDesc: 'The definitive fan hub for the Fast & Furious franchise. Movies, characters, iconic rides, and legendary quotes — all in one place.',
    footerCredit: 'A fan-made tribute. © 2026 F&F Hub · For the family.',
    moviesPageTitle: 'MOVIES', moviesPageSubtitle: 'THE FRANCHISE', moviesPageDesc: 'Every chapter of the Fast Saga, from street racing to global heists.',
    charactersPageTitle: 'CHARACTERS', charactersPageSubtitle: 'THE CREW', charactersPageDesc: "The family that drives the saga — legends in the driver's seat.",
    carsPageTitle: 'LEGENDARY RIDES', carsPageSubtitle: 'THE GARAGE', carsPageDesc: 'Every iconic machine that earned a spot in the saga.',
    quotesPageTitle: 'ICONIC QUOTES', quotesPageSubtitle: 'WORDS TO LIVE BY', quotesPageDesc: 'The lines that defined a franchise.',
    newsPageTitle: 'NEWS & EVENTS', newsPageSubtitle: 'LATEST DROP', newsPageDesc: 'Fresh updates from the F&F universe.',
    paulWalkerDates: 'September 12, 1973 – November 30, 2013',
    paulWalkerSubtitle: 'Actor. Philanthropist. The heart behind Brian O\'Conner. Forever part of the family.',
    paulWalkerHeroQuote: '"SEE YOU AGAIN."', paulWalkerHeroQuoteSource: 'FURIOUS 7, 2015',
    paulWalkerBio: "Paul Walker was many things: a devoted father to Meadow, an avid marine biologist, and one of Hollywood's most genuine souls.\n\nHis portrayal of Brian O'Conner brought warmth, loyalty, and humanity to a franchise that could have been pure spectacle.\n\nOn November 30, 2013, Paul passed away in a car accident while on a break from filming Furious 7. He was 40 years old. The world lost a star, but the family never let go.",
    rowwTitle: 'REACH OUT WORLDWIDE', rowwDesc: "Paul's disaster relief charity ROWW continues its mission today, deploying skilled volunteers to natural disaster zones worldwide. His legacy lives on through every life they touch.",
  });

  const movies = [
    {order:1,year:'2001',title:'THE FAST AND THE FURIOUS',director:'Dir. Rob Cohen',image:'https://upload.wikimedia.org/wikipedia/en/thumb/5/51/Fast_and_the_furious_movie_poster.jpg/220px-Fast_and_the_furious_movie_poster.jpg'},
    {order:2,year:'2003',title:'2 FAST 2 FURIOUS',director:'Dir. John Singleton',image:'https://upload.wikimedia.org/wikipedia/en/thumb/b/b4/2_fast_2_furious_ver3.jpg/220px-2_fast_2_furious_ver3.jpg'},
    {order:3,year:'2006',title:'THE FAST AND THE FURIOUS: TOKYO DRIFT',director:'Dir. Justin Lin',image:'https://upload.wikimedia.org/wikipedia/en/thumb/1/10/Poster_-_Fast_and_Furious_Tokyo_Drift.jpg/220px-Poster_-_Fast_and_Furious_Tokyo_Drift.jpg'},
    {order:4,year:'2009',title:'FAST & FURIOUS',director:'Dir. Justin Lin',image:'https://upload.wikimedia.org/wikipedia/en/thumb/7/75/Fast-_furious-_2009.jpg/220px-Fast-_furious-_2009.jpg'},
    {order:5,year:'2011',title:'FAST FIVE',director:'Dir. Justin Lin',image:'https://upload.wikimedia.org/wikipedia/en/thumb/4/4d/Fast_five_poster.jpg/220px-Fast_five_poster.jpg'},
    {order:6,year:'2013',title:'FAST & FURIOUS 6',director:'Dir. Justin Lin',image:'https://upload.wikimedia.org/wikipedia/en/thumb/1/12/Fast_and_Furious_6_film_poster.jpg/220px-Fast_and_Furious_6_film_poster.jpg'},
    {order:7,year:'2015',title:'FURIOUS 7',director:'Dir. James Wan',image:'https://upload.wikimedia.org/wikipedia/en/thumb/2/2e/Furious_7_poster.jpg/220px-Furious_7_poster.jpg'},
    {order:8,year:'2017',title:'THE FATE OF THE FURIOUS',director:'Dir. F. Gary Gray',image:'https://upload.wikimedia.org/wikipedia/en/thumb/7/7e/The-fate-of-the-furious-2017.png/220px-The-fate-of-the-furious-2017.png'},
    {order:9,year:'2021',title:'F9: THE FAST SAGA',director:'Dir. Justin Lin',image:'https://upload.wikimedia.org/wikipedia/en/thumb/d/d8/F9_-_The_Fast_Saga.png/220px-F9_-_The_Fast_Saga.png'},
    {order:10,year:'2023',title:'FAST X',director:'Dir. Louis Leterrier',image:'https://upload.wikimedia.org/wikipedia/en/thumb/d/d2/Fast_X_poster.jpg/220px-Fast_X_poster.jpg'},
  ];
  for (const m of movies) await addDoc(collection(db,'movies'), m);

  const characters = [
    {order:1,name:'DOMINIC TORETTO',actor:'VIN DIESEL',image:'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=400&q=80&grayscale'},
    {order:2,name:"BRIAN O'CONNER",actor:'PAUL WALKER',image:'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?w=400&q=80&grayscale'},
    {order:3,name:'LETTY ORTIZ',actor:'MICHELLE RODRIGUEZ',image:'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=400&q=80&grayscale'},
    {order:4,name:'ROMAN PEARCE',actor:'TYRESE GIBSON',image:'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?w=400&q=80&grayscale'},
    {order:5,name:'TEJ PARKER',actor:'LUDACRIS',image:'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=400&q=80&grayscale'},
    {order:6,name:'MIA TORETTO',actor:'JORDANA BREWSTER',image:'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=400&q=80&grayscale'},
    {order:7,name:'LUKE HOBBS',actor:'DWAYNE JOHNSON',image:'https://images.unsplash.com/photo-1547425260-76bcadfb4f2c?w=400&q=80&grayscale'},
    {order:8,name:'HAN LUE',actor:'SUNG KANG',image:'https://images.unsplash.com/photo-1463453091185-61582044d556?w=400&q=80&grayscale'},
  ];
  for (const c of characters) await addDoc(collection(db,'characters'), c);

  const cars = [
    {order:1,name:"DOM'S 1970 DODGE CHARGER R/T",model:'1970 Dodge Charger R/T',driver:'DRIVEN BY DOMINIC TORETTO',hp:'900 HP',image:'https://images.unsplash.com/photo-1555215695-3004980ad54e?w=600&q=80'},
    {order:2,name:"BRIAN'S 1995 TOYOTA SUPRA",model:'1995 Toyota Supra MK4',driver:"DRIVEN BY BRIAN O'CONNER",hp:'544 HP',image:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80'},
    {order:3,name:"DOM'S 1993 MAZDA RX-7",model:'1993 Mazda RX-7',driver:'DRIVEN BY DOMINIC TORETTO',hp:'350 HP',image:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80'},
    {order:4,name:"BRIAN'S NISSAN SKYLINE GT-R R34",model:'1999 Nissan Skyline GT-R R34',driver:"DRIVEN BY BRIAN O'CONNER",hp:'550 HP',image:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80'},
    {order:5,name:"HAN'S MAZDA RX-7 VEILSIDE",model:'2006 Mazda RX-7 Veilside Fortune',driver:'DRIVEN BY HAN LUE',hp:'320 HP',image:'https://images.unsplash.com/photo-1492144534655-ae79c964c9d7?w=600&q=80'},
    {order:6,name:'THE VAULT CHARGERS',model:'2011 Dodge Charger SRT',driver:'DRIVEN BY DOM & BRIAN',hp:'650 HP',image:'https://images.unsplash.com/photo-1558618666-fcd25c85cd64?w=600&q=80'},
  ];
  for (const c of cars) await addDoc(collection(db,'cars'), c);

  const quotes = [
    {order:1,text:'"I DON\'T HAVE FRIENDS. I GOT FAMILY."',character:'DOMINIC TORETTO',movie:'Furious 7'},
    {order:2,text:'"I LIVE MY LIFE A QUARTER MILE AT A TIME."',character:'DOMINIC TORETTO',movie:'The Fast and the Furious'},
    {order:3,text:'"IT DOESN\'T MATTER IF YOU WIN BY AN INCH OR A MILE. WINNING\'S WINNING."',character:'DOMINIC TORETTO',movie:'The Fast and the Furious'},
    {order:4,text:'"YOU ALMOST HAD ME? YOU NEVER HAD ME."',character:'DOMINIC TORETTO',movie:'The Fast and the Furious'},
    {order:5,text:'"RIDE OR DIE, REMEMBER?"',character:'LETTY ORTIZ',movie:'Fast & Furious'},
    {order:6,text:'"WE RIDE TOGETHER, WE DIE TOGETHER. BAD BOYS FOR LIFE."',character:'ROMAN PEARCE',movie:'2 Fast 2 Furious'},
    {order:7,text:'"ONE MORE RIDE."',character:'DOMINIC TORETTO',movie:'Fast X'},
  ];
  for (const q of quotes) await addDoc(collection(db,'quotes'), q);

  const news = [
    {order:1,category:'RELEASE',date:'OCT 12, 2025',title:'FAST X: PART 2 REVS UP FOR 2026',subtitle:"The saga's grand finale prepares to hit theaters.",body:"Vin Diesel confirms the final chapter is underway with Justin Lin back in the director's chair.",image:'https://images.unsplash.com/photo-1544636331-e26879cd4d9b?w=600&q=80'},
    {order:2,category:'BEHIND THE SCENES',date:'SEP 20, 2025',title:"BEHIND THE SCENES: THE MAKING OF DOM'S CHARGER",subtitle:"How the legendary 1970 Dodge Charger became cinema's most iconic muscle car.",body:"From the original 1970 block to the supercharged modern rebuilds, we trace every incarnation.",image:'https://images.unsplash.com/photo-1494976388531-d1058494cdd8?w=600&q=80'},
    {order:3,category:'EVENT',date:'AUG 5, 2025',title:'F&F FAN MEET: WEST COAST CRUISE 2026',subtitle:'The biggest fan-organized F&F cruise returns to Los Angeles.',body:'Hundreds of Chargers, Supras, and Skylines take over PCH for a weekend of racing and family.',image:'https://images.unsplash.com/photo-1503376780353-7e6692767b70?w=600&q=80'},
  ];
  for (const n of news) await addDoc(collection(db,'news'), n);

  const paulTimeline = [
    {order:1,year:'1973',text:'Paul William Walker IV born September 12 in Glendale, California.'},
    {order:2,year:'1986',text:'Began acting as a child, appearing in TV commercials and soap operas.'},
    {order:3,year:'1998',text:"Breakthrough role in Pleasantville, catching Hollywood's attention."},
    {order:4,year:'2001',text:"Cast as Brian O'Conner in The Fast and the Furious — a role that would define his legacy."},
    {order:5,year:'2010',text:'Founded Reach Out Worldwide (ROWW) after the Haiti earthquake.'},
    {order:6,year:'2013',text:'Passed away on November 30, age 40, during a break from filming Furious 7.'},
  ];
  for (const t of paulTimeline) await addDoc(collection(db,'paulTimeline'), t);

  const paulFilmography = [
    {order:1,movie:'The Fast and the Furious',year:'2001',role:"BRIAN O'CONNER"},
    {order:2,movie:'2 Fast 2 Furious',year:'2003',role:"BRIAN O'CONNER"},
    {order:3,movie:'Fast & Furious',year:'2009',role:"BRIAN O'CONNER"},
    {order:4,movie:'Fast Five',year:'2011',role:"BRIAN O'CONNER"},
    {order:5,movie:'Fast & Furious 6',year:'2013',role:"BRIAN O'CONNER"},
    {order:6,movie:'Furious 7',year:'2015',role:"BRIAN O'CONNER (POSTHUMOUS)"},
  ];
  for (const f of paulFilmography) await addDoc(collection(db,'paulFilmography'), f);

  const paulQuotes = [
    {order:1,text:'"IF ONE DAY THE SPEED KILLS ME, DON\'T CRY BECAUSE I WAS SMILING."',author:'— PAUL WALKER'},
    {order:2,text:'"I USED TO SAY I LIVE MY LIFE A QUARTER MILE AT A TIME... BUT NOT THE ONLY WAY."',author:"— BRIAN O'CONNER, F&F"},
    {order:3,text:'"NOBODY WINS WHEN SOMEONE\'S NOT AROUND TO SEE IT."',author:'— PAUL WALKER'},
  ];
  for (const q of paulQuotes) await addDoc(collection(db,'paulQuotes'), q);

  console.log('✅ Database seeded!');
}
