from rest_framework import status
from rest_framework.response import Response
from .serializers import CustomUserSerializer
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from rest_framework.views import APIView
from rest_framework.parsers import MultiPartParser
from django.http import HttpResponse, JsonResponse
from rest_framework.exceptions import ValidationError
from .models import CustomUser, Script
import random
import whisper
import pyaudio
import numpy as np
import os
import wave

## api_login checks it the credentials posted from frontend matches any credentials in database and authorizes use login.
@api_view(['POST'])
@permission_classes([AllowAny])
def api_login(request):
    if request.method == 'POST':
        username = request.data.get('username')
        password = request.data.get('password')
        print(f'Username: {username}, Password: {password}')
        user = authenticate(request, username=username, password=password)
        if user is not None:
            login(request, user)
            return JsonResponse({'success': True}, status=200)
        else:
            return JsonResponse({'success': False}, status=200)
    else:
        return HttpResponse(status=405)  # Method Not Allowed


## api_logout allows user to logout from the application.
@api_view(['POST'])
def api_logout(request):
    logout(request)
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

## api_register allows user to register to the application.
@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def api_register(request):
    if request.method == 'POST':
        serializer = CustomUserSerializer(data=request.data)
        try:
            serializer.is_valid(raise_exception=True)
            user = serializer.save()
            return JsonResponse({'success': True, 'message': 'Account created successfully'}, status=status.HTTP_201_CREATED)
        except ValidationError as e:
            error_messages = {field: errors[0] for field, errors in e.detail.items()}
            return Response({'errors': error_messages}, status=status.HTTP_400_BAD_REQUEST)
    elif request.method == 'GET':
        return Response({'message': 'GET request received for registration endpoint'}, status=status.HTTP_200_OK)
    else:
        return Response({'message': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


## check_unique_username check if the username input is unique in the database.
@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def check_unique_username(request):
    username = request.GET.get('username', '')
    is_unique = not CustomUser.objects.filter(username=username).exists()
    return JsonResponse({'is_unique': is_unique})

AUDIO_FOLDER = '/Users/kyujincho/lang_ko/backend/recorded_audio/'
file_path = '/Users/kyujincho/lang_ko/backend/recorded_audio/'

language = 'ko'

## update_language updates the language that whisper will be using for transcription. 
@api_view(['POST'])
@permission_classes([AllowAny])
def update_language(request):
    global language
    if request.method == 'POST':
        language = request.data.get('language')
        if language:
            return JsonResponse({'success': True}, status=200)
        else:
            return JsonResponse({'success': False}, status=401)
    else: 
        return HttpResponse(status=405)  # Method Not Allowed
    
## transcribe_audio transcirbes audio file using whisper and returns the transcript. 
def transcribe_audio(file_path):
    try:
        print("transcribing")
        model = whisper.load_model("large")
        result = model.transcribe(file_path, language=language, temperature=0.0)
        transcript = result['text']
        print(transcript)
        return transcript
    except Exception as e:
        raise Exception(f"Error in transcribing audio: {str(e)}")



recorder, frames, is_recording = None, [], False


## start_recording enables user audio recording until stopped. 
@api_view(['POST'])
@permission_classes([AllowAny])
def start_recording(request):
    global recorder, frames, is_recording

    if request.method == 'POST':
        try:
            # Reset recorder and frames
            recorder, frames, is_recording = None, [], True

            # Initialize PyAudio if not already initialized
            if not recorder:
                recorder = pyaudio.PyAudio()

            # Open a stream
            stream = recorder.open(format=pyaudio.paInt16,
                                   channels=1,
                                   rate=44100,
                                   input=True,
                                   frames_per_buffer=512)

            print("Recording started")

            # Capture audio data using PyAudio
            while is_recording:
                frame = np.frombuffer(stream.read(512), dtype=np.int16)
                frames.append(frame)

            stream.stop_stream()
            stream.close()
            print("After closing stream")

            return JsonResponse({'message': 'Recording in progress'}, status=status.HTTP_200_OK)

        except Exception as e:
            return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


## clean_up_audio removes the recorded audio file from it's path.
def clean_up_audio(file_path):
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"Audio file {file_path} deleted.")
        else:
            print(f"Audio file {file_path} does not exist.")
    except Exception as e:
        print(f"Error cleaning up audio file: {str(e)}")


## stop_recording stops the user audio recording and calls clean_up_audio.
@api_view(['POST'])
@permission_classes([AllowAny])
def stop_recording(request):
    global recorder, frames, is_recording

    if request.method == 'POST':
        try:
            is_recording = False

            # Save the audio data to a WAV file
            file_path = save_audio_to_wav(frames)

            # Transcribe the audio
            transcript = transcribe_audio(file_path)

            clean_up_audio(file_path)

            return JsonResponse({'transcript': transcript}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error stopping recording: {str(e)}")
            return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)


## save_audio_to_wav saves audio as .wav
def save_audio_to_wav(frames):
    try:
        # Combine captured frames into audio data
        audio_data = np.concatenate(frames)
        print("saving audio")
        
        # Create the audio folder if it doesn't exist
        os.makedirs(AUDIO_FOLDER, exist_ok=True)

        # Save the audio data to a WAV file
        file_path = os.path.join(AUDIO_FOLDER, 'recorded_audio.wav')
        with wave.open(file_path, 'wb') as wf:
            wf.setnchannels(1)
            wf.setsampwidth(pyaudio.PyAudio().get_sample_size(pyaudio.paInt16))
            wf.setframerate(44100)
            wf.writeframes(audio_data.tobytes())
        
        print(f"Audio saved to {file_path}")

        return file_path

    except Exception as e:
        print(f"Error saving audio to WAV file: {str(e)}")

# Assuming UPLOAD_FOLDER is the directory where you want to save the files
UPLOAD_FOLDER = '/Users/kyujincho/lang_ko/backend/uploaded_audio/'

class AudioUploadView(APIView):
    parser_classes = [MultiPartParser,]

    def post(self, request):
        print("saving audio file")
        file_obj = request.FILES.get('audioFile')

        if not file_obj:
            return JsonResponse({'error': 'No file provided'}, status=status.HTTP_400_BAD_REQUEST)

        try:
            # Ensure the upload folder exists
            UPLOAD_FOLDER = '/Users/kyujincho/lang_ko/backend/uploaded_audio/'
            os.makedirs(UPLOAD_FOLDER, exist_ok=True)

            # Save the file to the specified folder
            file_path = os.path.join(UPLOAD_FOLDER, file_obj.name)
            with open(file_path, 'wb') as destination:
                for chunk in file_obj.chunks():
                    destination.write(chunk)
            transcript = transcribe_audio(file_path)
            
            clean_up_audio(file_path)

            return JsonResponse({'transcript': transcript}, status=status.HTTP_200_OK)
        
        except Exception as e:
            return JsonResponse({'error': f"Error saving file: {str(e)}"}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
        

@api_view(['POST'])
@permission_classes([AllowAny])
def get_random_script(request):
    script = random.choice(Script.objects.all()).text
    return JsonResponse({'script': script}, status=status.HTTP_200_OK)