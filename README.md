# Description
This project demonstrates the capabilities of OpenAI's Whisper model, a powerful speech-to-text (STT) solution. Users can provide input text in either English or Korean, read the text aloud, and Whisper will generate a transcript based on the spoken audio. The project also allows users to compare the generated transcript with the original text to evaluate its accuracy.

Whisper is known for its accuracy and robustness across multiple languages and accents, making it suitable for a wide range of applications.

# Features:
Real-time Speech-to-Text Transcription: Input text in English or Korean, read it aloud, and Whisper generates the transcript.
Accuracy Testing: Compare the original text with Whisper's generated transcript to measure accuracy.
Support for Multiple Languages: Focused on both English and Korean language transcription.
Interactive User Interface: A simple UI for users to easily interact with the model.

### Accuracy Calculation

The accuracy of the Whisper-generated transcript is calculated using the formula:

$$
\text{Accuracy Percentage} = \left( \frac{\text{Correct Characters}}{\text{Total Characters in Script}} \right) \times 100
$$

Where:
- **Correct Characters**: The number of matching characters between the original script and the generated transcript.
- **Total Characters in Script**: The total number of characters in the original input text.
