# backend/routes/students.py
from flask import Blueprint, request, jsonify
from db import get_connection

students_bp = Blueprint('students', __name__)


# ── GET ALL STUDENTS (with search & filter) ───────────────
@students_bp.route('/', methods=['GET'])
def get_students():
    search = request.args.get('search', '')
    department = request.args.get('department', '')

    conn = get_connection()
    cursor = conn.cursor(dictionary=True)

    query = "SELECT * FROM students WHERE 1=1"
    params = []

    if search:
        query += " AND name LIKE %s"
        params.append(f'%{search}%')
    if department:
        query += " AND department = %s"
        params.append(department)

    query += " ORDER BY student_id DESC"
    cursor.execute(query, params)
    students = cursor.fetchall()
    cursor.close()
    conn.close()
    return jsonify(students)


# ── GET ONE STUDENT ───────────────────────────────────────
@students_bp.route('/<int:student_id>', methods=['GET'])
def get_student(student_id):
    conn = get_connection()
    cursor = conn.cursor(dictionary=True)
    cursor.execute("SELECT * FROM students WHERE student_id = %s", (student_id,))
    student = cursor.fetchone()
    cursor.close()
    conn.close()
    if student:
        return jsonify(student)
    return jsonify({'error': 'Student not found'}), 404


# ── ADD STUDENT ───────────────────────────────────────────
@students_bp.route('/', methods=['POST'])
def add_student():
    data = request.json
    name = data.get('name', '').strip()
    department = data.get('department', '').strip()

    if not name or not department:
        return jsonify({'error': 'Name and department are required'}), 400

    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "INSERT INTO students (name, department, total_marks) VALUES (%s, %s, 0)",
            (name, department)
        )
        conn.commit()
        return jsonify({'message': 'Student added successfully', 'id': cursor.lastrowid}), 201
    finally:
        cursor.close()
        conn.close()


# ── UPDATE STUDENT ────────────────────────────────────────
@students_bp.route('/<int:student_id>', methods=['PUT'])
def update_student(student_id):
    data = request.json
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute(
            "UPDATE students SET name=%s, department=%s WHERE student_id=%s",
            (data['name'], data['department'], student_id)
        )
        conn.commit()
        return jsonify({'message': 'Student updated successfully'})
    finally:
        cursor.close()
        conn.close()


# ── DELETE STUDENT ────────────────────────────────────────
@students_bp.route('/<int:student_id>', methods=['DELETE'])
def delete_student(student_id):
    conn = get_connection()
    cursor = conn.cursor()
    try:
        cursor.execute("DELETE FROM students WHERE student_id = %s", (student_id,))
        conn.commit()
        return jsonify({'message': 'Student deleted successfully'})
    finally:
        cursor.close()
        conn.close()