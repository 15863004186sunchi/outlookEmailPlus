from flask import Blueprint, jsonify, request
import requests
import os

def create_blueprint():
    bp = Blueprint('registrar', __name__, url_prefix='/api/registrar')
    
    REGISTRAR_URL = os.getenv('REGISTRAR_URL', 'http://registrar:8000')

    @bp.route('/<path:path>', methods=['GET', 'POST'])
    def proxy(path):
        target_url = f"{REGISTRAR_URL}/api/{path}"
        try:
            if request.method == 'POST':
                resp = requests.post(target_url, json=request.json, timeout=5)
            else:
                resp = requests.get(target_url, timeout=5)
            return jsonify(resp.json()), resp.status_code
        except Exception as e:
            return jsonify({"success": False, "message": str(e)}), 500

    return bp
