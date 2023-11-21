from rest_framework import status
from rest_framework.response import Response
from .serializers import CustomUserSerializer
from django.contrib.auth import authenticate, login, logout
from rest_framework.decorators import api_view, permission_classes
from rest_framework.permissions import AllowAny
from django.http import HttpResponse, JsonResponse
from rest_framework.exceptions import ValidationError
from .models import CustomUser
import whisper
import pyaudio
import numpy as np
import os
import wave

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
            return JsonResponse({'success': False}, status=401)
    else:
        return HttpResponse(status=405)  # Method Not Allowed

@api_view(['POST'])
def api_logout(request):
    logout(request)
    return Response({'message': 'Logout successful'}, status=status.HTTP_200_OK)

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

@api_view(['POST', 'GET'])
@permission_classes([AllowAny])
def check_unique_username(request):
    username = request.GET.get('username', '')
    is_unique = not CustomUser.objects.filter(username=username).exists()
    return JsonResponse({'is_unique': is_unique})

AUDIO_FOLDER = '/Users/kyujincho/lang_ko/backend/recorded_audio/'

def transcribe_audio(file_path):
    try:
        model = whisper.load_model("large")
        lang = 'ko'
        result = model.transcribe(file_path, language=lang, temperature=0.0)
        transcript = result['text']
        print(transcript)
        return transcript
    except Exception as e:
        raise Exception(f"Error in transcribing audio: {str(e)}")


recorder, frames, is_recording = None, [], False

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

        finally:
            # Stop and close the stream
            if stream.is_active():
                stream.stop_stream()
                stream.close()

    else:
        return JsonResponse({'message': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

def clean_up_audio(file_path):
    try:
        if os.path.exists(file_path):
            os.remove(file_path)
            print(f"Audio file {file_path} deleted.")
        else:
            print(f"Audio file {file_path} does not exist.")
    except Exception as e:
        print(f"Error cleaning up audio file: {str(e)}")

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

            return JsonResponse({'message': 'Recording stopped', 'transcript': transcript}, status=status.HTTP_200_OK)

        except Exception as e:
            print(f"Error stopping recording: {str(e)}")
            return JsonResponse({'error': str(e)}, status=status.HTTP_500_INTERNAL_SERVER_ERROR)
    else:
        return JsonResponse({'message': 'Method not allowed'}, status=status.HTTP_405_METHOD_NOT_ALLOWED)

def save_audio_to_wav(frames):
    try:
        # Combine captured frames into audio data
        audio_data = np.concatenate(frames)
        
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