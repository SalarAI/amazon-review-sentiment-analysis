# Bonus — Product Rating Prediction

This bonus experiment focuses on product rating prediction from user–item interactions and review text. It compares a traditional collaborative-filtering baseline with two neural approaches:

1. Singular Value Decomposition (SVD)
2. Neural Collaborative Filtering (NCF)
3. NCF enriched with TF-IDF review features

The goal is to estimate a user's rating for a product on the original 1–5 scale and measure how much review text improves prediction beyond interaction data alone.

## Files

| File | Description |
|---|---|
| [`Rating_predicttion.ipynb`](Rating_predicttion.ipynb) | Complete exploratory analysis, preprocessing, model training, tuning, evaluation, and comparison workflow |
| [`Benchmark_scoring_section.csv`](Benchmark_scoring_section.csv) | Final RMSE and MAE comparison reported by the notebook |

The notebook filename intentionally keeps its current spelling. Neither source file is modified by this README.

## Data preparation

The notebook reads `train_data.csv` and first inspects its schema, missing values, duplicates, rating distribution, and the number of unique users, products, and review texts.

For collaborative filtering, it keeps the following columns:

- `reviewerID` as the user identifier
- `asin` as the product identifier
- `overall` as the rating target

Duplicate and missing rows are removed. Products and users with fewer than five recorded interactions are filtered out, reducing sparsity before model training. The neural models use label encoding to convert user and product identifiers into integer indices suitable for embedding layers.

## Models

### SVD baseline

The baseline uses the `SVD` implementation from Surprise. Ratings are loaded with a valid range of 1–5 and divided into training and test sets with `random_state=42`.

The initial model uses:

- 100 latent factors
- 20 training epochs
- learning rate `0.005`
- regularization `0.02`

A grid search also explores different latent dimensions, epoch counts, learning rates, and regularization values with three-fold cross-validation. The notebook reports an improved tuned SVD result separately, while the final benchmark CSV retains the baseline SVD score.

### Neural Collaborative Filtering

The NCF model learns separate 64-dimensional embeddings for users and products. After flattening, both embeddings are concatenated and passed through dense layers:

```text
User embedding ─┐
                ├─ Concatenate → Dense(128) → Dropout(0.2)
Item embedding ─┘                → Dense(64) → Dense(32) → Rating
```

The model performs regression with a single linear output. It is trained with Adam, mean squared error as the loss, MAE as a tracked metric, batch size 256, and 10 epochs. Predictions are clipped to the valid 1–5 rating range.

Keras Tuner is then used to search embedding size, dense-layer width, dropout, and learning rate. The tuning objective is validation loss.

### NCF with TF-IDF review features

The third model adds review text to the user and product signals. Text preprocessing includes:

- stripping HTML
- converting text to lowercase
- removing URLs
- removing punctuation and digits
- removing English stopwords
- dropping empty reviews

`TfidfVectorizer` produces 1,000 text features using unigrams and bigrams. These features pass through their own dense branch before being combined with 32-dimensional user and item embeddings:

```text
User embedding ─────────────┐
Item embedding ─────────────┼─ Concatenate → Dense(64) → Dropout(0.3)
TF-IDF → Dense(64)           │                → Dense(32) → Rating
       → Dropout(0.3)        │
       → Dense(32) ──────────┘
```

This model uses Adam with a learning rate of `0.0005`, MSE loss, batch size 256, and 10 epochs. Its predictions are also clipped to the 1–5 range.

## Benchmark results

The final benchmark file reports:

| Model | RMSE | MAE |
|---|---:|---:|
| SVD | 1.1132 | 0.8446 |
| NCF | 1.1227 | 0.8471 |
| **NCF with TF-IDF** | **0.9567** | **0.5998** |

Lower values are better for both metrics. NCF without text performs slightly worse than the SVD baseline in this experiment. Adding TF-IDF review features produces the strongest result, reducing RMSE by about 14% and MAE by about 29% relative to SVD.

> **Result note:** the final Markdown conclusion inside the notebook mentions `RMSE=0.9653` and `MAE=0.5926` for NCF with TF-IDF. The benchmark cell and [`Benchmark_scoring_section.csv`](Benchmark_scoring_section.csv) both report `0.9567` and `0.5998`, so this README treats the exported benchmark file as the final result.

## Evaluation metrics

- **RMSE** gives larger errors more weight, so a few predictions far from the true rating have a stronger effect.
- **MAE** is the average absolute distance between predicted and true ratings and is easier to interpret directly on the 1–5 scale.

Together, they show both the typical prediction error and the model's sensitivity to larger mistakes.

## Running the notebook

Place `train_data.csv` where the notebook can read it, then open:

```bash
jupyter notebook Rating_predicttion.ipynb
```

The main dependencies are:

- pandas and NumPy
- Matplotlib
- TensorFlow/Keras
- Keras Tuner
- scikit-learn
- scikit-surprise
- Beautiful Soup
- NLTK

The NLTK English stopword corpus must also be available in the execution environment.

## Reproducibility notes

- Data splits use `random_state=42`.
- SVD uses a fixed random state before tuning.
- User and item filtering requires at least five interactions.
- Neural predictions are clipped to the valid rating interval.
- Exact neural results can still vary with TensorFlow version, hardware, random initialization, and dataset ordering.

## Limitations

- The same holdout dataset is used as validation data during NCF training and hyperparameter search, so a separate untouched test split would provide a more conservative final estimate.
- Random interaction-level splitting allows the same users and products to appear in both train and test. This measures warm-start recommendation quality rather than cold-start performance.
- TF-IDF vectors are converted to dense arrays, which can require substantial memory on large datasets.
- The TF-IDF model uses review text written for the rated item. This is useful for rating prediction from an existing review, but it is not a pure recommendation setting where no review exists yet.
