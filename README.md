<p align="center">
  <img src="assets/banner.jpeg" alt="Sentiment Analysis Banner" width="100%">
</p>

<h1 align="center">Sentiment Analysis on Amazon Reviews</h1>

<p align="center">
Deep Learning-based Sentiment Analysis using Amazon Product Reviews.
</p>

<p align="center">

![Python](https://img.shields.io/badge/Python-3.11-blue?style=for-the-badge&logo=python)
![TensorFlow](https://img.shields.io/badge/TensorFlow-DeepLearning-orange?style=for-the-badge&logo=tensorflow)
![Pandas](https://img.shields.io/badge/Pandas-Data%20Analysis-black?style=for-the-badge&logo=pandas)
![NumPy](https://img.shields.io/badge/NumPy-Scientific%20Computing-blue?style=for-the-badge&logo=numpy)
![Scikit-Learn](https://img.shields.io/badge/Scikit--Learn-ML-orange?style=for-the-badge&logo=scikit-learn)
![License](https://img.shields.io/badge/License-MIT-green?style=for-the-badge)

</p>

---

# 📖 Overview

This project performs **Sentiment Analysis** on Amazon product reviews using **Natural Language Processing (NLP)** and **Deep Learning** techniques.

The project includes:

- Data exploration (EDA)
- Text preprocessing
- Word Cloud visualization
- Sentiment classification
- Deep Learning model training
- Model evaluation

---

# 📂 Dataset

The dataset contains Amazon product reviews with fields such as:

- Review Text
- Rating (Overall)
- Summary
- Vote
- Verified Purchase
- Reviewer Name
- Review Time

Ratings are converted into sentiment classes:

| Rating | Sentiment |
|---------|-----------|
| 4–5 | Positive |
| 3 | Neutral |
| 1–2 | Negative |

---

# 🚀 Features

- Data Cleaning
- Text Normalization
- Stopword Removal
- Word Clouds
- Distribution Analysis
- Deep Learning Classification
- Performance Evaluation

---

# 🧠 Deep Learning

The model is implemented using TensorFlow/Keras.

Typical pipeline:

```
Text
   ↓
Cleaning
   ↓
Tokenizer
   ↓
Padding
   ↓
Embedding
   ↓
BiLSTM / LSTM
   ↓
Dense Layer
   ↓
Softmax
```

---

# 📊 Exploratory Data Analysis

The project includes:

- Rating Distribution
- Word Clouds
- Review Length Distribution
- Class Balance Analysis

---

# 🛠️ Tech Stack

- Python
- Pandas
- NumPy
- Matplotlib
- NLTK
- WordCloud
- Scikit-learn
- TensorFlow / Keras

---

# 📈 Results

The model is trained to classify reviews into:

- Positive
- Neutral
- Negative

Performance is evaluated using:

- Accuracy
- Precision
- Recall
- F1 Score
- Confusion Matrix

---

# ⚙️ Installation

```bash
git clone https://github.com/yourusername/Sentiment-Analysis.git

cd Sentiment-Analysis

pip install -r requirements.txt
```

---

# ▶️ Usage

```bash
python src/train.py
```

or

```bash
jupyter notebook
```

---

# 📜 License

This project is released under the MIT License.

---

# 🤝 Contributing

Contributions are welcome.

Please read **CONTRIBUTING.md** before submitting a Pull Request.

---

# 🔒 Security

If you discover a security issue, please read **SECURITY.md** before reporting it.

---

<p align="center">
Made with using Python & Deep Learning
</p>
