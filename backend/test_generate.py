import requests

url = "http://127.0.0.1:8000/generate-promo"

sample_request = {
    "brand_name": "CoolBrand",
    "content_type": "post",
    "tone": "fun",
    "hashtags": ["sale", "discount"],
    "cta": "Buy Now!"
}

response = requests.post(url, json=sample_request)
print(response.json())