import random
import string
from werkzeug.security import generate_password_hash, check_password_hash  # type: ignore

def hash_password(password):
    return generate_password_hash(password)

def verify_password(hashed_password, password):
    return check_password_hash(hashed_password, password)

def generate_otp():
    return ''.join(random.choices(string.digits, k=6))

def send_dummy_email(to_email, subject, body):
    """
    Simulates sending an email by printing to the console.
    This avoids needing actual SMTP credentials for development.
    """
    print("\n" + "="*50)
    print(f"[EMAIL] DUMMY EMAIL SENT TO: {to_email}")
    print(f"[SUBJECT]: {subject}")
    print(f"[BODY]:\n{body}")
    print("="*50 + "\n")
    return True
