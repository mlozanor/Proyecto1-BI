import re
from nltk.tokenize import word_tokenize

def normalize_documents(doc):
    doc = re.sub(r"[^a-zA-Z\\s]", "", doc)
    doc = doc.lower().strip()
    tokens = word_tokenize(doc)
    return " ".join(tokens)
