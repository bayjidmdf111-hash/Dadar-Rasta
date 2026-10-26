/**
 * Funny Bangladeshi traffic dialogues, Dhakaiya slang, passenger banter,
 * and newspaper accident headlines for Dhaka Traffic Rush.
 */

export interface BanglaDialogue {
  bangla: string;
  transliteration: string;
  translation: string;
  speaker: 'Driver' | 'Passenger' | 'Bus Driver' | 'Pedestrian' | 'Traffic Police';
}

export const FUNNY_COMMENTS: BanglaDialogue[] = [
  {
    bangla: 'এইটা কি দাদার রাস্তা পাইছেন নাকি?! এত জোরে চালান ক্যা?!',
    transliteration: 'Eita ki Dadar Rasta paisen naki?! Eto jore chalan kano?!',
    translation: 'Do you think this is your grandfather\'s road?! Why driving so fast?!',
    speaker: 'Bus Driver',
  },
  {
    bangla: 'ওস্তাদ, ডানে চাপেন! রাস্তা কি দাদার পাইছেন?!',
    transliteration: 'Ostad, dane chapen! Rasta ki dadar paisen?!',
    translation: 'Bro, steer right! Do you own this entire road?!',
    speaker: 'Bus Driver',
  },
  {
    bangla: 'দাদার রাস্তায় ফুল স্পিডে অটো ছুটিয়ে চলুন!',
    transliteration: 'Dadar Rastay full speed-e auto chutiye cholun!',
    translation: 'Race your auto at top speed on Dada\'s road!',
    speaker: 'Driver',
  },
  {
    bangla: 'ভাই আস্তে চালান, আমার হার্ট দুর্বল!',
    transliteration: 'Bhai aaste chalan, amar heart durbol!',
    translation: 'Brother drive slow, my heart is weak!',
    speaker: 'Passenger',
  },
  {
    bangla: 'হর্ন বাজান জোরে জোরে! না বাজাইলে পথ ছাড়ব না!',
    transliteration: 'Horn bajan jore jore! Na bajaile poth charbo na!',
    translation: 'Honk loudly! Nobody gives way without a horn in Dhaka!',
    speaker: 'Driver',
  },
  {
    bangla: 'সামনে মুরগির খাঁচা বাস আসতেছে! ডানে কাটেন!',
    transliteration: 'Samne murgir khacha bus astese! Dane katen!',
    translation: 'Local wooden bus incoming! Swerve right!',
    speaker: 'Driver',
  },
  {
    bangla: 'মামা একটু স্পিড দেন, অফিসে লেট হইয়া যাইতেছে!',
    transliteration: 'Mama ektu speed den, office e late hoiya jaitese!',
    translation: 'Uncle speed up, I am getting late for office!',
    speaker: 'Passenger',
  },
  {
    bangla: 'সাবধান! ওয়াসা আবার রাস্তা খুঁড়িয়া থুইয়া গ্যাছে!',
    transliteration: 'Shabdhan! WASA abar rasta khuriya thuiya gese!',
    translation: 'Watch out! The water authority dug up another trench!',
    speaker: 'Driver',
  },
  {
    bangla: 'আরে পাগলে চালায় গাড়ি, পিছনে তাকায় না!',
    transliteration: 'Are pagole chalay gari, pichone takay na!',
    translation: 'Crazy drivers everywhere, nobody looks back!',
    speaker: 'Pedestrian',
  },
  {
    bangla: 'কাগজপত্র ঠিক আছে? সিগনালে থামেন!',
    transliteration: 'Kagojpotro thik ase? Signale thamen!',
    translation: 'License and papers please! Halt at the signal!',
    speaker: 'Traffic Police',
  },
  {
    bangla: 'চা খাবা মামা? টং এ গরম চা বানাইয়া রাখি!',
    transliteration: 'Cha khaba mama? Tong e gorom cha banaiya rakhi!',
    translation: 'Want milk tea bro? Hot tea ready at roadside stall!',
    speaker: 'Pedestrian',
  },
];

export const NEAR_MISS_COMMENTS: string[] = [
  'আলহামদুলিল্লাহ! চুল পরিমাণ লাইগা বাঁইচা গেলেন!',
  'উফফ! মিলিমিটারের ব্যবধান!',
  'ওস্তাদ আপনার রিফ্লেক্স তো পাইলটের মতোন!',
  'বাসের রঙ গায়ে লাইগা গেছে প্রায়!',
  'খাঁটি ঢাকাইয়া ড্রাইভ!',
  'সুবহানাল্লাহ! অলৌকিক ওভারটেক!',
];

export const CRASH_HEADLINES: { headline: string; sub: string; advice: string }[] = [
  {
    headline: 'মিরপুর এক্সপ্রেস বাসের সাথে অটো-রিকশার রক্তক্ষয়ী সংঘর্ষ!',
    sub: 'ড্রাইভারের দাবি: "বাসের ব্রেক আছিল না মামা!"',
    advice: 'টিপস: বাসের সামনে ওভারটেক করার আগে দুইবার হর্ন দিন।',
  },
  {
    headline: 'ওয়াসার উন্মুক্ত ম্যানহোলে ডুব দিল ইজি বাইক!',
    sub: 'যাত্রী সাঁতার কাটিয়া উঠিয়া বলিলেন, "ভাড়া ফেরত চাই!"',
    advice: 'টিপস: ভাঙা রাস্তা ও ম্যানহোল দেখলে ব্রেক চাপুন।',
  },
  {
    headline: 'সড়কের মাঝখানে দাঁড়াইয়া থাকা গরুর লগে টক্কর!',
    sub: 'গরু মহাশয় অক্ষত, অটো-রিকশার ব্যাটারি খসিয়া পতন!',
    advice: 'টিপস: রাস্তায় গরু বা ছাগল দেখলে হর্ন বাজাইয়া দূর দিয়া যান।',
  },
  {
    headline: 'চায়ের টং দোকানে ঢুকিয়া পড়িল বেপরোয়া অটো!',
    sub: 'দোকানদার বলিলেন: "অটোর লগে ১০ কাপ লাল চাও মাগনা হইয়া গেল!"',
    advice: 'টিপস: রাস্তার পাশে অতিরিক্ত চাপাচাপি করবেন না।',
  },
  {
    headline: 'সিএনজি ও অটোর সাইড মারামারি, ট্রাফিক পুলিশ বাকরুদ্ধ!',
    sub: 'দুই চালকই বলিলেন: "রাস্তা তো আমাদেরই!"',
    advice: 'টিপস: সিএনজিকে জায়গা দিন, উহাদের কোনো মিটার থাকে না!',
  },
];

/**
 * Optional funny TTS announcement using browser SpeechSynthesis (if supported and Bengali language exists)
 */
export function speakFunnyBangla(text: string) {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return;
  try {
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = 'bn-BD';
    utterance.rate = 1.05;
    utterance.pitch = 1.2;
    window.speechSynthesis.speak(utterance);
  } catch {
    // Speech synthesis unavailable or unsupported on browser
  }
}
