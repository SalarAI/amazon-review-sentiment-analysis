# یادداشت شخصی بخش سوم پروژه

این فایل برای مرور شخصی پیاده‌سازی‌های بخش سوم نوشته شده است. مسیر اصلی کار به این شکل بود: ابتدا داده‌ها را برای مدل‌های Transformer آماده کردیم، سپس RoBERTa را یک‌بار با LoRA و بار دوم به‌صورت Full Fine-tuning آموزش دادیم.

## ۱. در Preprocessing چه کار کردیم؟

### خواندن و کنترل اولیه داده‌ها

داده‌های آموزش، تست و اطلاعات محصول از این فایل‌ها خوانده شدند:

- `train_data.csv`
- `test_data.csv`
- `title_brand.csv`

قبل از ادامه، وجود ستون‌های ضروری مثل `overall`، `reviewText`، `summary`، `verified`، `vote` و `asin` بررسی شد. این کار باعث می‌شود اگر ورودی اشتباه باشد، نوت‌بوک همان ابتدا متوقف شود و خطا در مراحل بعدی پنهان نماند.

نسخه Kaggle همین مراحل را انجام می‌دهد، با این تفاوت که فایل‌ها را داخل `/kaggle/input` پیدا می‌کند و مطمئن می‌شود فقط یک فایل معتبر با ستون‌های مورد انتظار وجود دارد.

### حذف داده‌های نامعتبر و تکراری

ابتدا ردیف‌هایی که کاملاً تکراری بودند با `drop_duplicates()` حذف شدند. بعد متن review به‌شکل موقت پاک‌سازی شد تا ردیف‌هایی که متن آن‌ها خالی، `NaN` یا فقط شامل HTML و URL بود شناسایی و حذف شوند.

منظور از duplicate در اینجا تکرار کامل ردیف است. اگر متن دو review یکی باشد ولی اطلاعات دیگری مثل کاربر، زمان یا امتیاز فرق کند، آن‌ها خودکار حذف نمی‌شوند.

### پاک‌سازی متن

پاک‌سازی عمداً سبک نگه داشته شد، چون ورودی قرار بود به RoBERTa داده شود. مراحل اصلی عبارت بودند از:

1. حذف تگ‌های HTML و نگه‌داشتن متن داخل آن‌ها؛
2. حذف URLها؛
3. یکسان‌کردن فاصله‌ها و خط‌های خالی؛
4. حذف فاصله ابتدا و انتهای متن.

کارهایی مثل lowercase کردن، حذف stopword، stemming، حذف علائم نگارشی یا حذف اعداد انجام نشدند. tokenizer مدل‌های Transformer خودش با این موارد سازگار است و حذف آن‌ها ممکن است بخشی از معنی جمله، مخصوصاً منفی‌بودن متن یا شدت احساس، را از بین ببرد.

### متعادل‌کردن کلاس‌ها

مسئله پنج کلاس دارد و برچسب‌ها همان امتیازهای ۱ تا ۵ هستند. برای هر کلاس ۵۰٬۰۰۰ نمونه انتخاب شد؛ بنابراین مجموعه متعادل نهایی ۲۵۰٬۰۰۰ ردیف دارد.

برای هر کلاس ابتدا ۲٬۰۰۰ ردیف validation انتخاب شد. سپس نمونه‌های train از ردیف‌های باقی‌مانده برداشته شدند. این ترتیب یک نکته مهم دارد: اگر بعداً تعداد نمونه‌های هر کلاس را تغییر دهیم، validation ثابت می‌ماند و مقایسه آزمایش‌ها منصفانه‌تر خواهد بود.

نمونه‌گیری بدون جایگزینی و با seed ثابت `42` انجام شد. در نتیجه:

- داده تکراری به‌خاطر sampling ساخته نمی‌شود؛
- کلاس‌ها دقیقاً متعادل هستند؛
- اجرای دوباره نوت‌بوک همان split را تولید می‌کند.

### استفاده از اطلاعات جانبی

