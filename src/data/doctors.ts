export interface Doctor {
  id: string;
  name: string;
  title: string;
  specialties: string[];
  schedule: string;
  image: string;
  shortBio: string;
  fullBio: string;
  services?: string[];
  education?: string[];
  languages?: string[];
  website?: string;
}

export const doctors: Doctor[] = [
  {
    id: "dr-csitos-agnes",
    name: "Dr. Csitos Ágnes",
    title: "rendelővezető",
    specialties: ["Bőrgyógyászat", "Gyerekbőrgyógyászat", "Kozmetológia"],
    schedule: "Kedd: 15:30-18:00, Péntek: 8:00-12:00",
    image: "/images/doctors/dr-csitos-agnes.jpg",
    shortBio: "A Bethesda Gyermekkórház bőrgyógyász főorvosa, az Uzsoki Kórház konzíliárus bőrgyógyásza.",
    fullBio: `2002-ben végeztem a Szegedi Tudományegyetem Általános Orvostudományi Karán. A diplomaosztót követően a Szegedi Tudományegyetem Bőrgyógyászati és Allergológiai Klinikáján kezdtem dolgozni. Hosszú időt töltöttem az égés- plasztikai sebészeti részlegen, az onkológiai, illetve a pikkelysömörös betegek gondozásával foglalkozó osztályon. Volt szerencsém számtalan ritka betegséggel megismerkedni.

Budapestre 2007-ben költöztem, 2018-ig a Heim Pál Gyermekkórház Bőrgyógyászati Osztályán dolgoztam, ahol az eltöltött 11 év alatt megismertem a gyermekbőrgyógyászati kórképek széles spektrumát. 2018 szeptemberétől a Magyar Református Egyház Bethesda Gyermekkórházának bőrgyógyász főorvosa vagyok.

A felnőtt bőrgyógyászattól sem szakadtam el teljesen, hiszen az Uzsoki Kórház konzíliárus bőrgyógyásza vagyok, valamint rendelek a DrRose Magánklinikán.

Fő érdeklődési területem az ér-, valamint a festéksejtes anyajegyek gondozása, az atópiás bőr és a pikkelysömör kezelése.`,
    services: [
      "Acne kezelése (serdülőkori pattanásos betegség)",
      "Atópiás bőr gondozása",
      "Anyajegyszűrés (dermatoscoppal, szükség esetén fotódokumentációval)",
      "Éranyajegy gondozás",
      "Gyulladásos bőrbetegségek kezelése",
      "Lábszárfekély kezelés",
      "Pikkelysömör terápiája",
      "Rosacea kezelése",
      "Jóindulatú bőrnövedékek eltávolítása",
      "Vírusos szemölcsök kauteres eltávolítása, folyékony nitrogénes fagyasztása"
    ]
  },
  {
    id: "dr-vasarhelyi-gabor",
    name: "Dr. Vásárhelyi Gábor",
    title: "rendelővezető",
    specialties: ["Ortopédia", "Sportsebészet", "Traumatológia"],
    schedule: "Szerda: 15:30-18:00",
    image: "/images/doctors/dr-vasarhelyi-gabor.jpg",
    shortBio: "Az Uzsoki Kórház Ortopéd-Traumatológia osztályának részlegvezető főorvosa.",
    fullBio: `Orvosi diplomámat 2000-ben Szegeden szereztem. 2001-től a magyar ortopédia bölcsőjének számító Uzsoki Kórház Ortopéd-Traumatológia osztályán dolgozom, mostanra már részlegvezető főorvosként. A nagy múltú, a magyar ortopédia és traumatológia bölcsőjének számító, és főleg Hangody Professzor vezetése alatt nem csak hazai, hanem nemzetközi szinten is ismert és elismert osztályon alkalmam volt az alapoktól megtanulni az ortopéd, traumatológiai ellátás teljes spektrumát.

Osztályunk sajátosságának köszönhetően a mozgásszervi sebészetet komplexitásában tanultam meg kezelni, nem egymástól elválasztva a különböző eredetű csont-ízületi elváltozásokat. Ennek megfelelően minden végtagot érintő elváltozást kezelek, függetlenül attól, hogy veleszületett, degeneratív vagy szerzett elváltozásról van szó.

Munkám kezdete óta, jelenleg már mint ügyeletvezető, részt veszek a budapesti ill. pest megyei akut baleseti ellátásban. Gyakorlatilag az összes végtagi ízületen rutinszerűen végzek különböző arthroscopos, ill. minimál invazív beavatkozásokat, beleértve a szalagpótlásokat, porc- és ínreconstructiókat, valamint különböző porcfelszínképző eljárásokat.

A RónaRendelő-ben lehetőség van az előzményi adatok, fizikális vizsgálat, ill. a különböző képalkotó vizsgálatok alapján az esetleges műtéti terv felállítására, igény szerinti betegút kiválasztására, ill. a különböző konzervatív kezelések megkezdésére.`,
    services: [
      "Mozgásszervi vizsgálat és konzultáció",
      "Arthroscopos beavatkozások",
      "Szalagpótlások (elülső-hátsó keresztszalag, külbokaszalag)",
      "Porc- és ínrekonstrukciók",
      "Porcfelszínképző eljárások (mozaikplasztika, microfractura)",
      "Nagyízületi protetika",
      "Láb és kéz deformitások kezelése",
      "Konzervatív és posztoperatív kezelések"
    ]
  },
  {
    id: "dr-nahm-krisztina",
    name: "Dr. Náhm Krisztina",
    title: "főorvos",
    specialties: ["UH diagnosztika", "Radiológia"],
    schedule: "Hétfő: 16:00-18:00",
    image: "/images/doctors/dr-nahm-krisztina.jpg",
    shortBio: "Az Uzsoki Kórház Radiológiai Osztályának főorvosa, 1981 óta végez komplex emlővizsgálatokat.",
    fullBio: `Általános orvosi diplomámat 1978-ban szereztem a Semmelweis Orvostudományi Egyetem Általános Orvosi Karán. Radiológus szakvizsgát 1982-ben tettem, komplex emlővizsgálatokat 1981 óta végzek.

Rövid szakmai áttekintés:
- 1986-tól 1989-ig az Apáthy István Gyermekkórház Röntgen Osztálya
- 1989-tól 1995-ig a Bajcsy Kórház Röntgen Osztálya
- 1995-től 2000-ig a Ferencvárosi Egészségügyi Szolgálat radiológus főorvosa
- 2003-tól a Semmelweis Egyetem Kútvölgyi Klinikai Tömb Röntgen Osztálya
- Jelenleg az Uzsoki Kórház Radiológiai Osztályán dolgozom, mint főorvos

1978 óta a Magyar Radiológus Társaság tagja, 1998-tól pedig az MRT Emlődiagnosztikai szekció vezetőségi tagja vagyok.

Rendelőnkben a legkülönfélébb ultrahang vizsgálatokat végezzük. Az elvégzett vizsgálatról hivatalos, szakorvosi leletet kapnak. Amennyiben a vizsgálat során eltérésre derül fény és igénylik, készséggel állunk szakorvosaink által az Önök rendelkezésére a további lépések megtételében.`,
    services: [
      "Hasi ultrahang vizsgálat",
      "Emlő ultrahang",
      "Pajzsmirigy ultrahang",
      "Lágyék ultrahang",
      "Ízületi ultrahang",
      "Komplex emlővizsgálat"
    ]
  },
  {
    id: "dr-toth-zoltan",
    name: "Dr. Tóth Zoltán",
    title: "osztályvezető főorvos, PhD",
    specialties: ["Urológia", "Onkosebészet"],
    schedule: "Hétfő: 15:00-20:00",
    image: "/images/doctors/dr-toth-zoltan.jpg",
    shortBio: "Az Uzsoki Kórház Urológiai Osztályának osztályvezetője, laparoscopos sebészet specialista.",
    fullBio: `Dr. Tóth Zoltán vagyok, urológus szakorvos, PhD. 1990-ben végeztem a Semmelweis Orvostudományi Egyetemen, majd 1994-ben szereztem meg az urológiai szakvizsgát. Pályafutásom során számos külföldi tanulmányúton vettem részt, többek között Bécsben, Berlinben és Innsbruckban, ahol nemzetközi tapasztalatokat szereztem a legmodernebb urológiai eljárások terén.

1990 óta az Uzsoki Kórház Urológiai Osztályán dolgozom, jelenleg osztályvezetőként. Nagy örömömre szolgált, hogy hozzájárulhatok a kórház laparoscopos munkájának megszervezéséhez és fejlesztéséhez. Különösen érdekelnek az endourológiai műtétek, a vese és a prostata malignus daganatok komplex ellátása.

A szakmai munkám mellett fontos számomra a folyamatos tanulás és fejlődés, ezért rendszeresen részt veszek nemzetközi konferenciákon és továbbképzéseken.

Várom, hogy segíthessek Önnek is egészsége megőrzésében és gyógyításában!`,
    languages: ["Magyar", "Német", "Angol"],
    services: [
      "Urológiai vizsgálat",
      "Ultrahang vizsgálat",
      "Endourológiai beavatkozások",
      "Vese daganatok kezelése",
      "Prostata betegségek ellátása",
      "Laparoscopos műtétek"
    ]
  },
  {
    id: "dr-dede-kristof",
    name: "Dr. Dede Kristóf Ph.D.",
    title: "osztályvezető helyettes főorvos",
    specialties: ["Általános sebészet", "Onkosebészet", "Laparoszkópos sebészet"],
    schedule: "Szerda: 16:00-18:00",
    image: "/images/doctors/dr-dede-kristof.jpg",
    shortBio: "Az Uzsoki Kórház Sebészeti Osztályának osztályvezető helyettes főorvosa, minimálisan invazív sebészet specialista.",
    fullBio: `2000-ben végeztem Budapesten a Semmelweis Egyetemen, majd 2007-ben sebészeti, 2009-ben gasztroenterológiai szakvizsgát szereztem. 2015-ben májsebészeti témában szereztem PhD fokozatot. 2002 óta dolgozom az Uzsoki utcai Kórház Sebészeti-, Onkosebészeti Osztályán, jelenleg osztályvezető helyettes főorvosként.

Kiemelt érdeklődési területem a minimálisan invazív sebészet (laparoszkópos sebészet) és az onkológiai sebészet. Az onkológiai sebészetben az emésztőszervi daganatok területén szereztem elsősorban gyakorlatot. A máj-, epeúti-, és bél eredetű daganatok onkológiai- és laparoszkópos sebészetére specializálódtam.

Jóindulatú betegségek esetében a laparoszkópos sebészetnek kiemelt szerepe van a sérvek, epehólyagbetegségek sebészetében, ahol a betegek hamarabb visszatérhetnek a mindennapi életükhöz és a fizikai aktivitásukhoz.

További kiemelt érdeklődési területem a sportsérv sebészete. A rendelésen nyugodt körülmények között van mód a leletek áttekintésére és a különböző terápiás lehetőségek megbeszélésére.`,
    languages: ["Magyar", "Angol", "Német"],
    website: "www.dedekristof.hu",
    services: [
      "Sebészeti konzultáció",
      "Laparoszkópos műtétek",
      "Sérvműtétek",
      "Epehólyag műtétek",
      "Máj- és epeúti daganatok sebészete",
      "Sportsérv kezelése",
      "Bőrelváltozások eltávolítása"
    ]
  },
  {
    id: "dr-domaraczki-oliver",
    name: "Dr. Domaraczki Olivér",
    title: "szakorvos",
    specialties: ["Ortopédia", "Traumatológia", "Sportsebészet", "Vállspecialista"],
    schedule: "Hétfő: 15:30-18:00",
    image: "/images/doctors/dr-domaraczki-oliver.jpg",
    shortBio: "Ortopéd traumatológus, sportsebész, vállspecialista.",
    fullBio: `Ortopéd traumatológus, sportsebész szakorvos vagyok, különös szakértelemmel a vállízületi problémák kezelésében. Széleskörű tapasztalattal rendelkezem a sportorvoslás és a mozgásszervi rehabilitáció területén.`,
    services: [
      "Vállízületi vizsgálat és kezelés",
      "Sportsérülések ellátása",
      "Ortopédiai konzultáció",
      "Mozgásszervi rehabilitáció"
    ]
  },
  {
    id: "dr-szerb-imre",
    name: "Dr. Szerb Imre",
    title: "szakorvos",
    specialties: ["Ortopédia"],
    schedule: "Kedd: 15:30-18:00",
    image: "/images/doctors/dr-szerb-imre.jpg",
    shortBio: "Ortopéd szakorvos.",
    fullBio: `Ortopéd szakorvosként dolgozom, széleskörű tapasztalattal a mozgásszervi betegségek diagnosztikájában és kezelésében.`,
    services: [
      "Ortopédiai vizsgálat",
      "Mozgásszervi konzultáció",
      "Konzervatív kezelések"
    ]
  },
  {
    id: "dr-pap-karoly",
    name: "Dr. Pap Károly Ph.D.",
    title: "egyetemi adjunktus",
    specialties: ["Ortopédia", "Sportsebészet", "Traumatológia"],
    schedule: "Csütörtök: 16:00-18:00",
    image: "/images/doctors/dr-pap-karoly.jpg",
    shortBio: "Ortopéd szakorvos, egyetemi adjunktus, sportsebészet és traumatológia specialista.",
    fullBio: `Ortopéd szakorvos, egyetemi adjunktus vagyok. Szakterületem az ortopédia, sportsebészet és traumatológia. Egyetemi munkám mellett magánrendelésen is fogadom a betegeket.`,
    services: [
      "Ortopédiai vizsgálat",
      "Sportsérülések kezelése",
      "Traumatológiai ellátás",
      "Mozgásszervi konzultáció"
    ]
  },
  {
    id: "dr-papp-geza",
    name: "Dr. Papp Géza",
    title: "szakorvos",
    specialties: ["Sebészet", "Onkosebészet"],
    schedule: "Kedd: 16:00-19:00",
    image: "/images/doctors/dr-papp-geza.jpg",
    shortBio: "Sebész-onkosebész szakorvos.",
    fullBio: `Sebész-onkosebész szakorvosként dolgozom. Széleskörű tapasztalattal rendelkezem az általános sebészet és az onkológiai sebészet területén.`,
    services: [
      "Sebészeti konzultáció",
      "Onkosebészeti vizsgálat",
      "Kisebb sebészeti beavatkozások"
    ]
  },
  {
    id: "dr-mikoczi-mario",
    name: "Dr. Mikoczi Márió",
    title: "adjunktus",
    specialties: ["Gyermeksebészet"],
    schedule: "Csütörtök: 16:00-18:00",
    image: "/images/doctors/dr-mikoczi-mario.jpg",
    shortBio: "Gyermeksebész szakorvos, adjunktus.",
    fullBio: `Gyermeksebész szakorvos, adjunktus vagyok. Szakmai munkám során a gyermekek sebészeti ellátására specializálódtam.`,
    services: [
      "Gyermeksebészeti vizsgálat",
      "Gyermeksebészeti konzultáció",
      "Kisebb gyermeksebészeti beavatkozások"
    ]
  }
];

export function getDoctorBySlug(slug: string): Doctor | undefined {
  return doctors.find(doctor => doctor.id === slug);
}

export function getAllDoctorSlugs(): string[] {
  return doctors.map(doctor => doctor.id);
}
