# from huggingface_hub import InferenceClient, whoami, interpreter_login, login
print("atleast im at the top")
from transformers import AutoModelForSeq2SeqLM, MarianTokenizer

def translateMarianMT(akk_text): 
# prepare input of seq2seq 
    full_prompt = ">>en<<" + akk_text 
    checkpoint = "Hippopoto0/akkadian-marianMT" 
    print("hetting model")
    model = AutoModelForSeq2SeqLM.from_pretrained(checkpoint) 
# does not train tokenizer, so tokenizer loadded from marian 
    print("getting tokenizer")
    model_tokeniser_src = "Helsinki-NLP/opus-mt-ar-en"  # Arabic-to-English model 
    tokenizer = MarianTokenizer.from_pretrained(model_tokeniser_src) 
    inputs = tokenizer( 
        full_prompt, 
        max_length=128, 
        truncation=True, 
        return_tensors="pt" 
    ) 
    inputs = inputs.to(model.device) # move to GPU 
    # dont use torch gradient, unnecessary but saved memory 
    generated_tokens = model.generate(
        **inputs,
        max_length=128
    )
    predicted_translation = tokenizer.decode(generated_tokens[0], skip_special_tokens=True) 
    
    
    return predicted_translation

print("here")
print(translateMarianMT("un-gal_-_nibru-ki gaszan_ szur-bu-tu _gaszan_-ia szi-pir szu-a-tu ha-disz lip-pa-lis-ma a-mat _sig5_-ti-ia lisz-szA-kin szap-tusz-szA _tin ud-mesz su-mesz_ sze-bé-e lit-tu-u-tu _dug_-ub _uzu_ u hu-ud lib-bi li-szim szi-ma-a-ti"))