فایل اطلاعات محصول ممکن بود برای یک `asin` چند ردیف داشته باشد. برای هر محصول، ردیفی نگه داشته شد که `title` و `brand` کامل‌تری داشت. سپس اطلاعات محصول با رابطه `many_to_one` به reviewها وصل شد تا merge باعث زیادشدن تعداد ردیف‌ها نشود.

در کنار متن review، این ویژگی‌ها آماده شدند:

- `verified_str`: مقدار `yes`، `no` یا `unknown`؛
- `vote_bucket`: تعداد رأی مفید در بازه‌های `missing`، `0_to_4`، `5_to_9`، `10_to_49` و `50_plus`؛
- `summary_for_model`: حداکثر ۴۰ کلمه اول summary؛
- `model_input`: رشته نهایی شامل verified، helpful votes، summary و review.

قالب ورودی LoRA تقریباً به این شکل است:

```text
Verified: yes | Helpful votes: 5_to_9 | Summary: ... | Review: ...
```

`title` و `brand` برای بررسی پوشش metadata پردازش شدند، اما در ورودی نهایی مدل استفاده نشدند. شناسه کاربر، نام کاربر، زمان review و سایر شناسه‌ها نیز وارد مدل نشدند تا مدل به اطلاعات هویتی یا الگوهای تصادفی وابسته نشود.

### آماده‌کردن داده تست

همان pipeline مربوط به train روی تمام ردیف‌های test نیز اجرا شد. قبل از merge یک ستون ترتیب موقت ساخته شد و در پایان بررسی شد که ترتیب اولیه ردیف‌ها تغییر نکرده باشد. این موضوع برای ساخت submission ضروری است.

در پایان فایل‌های `balanced_reviews.csv`، `train.csv`، `validation.csv`، `test.csv` و `metadata.json` ذخیره شدند. فایل metadata شامل seed، تعداد ردیف‌ها، توزیع کلاس‌ها، تعداد duplicateها، پوشش اطلاعات محصول و تنظیمات preprocessing است.

## ۲. پیاده‌سازی RoBERTa با LoRA

### ساخت مدل پایه

مدل با `RobertaTextClassifier.from_preset()` از وزن‌های ازپیش‌آموزش‌دیده `roberta-base` ساخته شد. ابتدا preset متصل‌شده به Kaggle بررسی می‌شود و اگر موجود نباشد، نسخه Hugging Face استفاده می‌شود.

سر خروجی مدل برای پنج کلاس ساخته شد:

```python
model = keras_hub.models.RobertaTextClassifier.from_preset(
    preset,
    num_classes=5,
    activation=None,
    dropout=0.1,
)
```

`activation=None` یعنی خروجی مدل logits خام است. به همین دلیل loss با `from_logits=True` تعریف شد. طول sequence نیز روی ۲۵۶ token قرار گرفت که نسبت به ۱۲۸، بخش بیشتری از review را نگه می‌دارد ولی هنوز از نظر حافظه برای GPU Kaggle قابل‌مدیریت است.

### لایه‌ها در LoRA چطور تغییر کردند؟

در این مدل لایه‌های RoBERTa را یکی‌یکی باز نکردیم و وزن‌های اصلی backbone را هم مستقیماً تغییر ندادیم. این خط کار اصلی را انجام می‌دهد:

```python
model.backbone.enable_lora(rank=16)
```

KerasHub با این دستور داخل لایه‌های پشتیبانی‌شده backbone آداپترهای کم‌رتبه LoRA قرار می‌دهد. ایده این است که به‌جای آموزش کامل ماتریس وزن بزرگ `W`، تغییر آن را با حاصل‌ضرب دو ماتریس کوچک‌تر تقریب بزنیم:

```text
W_new = W + A × B
```

وزن اصلی `W` ثابت می‌ماند و بیشتر یادگیری روی `A` و `B` انجام می‌شود. `rank=16` اندازه فضای کم‌رتبه را مشخص می‌کند. rank بزرگ‌تر ظرفیت بیشتری می‌دهد، ولی تعداد پارامترهای قابل‌آموزش و مصرف حافظه را هم بالا می‌برد.

