# backend/routes/feedback.py
from flask import Blueprint, request, jsonify
from db import get_connection

feedback_bp = Blueprint('feedback', __name__)


# ── SUBMIT FEEDBACK ───────────────────────────────────────
@feedback_bp.route('/', methods=['POST'])
def add_feedback():
    data = request.json
    username = data.get('username', 'anonymous').strip()
    message = data.get('message', '').strip()

    if not message:
        return jsonify({'error': 'Feedback message is required'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO feedback (username, message, created_at) VALUES (%s, %s, NOW())",
            (username, message)
        )
        conn.commit()
        return jsonify({'message': 'Thank you for your feedback!'}), 201
    finally:
        cursor.close()
        conn.close()


# ── GET ALL FEEDBACK (admin only) ────────────────────────
@feedback_bp.route('/', methods=['GET'])
def get_feedback():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM feedback ORDER BY created_at DESC")
    results = cursor.fetchall()
    cursor.close()
    conn.close()
    for r in results:
        r['created_at'] = str(r['created_at'])
    return jsonify(results)