import BilingualPresentation, { PresentationData, Visual } from "./BilingualPresentation";

const r = "/project-assets/reports/";
const n = "/project-assets/notebooks/";
const v = (src: string, fa: string, en: string, source: string): Visual => ({ src, title: { fa, en }, source });

const data: PresentationData = {
  part: "PART 1",
  eyebrow: { fa: "تحلیل اکتشافی داده", en: "Exploratory data analysis" },
  title: { fa: "شناخت صدای مشتری", en: "Reading the customer voice" },
  subtitle: { fa: "از توزیع امتیاز تا واژه‌ها، محصول‌ها و کاربران", en: "Ratings, language, products, and reviewers" },
  description: { fa: "در بخش اول ساختار ۸۳۸٬۹۴۴ نقد آمازون، عدم‌توازن امتیازها، طول متن، واژگان پرتکرار و رفتار کاربران و محصول‌ها بررسی شد.", en: "Part 1 explores 838,944 Amazon reviews through rating imbalance, text length, frequent language, and user-product behavior." },
  metrics: [
    { value: "838,944", title: { fa: "نقد آموزشی", en: "Training reviews" }, detail: { fa: "داده خام دارای ۱۱ ویژگی", en: "Raw dataset with 11 fields" } },
    { value: "55.01%", title: { fa: "امتیاز پنج", en: "Five-star share" }, detail: { fa: "نشانهٔ اصلی عدم‌توازن کلاس‌ها", en: "The clearest sign of class imbalance" } },
    { value: "20,000", title: { fa: "داده آزمون", en: "Test records" }, detail: { fa: "بدون برچسب برای submission", en: "Unlabeled submission set" } },
    { value: "408", title: { fa: "میانه طول متن", en: "Median text length" }, detail: { fa: "برحسب تعداد کاراکتر", en: "Measured in characters" } }
  ],
  findings: [
    { title: { fa: "عدم‌توازن جدی", en: "Strong imbalance" }, text: { fa: "کلاس پنج‌ستاره بیش از نیمی از داده را تشکیل می‌دهد و ارزیابی صرف با Accuracy را گمراه‌کننده می‌کند.", en: "Five-star reviews exceed half of the data, making accuracy alone misleading." } },
    { title: { fa: "زبان هر احساس متفاوت است", en: "Each sentiment has its own language" }, text: { fa: "ابرواژه‌های مثبت، خنثی و منفی تفاوت روشن واژه‌های رضایت، کارکرد و مشکل را نشان می‌دهند.", en: "Positive, neutral, and negative word clouds reveal distinct language around satisfaction, utility, and failure." } },
    { title: { fa: "تحلیل فراتر از متن", en: "Beyond review text" }, text: { fa: "محصول‌های محبوب، برندها و کاربران پرتکرار نیز جداگانه بررسی شدند تا سوگیری‌های داده دیده شوند.", en: "Popular products, brands, and frequent reviewers were also examined for dataset bias." } }
  ],
  tables: [
    { title:{fa:"آمار طول متن نقد",en:"Review length statistics"}, description:{fa:"توزیع طول ۸۳۸٬۹۴۴ نقد برحسب کاراکتر.",en:"Character-length distribution across 838,944 reviews."}, columns:[{fa:"شاخص",en:"Statistic"},{fa:"مقدار",en:"Value"}], rows:[["Mean","624.69"],["Median","408"],["75%","697"],["95%","1,733"],["99%","3,399"],["Max","29,146"]], source:"review_text_length_distribution.ipynb · cells 5, 7" },
    { title:{fa:"ده برند پرتکرار و میانگین امتیاز آن‌ها",en:"Ratings of the ten most-reviewed brands"}, description:{fa:"ده برند با بیشترین تعداد نقد، مرتب‌شده بر اساس میانگین امتیاز.",en:"The ten most-reviewed brands, ranked by their average customer rating."}, columns:[{fa:"برند",en:"Brand"},{fa:"میانگین امتیاز",en:"Average rating"},{fa:"تعداد نقد",en:"Reviews"}], rows:[["Anker","4.244","9,860"],["AmazonBasics","4.201","13,213"],["Sabrent","4.028","7,320"],["SanDisk","3.959","8,400"],["Logitech","3.954","17,066"],["Samsung","3.941","15,409"],["Sony","3.939","12,436"],["TP-LINK","3.929","9,773"],["Asus","3.856","11,928"],["NETGEAR","3.836","7,085"]], source:"top_10_brands_by_review_count.ipynb · cells 9–10" },
    { title:{fa:"محصول‌های برتر با نقد پنج‌ستاره",en:"Top products by five-star reviews"}, description:{fa:"ده محصول با بیشترین تعداد نقد پنج‌ستاره در داده‌های آموزشی.",en:"The ten products receiving the largest number of five-star reviews in the training data."}, columns:[{fa:"برند",en:"Brand"},{fa:"محصول",en:"Product"},{fa:"نقد پنج‌ستاره",en:"Five-star reviews"}], rows:[["Cambridge Soundworks","OontZ Angle 3 Enhanced Stereo Edition","1,163"],["NETGEAR","N300 WiFi Range Extender (EX2700)","659"],["Roku","Streaming Stick (3600R)","600"],["StarTech","USB 2.0 to SATA IDE Adapter","598"],["Logitech","M570 Wireless Trackball Mouse","552"],["Samsung","850 EVO 500GB SATA III SSD","529"],["Asus","Tri-Band Gigabit AC3200 WiFi Router","471"],["VideoSecu","ML531BE TV Wall Mount","448"],["Arlo Technologies, Inc","Wireless Home Security Camera System","433"],["Samsung","850 EVO 250GB SATA III SSD","431"]], source:"top_10_products_by_five_star_reviews.ipynb · cells 8–9" },
    { title:{fa:"کاربران پرتکرار",en:"Most active reviewers"}, description:{fa:"نام‌هایی با بیشترین فعالیت ثبت‌شده",en:"Reviewer names with the largest recorded activity."}, columns:[{fa:"نام",en:"Reviewer"},{fa:"تعداد",en:"Count"}], rows:[["Benson Leung","4,572"],["Michael","3,710"],["Mike","3,000"],["John","2,730"],["Dave","2,230"]], source:"Top_10_names_3.ipynb · cell 8" }
  ],
  groups: [
    { title: { fa: "توزیع امتیاز و طول نقد", en: "Rating and review-length distributions" }, description: { fa: "خروجی‌های تحلیل توزیع", en: "Direct outputs from the distribution-analysis notebooks." }, visuals: [
      v(r + "Distribution%20of%20Overall%20Ratings.png", "توزیع امتیازهای کلی", "Overall rating distribution", "reports"),
      v(n + "review_text_length_distribution-cell6-output0.png", "توزیع اولیه طول متن", "Initial review-length distribution", "part1/review_text_length_distribution.ipynb · cell 6"),
      v(n + "review_text_length_distribution-cell8-output0.png", "طول متن پس از بررسی صدک‌ها", "Review length after percentile inspection", "part1/review_text_length_distribution.ipynb · cell 8"),
      v(n + "review_text_length_distribution-cell9-output0.png", "نمای نهایی توزیع طول نقد", "Final review-length view", "part1/review_text_length_distribution.ipynb · cell 9")
    ] },
    { title: { fa: "ابرواژه‌های احساس", en: "Sentiment word clouds" }, description: { fa: "یک خروجی نهایی برای هر گروه از نقدهای مثبت، معمولی و منفی.", en: "One final output for each positive, neutral, and negative review group." }, visuals: [
      v(r + "positive_words.png", "واژه‌های نقدهای مثبت", "Positive-review words", "reports"),
      v(r + "normal_words.png", "واژه‌های نقدهای معمولی", "Neutral-review words", "reports"),
      v(r + "negative_words.png", "واژه‌های نقدهای منفی", "Negative-review words", "reports")
    ] },
    { title: { fa: "کاربران و نام محصولات", en: "Reviewers and product names" }, description: { fa: "تمرکز نقدها میان کاربران و عنوان‌های محصول.", en: "How review activity is concentrated across users and product titles." }, visuals: [
      v(r + "top_10_reviewers.png", "ده کاربر با بیشترین نقد", "Top ten reviewers", "reports"),
      v(n + "Top_10_names_3-cell10-output0.png", "ده نام پرتکرار محصول", "Top ten product names", "part1/Top_10_names_3.ipynb")
    ] }
  ],
  takeaway: { fa: "EDA نشان داد که مدل‌سازی باید هم عدم‌توازن پنج کلاس و هم تنوع شدید طول و زبان نقدها را مدیریت کند.", en: "EDA showed that modeling must handle both five-class imbalance and wide variation in review length and language." }
};

export default function ExplorationPresentation() { return <BilingualPresentation data={data} />; }
