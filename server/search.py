import requests
from bs4 import BeautifulSoup

# def filter_transliteration_from_translation(text: str) -> str:
#     text_lines = text.split("\n")

#     # may leave metadata, such as obverse reverse, broken line etc
#     def line_filter(line: str):
#         if line.startswith("ts:"): # transcription
#             return False
#         if line.startswith("en:"): # english translation
#             return False
#         if line.startswith("fr:"): # french translation (rare)
#             return False
        
#         return True
        
#     def line_clean(line: str):
#         split_numbers = line.split(".", 1) # split once
#         if len(split_numbers) == 2:
#             line_only = split_numbers[1]
#             return line_only
#         else:
#             print("Error splitting line.")

#     filtered_lines = filter(line_filter, text_lines)

#     cleaned_lines = map(line_clean, filtered_lines)

#     cleaned_lines = list(cleaned_lines)
#     return cleaned_lines

def filter_transliteration_from_translation(text: str) -> list[list[str]]:
    """
    Removes line numbering from raw CDLI text
    Removes en:, fr:, tr: lines
    Splits the text by obverse, reverse, broken, column, side, meaning resultant strings within 
    the list should be unbroken snippets of Akkadian text
    """
    text_lines = text.split("\n")
    all_transliterations = []
    current_transliteration = []

    metadata_keywords = ["reverse", "obverse", "broken", "column", "side"] # Add more if needed

    def line_filter(line: str):
        line = line.strip()
        if line.startswith("ts:"): # transcription
            return False
        if line.startswith("en:"): # english translation
            return False
        if line.startswith("fr:"): # french translation (rare)
            return False
        if not line: # Skip empty lines
            return False
        return True

    def line_clean(line: str):
        split_numbers = line.split(".", 1) # split once
        if len(split_numbers) == 2:
            line_only = split_numbers[1].strip()
            return line_only
        else:
            return None

    filtered_lines = filter(line_filter, text_lines)

    for line in filtered_lines:
        cleaned_line = line_clean(line)
        if cleaned_line:
            current_transliteration.append(cleaned_line)
        else:
            is_metadata = False
            lower_line = line.lower()
            for keyword in metadata_keywords:
                if keyword in lower_line:
                    is_metadata = True
                    break

            if is_metadata:
                if current_transliteration:
                    all_transliterations.append(" ".join(current_transliteration))
                    current_transliteration = []
            else:
                print(f"Error splitting line: '{line}'") # Keep the error message for unhandled cases

    if current_transliteration:
        all_transliterations.append(" ".join(current_transliteration))

    # Remove any potential empty lists at the beginning if the first lines were metadata
    while all_transliterations and not all_transliterations[0]:
        all_transliterations.pop(0)

    return all_transliterations


