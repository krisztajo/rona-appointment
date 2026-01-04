export interface ServiceCategory {
  id: string;
  name: string;
  icon: string;
  services: Service[];
}

export interface Service {
  name: string;
  price: string;
  note?: string;
}

export const serviceCategories: ServiceCategory[] = [
  {
    id: "borgyogyaszat",
    name: "Bőrgyógyászat",
    icon: "🔬",
    services: [
      { name: "Vizsgálat, anyajegy szűrés", price: "30 000 Ft" },
      { name: "Visszarendelés, kontrollvizsgálat 1 hónapon belül", price: "20 000 Ft" },
      { name: "Fagyasztás – elváltozások számától függően vizsgálati díj", price: "+ 10 000-20 000 Ft" },
      { name: "Elektrosebészeti beavatkozás – elváltozások számától függően vizsgálati díj", price: "+ 10 000-30 000 Ft" },
      { name: "Bőrgyógyászati alap laborvizsgálat csomag (vérkép, SGOT, SGPT, GGT, KN, kreatinin, T. vizelet)", price: "20 000 Ft" },
      { name: "Gyógyszeres terápia esetén + chol, TG", price: "15 000 Ft" },
      { name: "Bőrgyógyászati góc kutatás laborvizsgálat csomag", price: "20 000 Ft" },
      { name: "Allergiavizsgálat (inhalatív panel, nutritív panel, LTT)", price: "változhat", note: "allergének számától függően" },
      { name: "Tenyésztés (gomba, baktérium)", price: "10 000 Ft" }
    ]
  },
  {
    id: "ortopedia",
    name: "Ortopédia, Baleseti Sebészet, Sportsebészet",
    icon: "🦴",
    services: [
      { name: "Vizsgálat", price: "30 000 Ft" },
      { name: "Ortopédiai góc kutatás laborvizsgálat csomag (vérkép, vérsüllyedés, AST, CRP, SGOT, SGPT, GGT, KN, kreatinin, T. vizelet)", price: "20 000 Ft" },
      { name: "+ HgbA1C", price: "5 000 Ft" },
      { name: "+ Vércsoport, ellenanyag", price: "15 000 Ft" },
      { name: "Tenyésztés (gomba, baktérium)", price: "10 000 Ft" },
      { name: "Viscosupplementatio - CINGAL", price: "70 000 Ft" },
      { name: "Viscosupplementatio - MONOVISC", price: "65 000 Ft" }
    ]
  },
  {
    id: "urologia",
    name: "Urológia",
    icon: "🩺",
    services: [
      { name: "Vizsgálat", price: "30 000 Ft" },
      { name: "+ UH vizsgálat", price: "5 000 Ft" },
      { name: "Urológiai góc kutatás laborvizsgálat csomag (vérkép, vérsüllyedés, AST, CRP, SGOT, SGPT, GGT, KN, kreatinin, T. vizelet)", price: "10 000 Ft" },
      { name: "+ PSA", price: "6 000 Ft" },
      { name: "+ HgbA1C", price: "5 000 Ft" },
      { name: "+ Vércsoport, ellenanyag", price: "15 000 Ft" },
      { name: "Ejakulátum tenyésztés", price: "15 000 Ft" },
      { name: "Vizelet tenyésztés", price: "15 000 Ft" }
    ]
  },
  {
    id: "sebeszet",
    name: "Általános Sebészet, Onkosebészet",
    icon: "⚕️",
    services: [
      { name: "Sebészeti konzultáció", price: "30 000 Ft" },
      { name: "Bőrelváltozások eltávolítása szövettani vizsgálattal", price: "egyedi ár" }
    ]
  },
  {
    id: "ultrahang",
    name: "UH Diagnosztika",
    icon: "📡",
    services: [
      { name: "Hasi ultrahang", price: "20 000 Ft" },
      { name: "Emlő ultrahang", price: "18 000 Ft" },
      { name: "Pajzsmirigy ultrahang", price: "15 000 Ft" }
    ]
  },
  {
    id: "gyermeksebeszet",
    name: "Gyermeksebészet",
    icon: "👶",
    services: [
      { name: "Gyermeksebészeti vizsgálat", price: "30 000 Ft" },
      { name: "Gyermeksebészeti konzultáció", price: "25 000 Ft" }
    ]
  }
];
