# backend/routes/admin.py
from flask import Blueprint, jsonify
from db import get_connection

admin_bp = Blueprint('admin', __name__)

@admin_bp.route('/logs', methods=['GET'])
def get_logs():
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM login_logs ORDER BY login_time DESC")
    logs = cursor.fetchall()
    cursor.close()
    conn.close()

    # Convert datetime to readable string
    for log in logs:
        log['login_time'] = str(log['login_time'])

    return jsonify(logs)