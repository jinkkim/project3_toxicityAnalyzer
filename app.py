import re
import nltk
import string
import joblib

from flask import Flask, request, render_template, redirect, url_for


app = Flask(__name__)

stopwords = nltk.corpus.stopwords.words('english')
wn = nltk.WordNetLemmatizer()

def clean_text(text):
    text_funct_removed = "".join([word.lower() for word in text if word not in string.punctuation])
    tokens = re.split('\W+', text_funct_removed)
    text_lemmatized = [wn.lemmatize(word) for word in tokens if word not in stopwords]
    text = " ".join(text_lemmatized)
    return text

toxicity = 0.0

@app.route("/")
def index():
    return render_template("index.html")

@app.route("/analyze")
def analyze():
    return render_template("analyzer.html", toxicity = toxicity)

## Todo
@app.route("/visualize")
def visualize():
    return render_template("visualizer.html")



@app.route('/analyze_this', methods = ['POST'])
def analyze_this():

    received_text = request.get_json()['analyze_this']
    print(received_text)

    ## natural language data pre-processing
    text_cleaned = clean_text(received_text)
    print("text cleaned: ", text_cleaned)

    filename_tfidf = "./resources/tfidf.sav"
    tfidf_vect_loaded = joblib.load(filename_tfidf)
    X_tfidf = tfidf_vect_loaded.transform([text_cleaned])
    print("TF-IDF completed!")

    ## Prediction with pre-trained macine learning
    filename_model = "./resources/model_depth_120n_estimator_150.sav"
    model_loaded = joblib.load(filename_model)
    toxicity_predict = model_loaded.predict(X_tfidf)
    print("Predicted Toxicity: {}".format(toxicity_predict))

    global toxicity
    if toxicity_predict[0] > 1.0 :
        toxicity = 1.0
    else:
        toxicity = toxicity_predict[0]
    
    print("Toxicity: ", toxicity)
    return redirect("/analyze")

    
if __name__ == "__main__":
    app.run(debug=True)