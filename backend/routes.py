import os
import requests
from flask import Blueprint, request, jsonify
from models import QuestionAnswer
from app import db

API_KEY = os.getenv("TOGETHER_API_KEY")

routes = Blueprint("routes", __name__)

@routes.route("/api/clarify-task", methods=["POST"])
def clarify_task():
    data = request.get_json()
    user_task = data.get("task", "")

    try:
        response = requests.post(
            "https://api.together.xyz/v1/chat/completions",
            headers={"Authorization": f"Bearer {API_KEY}"},
            json={
                "model": "mistralai/Mixtral-8x7B-Instruct-v0.1",
                "messages": [
                    {"role": "system", "content": "You are a helpful assistant that explains tasks step by step."},
                    {"role": "user", "content": f"Break down this task into steps: {user_task}"}
                ]
            }
        )

        result = response.json()
        steps = result["choices"][0]["message"]["content"].strip()

        qa_entry = QuestionAnswer(question=user_task, answer=steps)
        db.session.add(qa_entry)
        db.session.commit()

        return jsonify({"steps": steps})

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@routes.route("/api/answers", methods=["GET"])
def get_all_answers():
    try:
        answers = QuestionAnswer.query.all()
        result = [
            {"id": entry.id, "question": entry.question, "answer": entry.answer}
            for entry in answers
        ]
        return jsonify(result)
    except Exception as e:
        return jsonify({"error": str(e)}), 500


@routes.route("/api/answers/<int:answer_id>", methods=["GET"])
def get_answer_by_id(answer_id):
    try:
        entry = QuestionAnswer.query.get(answer_id)
        if entry:
            return jsonify({
                "id": entry.id,
                "question": entry.question,
                "answer": entry.answer
            })
        else:
            return jsonify({"error": "Answer not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500


@routes.route("/api/answers/<int:answer_id>", methods=["DELETE"])
def delete_answer_by_id(answer_id):
    try:
        entry = QuestionAnswer.query.get(answer_id)
        if entry:
            db.session.delete(entry)
            db.session.commit()
            return jsonify({"message": "Answer deleted successfully"})
        else:
            return jsonify({"error": "Answer not found"}), 404

    except Exception as e:
        return jsonify({"error": str(e)}), 500