نکته مهم این است که ما نام لایه‌ها را hard-code نکردیم و ماتریس‌ها را دستی به query یا value اضافه نکردیم؛ خود `enable_lora` لایه‌های سازگار در پیاده‌سازی KerasHub را پیدا می‌کند. بعد از ساخت مدل، با این دو مجموعه تعداد پارامترها خوانده شد:

```python
model.trainable_weights
model.weights
```

همچنین `model.summary()` برای دیدن ساختار مدل استفاده شد. نسبت پارامترهای trainable به کل پارامترها محاسبه شد تا مطمئن شویم آموزش واقعاً به‌شکل parameter-efficient انجام می‌شود. سر classification و وزن‌های LoRA قابل‌آموزش‌اند، اما وزن‌های اصلی backbone مانند Full Fine-tuning به‌طور کامل آپدیت نمی‌شوند.

### ورودی و pipeline آموزش

مدل LoRA مستقیماً ستون `model_input` را دریافت می‌کند. امتیازها از بازه ۱ تا ۵ به برچسب‌های صفر تا چهار تبدیل شدند، چون Sparse Categorical Crossentropy انتظار دارد index کلاس از صفر شروع شود.

داده‌ها با `tf.data` ساخته شدند:

- shuffle با seed ثابت؛
- batch size برابر ۸ برای هر replica؛
- `drop_remainder=True` برای batchهای train؛
- `prefetch(AUTOTUNE)` برای آماده‌کردن batch بعدی هم‌زمان با اجرای GPU؛
- deterministic option برای تکرارپذیری validation.

### optimizer و ترفندهای آموزش

Optimizer از نوع `AdamW` است. تفاوت مهم AdamW با Adam معمولی، اعمال درست weight decay جدا از gradient update است. تنظیمات اصلی:

- learning rate نهایی LoRA: `5e-5`؛
- weight decay: `0.01`؛
- `beta_1=0.9` و `beta_2=0.999`؛
- `epsilon=1e-6`؛
- `global_clipnorm=1.0` برای جلوگیری از بزرگ‌شدن ناگهانی gradientها.

پارامترهای bias و پارامترهای normalization یعنی `beta` و `gamma` از weight decay خارج شدند؛ چون decay روی این پارامترها معمولاً مفید نیست.

#### Warmup و Cosine Decay

learning rate از ابتدا روی مقدار نهایی قرار نگرفت. ابتدا از صفر شروع شد و در ۱۰٪ قدم‌های اولیه به `5e-5` رسید. این مرحله warmup است و کمک می‌کند وزن‌های تازه اضافه‌شده در شروع آموزش با gradientهای شدید خراب نشوند.

بعد از warmup، learning rate با منحنی cosine کم شد و در انتهای آموزش به ۱۰٪ مقدار peak رسید. پس روند کلی چنین بود:

```text
0  →  5e-5  →  5e-6
   warmup      cosine decay
```

این روش شروع آرام و پایان باثبات‌تری نسبت به learning rate ثابت ایجاد می‌کند.

### Loss و metric

برای LoRA از `SparseCategoricalCrossentropy(from_logits=True)` استفاده شد. در زمان compile، `SparseCategoricalAccuracy` با نام `micro_f1` ثبت شده است. در مسئله تک‌برچسبی چندکلاسه، micro-F1 با accuracy برابر می‌شود؛ بااین‌حال بعد از آموزش، micro-F1، macro-F1 و weighted-F1 واقعی با scikit-learn نیز جداگانه محاسبه شدند.

### مدیریت قطع‌شدن آموزش

چون آموزش در Kaggle ممکن است قطع شود، چند callback در نظر گرفته شد:

