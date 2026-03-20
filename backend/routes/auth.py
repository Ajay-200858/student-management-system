# backend/routes/auth.py
from flask import Blueprint, request, jsonify
from db import get_connection
from datetime import datetime

auth_bp = Blueprint('auth', __name__)

# Fixed passwords for each role
PASSWORDS = {
    'student': 'student123',
    'teacher': 'JD',
    'admin': 'admin123'
}

# ── REGISTER ──────────────────────────────────────────────
@auth_bp.route('/register', methods=['POST'])
def register():
    data = request.json
    username = data.get('username', '').strip()
    role = data.get('role', '').strip()

    if not username or not role:
        return jsonify({'error': 'Username and role are required'}), 400

    if role not in ['student', 'teacher']:
        return jsonify({'error': 'Role must be student or teacher'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO users (username, role) VALUES (%s, %s)",
            (username, role)
        )
        conn.commit()
        return jsonify({'message': 'Account created successfully!'}), 201
    except Exception as e:
        if 'Duplicate entry' in str(e):
            return jsonify({'error': 'Username already exists'}), 409
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()


# ── LOGIN ─────────────────────────────────────────────────
@auth_bp.route('/login', methods=['POST'])
def login():
    data = request.json
    username = data.get('username', '').strip()
    password = data.get('password', '').strip()

    # Hidden admin login
    if username == 'admin' and password == 'admin123':
        log_login('admin', 'admin')
        return jsonify({'username': 'admin', 'role': 'admin'}), 200

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM users WHERE username = %s", (username,))
        user = cursor.fetchone()

        if not user:
            return jsonify({'error': 'User not found. Please register first.'}), 404

        expected_password = PASSWORDS.get(user['role'])
        if password != expected_password:
            return jsonify({'error': 'Incorrect password'}), 401

        log_login(username, user['role'])
        return jsonify({'username': user['username'], 'role': user['role']}), 200

    finally:
        cursor.close()
        conn.close()


# ── Helper: Save login log ────────────────────────────────
def log_login(username, role):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO login_logs (username, role, login_time) VALUES (%s, %s, %s)",
            (username, role, datetime.now())
        )
        conn.commit()
    finally:
        cursor.close()
        conn.close()