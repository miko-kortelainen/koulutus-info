const AMK_SHORT_NAMES: Readonly<Record<string, string>> = {
  "Centria-ammattikorkeakoulu": "Centria",
  "Diakonia-ammattikorkeakoulu": "Diak",
  "Haaga-Helia ammattikorkeakoulu": "Haaga-Helia",
  "Humanistinen ammattikorkeakoulu": "Humak",
  "Hämeen ammattikorkeakoulu": "HAMK",
  "Jyväskylän ammattikorkeakoulu": "Jamk",
  "Kaakkois-Suomen ammattikorkeakoulu": "Xamk",
  "Kajaanin ammattikorkeakoulu": "KAMK",
  "Karelia-ammattikorkeakoulu": "Karelia",
  "LAB-ammattikorkeakoulu": "LAB",
  "Lapin ammattikorkeakoulu": "Lapin AMK",
  "Laurea-ammattikorkeakoulu": "Laurea",
  "Metropolia Ammattikorkeakoulu": "Metropolia",
  "Oulun ammattikorkeakoulu": "OAMK",
  "Satakunnan ammattikorkeakoulu": "SAMK",
  "Savonia-ammattikorkeakoulu": "Savonia",
  "Seinäjoen ammattikorkeakoulu": "SEAMK",
  "Tampereen ammattikorkeakoulu": "TAMK",
  "Turun ammattikorkeakoulu": "Turun AMK",
  "Vaasan ammattikorkeakoulu": "VAMK",
  "Yrkeshögskolan Arcada": "Arcada",
  "Yrkeshögskolan Novia": "Novia",
};

export function schoolNameWithShort(name: string): string {
  const short = AMK_SHORT_NAMES[name];
  return short ? `${name} (${short})` : name;
}