def search_corpus(search_term: str):
    """
    Searches the CDLI corpus for Akkadian texts with transliteration
    containing the given search term and extracts image, metadata, and transliteration.

    Args:
        search_term (str): The term to search for in the corpus.

    Returns:
        list: A list of dictionaries, where each dictionary contains:
              - 'image_url': URL of the artifact's image.
              - 'metadata': A dictionary containing metadata fields.
              - 'transliteration': The transliteration text.
              Returns None if the request fails.
    """
    url_to_fetch = f"https://cdli.mpiwg-berlin.mpg.de/search?simple-value%5B%5D={search_term}&simple-field%5B%5D=keyword&f%5Blanguage%5D%5B%5D=Akkadian&f%5Batf_transliteration%5D%5B%5D=With"

    try:
        response = requests.get(url_to_fetch)
        response.raise_for_status()  # Raise an exception for bad status codes

        soup = BeautifulSoup(response.content, 'html.parser')

        results = []
        search_cards = soup.find_all('div', class_='search-card')

        for card in search_cards:
            image_url = None
            metadata = {}
            transliteration = None

            # Extract Image
            media_div = card.find('div', class_='search-card-media')
            if media_div:
                img_tag = media_div.find('img')
                if img_tag and img_tag.has_attr('src'):
                    image_url = f"https://cdli.mpiwg-berlin.mpg.de{img_tag['src']}"

            # Extract Metadata
            content_div = card.find('div', class_='search-card-content')
            if content_div:
                title_tag = content_div.find('h2', class_='d-flex')
                if title_tag and title_tag.find('a'):
                    metadata['title'] = title_tag.find('a').text.strip()
                    metadata['artifact_link'] = f"https://cdli.mpiwg-berlin.mpg.de{title_tag.find('a')['href']}"

                info_paragraphs = content_div.find_all('p', class_='my-0')
                for p in info_paragraphs:
                    if p.find('b'):
                        label = p.find('b').text.replace(':', '').strip()
                        value = p.text.replace(p.find('b').text, '').strip()
                        metadata[label] = value

                period_paragraph = content_div.find('p', class_='my-0') # Period is often the last my-0 before mt-3
                if period_paragraph and "Period:" in period_paragraph.text:
                    metadata['Period'] = period_paragraph.text.replace('Period:', '').strip()

                object_type_paragraph = content_div.find('p', class_='my-0')
                if object_type_paragraph and "Object Type:" in object_type_paragraph.text:
                    metadata['Object Type'] = object_type_paragraph.text.replace('Object Type:', '').strip()

                material_paragraph = content_div.find('p', class_='my-0')
                if material_paragraph and "Material:" in material_paragraph.text:
                    metadata['Material'] = material_paragraph.text.replace('Material:', '').strip()

                date_paragraph = content_div.find('p', class_='my-0')
                if date_paragraph and "Date:" in date_paragraph.text:
                    metadata['Date'] = date_paragraph.text.replace('Date:', '').strip()


            # Extract Transliteration
            transliteration_paragraph = content_div.find('p', class_='mt-3')
            if transliteration_paragraph and transliteration_paragraph.find('b') and transliteration_paragraph.find('b').text == 'Transliteration:':
                transliteration_parts = []
                for content in transliteration_paragraph.contents:
                    if isinstance(content, str):
                        transliteration_parts.append(content.strip())
                    elif content.name == 'br':
                        transliteration_parts.append('\n')
                    elif content.name == 'i':
                        transliteration_parts.append(content.text.strip())
                transliteration = "".join(transliteration_parts).strip()

            cleaned_transliteration = filter_transliteration_from_translation(transliteration)

            results.append({
                'image_url': image_url,
                'metadata': metadata,
                'transliteration': cleaned_transliteration
            })

        return results

    except requests.exceptions.RequestException as e:
        print(f"Error fetching URL: {e}")
        return None
    except Exception as e:
        print(f"Error parsing HTML: {e}")
        return None

# print(search_corpus("gilgamesh")[1]["transliteration"])
# print(search_corpus("gilgamesh"))

# def search_corpus(search_term: str):
#     """
#     Searches the CDLI corpus for Akkadian texts with transliteration
#     containing the given search term.

#     Args:
#         search_term (str): The term to search for in the corpus.

#     Returns:
#         list: A list of dictionaries, where each dictionary contains
#               the 'title' and 'link' of a search result.
#               Returns None if the request fails.
#     """
#     url_to_fetch = f"https://cdli.mpiwg-berlin.mpg.de/search?simple-value%5B%5D={search_term}&simple-field%5B%5D=keyword&f%5Blanguage%5D%5B%5D=Akkadian&f%5Batf_transliteration%5D%5B%5D=With"

#     try:
#         response = requests.get(url_to_fetch)
#         response.raise_for_status()  # Raise an exception for bad status codes

#         soup = BeautifulSoup(response.content, 'html.parser')

#         results = []
#         search_results = soup.find_all('div', class_='search-result')



#         return results

#     except requests.exceptions.RequestException as e:
#         print(f"Error fetching URL: {e}")
#         return None
#     except Exception as e:
#         print(f"Error parsing HTML: {e}")
#         return None

# if __name__ == '__main__':
#     search_term = "cyrus"
#     corpus_results = search_corpus(search_term)

#     if corpus_results:
#         print(f"Search results for '{search_term}':")
#         for result in corpus_results:
#             print(f"  Title: {result['title']}")
#             print(f"  Link: {result['link']}")
#             print("-" * 20)
#     else:
#         print(f"No search results found for '{search_term}' or an error occurred.")