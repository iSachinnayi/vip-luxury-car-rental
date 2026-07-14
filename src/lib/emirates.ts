// ═══════════════════════════════════════════════
//  Emirates Config — Location archive pages
//  Auto-generates SEO content from live car data
// ═══════════════════════════════════════════════

export interface Emirate {
  slug: string;
  name: string;
  nameAr: string;
  description: string;
  descriptionAr: string;
  intro: string;
  introAr: string;
  attractions: string[];
  attractionsAr: string[];
  deliveryNote: string;
  airports: string[];
  metaDesc: string;
  keywords: string[];
}

export const EMIRATES: Emirate[] = [
  {
    slug: "dubai",
    name: "Dubai",
    nameAr: "دبي",
    description:
      "Experience the glittering metropolis of Dubai with VIP Luxury Car Rental. From the iconic Burj Khalifa and the sprawling Dubai Mall to the Palm Jumeirah and Dubai Marina, cruise through the city's most prestigious destinations in unparalleled style. Our premium fleet of 350+ luxury, sports, and exotic cars ensures your Dubai experience is nothing short of extraordinary.",
    descriptionAr:
      "استمتع بمدينة دبي البراقة مع خدمة تأجير السيارات الفاخرة لكبار الشخصيات. من برج خليفة الأيقوني ودبي مول الشاسع إلى نخلة جميرا ومرسى دبي، تجول في أجمل وجهات المدينة بأناقة لا مثيل لها. يضمن أسطولنا الفاخر الذي يضم أكثر من 350 سيارة فاخرة ورياضية أن تكون تجربتك في دبي استثنائية.",
    intro:
      "Dubai is the ultimate destination for luxury car rentals. Whether you are visiting for business, a family vacation, or a special celebration, renting a luxury car in Dubai transforms your experience. Our fleet includes Lamborghini, Ferrari, Rolls Royce, Bentley, Porsche, and more — all available with complimentary delivery to your hotel, villa, or airport terminal anywhere in Dubai.",
    introAr:
      "دبي هي الوجهة المثالية لتأجير السيارات الفاخرة. سواء كنت تزورها للأعمال أو لقضاء عطلة عائلية أو احتفال خاص، فإن استئجار سيارة فاخرة في دبي يغير تجربتك تمامًا. يضم أسطولنا لامبورغيني وفيراري ورولز رويس وبنتلي وبورشه والمزيد — جميعها متاحة مع توصيل مجاني إلى فندقك أو فيلتك أو مطارك في أي مكان في دبي.",
    attractions: [
      "Burj Khalifa — The world's tallest building with observation decks on levels 124, 125, and 148",
      "The Dubai Mall — One of the world's largest shopping and entertainment destinations",
      "Palm Jumeirah — Iconic artificial archipelago with luxury hotels and residences",
      "Dubai Marina — A stunning waterfront district with dining and nightlife",
      "Mall of the Emirates — Premier shopping destination with indoor ski slope",
      "Dubai Creek — Historic heart of the city with traditional souks and abras",
      "Jumeirah Beach — Pristine white sand beaches with clear turquoise waters",
      "Dubai Frame — A landmark offering panoramic views of old and new Dubai",
    ],
    attractionsAr: [
      "برج خليفة — أطول مبنى في العالم مع منصات مشاهدة في الطوابق 124 و125 و148",
      "دبي مول — واحد من أكبر وجهات التسوق والترفيه في العالم",
      "نخلة جميرا — أرخبيل اصطناعي أيقوني يضم فنادق ومنتجعات فاخرة",
      "مرسى دبي — منطقة واجهة بحرية مذهلة مع المطاعم والحياة الليلية",
      "مول الإمارات — وجهة تسوق رئيسية مع منحدر تزلج داخلي",
      "خور دبي — القلب التاريخي للمدينة مع الأسواق التقليدية",
      "شاطئ جميرا — شواطئ رملية بيضاء نقية مع مياه فيروزية صافية",
      "إطار دبي — معلم يوفر إطلالات بانورامية على دبي القديمة والجديدة",
    ],
    deliveryNote:
      "Free delivery and pickup across all Dubai locations including Dubai Marina, Downtown Dubai, Palm Jumeirah, Dubai International Airport (DXB), and Al Maktoum Airport (DWC). We deliver to hotels, residences, and any location within Dubai city limits.",
    airports: ["Dubai International Airport (DXB)", "Al Maktoum International Airport (DWC)"],
    metaDesc:
      "Rent luxury cars in Dubai with VIP Luxury Car Rental. Sports cars, SUVs & premium sedans delivered free to your hotel. Lamborghini, Ferrari, Rolls Royce & more. Full insurance & 24/7 support. Book your dream car today!",
    keywords: [
      "luxury car rental Dubai",
      "rent sports car Dubai",
      "exotic car rental Dubai",
      "luxury car hire Dubai",
      "premium car rental Dubai",
      "supercar rental Dubai",
      "Lamborghini rental Dubai",
      "Ferrari rental Dubai",
    ],
  },
  {
    slug: "abu-dhabi",
    name: "Abu Dhabi",
    nameAr: "أبو ظبي",
    description:
      "Explore the capital of the UAE with VIP Luxury Car Rental. From the stunning Sheikh Zayed Grand Mosque to the thrilling Ferrari World and the cultural district of Saadiyat Island, Abu Dhabi offers an unmatched blend of luxury, culture, and adventure. Our premium fleet ensures you travel between these iconic landmarks in style and comfort.",
    descriptionAr:
      "استكشف عاصمة الإمارات مع خدمة تأجير السيارات الفاخرة لكبار الشخصيات. من مسجد الشيخ زايد الكبير المذهل إلى عالم فيراري المثير ومنطقة السعديات الثقافية، تقدم أبو ظبي مزيجًا لا مثيل له من الفخامة والثقافة والمغامرة. يضمن أسطولنا الفاخر تنقلك بين هذه المعالم الشهيرة بأناقة وراحة.",
    intro:
      "Whether you are visiting for business, a family holiday, or a special occasion, renting a luxury car in Abu Dhabi elevates your experience. Our fleet of 350+ premium vehicles includes sports cars, SUVs, and luxury sedans — all available with free delivery to your hotel, villa, or airport terminal across Abu Dhabi.",
    introAr:
      "سواء كنت تزور أبو ظبي للأعمال أو لقضاء عطلة عائلية أو بمناسبة خاصة، فإن استئجار سيارة فاخرة يرفع من تجربتك. يضم أسطولنا الذي يزيد عن 350 سيارة متميزة سيارات رياضية وسيارات دفع رباعي وسيارات سيدان فاخرة — جميعها متاحة مع توصيل مجاني إلى فندقك أو فيلتك أو مطارك في جميع أنحاء أبو ظبي.",
    attractions: [
      "Sheikh Zayed Grand Mosque — One of the world's largest mosques, open to visitors",
      "Ferrari World Abu Dhabi — Thrilling rides on Yas Island",
      "Yas Marina Circuit — Home of the Formula 1 Abu Dhabi Grand Prix",
      "Saadiyat Island — Cultural district with Louvre Abu Dhabi",
      "Corniche Beach — 8 km of pristine coastline and promenade",
      "Qasr Al Watan — The Presidential Palace landmark",
      "Emirates Palace — Iconic luxury hotel and beach resort",
      "Al Ain — The Garden City, a UNESCO World Heritage site",
    ],
    attractionsAr: [
      "مسجد الشيخ زايد الكبير — أحد أكبر المساجد في العالم، مفتوح للزوار",
      "عالم فيراري أبو ظبي — ألعاب مثيرة في جزيرة ياس",
      "حلبة مرسى ياس — موطن سباق جائزة الكبرى للفورمولا 1 في أبو ظبي",
      "جزيرة السعديات — المنطقة الثقافية مع متحف اللوفر أبو ظبي",
      "شاطئ الكورنيش — 8 كم من الواجهة البحرية البكر",
      "قصر الوطن — معلم القصر الرئاسي",
      "قصر الإمارات — فندق ومنتجع فاخر أيقوني",
      "العين — مدينة الحدائق، أحد مواقع التراث العالمي لليونسكو",
    ],
    deliveryNote:
      "We deliver and pick up vehicles anywhere in Abu Dhabi city, Yas Island, Saadiyat Island, Al Ain, and all Abu Dhabi airports. Our drivers coordinate directly with you for a seamless handover.",
    airports: ["Abu Dhabi International Airport (AUH)", "Al Ain International Airport (AAN)"],
    metaDesc:
      "Rent luxury cars in Abu Dhabi with VIP Luxury Car Rental. Premium sports cars, SUVs & sedans with free delivery across Abu Dhabi. Full insurance, no deposit options & 24/7 support. Book online today!",
    keywords: [
      "luxury car rental Abu Dhabi",
      "rent sports car Abu Dhabi",
      "SUV rental Abu Dhabi",
      "premium car hire Abu Dhabi",
      "exotic car rental Abu Dhabi",
    ],
  },
  {
    slug: "sharjah",
    name: "Sharjah",
    nameAr: "الشارقة",
    description:
      "Discover the cultural heart of the UAE with VIP Luxury Car Rental in Sharjah. As the UNESCO World Heritage-approved cultural capital, Sharjah blends rich heritage with modern attractions. From the historic Heart of Sharjah to the stunning Al Noor Mosque and the family-friendly Al Qasba waterfront, explore the emirate with the comfort of a premium vehicle.",
    descriptionAr:
      "اكتشف قلب الإمارات الثقافي مع خدمة تأجير السيارات الفاخرة لكبار الشخصيات في الشارقة. بوصفها عاصمة ثقافية معتمدة من اليونسكو، تمتزج الشارقة بين التراث الغني والمعالم العصرية. من قلب الشارقة التاريخي إلى مسجد النور المذهل والواجهة البحرية للقصباء المناسبة للعائلات، استكشف الإمارة براحة مركبة فاخرة.",
    intro:
      "Renting a luxury car in Sharjah gives you the freedom to explore its museums, souks, and beaches at your own pace. Our fleet of sports cars, luxury SUVs, and executive sedans is available with complimentary delivery to any location in Sharjah, including hotels, residences, and Sharjah International Airport.",
    introAr:
      "يمنحك استئجار سيارة فاخرة في الشارقة حرية استكشاف متاحفها وأسواقها وشواطئها بوتيرتك الخاصة. أسطولنا من السيارات الرياضية وسيارات الدفع الرباعي الفاخرة وسيارات السيدان التنفيذية متاح مع توصيل مجاني إلى أي مكان في الشارقة، بما في ذلك الفنادق والمساكن ومطار الشارقة الدولي.",
    attractions: [
      "Heart of Sharjah — Heritage district with restored traditional architecture",
      "Al Noor Mosque — Stunning Ottoman-inspired architecture on the Khalid Lagoon",
      "Al Qasba — Waterfront dining, entertainment, and the iconic Eye of the Emirates wheel",
      "Sharjah Art Museum — One of the largest art museums in the Gulf",
      "Al Majaz Waterfront — Family destination with fountains and restaurants",
      "Mleiha Archaeological Centre — Ancient tombs and desert adventures",
      "Sharjah Aquarium — Marine life exhibits along the Corniche",
      "Desert Palm — Luxury resorts and equestrian experiences",
    ],
    attractionsAr: [
      "قلب الشارقة — المنطقة التراثية ذات العمارة التقليدية المرممة",
      "مسجد النور — عمارة عثمانية مذهلة على بحيرة خالد",
      "القصباء — تناول الطعام والترفيه على الواجهة البحرية وعجلة عين الإمارات الشهيرة",
      "متحف الشارقة للفنون — أحد أكبر متاحف الفن في الخليج",
      "الواجهة المائية المجاز — وجهة عائلية مع النوافير والمطاعم",
      "مركز مليحة للآثار — مقابر قديمة ومغامرات صحراوية",
      "أكواريوم الشارقة — معارض الحياة البحرية على طول الكورنيش",
      "نخلة الصحراء — منتجعات فاخرة وتجارب فروسية",
    ],
    deliveryNote:
      "Free delivery and pickup across Sharjah city, Al Majaz, Al Qasba, university area, and Sharjah International Airport. Our team ensures a smooth handover at your preferred location.",
    airports: ["Sharjah International Airport (SHJ)"],
    metaDesc:
      "Premium luxury car rental in Sharjah. Rent sports cars, SUVs & executive sedans with free delivery across Sharjah. Full insurance, competitive rates & 24/7 roadside assistance. Book your dream car today!",
    keywords: [
      "luxury car rental Sharjah",
      "rent sports car Sharjah",
      "SUV rental Sharjah",
      "premium car hire Sharjah",
      "exotic car rental Sharjah",
    ],
  },
  {
    slug: "ras-al-khaimah",
    name: "Ras Al Khaimah",
    nameAr: "رأس الخيمة",
    description:
      "Experience the natural beauty of Ras Al Khaimah with VIP Luxury Car Rental. From the majestic Jebel Jais mountain range to pristine beaches and world-class resorts, RAK is the UAE's fastest-growing tourism destination. A luxury car is the perfect way to explore everything this stunning emirate has to offer.",
    descriptionAr:
      "اختبر الجمال الطبيعي لرأس الخيمة مع خدمة تأجير السيارات الفاخرة لكبار الشخصيات. من سلسلة جبال جبل جيس المهيبة إلى الشواطئ البكر والمنتجعات العالمية، رأس الخيمة هي أسرع وجهة سياحية نموًا في الإمارات. السيارة الفاخرة هي الطريقة المثلى لاستكشاف كل ما تقدمه هذه الإمارة الخلابة.",
    intro:
      "Ras Al Khaimah offers a perfect blend of adventure and relaxation. Renting a premium vehicle from our fleet lets you cruise along the coastal roads, drive up to Jebel Jais — the UAE's highest peak — and arrive at luxury resorts in style. We offer free delivery across RAK including all hotels, resorts, and airports.",
    introAr:
      "تقدم رأس الخيمة مزيجًا مثاليًا من المغامرة والاسترخاء. يتيح لك استئجار سيارة فاخرة من أسطولنا التجول على طول الطرق الساحلية، والصعود إلى جبل جيس — أعلى قمة في الإمارات — والوصول إلى المنتجعات الفاخرة بأناقة. نقدم توصيل مجاني في جميع أنحاء رأس الخيمة بما في ذلك الفنادق والمنتجعات والمطارات.",
    attractions: [
      "Jebel Jais — UAE's highest mountain with the world's longest zipline",
      "Al Marjan Island — Man-made islands with beachfront resorts",
      "RAK Mall — Premier shopping and dining destination",
      "Dhayah Fort — Historic hilltop fort with panoramic views",
      "Saqr Park — Family-friendly green spaces and picnic areas",
      "Pearl Island — Luxury residential and tourism development",
      "Ras Al Khaimah National Museum — History and archaeology exhibits",
      "Bear Grylls Explorers Club — Adventure experiences on Jebel Jais",
    ],
    attractionsAr: [
      "جبل جيس — أعلى جبل في الإمارات مع أطول خط انزلاق في العالم",
      "جزيرة المرجان — جزر اصطناعية مع منتجعات على الشاطئ",
      "مول رأس الخيمة — وجهة تسوق وتناول طعام رئيسية",
      "حصن ضاية — حصن تاريخي على قمة تل مع إطلالات بانورامية",
      "حديقة صقر — مساحات خضراء ومناطق نزهة للعائلات",
      "جزيرة اللؤلؤ — تطوير سياحي وسكني فاخر",
      "متحف رأس الخيمة الوطني — معارض التاريخ والآثار",
      "نادي بير جريلز للمغامرين — تجارب مغامرة على جبل جيس",
    ],
    deliveryNote:
      "Complimentary delivery and pickup throughout Ras Al Khaimah including Al Marjan Island, Al Hamra Village, RAK City, and all resort hotels. We also deliver to Ras Al Khaimah International Airport.",
    airports: ["Ras Al Khaimah International Airport (RKT)"],
    metaDesc:
      "Rent luxury cars in Ras Al Khaimah with VIP Luxury Car Rental. Sports cars, SUVs & premium sedans delivered free to your RAK hotel or resort. Full insurance & 24/7 support. Book your getaway car now!",
    keywords: [
      "luxury car rental Ras Al Khaimah",
      "rent sports car RAK",
      "SUV rental Ras Al Khaimah",
      "premium car hire RAK",
      "exotic car rental Ras Al Khaimah",
    ],
  },
];

export function getEmirate(slug: string): Emirate | undefined {
  return EMIRATES.find((e) => e.slug === slug);
}

export function getEmirateSlugs(): string[] {
  return EMIRATES.map((e) => e.slug);
}

export function getEmirateNames(): string[] {
  return EMIRATES.map((e) => e.name);
}
