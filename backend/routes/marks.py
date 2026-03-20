# backend/routes/marks.py
from flask import Blueprint, request, jsonify
from db import get_connection

marks_bp = Blueprint('marks', __name__)


# ── GET MARKS FOR A STUDENT ───────────────────────────────
@marks_bp.route('/<int:student_id>', methods=['GET'])
def get_marks(student_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM marks WHERE student_id = %s", (student_id,))
    marks = cursor.fetchall()
    cursor.close()
    conn.close()

    total = sum(m['marks'] for m in marks)
    max_possible = len(marks) * 100
    percentage = round((total / max_possible) * 100, 2) if max_possible > 0 else 0

    return jsonify({'marks': marks, 'total': total, 'percentage': percentage})


# ── ADD A MARK ────────────────────────────────────────────
@marks_bp.route('/', methods=['POST'])
def add_mark():
    data = request.json
    student_id = data.get('student_id')
    subject = data.get('subject', '').strip()
    marks = data.get('marks')

    if not student_id or not subject or marks is None:
        return jsonify({'error': 'student_id, subject, and marks are required'}), 400

    if not (0 <= int(marks) <= 100):
        return jsonify({'error': 'Marks must be between 0 and 100'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO marks (student_id, subject, marks) VALUES (%s, %s, %s)",
            (student_id, subject, marks)
        )
        # Update total_marks in students table
        cursor.execute(
            """UPDATE students
               SET total_marks = (SELECT COALESCE(SUM(marks), 0) FROM marks WHERE student_id = %s)
               WHERE student_id = %s""",
            (student_id, student_id)
        )
        conn.commit()
        return jsonify({'message': 'Mark added successfully'}), 201
    finally:
        cursor.close()
        conn.close()


# ── DELETE A MARK ─────────────────────────────────────────
@marks_bp.route('/<int:mark_id>', methods=['DELETE'])
def delete_mark(mark_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        # Get student_id before deleting
        cursor.execute("SELECT student_id FROM marks WHERE id = %s", (mark_id,))
        row = cursor.fetchone()

        cursor.execute("DELETE FROM marks WHERE id = %s", (mark_id,))

        if row:
            student_id = row[0]
            cursor.execute(
                """UPDATE students
                   SET total_marks = (SELECT COALESCE(SUM(marks), 0) FROM marks WHERE student_id = %s)
                   WHERE student_id = %s""",
                (student_id, student_id)
            )
        conn.commit()
        return jsonify({'message': 'Mark deleted successfully'})
    finally:
        cursor.close()
        conn.close()