- `BackupAndRestore`: ذخیره وضعیت آموزش هر ۵۰۰ batch و امکان ادامه run؛
- checkpoint از آخرین وزن‌ها هر ۵۰۰ batch؛
- checkpoint جدا برای بهترین `val_micro_f1`؛
- `EarlyStopping` با patience برابر ۲ و بازگرداندن بهترین وزن‌ها؛
- `CSVLogger` برای تاریخچه آموزش؛
- `TensorBoard` برای نمودارها؛
- `TerminateOnNaN` برای توقف سریع در صورت خراب‌شدن loss.

از mixed precision با policy برابر `mixed_float16` استفاده شد تا مصرف حافظه کمتر و سرعت GPU بیشتر شود. به‌دلیل ناسازگاری مشاهده‌شده میان نسخه‌های TensorFlow/KerasHub و LoRA روی `MirroredStrategy` در T4x2، حالت پیش‌فرض روی یک GPU قرار گرفت.

در پایان، بهترین checkpoint دوباره بارگذاری شد و مدل کامل، preset و وزن‌های مستقل LoRA با پسوند الزامی `.lora.h5` ذخیره شدند.

## ۳. پیاده‌سازی RoBERTa با Full Fine-tuning و Ordinal Loss

### تفاوت ورودی با نسخه LoRA

در نسخه Full فقط از `model_input` آماده استفاده نشد. متن ورودی دوباره از ویژگی‌ها ساخته شد و برای reviewهای طولانی، ۹۶ کلمه اول و ۴۸ کلمه آخر نگه داشته شدند. وسط review با عبارت `Review ending` جدا شد.

این ترفند head/tail به این دلیل استفاده شد که نتیجه یا جمع‌بندی review خیلی وقت‌ها در انتهای متن قرار دارد. truncation عادی tokenizer معمولاً فقط ابتدای متن را نگه می‌دارد و ممکن است جمله نهایی نویسنده را از دست بدهد.

### لایه‌ها در Full Fine-tuning چطور آموزش داده شدند؟

مدل باز هم با `RobertaTextClassifier.from_preset()` ساخته شد، اما این بار خط زیر وجود ندارد:

```python
model.backbone.enable_lora(...)
```

همچنین هیچ لایه‌ای با `trainable=False` منجمد نشده است. بنابراین رفتار پیش‌فرض مدل حفظ شده و تمام وزن‌های backbone به‌همراه سر classification داخل `model.trainable_weights` قرار می‌گیرند. در نتیجه gradient از loss وارد سر classification می‌شود و از آنجا در کل لایه‌های Transformer، attentionها، feed-forwardها و embeddingهای قابل‌آموزش پخش می‌شود.

پس تفاوت اصلی این است:

| روش | وزن‌های اصلی RoBERTa | پارامترهای اضافه | هزینه آموزش |
|---|---|---|---|
| LoRA | عمدتاً ثابت | ماتریس‌های کم‌رتبه rank 16 | کمتر |
| Full Fine-tuning | همگی قابل‌آموزش | آداپتر LoRA ندارد | بیشتر |

ما لایه‌ها را دستی جایگزین نکردیم؛ preset معماری و وزن‌ها را خواند و چون freeze یا LoRA فعال نشد، Keras تمام وزن‌های trainable مدل را در optimizer قرار داد. برای کنترل این موضوع، تعداد `model.trainable_weights` با کل `model.weights` مقایسه و ساختار با `model.summary()` بررسی شد.

### چرا learning rate کمتر شد؟

در LoRA فقط بخش کوچکی از پارامترها آموزش می‌دیدند، اما در Full Fine-tuning کل backbone تغییر می‌کند. به همین دلیل peak learning rate از `5e-5` به `1e-5` کاهش یافت تا وزن‌های ازپیش‌آموزش‌دیده با updateهای بزرگ خراب نشوند.

در این مدل warmup برابر ۵٪ کل stepها است. سپس cosine decay مقدار learning rate را تا ۱۰٪ peak پایین می‌آورد:

```text
0  →  1e-5  →  1e-6
   warmup      cosine decay
```

AdamW، weight decay برابر `0.01`، gradient clipping برابر `1.0` و خارج‌کردن bias و پارامترهای normalization از decay مانند مدل LoRA باقی ماندند.

