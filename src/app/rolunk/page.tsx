import { Metadata } from "next";

export const metadata: Metadata = {
  title: "Rólunk - Miért csináljuk?",
  description:
    "Ismerje meg a RónaRendelő történetét és küldetését. Szakorvosi ellátás nyugodt körülmények között, kiszámítható időpontokkal.",
};

export default function RolunkPage() {
  return (
    <div className="py-12 lg:py-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 mb-4">
            Miért csináljuk?
          </h1>
          <div className="w-20 h-1 bg-rona-600 mx-auto"></div>
        </div>

        {/* Content */}
        <div className="prose prose-lg max-w-none text-gray-700 space-y-6">
          <p className="leading-relaxed text-lg">
            Orvosaink szinte kivétel nélkül a mindennapi betegellátásban
            dolgoznak, mind a szakmájuk, mind a betegek által elismerten.
            Sajnos a kórházi sikeresség automatikusan a betegforgalom
            megemelkedését, néha már a betegek által nehezen tolerálható
            várakozást jelenti. Ezen felül, a mindennapi munka melletti
            kórházi körülmények nem mindig alkalmasak a betegek egy részének
            sokat jelentő, kiszámítható vizsgálati idő tartására. A{" "}
            <strong>„RónaRendelő"-t</strong> évekkel ezelőtt azon
            megfontolások alapján hoztuk létre, hogy olyan betegeknek
            kínáljunk alternatívát, akiknek sokat számít a mielőbbi orvosi
            konzultáció, vagy munkájukból, elfoglaltságaikból adódóan fontos,
            hogy egy vizsgálat, kontrollvizsgálat miatt ne töltsenek
            felesleges időt a rendelő előtt várakozva. Hangsúlyozzuk, hogy
            Rendelőnk alapításának célja nem a beteg teljes kivezetése volt a
            közfinanszírozott ellátásból, hanem csak lehetőséget teremtett egy
            munkaidőhöz rugalmasabb konzultációhoz, ellátáshoz.
          </p>

          <div className="bg-rona-50 border-l-4 border-rona-600 p-6 rounded-r-lg my-8">
            <p className="leading-relaxed">
              Azonban az élet közbe szólt, a 2021.03.01.-től a{" "}
              <strong>
                „528/2020. (XI. 28.) Korm. rendelet az egészségügyi szolgálati
                jogviszonyról szóló 2020. évi C. törvény"
              </strong>{" "}
              miatt megváltozó jogszabályi háttér miatt, mely egyazon
              diagnózissal megszűntette az átjárhatóságot a magán és állami
              ellátás közt. Ez jogilag azt jelenti, hogy választott orvosa nem
              kezelheti ugyanazzal a betegséggel a magán, illetve a
              közfinanszírozott ellátásban.
            </p>
          </div>

          <p className="leading-relaxed text-lg">
            Szeretnénk azonban megnyugtatni Mindenkit, hogy a{" "}
            <strong>RónaRendelő</strong> ezután is a hozzánk forduló
            Betegeknek teljes körű ellátást kíván biztosítani, amennyiben
            lehetséges a Rendelő kereteken belül, de azon túl is.
          </p>

          <p className="leading-relaxed text-lg">
            Azon Betegeknek tudunk alternatívát biztosítani, akik
            magánbiztosításuknak, anyagi lehetőségüknek köszönhetően az
            azonnali, közfinanszírozáson kívüli magán ellátást kívánják
            igénybe venni, hiszen orvosaink több jóhírű Magánklinikával is
            szerződésben állnak.
          </p>

          <p className="leading-relaxed text-lg">
            Természetesen azokat a korábbi, ill. a jövőben Hozzánk forduló
            Betegeinknek, akik ezt anyagilag nem engedhetik meg maguknak, de a
            későbbiekben szükséges a kórházi kezelés, a jogszabályi keretek
            betartása mellett segítünk a számukra legoptimálisabb
            közfinanszírozott betegút, kezelőorvos kiválasztásban.
          </p>
        </div>
      </div>
    </div>
  );
}
