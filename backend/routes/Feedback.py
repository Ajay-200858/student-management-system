# backend/routes/feedback.py
from flask import Blueprint, request, jsonify
from db import get_connection
from datetime import datetime

feedback_bp = Blueprint('feedback', __name__)


@feedback_bp.route('/', methods=['POST'])
def add_feedback():
    data = request.json or {}
    message  = data.get('feedback_text', '').strip()   # frontend sends feedback_text
    username = data.get('username', 'anonymous')

    if not message:
        return jsonify({'error': 'Feedback text is required'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO feedback (username, message, created_at) VALUES (%s, %s, %s)",
            (username, message, datetime.now())
        )
        conn.commit()
        return jsonify({'message': 'Feedback submitted! Thank you.'}), 201
    except Exception as e:
        print(f"[feedback] Insert error: {e}")
        return jsonify({'error': str(e)}), 500
    finally:
        cursor.close()
        conn.close()


@feedback_bp.route('/', methods=['GET'])
def get_feedback():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    try:
        cursor.execute("SELECT * FROM feedback ORDER BY created_at DESC LIMIT 50")
        rows = cursor.fetchall()
        for r in rows:
            r['created_at'] = str(r['created_at'])
        return jsonify(rows)
    finally:
        cursor.close()
        conn.close()