### Loss ترکیبی Ordinal

امتیاز ستاره‌ای فقط یک کلاس معمولی نیست و ترتیب دارد؛ برای مثال اشتباه گرفتن امتیاز ۴ با ۵ خیلی کم‌خطرتر از اشتباه گرفتن ۱ با ۵ است. Crossentropy معمولی این فاصله را نمی‌بیند و همه کلاس‌های اشتباه را جدا از هم در نظر می‌گیرد.

برای حل این موضوع یک loss سفارشی با نام `HybridOrdinalCrossentropy` نوشته شد:

```text
loss = categorical_crossentropy + 0.25 × ordinal_loss
```

بخش اول همان دسته‌بندی پنج‌کلاسه است. برای بخش ordinal ابتدا softmax logits محاسبه می‌شود، سپس CDF یا مجموع تجمعی احتمال کلاس‌ها با CDF برچسب واقعی مقایسه می‌شود. میانگین مربع اختلاف این دو CDF نقش جریمه ترتیبی را دارد.

این loss همچنان مدل را وادار می‌کند کلاس درست را پیدا کند، ولی در کنار آن فاصله میان رتبه‌ها را هم در نظر می‌گیرد. وزن `0.25` باعث می‌شود بخش ordinal مکمل crossentropy باشد و کاملاً بر آن غالب نشود.

کلاس loss با `register_keras_serializable` ثبت شد و `get_config()` دارد؛ بنابراین هنگام ذخیره و بارگذاری فایل `.keras` تنظیم `ordinal_weight` گم نمی‌شود.

### سایر تنظیمات و ترفندها

- sequence length برابر ۲۵۶؛
- dropout سر طبقه‌بندی برابر `0.1`؛
- سه epoch، چون Full Fine-tuning سریع‌تر از LoRA به نقطه مناسب می‌رسد و احتمال overfitting بیشتر است؛
- batch size برابر ۸ برای کنترل حافظه؛
- mixed precision برای سرعت و حافظه؛
- seed ثابت و deterministic operations برای تکرارپذیری؛
- `prefetch` و `AUTOTUNE` برای بهتر استفاده‌کردن از GPU؛
- warmup و cosine decay؛
- AdamW و weight decay؛
- gradient clipping؛
- checkpoint دوره‌ای، backup، Early Stopping، TensorBoard، CSV log و توقف روی NaN.

checkpoint در Full Fine-tuning هر ۱۰۰۰ batch ذخیره می‌شود، درحالی‌که در LoRA هر ۵۰۰ batch بود. بهترین مدل با `val_micro_f1` انتخاب و قبل از ارزیابی نهایی دوباره بارگذاری شد.

در پایان accuracy، micro-F1، macro-F1، weighted-F1، classification report و confusion matrix محاسبه شدند. علاوه بر مدل `.keras`، preset قابل‌استفاده مجدد، پیش‌بینی‌های validation، metricها و آمار پارامترها نیز ذخیره شدند.

## جمع‌بندی کوتاه برای ارائه

در preprocessing داده را بیش از حد دست‌کاری نکردیم، چون RoBERTa باید متن طبیعی را ببیند. کلاس‌ها را متعادل و split را قابل‌تکرار کردیم و اطلاعات مفیدی مثل verified و helpful vote را به متن ساختاریافته تبدیل کردیم.

در مدل اول، با LoRA rank 16 فقط بخش کوچکی از پارامترها آموزش داده شد تا هزینه حافظه و زمان کمتر شود. در مدل دوم، تمام backbone را با learning rate پایین‌تر fine-tune کردیم و با loss ترتیبی فاصله واقعی میان امتیازهای ۱ تا ۵ را وارد فرایند یادگیری کردیم. در هر دو مدل از warmup، cosine decay، AdamW، mixed precision، gradient clipping، checkpoint و Early Stopping برای پایدارتر و قابل‌بازیابی‌بودن آموزش استفاده شد.
