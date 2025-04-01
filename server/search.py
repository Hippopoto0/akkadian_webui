import requests
from bs4 import BeautifulSoup
import logging

class CDLICorpusSearcher:
    """
    A class for searching the CDLI corpus for Akkadian texts with transliteration.
    """

    metadata_keywords = ["reverse", "obverse", "broken", "column", "side"]

    @staticmethod
    def filter_transliteration_from_translation(text: str) -> list[str]:
        """
        Removes line numbering from raw CDLI text, excludes translation lines,
        and splits the text into continuous snippets of Akkadian text.
        """
        text_lines = text.split("\n")
        all_transliterations = []
        current_transliteration = []

        def line_filter(line: str) -> bool:
            line = line.strip()
            if line.startswith("ts:"):  # transcription
                return False
            if line.startswith("en:"):  # English translation
                return False
            if line.startswith("fr:"):  # French translation (rare)
                return False
            if not line:  # Skip empty lines
                return False
            return True

        def line_clean(line: str):
            split_numbers = line.split(".", 1)  # split once
            if len(split_numbers) == 2:
                return split_numbers[1].strip()
            else:
                return None

        filtered_lines = filter(line_filter, text_lines)

        for line in filtered_lines:
            cleaned_line = line_clean(line)
            if cleaned_line:
                current_transliteration.append(cleaned_line)
            else:
                # Check if the line is metadata
                is_metadata = any(keyword in line.lower() for keyword in CDLICorpusSearcher.metadata_keywords)
                if is_metadata:
                    if current_transliteration:
                        all_transliterations.append(" ".join(current_transliteration))
                        current_transliteration = []
                else:
                    logging.error("Error splitting line: '%s'", line)

        if current_transliteration:
            all_transliterations.append(" ".join(current_transliteration))

        # Remove any potential empty snippets at the beginning
        while all_transliterations and not all_transliterations[0]:
            all_transliterations.pop(0)

        return all_transliterations

    def search(self, search_term: str) -> list[dict]:
        """
        Searches the CDLI corpus for Akkadian texts with transliteration containing the given search term
        and extracts image, metadata, and transliteration.

        Returns:
            A list of dictionaries, each containing:
              - 'image_url': URL of the artifact's image.
              - 'metadata': A dictionary of metadata fields.
              - 'transliteration': The filtered transliteration text.
        Raises:
            Exception: If the HTTP request fails or the HTML cannot be parsed.
        """
        url_to_fetch = (
            f"https://cdli.mpiwg-berlin.mpg.de/search?simple-value%5B%5D={search_term}"
            "&simple-field%5B%5D=keyword&f%5Blanguage%5D%5B%5D=Akkadian&f%5Batf_transliteration%5D%5B%5D=With"
        )

        try:
            response = requests.get(url_to_fetch)
            response.raise_for_status()  # Raise exception for HTTP errors
            soup = BeautifulSoup(response.content, 'html.parser')
        except requests.exceptions.RequestException as e:
            logging.error("Error fetching URL: %s", e)
            raise Exception(f"Error fetching URL: {e}")
        except Exception as e:
            logging.error("Error parsing HTML: %s", e)
            raise Exception(f"Error parsing HTML: {e}")

        results = []
        search_cards = soup.find_all('div', class_='search-card')

        for card in search_cards:
            image_url = None
            metadata = {}
            transliteration = None

            # Extract Image URL
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
                    bold = p.find('b')
                    if bold:
                        label = bold.text.replace(':', '').strip()
                        value = p.text.replace(bold.text, '').strip()
                        metadata[label] = value

            # Extract Transliteration
            transliteration_paragraph = content_div.find('p', class_='mt-3') if content_div else None
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

            cleaned_transliteration = self.filter_transliteration_from_translation(transliteration) if transliteration else []

            results.append({
                'image_url': image_url,
                'metadata': metadata,
                'transliteration': cleaned_transliteration
            })

        return results
