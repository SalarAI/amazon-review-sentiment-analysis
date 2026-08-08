import BilingualPresentation, { PresentationData, Visual } from "./BilingualPresentation";

const n = "/project-assets/notebooks/";
const visual = (src: string, fa: string, en: string, source: string): Visual => ({ src, title: { fa, en }, source });

const data: PresentationData = {
  part: "PART 3",
  eyebrow: { fa: "پیش‌بینی امتیاز با Transformer", en: "Transformer rating prediction" },
  title: { fa: "سه مدل، یک رقابت نهایی", en: "Three models, one final benchmark" },
  subtitle: { fa: "RoBERTa LoRA، RoBERTa Full و DeBERTa-v3", en: "RoBERTa LoRA, RoBERTa Full, and DeBERTa-v3" },
  description: { fa: "داده متعادل و پیش‌پردازش‌شده برای تنظیم کم‌هزینه LoRA و تنظیم کامل استفاده شد. خروجی‌های validation و submission هر سه مسیر در کنار هم مقایسه شده‌اند.", en: "Balanced preprocessed data powers both parameter-efficient LoRA and full fine-tuning. Validation and submission outputs from all three tracks are compared together." },
  metrics: [
    { value: "0.6748", title: { fa: "RoBERTa LoRA", en: "RoBERTa LoRA" }, detail: { fa: "F1-micro نتیجه submission", en: "Submission micro-F1" } },
    { value: "0.6757", title: { fa: "DeBERTa-v3", en: "DeBERTa-v3" }, detail: { fa: "F1-micro نتیجه submission", en: "Submission micro-F1" } },
    { value: "0.6948", title: { fa: "RoBERTa Full", en: "RoBERTa Full" }, detail: { fa: "بهترین F1-micro نهایی", en: "Best final micro-F1" } },
    { value: "256", title: { fa: "حداکثر توکن", en: "Maximum tokens" }, detail: { fa: "تعادل میان پوشش متن و حافظه", en: "Text-coverage and memory tradeoff" } }
  ],
  findings: [
    { title: { fa: "داده متعادل", en: "Balanced data" }, text: { fa: "برای هر پنج امتیاز نمونه‌گیری برابر انجام شد و train/validation به شکل stratified ساخته شدند.", en: "All five ratings were sampled equally and split with stratification." } },
    { title: { fa: "LoRA در برابر Full", en: "LoRA versus full tuning" }, text: { fa: "LoRA فقط آداپتورهای attention را آموزش داد؛ در مدل Full همه لایه‌های RoBERTa همراه head ترتیبی باز شدند.", en: "LoRA trains attention adapters only; the full model unfreezes every RoBERTa layer with an ordinal head." } },
    { title: { fa: "آموزش پایدار", en: "Stable optimization" }, text: { fa: "AdamW، warmup، cosine decay، weight decay، gradient clipping و checkpoint برای کنترل آموزش به‌کار رفتند.", en: "AdamW, warmup, cosine decay, weight decay, gradient clipping, and checkpoints stabilize training." } }
  ],
  architectures: [
    { name:"RoBERTa LoRA", badge:{fa:"تنظیم کم‌هزینه",en:"Parameter-efficient"}, params:"128.21M", trainable:"4.18M", trainablePct:"3.26%", layers:[{fa:"متن ترکیبی + tokenizer",en:"Combined text + tokenizer"},{fa:"توکن‌های ۲۵۶تایی و mask",en:"256 tokens + padding mask"},{fa:"RoBERTa-base · ۱۲ بلوک Transformer",en:"RoBERTa-base · 12 Transformer blocks"},{fa:"LoRA rank 16 روی Query و Value",en:"Rank-16 LoRA on Query and Value"},{fa:"CLS → Dropout → Dense 768",en:"CLS → Dropout → Dense 768"},{fa:"Logits پنج‌کلاسه",en:"Five-class logits"}], tricks:[{fa:"Mixed precision FP16",en:"Mixed precision FP16"},{fa:"AdamW · LR 5e-5",en:"AdamW · LR 5e-5"},{fa:"Warmup 10% + Cosine decay",en:"10% warmup + cosine decay"},{fa:"Gradient clip = 1.0",en:"Gradient clip = 1.0"},{fa:"BackupAndRestore + best checkpoint",en:"BackupAndRestore + best checkpoint"}] },
    { name:"RoBERTa Full + Ordinal", badge:{fa:"تنظیم کامل",en:"Full fine-tuning"}, params:"124.65M", trainable:"124.65M", trainablePct:"100%", layers:[{fa:"Summary + ابتدای ۹۶ و انتهای ۴۸ واژه",en:"Summary + first 96 and last 48 words"},{fa:"توکن‌های ۲۵۶تایی و mask",en:"256 tokens + padding mask"},{fa:"تمام ۱۲ بلوک RoBERTa باز",en:"All 12 RoBERTa blocks unfrozen"},{fa:"CLS → Dropout 0.1 → Dense 768",en:"CLS → Dropout 0.1 → Dense 768"},{fa:"Dropout → logits پنج‌کلاسه",en:"Dropout → five-class logits"},{fa:"Cross-entropy + CDF ordinal",en:"Cross-entropy + ordinal CDF"}], tricks:[{fa:"Ordinal loss weight = 0.25",en:"Ordinal loss weight = 0.25"},{fa:"Head-tail truncation",en:"Head-tail truncation"},{fa:"AdamW · LR 1e-5",en:"AdamW · LR 1e-5"},{fa:"Warmup 5% + Cosine decay",en:"5% warmup + cosine decay"},{fa:"همه لایه‌ها قابل‌آموزش",en:"Every layer trainable"}] },
    { name:"DeBERTa-v3 LoRA", badge:{fa:"Attention تفکیک‌شده",en:"Disentangled attention"}, params:"187.99M", trainable:"4.18M", trainablePct:"2.22%", layers:[{fa:"متن ترکیبی + SentencePiece",en:"Combined text + SentencePiece"},{fa:"توکن‌های ۲۵۶تایی و mask",en:"256 tokens + padding mask"},{fa:"DeBERTa-v3 · محتوای/موقعیت جدا",en:"DeBERTa-v3 · disentangled content/position"},{fa:"LoRA rank 16 در attention",en:"Rank-16 LoRA in attention"},{fa:"CLS → Dropout → Dense 768",en:"CLS → Dropout → Dense 768"},{fa:"Classifier dropout → ۵ logits",en:"Classifier dropout → 5 logits"}], tricks:[{fa:"Mixed precision روی یک GPU",en:"Single-GPU mixed precision"},{fa:"AdamW · LR 4.5e-5",en:"AdamW · LR 4.5e-5"},{fa:"Warmup 10% + Cosine decay",en:"10% warmup + cosine decay"},{fa:"Resume در سطح batch",en:"Batch-level resume"},{fa:"وزن‌های LoRA مستقل",en:"Standalone LoRA adapters"}] }
  ],
  tables: [
    { title:{fa:"مقایسه نهایی سه مدل",en:"Final three-model comparison"}, description:{fa:"پارامترها مستقیماً از model.summary و امتیازها از خروجی validation/submission آمده‌اند.",en:"Parameters come from model.summary; scores come from validation/submission outputs."}, columns:[{fa:"مدل",en:"Model"},{fa:"کل پارامتر",en:"Total params"},{fa:"قابل‌آموزش",en:"Trainable"},{fa:"درصد",en:"Share"},{fa:"F1-micro",en:"Micro-F1"}], rows:[["RoBERTa LoRA","128.21M","4.18M","3.26%","0.6748"],["DeBERTa-v3 LoRA","187.99M","4.18M","2.22%","0.6757"],["RoBERTa Full Ordinal","124.65M","124.65M","100%","0.6948"]], source:"model.summary + validation outputs" },
    { title:{fa:"عملکرد کلاسی مدل برتر",en:"Per-class performance of the winner"}, description:{fa:"گزارش classification مدل RoBERTa Full روی ۱۰٬۰۰۰ نمونه validation متعادل.",en:"RoBERTa Full classification report on 10,000 balanced validation samples."}, columns:[{fa:"امتیاز",en:"Rating"},{fa:"Precision",en:"Precision"},{fa:"Recall",en:"Recall"},{fa:"F1",en:"F1"},{fa:"Support",en:"Support"}], rows:[["1","0.7659","0.7410","0.7532","2,000"],["2","0.5848","0.6395","0.6109","2,000"],["3","0.6190","0.6215","0.6203","2,000"],["4","0.6891","0.6605","0.6745","2,000"],["5","0.8310","0.8115","0.8211","2,000"]], source:"roberta_keras_full_ordinal.ipynb · cell 19" },
    { title:{fa:"توزیع submission مدل LoRA",en:"LoRA submission distribution"}, description:{fa:"کنترل نهایی تعادل پیش‌بینی روی ۲۰٬۰۰۰ ردیف تست.",en:"Final prediction-balance check over 20,000 test rows."}, columns:[{fa:"کلاس",en:"Class"},{fa:"تعداد",en:"Count"},{fa:"درصد",en:"Percentage"}], rows:[["1","3,982","19.91%"],["2","4,132","20.66%"],["3","3,980","19.90%"],["4","3,907","19.54%"],["5","3,999","19.99%"]], source:"roberta_lora_test_inference_submission.ipynb · cell 16" }
  ],
  groups: [
    { title: { fa: "EDA و پیش‌پردازش Part 3", en: "Part 3 EDA and preprocessing" }, description: { fa: "کنترل توزیع کلاس‌ها پیش و پس از ساخت داده متعادل.", en: "Class-distribution checks before and after balancing." }, visuals: [
      visual(n + "eda-cell6-output1.png", "توزیع کلاس‌ها در EDA", "EDA class distribution", "part3/eda.ipynb · cell 6"),
      visual(n + "eda-cell10-output1.png", "بررسی تکمیلی داده در EDA", "Additional EDA inspection", "part3/eda.ipynb · cell 10")
    ] },
    { title: { fa: "ماتریس‌های درهم‌ریختگی validation", en: "Validation confusion matrices" }, description: { fa: "الگوی خطای مدل‌ها نشان می‌دهد بیشتر اشتباه‌ها میان امتیازهای مجاور رخ داده‌اند.", en: "Most model errors occur between neighboring rating classes." }, visuals: [
      visual(n + "roberta_keras_lora-cell20-output0.png", "RoBERTa LoRA — ماتریس validation", "RoBERTa LoRA — validation matrix", "part3/roberta_keras_lora.ipynb · cell 20"),
      visual(n + "roberta_keras_full_ordinal-cell20-output0.png", "RoBERTa Full Ordinal — ماتریس validation", "RoBERTa Full Ordinal — validation matrix", "part3/roberta_keras_full_ordinal.ipynb · cell 20"),
      visual(n + "deberta-v3-resume-cell22-output0.png", "DeBERTa-v3 — ماتریس validation", "DeBERTa-v3 — validation matrix", "part3/deberta-v3-resume.ipynb · cell 22")
    ] },
    { title: { fa: "خروجی‌های inference و submission", en: "Inference and submission outputs" }, description: { fa: "نمودارهای خروجی notebookهای تولید submission برای مدل‌های RoBERTa.", en: "Outputs from the RoBERTa submission-generation notebooks." }, visuals: [
      visual(n + "roberta_lora_test_inference_submission-cell16-output2.png", "توزیع پیش‌بینی RoBERTa LoRA", "RoBERTa LoRA prediction distribution", "part3/roberta_lora_test_inference_submission.ipynb · cell 16"),
      visual(n + "roberta_full_test_inference_submission-cell16-output2.png", "توزیع پیش‌بینی RoBERTa Full", "RoBERTa Full prediction distribution", "part3/roberta_full_test_inference_submission.ipynb · cell 16")
    ] }
  ],
  takeaway: { fa: "تنظیم کامل RoBERTa با درنظرگرفتن ترتیب طبیعی امتیازها بهترین نتیجه را گرفت؛ LoRA و DeBERTa با پارامترهای آموزشی کمتر، فاصله کمی با آن داشتند.", en: "Full RoBERTa with ordinal awareness won the benchmark, while LoRA and DeBERTa stayed close with far fewer trainable parameters." }
};

export default function BackbonePresentation() { return <BilingualPresentation data={data} />; }
