from __future__ import annotations

from flask import Blueprint

from outlook_web.controllers import temp_emails as temp_emails_controller


def create_blueprint() -> Blueprint:
    """创建 temp_emails Blueprint"""
    bp = Blueprint("temp_emails", __name__)
    bp.add_url_rule("/api/temp-emails", view_func=temp_emails_controller.api_get_temp_emails, methods=["GET"])
    bp.add_url_rule("/api/temp-emails/generate", view_func=temp_emails_controller.api_generate_temp_email, methods=["POST"])
    bp.add_url_rule("/api/temp-emails/<path:email_addr>", view_func=temp_emails_controller.api_delete_temp_email, methods=["DELETE"])
    bp.add_url_rule("/api/temp-emails/<path:email_addr>/messages", view_func=temp_emails_controller.api_get_temp_email_messages, methods=["GET"])
    bp.add_url_rule(
        "/api/temp-emails/<path:email_addr>/messages/<path:message_id>",
        view_func=temp_emails_controller.api_get_temp_email_message_detail,
        methods=["GET"],
    )
    bp.add_url_rule(
        "/api/temp-emails/<path:email_addr>/messages/<path:message_id>",
        view_func=temp_emails_controller.api_delete_temp_email_message,
        methods=["DELETE"],
    )
    bp.add_url_rule("/api/temp-emails/<path:email_addr>/clear", view_func=temp_emails_controller.api_clear_temp_email_messages, methods=["DELETE"])
    bp.add_url_rule("/api/temp-emails/<path:email_addr>/refresh", view_func=temp_emails_controller.api_refresh_temp_email_messages, methods=["POST"])
    return bp

